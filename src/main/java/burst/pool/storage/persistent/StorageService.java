package burst.pool.storage.persistent;

import signumj.entity.SignumAddress;
import burst.pool.entity.Payout;
import burst.pool.entity.WonBlock;
import burst.pool.miners.Miner;
import burst.pool.miners.PoolFeeRecipient;
import burst.pool.pool.StoredSubmission;

import java.util.List;
import java.util.Map;

public interface StorageService extends AutoCloseable {
    StorageService beginTransaction() throws Exception;
    void commitTransaction() throws Exception;
    void rollbackTransaction() throws Exception;

    int getMinerCount();
    List<Miner> getMiners();
    List<Miner> getMinersFiltered();
    Miner getMiner(SignumAddress address);
    Miner newMiner(SignumAddress address);

    PoolFeeRecipient getPoolFeeRecipient();
    PoolFeeRecipient getPoolDonationRecipient();

    int getLastProcessedBlock();
    void incrementLastProcessedBlock();

    Map<Long, List<StoredSubmission>> getBestSubmissions();
    List<StoredSubmission> getBestSubmissionsForBlock(long blockHeight);
    void addBestSubmissionForBlock(long blockHeight, StoredSubmission submission);

    void addWonBlock(WonBlock wonBlock);
    List<WonBlock> getWonBlocks(int limit);

    void addPayout(Payout payout);
    void removeDeadlinesBefore(long lastHeight);
}
