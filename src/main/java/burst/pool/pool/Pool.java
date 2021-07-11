package burst.pool.pool;

import signumj.crypto.SignumCrypto;
import signumj.entity.SignumAddress;
import signumj.entity.SignumValue;
import signumj.entity.response.Account;
import signumj.entity.response.Block;
import signumj.entity.response.FeeSuggestion;
import signumj.entity.response.MiningInfo;
import signumj.entity.response.Transaction;
import signumj.entity.response.TransactionAppendix;
import signumj.entity.response.http.MiningInfoResponse;
import signumj.response.appendix.PlaintextMessageAppendix;
import signumj.service.NodeService;
import signumj.util.SignumUtils;
import burst.pool.miners.Miner;
import burst.pool.miners.MinerTracker;
import burst.pool.storage.config.Prop;
import burst.pool.storage.config.PropertyService;
import burst.pool.storage.config.Props;
import burst.pool.storage.persistent.StorageService;
import com.google.gson.Gson;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;

import io.reactivex.Completable;
import io.reactivex.Observable;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigInteger;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

public class Pool {
    private static final Logger logger = LoggerFactory.getLogger(Pool.class);
    
    public static final double LN_FACTOR =  240.0/Math.log(240.0);

    private final NodeService nodeService;
    private final SignumCrypto burstCrypto = SignumCrypto.getInstance();
    private final StorageService storageService;
    private final PropertyService propertyService;
    private final MinerTracker minerTracker;
    private final CompositeDisposable disposables = new CompositeDisposable();

    private final Semaphore processBlockSemaphore = new Semaphore(1);
    private final Semaphore resetRoundSemaphore = new Semaphore(1);
    private final Semaphore processDeadlineSemaphore = new Semaphore(12);

    // Variables
    private final AtomicReference<Instant> roundStartTime = new AtomicReference<>();
    private final AtomicReference<Submission> bestSubmission = new AtomicReference<>();
    private final AtomicReference<BigInteger> bestDeadline = new AtomicReference<>();
    private final AtomicReference<MiningInfo> miningInfo = new AtomicReference<>();
    private final AtomicReference<SignumValue> transactionFee = new AtomicReference<>();
    private final Set<SignumAddress> myRewardRecipients = new HashSet<>();
    private final AtomicReference<ArrayList<Block>> recentlyForged = new AtomicReference<>();
    private final Set<?> secondaryRewardRecipients[] = new HashSet<?>[Props.passphraseSecondary.length];

    public Pool(NodeService nodeService, StorageService storageService, PropertyService propertyService, MinerTracker minerTracker) {
        this.storageService = storageService;
        this.minerTracker = minerTracker;
        this.propertyService = propertyService;
        this.nodeService = nodeService;
        this.transactionFee.set(SignumValue.fromSigna(0.1));
        disposables.add(refreshMiningInfoThread());
        disposables.add(processBlocksThread());
        for (int i = 0; i < secondaryRewardRecipients.length; i++) {
            secondaryRewardRecipients[i] = new HashSet<SignumAddress>();
        }
        resetRound(null);
    }

    private Disposable processBlocksThread() {
        return Observable.interval(0, 100, TimeUnit.MILLISECONDS)
                .flatMapCompletable(l -> processNextBlock().onErrorComplete(e -> {
                    onProcessBlocksError(e, false);
                    return true;
                }))
                .retry()
                .subscribeOn(Schedulers.io())
                .subscribe(() -> {}, e -> onProcessBlocksError(e, true));
    }

    private void onProcessBlocksError(Throwable throwable, boolean fatal) {
        if (fatal) {
            logger.error("Fatal error processing blocks (Thread now shutdown)", throwable);
        } else {
            logger.warn("Non-fatal error processing blocks", throwable);
        }
    }

