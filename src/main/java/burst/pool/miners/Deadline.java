package burst.pool.miners;

import java.math.BigInteger;

public class Deadline {
    private final BigInteger deadline;
    private final BigInteger baseTarget;
    private final int sharePercent;
    private final long height;

    public Deadline(BigInteger deadline, BigInteger baseTarget, int sharePercent, long height) {
        this.deadline = deadline;
        this.baseTarget = baseTarget;
        this.sharePercent = sharePercent;
        this.height = height;
    }

    public BigInteger getDeadline() {
        return deadline;
    }

    public BigInteger getBaseTarget() {
        return baseTarget;
    }

    public long getHeight() {
        return height;
    }
    
    public int getSharePercent() {
      return sharePercent;
    }

    public BigInteger calculateHit() {
        return baseTarget.multiply(deadline);
    }
}
