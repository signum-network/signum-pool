package burst.pool.pool;

import signumj.entity.SignumAddress;

import java.math.BigInteger;

public class StoredSubmission extends Submission {
    private final long deadline;
    public StoredSubmission(SignumAddress miner, BigInteger nonce, long deadline) {
        super(miner, nonce);
        this.deadline = deadline;
    }

    public long getDeadline() {
        return deadline;
    }
}