    private Disposable refreshMiningInfoThread() {
        return nodeService.getMiningInfo().subscribeOn(SignumUtils.defaultNodeServiceScheduler())
                .retry()
                .subscribeOn(Schedulers.io())
                .subscribe(this::onMiningInfo, e -> onMiningInfoError(e, true));
    }

    private void onMiningInfo(MiningInfo newMiningInfo) {
        if (miningInfo.get() == null || !Arrays.equals(miningInfo.get().getGenerationSignature(), newMiningInfo.getGenerationSignature())
                || !Objects.equals(miningInfo.get().getHeight(), newMiningInfo.getHeight())) {
            logger.info("NEW BLOCK from {} (block {}, gensig {}, base target {}, avg commitment {})",
                    nodeService.getAddress(), newMiningInfo.getHeight(), burstCrypto.toHexString(newMiningInfo.getGenerationSignature()),
                    newMiningInfo.getBaseTarget(), newMiningInfo.getAverageCommitmentNQT());
            resetRound(newMiningInfo);
        }
    }

    private void onMiningInfoError(Throwable throwable, boolean fatal) {
        if (fatal) {
            logger.error("Fatal error fetching mining info (Thread now shutdown)", throwable);
        } else {
            logger.warn("Non-fatal error fetching mining info", throwable);
        }
    }

