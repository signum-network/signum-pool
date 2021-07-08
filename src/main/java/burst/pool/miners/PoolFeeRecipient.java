package burst.pool.miners;

import signumj.entity.SignumAddress;
import signumj.entity.SignumValue;
import burst.pool.storage.config.PropertyService;
import burst.pool.storage.config.Props;
import burst.pool.storage.persistent.MinerStore;

public class PoolFeeRecipient implements Payable {
    private final PropertyService propertyService;
    private final MinerStore.FeeRecipientStore store;
    private final SignumAddress address;

    public PoolFeeRecipient(PropertyService propertyService, MinerStore.FeeRecipientStore store, SignumAddress address) {
        this.propertyService = propertyService;
        this.store = store;
        this.address = address;
    }

    @Override
    public void increasePending(SignumValue delta, Payable donationRecipient) {
        store.setPendingBalance(store.getPendingBalance()
                .add(delta));
    }

    @Override
    public void decreasePending(SignumValue delta) {
        store.setPendingBalance(store.getPendingBalance().subtract(delta));
    }

    @Override
    public SignumValue getMinimumPayout() {
        return SignumValue.fromSigna(propertyService.getFloat(Props.defaultMinimumPayout));
    }

    @Override
    public SignumValue takeShare(SignumValue availableReward, Payable donationRecipient) {
        return SignumValue.fromSigna(0);
    }

    @Override
    public SignumValue getPending() {
        return store.getPendingBalance();
    }

    @Override
    public SignumAddress getAddress() {
        return address;
    }
}
