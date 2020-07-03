package burst.pool.entity;

import burst.kit.entity.BurstAddress;
import burst.kit.entity.BurstID;
import burst.kit.entity.BurstValue;

import java.math.BigInteger;

public class WonBlock {
    private final int blockHeight;
    private final BurstID blockId;
    private final BurstAddress generatorId;
    private final BigInteger nonce;
    private final BurstValue fullReward;
    private final BurstValue poolShare;

    public WonBlock(int blockHeight, BurstID blockId, BurstAddress generatorId, BigInteger nonce, BurstValue fullReward, BurstValue poolShare) {
        this.blockHeight = blockHeight;
        this.blockId = blockId;
        this.generatorId = generatorId;
        this.nonce = nonce;
        this.fullReward = fullReward;
        this.poolShare = poolShare;
    }

    public int getBlockHeight() {
        return blockHeight;
    }

    public BurstID getBlockId() {
        return blockId;
    }

    public BurstAddress getGeneratorId() {
        return generatorId;
    }

    public BigInteger getNonce() {
        return nonce;
    }

    public BurstValue getFullReward() {
        return fullReward;
    }
    
    public BurstValue getPoolShare() {
        return poolShare;
    }
}