    private Completable processNextBlock() {
        return Completable.fromAction(() -> {
            StorageService transactionalStorageService = null;
            try {
                if (miningInfo.get() == null || processBlockSemaphore.availablePermits() == 0 || miningInfo.get().getHeight() - 1 <= storageService.getLastProcessedBlock() + propertyService.getInt(Props.processLag)) {
                    return;
                }
                
                // Leave the process blocks only a minute after starting a new round
                // TODO: add a configuration for this
                Duration roundDuration = Duration.between(roundStartTime.get(), Instant.now());
                if(roundDuration.toMillis() < 60000) {
                    return;
                }
                
                propertyService.reloadIfModified();
                
                logger.info("Started processing block {}", storageService.getLastProcessedBlock() + 1);

                try {
                    processBlockSemaphore.acquire();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }

                try {
                    transactionalStorageService = storageService.beginTransaction();
                } catch (Exception e) {
                    logger.error("Could not open transactional storage service", e);
                    processBlockSemaphore.release();
                    return;
                }

                minerTracker.setCurrentlyProcessingBlock(true);
                
                FeeSuggestion feeSuggestion = nodeService.suggestFee().blockingGet();
                this.transactionFee.set(feeSuggestion.getStandardFee());

                List<StoredSubmission> storedSubmissions = transactionalStorageService.getBestSubmissionsForBlock(transactionalStorageService.getLastProcessedBlock() + 1);
                if (storedSubmissions == null || storedSubmissions.isEmpty()) {
                    onProcessedBlock(transactionalStorageService, false);
                    return;
                }
                
                Block block = nodeService.getBlock(transactionalStorageService.getLastProcessedBlock() + 1).blockingGet();
                
                // Check for commands from miners (always to the primary address)
                SignumAddress poolAddress = burstCrypto.getAddressFromPassphrase(propertyService.getString(Props.passphrase));
                // Having 100 should be enough to not get past it
                Transaction []txs = nodeService.getAccountTransactions(poolAddress, 0, 100, false).blockingGet();
                for(Transaction tx : txs) {
                    if(tx.getBlockHeight() != block.getHeight())
                        continue;

                    Miner miner = storageService.getMiner(tx.getSender());
                    if(miner == null)
                        continue;
                    
                    if(tx.getAppendages()!=null && tx.getAppendages().length > 0 && tx.getRecipient().equals(poolAddress)) {
                        try {
                            String message = null;
                            TransactionAppendix append = tx.getAppendages()[0];
                            // Public messages only, so it is all on chain and we can easily verify
                            if(append instanceof PlaintextMessageAppendix) {
                                PlaintextMessageAppendix appendMessage = (PlaintextMessageAppendix) append;
                                message = appendMessage.getMessage();
                            }
                            if(message != null) {
                                StringTokenizer tokens = new StringTokenizer(message, " ");
                                while(tokens.hasMoreElements()) {
                                    String cmd = tokens.nextToken();
                                    
                                    if(cmd.equals("share") && tokens.hasMoreTokens()) {
                                        // Allows to configure the amount a miner wants to "share" with the pool
                                        int sharePercent = Integer.parseInt(tokens.nextToken());
                                        if(sharePercent >= 0 && sharePercent <= 100) {
                                            miner.setSharePercent(sharePercent);
                                            logger.info("Miner " + miner.getAddress().getID() + " sharePercent=" + sharePercent);
                                        }
                                    }
                                    else if(cmd.equals("pay") && tokens.hasMoreTokens()) {
                                        // Allows a miner to increase the minimum payout (less frequent payments)
                                        SignumValue newMinimumPayout = SignumValue.fromSigna(tokens.nextToken());
                                        if (newMinimumPayout.compareTo(SignumValue.fromSigna(propertyService.getFloat(Props.minimumMinimumPayout))) > 0) {
                                            miner.setMinimumPayout(newMinimumPayout);
                                            logger.info("Miner " + miner.getAddress().getID() + " new minimum payout " + newMinimumPayout.toFormattedString());
                                        }
                                    }
                                    else if(cmd.equals("donate") && tokens.hasMoreTokens()) {
                                        // Allows a miner to change the amount to donate
                                        int donationPercent = Integer.parseInt(tokens.nextToken());
                                        if(donationPercent >= 0 && donationPercent <= 100) {
                                            miner.setDonationPercent(donationPercent);
                                            logger.info("Miner " + miner.getAddress().getID() + " donationPercent=" + donationPercent);
                                        }
                                    }
                                }
                            }
                        }
                        catch (Exception e) {
                            logger.error("Could not parse message, tx: " + tx.getId(), e);
                        }
                    }
                }
                
                ArrayList<Block> ourNewBlocks = new ArrayList<>();
                try {
                    Block[] blocks = nodeService.getBlocks(1, propertyService.getInt(Props.processLag) - 1).blockingGet();
                    for(Block b : blocks) {
                        Miner miner = storageService.getMiner(b.getGenerator());
                        if(miner != null)
                            ourNewBlocks.add(b);
                    }
                }
                catch (Exception e) {
                    logger.error("Could not get the list of recent blocks", e);
                }
                recentlyForged.set(ourNewBlocks);

                List<? extends Submission> submissions = transactionalStorageService.getBestSubmissionsForBlock(block.getHeight());
                boolean won = false;
                if (submissions != null && !submissions.isEmpty()) {
                    for (Submission submission : submissions) {
                        if (Objects.equals(block.getGenerator(), submission.getMiner()) && Objects.equals(block.getNonce(), submission.getNonce())) {
                            won = true;
                        }
                    }
                }
                if (won) {
                    minerTracker.onBlockWon(transactionalStorageService, block, block.getBlockReward().add(block.getTotalFee()));
                } else {
                    if (myRewardRecipients.contains(block.getGenerator())) {
                        logger.error("Our miner forged but did not detect block won. Height " + block.getHeight());
                    }
                    minerTracker.onBlockNotWon(transactionalStorageService, block);
                }
                onProcessedBlock(transactionalStorageService, true);
            } catch (Exception e) {
                if (transactionalStorageService != null) {
                    logger.warn("Error processing block " + (transactionalStorageService.getLastProcessedBlock() + 1), e);
                    try {
                        transactionalStorageService.rollbackTransaction();
                        transactionalStorageService.close();
                    } catch (Exception e1) {
                        logger.error("Error rolling back transaction", e1);
                    }
                }
                minerTracker.setCurrentlyProcessingBlock(false);
                processBlockSemaphore.release();
            }
        });
    }
    
