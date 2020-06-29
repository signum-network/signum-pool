package burst.pool.miners;

import java.math.BigInteger;

public class Deadline {
    private final BigInteger deadline;
    private final BigInteger baseTarget;
    private final double shareRatio;
    private final long height;

    public Deadline(BigInteger deadline, BigInteger baseTarget, double shareRatio, long height) {
        this.deadline = deadline;
        this.baseTarget = baseTarget;
        this.shareRatio = shareRatio;
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
    
    public double getShareRatio() {
      return shareRatio;
    }

    public BigInteger calculateHit() {
        return baseTarget.multiply(deadline);
    }
}
