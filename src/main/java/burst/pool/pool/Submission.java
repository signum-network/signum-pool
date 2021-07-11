package burst.pool.pool;

import signumj.entity.SignumAddress;

import java.math.BigInteger;

public class Submission {
    private final SignumAddress miner;
    private final BigInteger nonce;

    public Submission(SignumAddress miner, BigInteger nonce) {
        this.miner = miner;
        this.nonce = nonce;
    }

    public SignumAddress getMiner() {
        return miner;
    }

    public BigInteger getNonce() {
        return nonce;
    }
}
