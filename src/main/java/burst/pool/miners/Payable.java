package burst.pool.miners;

import burst.kit.entity.BurstAddress;
import burst.kit.entity.BurstValue;

public interface Payable {
    void increasePending(BurstValue delta, Payable donationRecipient);
    void decreasePending(BurstValue delta);
    BurstValue getMinimumPayout();
    BurstValue takeShare(BurstValue availableReward, Payable donationRecipient);
    BurstValue getPending();
    BurstAddress getAddress();
}
