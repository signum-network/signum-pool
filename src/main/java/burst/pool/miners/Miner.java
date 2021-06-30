package burst.pool.miners;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import burst.kit.entity.BurstAddress;
import burst.kit.entity.BurstValue;
import burst.kit.entity.response.Block;
import burst.pool.storage.config.PropertyService;
import burst.pool.storage.config.Props;
import burst.pool.storage.persistent.MinerStore;

public class Miner implements Payable {
    private final MinerMaths minerMaths;
    private final PropertyService propertyService;

    private final BurstAddress address;
    private final MinerStore store;
    private int commitmentHeight;
    private AtomicReference<BurstValue> commitment = new AtomicReference<>();
    private AtomicReference<BurstValue> committedBalance = new AtomicReference<>();
    private String userAgent, name;
    private AtomicInteger nconf = new AtomicInteger(0);
    private ConcurrentLinkedQueue<Deadline> deadlines = new ConcurrentLinkedQueue<>();
    private AtomicReference<Double> boost = new AtomicReference<>();
    private AtomicReference<Double> boostPool = new AtomicReference<>();
    private AtomicReference<Double> totalCapacityEffective = new AtomicReference<>();

    public Miner(MinerMaths minerMaths, PropertyService propertyService, BurstAddress address, MinerStore store) {
        this.minerMaths = minerMaths;
        this.propertyService = propertyService;
        this.address = address;
        this.store = store;
        
        // Read the deadline history from the DB the first time and then keep on memory
        List<Deadline> storeDeadlines = store.getDeadlines();
        deadlines.addAll(storeDeadlines);
        if(storeDeadlines.size() > 0) {
            nconf.set(storeDeadlines.size()-1);
            Deadline latestDeadline = storeDeadlines.get(storeDeadlines.size()-1);
            boost.set(latestDeadline.getBoost());
            boostPool.set(latestDeadline.getBoostPool());
        }
        else {
            boost.set(0.125);
            boostPool.set(0.125);
        }
        userAgent = "...";
    }

    public void recalculateCapacity(Block block) {
        
        long processBlockHeight = block.getHeight();
        
        BigInteger hitSum = BigInteger.ZERO;
        BigInteger hitSumBoost = BigInteger.ZERO;
        Deadline deadlineToSave = null;
        
        BigInteger hitSumShared = BigInteger.ZERO;
        int deadlinesSharedCount = 0;
        
        int nAvg = propertyService.getInt(Props.nAvg);
        int processLag = propertyService.getInt(Props.processLag);
        long lastBlockHeight = processBlockHeight + processLag;
        
        // First loop will calculate the average for the physical capacity
        int deadlinesCount = 0;
        Iterator<Deadline> it = deadlines.iterator();
        while(it.hasNext()) {
            Deadline deadline = it.next();
            
            if (deadline.getHeight() >= lastBlockHeight) {
                // We use all deadlines except the current one, so users have a best experience being able to see
                // their miner even on the first submitted deadline.
                continue;
            }
            if(deadline.getHeight() < processBlockHeight - nAvg) {
                it.remove();
                continue;
            }
            deadlinesCount++;
            BigInteger hit = deadline.calculateHit();
            
            hitSum = hitSum.add(hit);
            
            double hitBoost = hit.doubleValue()/deadline.getBoostPool();
            hitSumBoost = hitSumBoost.add(BigInteger.valueOf((long)hitBoost));
            
            if(deadline.getSharePercent() > 0) {
                double hitShared = hitBoost*100.0/(deadline.getSharePercent());
                hitSumShared = hitSumShared.add(BigInteger.valueOf((long)hitShared));
                
                deadlinesSharedCount++;
            }

            if(deadline.getHeight() == lastBlockHeight - 1) {
                deadlineToSave = deadline;
            }
        }
        nconf.set(Math.max(nAvg+processLag, deadlinesCount));        
        
        double estimatedCapacity = minerMaths.estimatedTotalPlotSize(deadlinesCount, hitSum);
        double estimatedCapacityWithBoost = minerMaths.estimatedTotalPlotSize(deadlinesCount, hitSumBoost);
        totalCapacityEffective.set(estimatedCapacityWithBoost);

        if(deadlineToSave != null) {
            // we have a new deadline to save to the DB
            if(deadlinesCount > nAvg/4) {
                // enough deadlines to make a reasonable estimate using pool data besides the chain data
                BurstValue commitmentPool = getCommittedBalance().divide(Math.max(1.0, estimatedCapacityWithBoost));

                double boostPool = MinerTracker.getCommitmentFactor(commitmentPool, block.getAverageCommitmentNQT());
                deadlineToSave.setBoostPool(boostPool);
            }
            
            // store in the database
            store.setOrUpdateDeadline(deadlineToSave.getHeight(), deadlineToSave);
            this.boost.set(deadlineToSave.getBoost());
            this.boostPool.set(deadlineToSave.getBoostPool());
        }

        // Store the calculated values on the DB
        store.setSharedCapacity(minerMaths.estimatedEffectivePlotSize(deadlinesSharedCount, hitSumShared));
        store.setTotalCapacity(estimatedCapacity);
    }