    /**
     * @return the recently forged blocks, not yet processed
     */
    public ArrayList<Block> getRecentlyForged(){
        return recentlyForged.get();
    }

    private void onProcessedBlock(StorageService transactionalStorageService, boolean actuallyProcessed) {
        // TODO this needs to be done if block is behind nAvg otherwise fast block calculation breaks
        //storageService.removeBestSubmission(storageService.getLastProcessedBlock() + 1);
        transactionalStorageService.incrementLastProcessedBlock();
        try {
            transactionalStorageService.commitTransaction();
            transactionalStorageService.close();
        } catch (Exception e) {
            logger.error("Error committing transaction", e);
        }
        minerTracker.setCurrentlyProcessingBlock(false);
        processBlockSemaphore.release();
        if (actuallyProcessed) {
            minerTracker.payoutIfNeeded(storageService, transactionFee.get());
        }
        
        logger.info("Finished processing block {}", storageService.getLastProcessedBlock());
    }

    private void resetRound(MiningInfo newMiningInfo) {
        
        // Traffic flow - we want to stop new requests but let old ones finish before we go ahead.
        try {
            // Lock the reset round semaphore to stop accepting new requests
            resetRoundSemaphore.acquire();
            // Wait for all requests to be processed
            while (processDeadlineSemaphore.getQueueLength() > 0) {
                Thread.sleep(100);
            }
            // Lock the process block semaphore as we are going to be modifying bestSubmission
            processDeadlineSemaphore.acquire();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return;
        }
        
        if(newMiningInfo == null) {
            // we are booting the pool, lets get one
            try {
                newMiningInfo = nodeService.getMiningInfoSingle().blockingGet();
            }
            catch (Exception e) {
                logger.error("Could not get the mining info from node", e);
            }
        }
        
        bestSubmission.set(null);
        bestDeadline.set(BigInteger.valueOf(Long.MAX_VALUE));
        roundStartTime.set(Instant.now());
        miningInfo.set(newMiningInfo);

        // get the current reward recipient for the multiple pool IDs and transfer balance to primary if any
        try {
            // First for the primary account
            SignumAddress primaryAddress = burstCrypto.getAddressFromPassphrase(propertyService.getString(Props.passphrase));
            SignumAddress[] rewardRecipients = nodeService.getAccountsWithRewardRecipient(primaryAddress).blockingGet();
            myRewardRecipients.clear();
            myRewardRecipients.addAll(Arrays.asList(rewardRecipients));
            
            // Next for the secondary accounts (if any)
            for (int i = 0; i < Props.passphraseSecondary.length; i++) {
                @SuppressWarnings("unchecked")
                Prop<String> passphraseProp = (Prop<String>) Props.passphraseSecondary[i];
                String passphrase = propertyService.getString(passphraseProp);
                if(passphrase == null || passphrase.length() == 0)
                    break;
                
                SignumAddress secondaryAddress = burstCrypto.getAddressFromPassphrase(passphrase);
                rewardRecipients = nodeService.getAccountsWithRewardRecipient(secondaryAddress).blockingGet();
                
                @SuppressWarnings("unchecked")
                Set<SignumAddress> mySecondaryRewardRecipients = (Set<SignumAddress>) secondaryRewardRecipients[i];
                mySecondaryRewardRecipients.clear();
                mySecondaryRewardRecipients.addAll(Arrays.asList(rewardRecipients));
                
                // Check for balances on the secondary pools and transfer to the primary one, every processLag/2 blocks
                int transferBlocks = propertyService.getInt(Props.processLag)/2;
                if(miningInfo.get()!=null) {
                    long mod = miningInfo.get().getHeight() % (transferBlocks);
                    if(mod == 0L) {
                        Account balance = nodeService.getAccount(secondaryAddress, null, null, null).blockingGet();
                        if(balance.getBalance().compareTo(SignumValue.fromSigna(propertyService.getFloat(Props.minimumMinimumPayout))) > 0) {
                            SignumValue amountToSend = balance.getBalance().subtract(getTransactionFee());
                            byte[] unsignedBytes = nodeService.generateTransaction(primaryAddress, burstCrypto.getPublicKey(passphrase), amountToSend,
                                    getTransactionFee(), transferBlocks, null).blockingGet();
                            byte [] signedBytes = burstCrypto.signTransaction(passphrase, unsignedBytes);
                            nodeService.broadcastTransaction(signedBytes).blockingGet();
                            logger.info("Balance of " + amountToSend.toFormattedString() + " from secondary " + secondaryAddress.toString() + " transfered to primary");
                        }
                    }
                }
            }
        }
        catch (Exception e) {
            logger.error("Error fetching pool's reward recipients or transfering from secondary pools", e);
        }
        
        // Unlock to signal we have finished modifying bestSubmission
        processDeadlineSemaphore.release();
        // Unlock to start accepting requests again
        resetRoundSemaphore.release();
    }

