package burst.pool.miners;

import burst.kit.entity.BurstAddress;
import burst.kit.entity.BurstValue;
import burst.pool.storage.config.PropertyService;
import burst.pool.storage.config.Props;
import burst.pool.storage.persistent.MinerStore;

import java.math.BigInteger;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

public class Miner implements Payable {
    private final MinerMaths minerMaths;
    private final PropertyService propertyService;

    private final BurstAddress address;
    private final MinerStore store;
    private int commitmentHeight;
    private AtomicReference<BurstValue> commitment = new AtomicReference<>();
    private AtomicReference<BurstValue> committedBalance = new AtomicReference<>();
    private String userAgent, name;

    public Miner(MinerMaths minerMaths, PropertyService propertyService, BurstAddress address, MinerStore store) {
        this.minerMaths = minerMaths;
        this.propertyService = propertyService;
        this.address = address;
        this.store = store;
    }

    public void recalculateCapacity(long currentBlockHeight) {
        // Calculate hitSum
        BigInteger hitSumShared = BigInteger.ZERO;
        BigInteger hitSum = BigInteger.ZERO;
        AtomicInteger deadlineCount = new AtomicInteger(store.getDeadlineCount());
        List<Deadline> deadlines = store.getDeadlines();
        for(Deadline deadline : deadlines) {
            if (currentBlockHeight - deadline.getHeight() >= propertyService.getInt(Props.nAvg)) {
                // Prune older deadlines
                store.removeDeadline(deadline.getHeight());
                continue;
            }
            
            BigInteger hit = deadline.calculateHit();
            hitSum = hitSum.add(hit);
            if(deadline.getSharePercent() > 0) {
                hit = hit.divide(BigInteger.valueOf(deadline.getSharePercent()))
                    .multiply(BigInteger.valueOf(100L));
            }
            else {
                // Set a very high hit to produce a zero shared capacity
                hit = BigInteger.valueOf(MinerMaths.GENESIS_BASE_TARGET * 10000L);
            }
            hitSumShared = hitSumShared.add(hit);
        }
        // Calculate estimated capacity
        try {
            store.setSharedCapacity(minerMaths.estimatedEffectivePlotSize(deadlines.size(), deadlineCount.get(), hitSumShared));
            store.setTotalCapacity(minerMaths.estimatedTotalPlotSize(deadlines.size(), hitSum));
        } catch (ArithmeticException ignored) {
        }
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
        // Check if deadline is for an older block
        List<Deadline> deadlines = store.getDeadlines();
        boolean previousDeadlineExists = false;
        for (Deadline existingDeadline : deadlines) {
            if (existingDeadline.getHeight() > deadline.getHeight()) return;
            if (existingDeadline.getHeight() == deadline.getHeight()) previousDeadlineExists = true;
        }

        if (previousDeadlineExists) {
            Deadline previousDeadline = store.getDeadline(deadline.getHeight());
            if (previousDeadline == null || deadline.getDeadline().compareTo(previousDeadline.getDeadline()) < 0) { // If new deadline is better
                store.setOrUpdateDeadline(deadline.getHeight(), deadline);
            }
        } else {
            store.setOrUpdateDeadline(deadline.getHeight(), deadline);
        }
    }

    public double getSharedCapacity() {
        return store.getSharedCapacity();
    }
    

    public double getTotalCapacity() {
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
        return store.getDeadlineCount();
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

    public BigInteger getBestDeadline(long height) {
        Deadline deadline = store.getDeadline(height);
        return deadline == null ? null : deadline.getDeadline();
    }
}
