package burst.pool.miners;

import java.math.BigInteger;

public class Deadline {
    private final BigInteger deadline;
    private final BigInteger baseTarget;
    private final int sharePercent;
    private final long height;
    private final double boost;
    private double boostPool;

    public Deadline(BigInteger deadline, BigInteger baseTarget, int sharePercent, long height, double boost, double boostPool) {
        this.deadline = deadline;
        this.baseTarget = baseTarget;
        this.sharePercent = sharePercent;
        this.height = height;
        this.boost = boost;
        this.boostPool = boostPool;
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
    
    public double getBoost() {
        if(boost == 0.0)
            return 1.0;
        return boost;
    }

    public double getBoostPool() {
        if(boostPool == 0)
            return getBoost();
        return boostPool;
    }
    
    public void setBoostPool(double boostPool) {
        this.boostPool = boostPool;
    }

    public BigInteger calculateHit() {
        return baseTarget.multiply(deadline);
    }
}
