package burst.pool.storage.persistent;

import signumj.entity.SignumValue;
import burst.pool.miners.Deadline;

import java.util.List;

public interface MinerStore {
    SignumValue getPendingBalance();
    void setPendingBalance(SignumValue pendingBalance);
    
    double getSharedCapacity();
    void setSharedCapacity(double sharedCapacity);
    
    double getTotalCapacity();
    void setTotalCapacity(double totalCapacity);
    
    int getSharePercent();
    void setSharePercent(int sharePercent);
    
    int getDonationPercent();
    void setDonationPercent(int donationPercent);
    
    double getShare();
    void setShare(double share);

    SignumValue getMinimumPayout();
    void setMinimumPayout(SignumValue minimumPayout);
    
    List<Deadline> getDeadlines();
    
    void setOrUpdateDeadline(long height, Deadline deadline);

    interface FeeRecipientStore {
        SignumValue getPendingBalance();
        void setPendingBalance(SignumValue pending);
    }
}
