package burst.pool.miners;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigInteger;

public class MinerMaths {
    private final Logger logger = LoggerFactory.getLogger(MinerMaths.class);

    public static final long GENESIS_BASE_TARGET = 18325193796L;
    private final double[] alphas;

    public MinerMaths(int nAvg, int nMin) {
        alphas = new double[nAvg];
        for (int i = 0; i < nAvg; i++) {
            if (i < nMin-1) {
                alphas[i] = 0d;
            } else {
                double nConf = i + 1;
                alphas[i] = 1d - ((double)nAvg-nConf)/ nConf *Math.log(nAvg/((double)nAvg-nConf));
            }
        }
        alphas[nAvg-1] = 1d;
    }
    
    /**
     * Tries to estimate the total capacity of the account, given a hitSum and number of confirmations
     *  
     * @param nConf
     * @param hitSum
     * @return the estimated total capacity
     */
    public double estimatedTotalPlotSize(int nConf, BigInteger hitSum) {
        return estimatePlotSize(1.0, nConf, hitSum);
    }

    public double estimatedEffectivePlotSize(int originalNConf, int nConf, BigInteger hitSum) {
        return estimatePlotSize(alpha(originalNConf), nConf, hitSum);
    }
    
    private double estimatePlotSize(double alphaValue, int nConf, BigInteger hitSum) {
        if (hitSum.compareTo(BigInteger.ZERO) == 0) {
            throw new ArithmeticException();
        }
        double plotSize =  alphaValue * 240d * (((double)nConf)-1d) * (double)GENESIS_BASE_TARGET / hitSum.doubleValue();
        if (Double.isInfinite(plotSize) || Double.isNaN(plotSize)) {
            logger.debug("Calculated impossible plot size. alpha: " + alphaValue + ", nConf: " + nConf + ", hitSum: " + hitSum);
            throw new ArithmeticException();
        }
        return plotSize;
    }

    private double alpha(int nConf) {
        if (nConf == 0) {
            return 0d;
        }
        if (alphas.length < nConf) {
            return 1d;
        }
        return alphas[nConf-1];
    }
}