    BigInteger checkNewSubmission(Submission submission, String userAgent) throws SubmissionException {
        if (miningInfo.get() == null) {
            throw new SubmissionException("Pool does not have mining info");
        }

        boolean recipientSet = myRewardRecipients.contains(submission.getMiner());
        for (int i = 0; i < secondaryRewardRecipients.length; i++) {
            if(recipientSet)
                break;
            
            @SuppressWarnings("unchecked")
            Set<SignumAddress> mySecondaryRewardRecipients = (Set<SignumAddress>) secondaryRewardRecipients[i];
            recipientSet = mySecondaryRewardRecipients.contains(submission.getMiner());
        }
        if (!recipientSet) {
            throw new SubmissionException("Reward recipient not set to pool");
        }

        // If we are resetting the request must be for the previous round and no longer matters - reject
        if (resetRoundSemaphore.availablePermits() < 0) {
            throw new SubmissionException("Cannot submit - new round starting");
        }

        MiningInfo localMiningInfo = miningInfo.get();
        BigInteger deadline = burstCrypto.calculateDeadline(submission.getMiner(), Long.parseUnsignedLong(submission.getNonce().toString()), localMiningInfo.getGenerationSignature(), burstCrypto.calculateScoop(localMiningInfo.getGenerationSignature(), localMiningInfo.getHeight()), localMiningInfo.getBaseTarget(), 2);

        // With PoC+ we have up to a factor of 8, since miner software is unaware of that we need to accept it up to 8 times larger
        long factor = localMiningInfo.getHeight() >= propertyService.getInt(Props.pocPlusBlock) ? 8 : 1;
        if (deadline.compareTo(BigInteger.valueOf(propertyService.getLong(Props.maxDeadline) * factor)) >= 0) {
            throw new SubmissionException("Deadline exceeds maximum allowed deadline");
        }

        if (logger.isDebugEnabled()) {
            logger.debug("New submission from {} of nonce {}, calculated deadline {} seconds.", submission.getMiner(), submission.getNonce(), deadline.toString());
        }

        try {
            try {
                processDeadlineSemaphore.acquire();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new SubmissionException("Server Interrupted");
            }
            
            BigInteger newDeadline = minerTracker.onMinerSubmittedDeadline(storageService, submission.getMiner(), deadline, miningInfo.get(), userAgent);

            if (bestSubmission.get() != null) {
                if (logger.isDebugEnabled()) {
                    logger.debug("Best deadline is {}, new deadline is {}", bestDeadline.get(), newDeadline);
                }
                if (newDeadline.compareTo(bestDeadline.get()) < 0) {
                    logger.debug("Newer deadline is better! Submitting...");
                    onNewBestDeadline(miningInfo.get().getHeight(), submission, newDeadline);
                }
            } else {
                logger.debug("This is the first deadline, submitting...");
                onNewBestDeadline(miningInfo.get().getHeight(), submission, newDeadline);
            }

            return deadline;
        } finally {
            processDeadlineSemaphore.release();
        }
    }