    public void recalculateShare(double poolCapacity) {
        if (poolCapacity == 0d) {
            store.setShare(0d);
            return;
        }
        double newShare = getSharedCapacity() / poolCapacity;
        if (Double.isNaN(newShare)) newShare = 0d;
        store.setShare(newShare);
    }

    @Override
    public void increasePending(BurstValue delta, Payable donationRecipient) {
        if(donationRecipient != null) {
            BurstValue donation = delta.multiply(store.getDonationPercent()/100d);
            delta = delta.subtract(donation);
            donationRecipient.increasePending(donation, null);
        }
        store.setPendingBalance(store.getPendingBalance().add(delta));
    }

    @Override
    public void decreasePending(BurstValue delta) {
        store.setPendingBalance(store.getPendingBalance().subtract(delta));
    }

    @Override
    public BurstValue getMinimumPayout() {
        return store.getMinimumPayout();
    }

    @Override
    public BurstValue takeShare(BurstValue availableReward, Payable donationRecipient) {
        BurstValue share = availableReward.multiply(store.getShare());
        increasePending(share, donationRecipient);
        return share;
    }

    public void processNewDeadline(Deadline deadline) {
        Deadline previousDeadline = null;
        for (Deadline existingDeadline : deadlines) {
            if (existingDeadline.getHeight() > deadline.getHeight()) {
                // no need, this is for an older block
                return;
            }
            if (existingDeadline.getHeight() == deadline.getHeight()) {
                if(deadline.getDeadline().compareTo(existingDeadline.getDeadline()) < 0) {
                    // the new deadline which is better
                    previousDeadline = existingDeadline;
                    break;
                }
                else {
                    // no need we already have one better
                    return;
                }
            }
        }
        if(previousDeadline != null)
            deadlines.remove(previousDeadline);

        deadlines.add(deadline);
    }

    public double getSharedCapacity() {
        return store.getSharedCapacity();
    }

    public double getTotalCapacity() {
        return store.getTotalCapacity();
    }
    
    public double getTotalEffectiveCapacity() {
        if(totalCapacityEffective.get()!=null)
            return totalCapacityEffective.get();
        return store.getTotalCapacity();
    }

    public int getSharePercent() {
        return store.getSharePercent();
    }
    public void setSharePercent(int sharePercent) {
        store.setSharePercent(sharePercent);
    }
    
    public int getDonationPercent() {
        return store.getDonationPercent();
    }
    public void setDonationPercent(int donationPercent) {
        store.setDonationPercent(donationPercent);
    }

    @Override
    public BurstValue getPending() {
        return store.getPendingBalance();
    }

    @Override
    public BurstAddress getAddress() {
        return address;
    }

    public double getShare() {
        return store.getShare();
    }

    public int getNConf() {
        return nconf.get();
    }
    
    public double getBoost() {
        return boost.get();
    }

    public double getBoostPool() {
        return boostPool.get();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public void setCommitment(BurstValue commitment, BurstValue comittedBalance, int height) {
        this.commitment.set(commitment);
        this.committedBalance.set(comittedBalance);
        this.commitmentHeight = height;
    }
    
    public BurstValue getCommitment() {
        BurstValue value = commitment.get();
        if(value == null)
            value = BurstValue.fromBurst(0);
        return value;
    }
    
    public BurstValue getCommittedBalance() {
        BurstValue value = committedBalance.get();
        if(value == null)
            value = BurstValue.fromBurst(0);
        return value;
    }
    
    public int getCommitmentHeight() {
        return this.commitmentHeight;
    }
    
    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public void setMinimumPayout(BurstValue minimumPayout) {
        store.setMinimumPayout(minimumPayout);
    }

    public Deadline getBestDeadline(long height) {
        for(Deadline deadline : deadlines) {
            if(deadline.getHeight() == height)
                return deadline;
        }
        return null;
    }
    
    public List<Deadline> getDeadlines() {
        return new ArrayList<>(deadlines);
    }
}
