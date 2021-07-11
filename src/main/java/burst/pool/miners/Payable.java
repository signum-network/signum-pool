package burst.pool.miners;

import signumj.entity.SignumAddress;
import signumj.entity.SignumValue;

public interface Payable {
    void increasePending(SignumValue delta, Payable donationRecipient);
    void decreasePending(SignumValue delta);
    SignumValue getMinimumPayout();
    SignumValue takeShare(SignumValue availableReward, Payable donationRecipient);
    SignumValue getPending();
    SignumAddress getAddress();
}