    private void onNewBestDeadline(long blockHeight, Submission submission, BigInteger deadline) {
        bestSubmission.set(submission);
        bestDeadline.set(deadline);
        submitDeadline(submission);
        storageService.addBestSubmissionForBlock(blockHeight, new StoredSubmission(submission.getMiner(), submission.getNonce(), deadline.longValue()));
    }

    @SuppressWarnings("unchecked")
    private void submitDeadline(Submission submission) {
        String passphrase = null;
        
        if(myRewardRecipients.contains(submission.getMiner()))
            passphrase = propertyService.getString(Props.passphrase);
        
        for (int i = 0; i < secondaryRewardRecipients.length; i++) {
            if(passphrase != null)
                break;
            
            Set<SignumAddress> mySecondaryRewardRecipients = (Set<SignumAddress>) secondaryRewardRecipients[i];
            if(mySecondaryRewardRecipients.contains(submission.getMiner()))
                passphrase = propertyService.getString((Prop<String>) Props.passphraseSecondary[i]);
        }
        
        disposables.add(nodeService.submitNonce(passphrase, submission.getNonce().toString(), submission.getMiner().getSignumID()) // TODO burstkit4j accept nonce as bigint
                .retry(propertyService.getInt(Props.submitNonceRetryCount))
                .subscribe(this::onNonceSubmitted, this::onSubmitNonceError));
    }

    private void onNonceSubmitted(long deadline) {
        logger.debug("Submitted nonce to node. Deadline is {}", Long.toUnsignedString(deadline));
    }

    private void onSubmitNonceError(Throwable t) {
        logger.error("Error submitting nonce to node", t);
    }

    MiningInfo getMiningInfo() {
        return miningInfo.get();
    }

    public JsonObject getCurrentRoundInfo(Gson gson) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("roundStart", roundStartTime.get().getEpochSecond());

        if (bestSubmission.get() != null) {
        	BigInteger deadline = bestDeadline.get();
       		deadline = BigInteger.valueOf((long)(Math.log(deadline.doubleValue()) * LN_FACTOR));
       		
            JsonObject bestDeadlineJson = new JsonObject();
            bestDeadlineJson.addProperty("explorer", propertyService.getString(Props.siteExplorerURL) + propertyService.getString(Props.siteExplorerAccount));
            bestDeadlineJson.addProperty("miner", bestSubmission.get().getMiner().getID());
            bestDeadlineJson.addProperty("minerRS", bestSubmission.get().getMiner().getFullAddress());
            Miner miner = storageService.getMiner(bestSubmission.get().getMiner());
            if(miner != null && !Objects.equals(miner.getName(), "")) {
                bestDeadlineJson.addProperty("name", miner.getName());
            }
            bestDeadlineJson.addProperty("nonce", bestSubmission.get().getNonce());
            bestDeadlineJson.addProperty("deadline", deadline);
            jsonObject.add("bestDeadline", bestDeadlineJson);
        } else {
            jsonObject.add("bestDeadline", JsonNull.INSTANCE);
        }

        MiningInfo miningInfo = Pool.this.miningInfo.get();
        if (miningInfo != null) {
            long baseTarget = miningInfo.getBaseTarget();
            baseTarget = (long)(baseTarget * 1.83f);
            jsonObject.add("miningInfo", gson.toJsonTree(
                    new MiningInfoResponse(burstCrypto.toHexString(miningInfo.getGenerationSignature()), baseTarget, miningInfo.getHeight(),
                            miningInfo.getAverageCommitmentNQT(), miningInfo.getTimestamp().getTimestamp())));
        }
        return jsonObject;
    }

    public SignumAddress getAccount() {
        return burstCrypto.getAddressFromPassphrase(propertyService.getString(Props.passphrase));
    }
    
    public SignumValue getTransactionFee() {
        return transactionFee.get();
    }
}
