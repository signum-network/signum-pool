package burst.pool.entity;

import signumj.entity.SignumAddress;
import signumj.entity.SignumID;
import signumj.entity.SignumValue;

import java.math.BigInteger;

public class WonBlock {
    private final int blockHeight;
    private final SignumID blockId;
    private final SignumAddress generatorId;
    private final BigInteger nonce;
    private final SignumValue fullReward;
    private final SignumValue poolShare;

    public WonBlock(int blockHeight, SignumID blockId, SignumAddress generatorId, BigInteger nonce, SignumValue fullReward, SignumValue poolShare) {
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

    public SignumID getBlockId() {
        return blockId;
    }

    public SignumAddress getGeneratorId() {
        return generatorId;
    }

    public BigInteger getNonce() {
        return nonce;
    }

    public SignumValue getFullReward() {
        return fullReward;
    }
    
    public SignumValue getPoolShare() {
        return poolShare;
    }
}
