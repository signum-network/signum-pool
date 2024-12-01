package burst.pool.storage.persistent;

import signumj.entity.SignumAddress;
import signumj.entity.SignumID;
import signumj.entity.SignumValue;
import signumj.service.NodeService;
import burst.pool.db.tables.records.MinersRecord;
import burst.pool.entity.Payout;
import burst.pool.entity.WonBlock;
import burst.pool.miners.Deadline;
import burst.pool.miners.Miner;
import burst.pool.miners.MinerMaths;
import burst.pool.miners.PoolFeeRecipient;
import burst.pool.pool.StoredSubmission;
import burst.pool.storage.config.PropertyService;
import burst.pool.storage.config.Props;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.ehcache.Cache;
import org.ehcache.CacheManager;
import org.ehcache.config.CacheConfiguration;
import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.CacheManagerBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.FlywayException;
import org.flywaydb.core.api.configuration.FluentConfiguration;
import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.Table;
import org.jooq.conf.Settings;
import org.jooq.impl.DSL;
import org.jooq.tools.jdbc.JDBCUtils;
import org.mariadb.jdbc.MariaDbDataSource;
import org.mariadb.jdbc.UrlParser;

import java.lang.reflect.Field;
import java.math.BigInteger;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.Semaphore;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import static burst.pool.db.tables.BestSubmissions.BEST_SUBMISSIONS;
import static burst.pool.db.tables.MinerDeadlines.MINER_DEADLINES;
import static burst.pool.db.tables.Miners.MINERS;
import static burst.pool.db.tables.Payouts.PAYOUTS;
import static burst.pool.db.tables.PoolState.POOL_STATE;
import static burst.pool.db.tables.WonBlocks.WON_BLOCKS;

public class DbStorageService implements StorageService {

    private static final String POOL_STATE_FEE_RECIPIENT_BALANCE = "feeRecipientBalance";
    private static final String POOL_STATE_DONATION_RECIPIENT_BALANCE = "donationRecipientBalance";
    private static final String POOL_STATE_LAST_PROCESSED_BLOCK = "lastProcessedBlock";

    private final PropertyService propertyService;
    private final MinerMaths minerMaths;
    private final NodeService burstNodeService;

    private final ThreadLocal<Connection> localConnection = new ThreadLocal<>();

    private final int nMin;

    private final Settings settings;
    private final HikariDataSource connectionPool;
    private final SQLDialect sqlDialect;

    private final CacheManager cacheManager;
    private final Map<Table<?>, Semaphore> cacheLocks;

    public DbStorageService(PropertyService propertyService, MinerMaths minerMaths, NodeService burstNodeService) throws SQLException, FlywayException {
        String url = propertyService.getString(Props.dbUrl);
        String username = propertyService.getString(Props.dbUsername);
        String password = propertyService.getString(Props.dbPassword);
        this.propertyService = propertyService;
        this.minerMaths = minerMaths;
        this.burstNodeService = burstNodeService;

        nMin = propertyService.getInt(Props.nMin);

        String driverClass = JDBCUtils.driver(url);
        sqlDialect = JDBCUtils.dialect(url);
        try {
            Class.forName(driverClass);
        } catch (ClassNotFoundException e) {
            throw new SQLException("Could not find SQL driver: " + driverClass + ". If you want to use this Database type, please check if it is supported by JDBC and jOOQ, and then add the driver to the classpath.");
        }

        Flyway flyway = null;
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(url);
        hikariConfig.setUsername(username);
        hikariConfig.setPassword(password);
        hikariConfig.setMaximumPoolSize(64);
        hikariConfig.setAutoCommit(true);

        if (sqlDialect == SQLDialect.MARIADB) {
            flyway = flywayHack(Flyway.configure(), url, username, password).load();
        } else if (sqlDialect == SQLDialect.H2) {
            flyway = Flyway.configure()
                .locations("classpath:/db/migration_h2")
                .dataSource(url, username, password).load();

            hikariConfig.addDataSourceProperty("cachePrepStmts", "true");
            hikariConfig.addDataSourceProperty("prepStmtCacheSize", "250");
            hikariConfig.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
            hikariConfig.addDataSourceProperty("DATABASE_TO_UPPER", "false");
            hikariConfig.addDataSourceProperty("CASE_INSENSITIVE_IDENTIFIERS", "true");
        } else {
            throw new SQLException("Unsupported dialect " + sqlDialect.getName());
        }

        flyway.migrate();

        settings = new Settings();
        settings.setRenderSchema(false);
        connectionPool = new HikariDataSource(hikariConfig);

        Table<?>[] tables = new Table[]{BEST_SUBMISSIONS, MINER_DEADLINES, MINERS, POOL_STATE};
        cacheLocks = new HashMap<>();
        CacheManagerBuilder cacheManagerBuilder = CacheManagerBuilder.newCacheManagerBuilder();
        CacheConfiguration<String, Object> cacheConfiguration = CacheConfigurationBuilder.newCacheConfigurationBuilder(String.class, Object.class, ResourcePoolsBuilder.heap(1024 * 1024).build()).build();
        for (Table<?> table : tables) {
            cacheManagerBuilder = cacheManagerBuilder.withCache(table.getName(), cacheConfiguration);
            cacheLocks.put(table, new Semaphore(1));
        }
        this.cacheManager = cacheManagerBuilder.build(true);
    }

    protected DSLContext getDslContext() {
        Connection connection = localConnection.get();
        if (connection == null) {
            return DSL.using(connectionPool, sqlDialect, settings);
        } else {
            return DSL.using(connection, sqlDialect, settings);
        }
    }

    private <T> T useDslContext(Function<DSLContext, T> function) {
        return function.apply(getDslContext());
    }

    private void useDslContextVoid(Consumer<DSLContext> function) {
        function.accept(getDslContext());
    }

    private static FluentConfiguration flywayHack(FluentConfiguration flywayBuilder, String dbUrl, String dbUsername, String dbPassword) {
        MariaDbDataSource flywayDataSource = new MariaDbDataSource(dbUrl) {
            @Override
            protected synchronized void initialize() throws SQLException {
                super.initialize();
                Properties props = new Properties();
                props.setProperty("user", dbUsername);
                props.setProperty("password", dbPassword);
                props.setProperty("useMysqlMetadata", "true");
                try {
                    Field f = MariaDbDataSource.class.getDeclaredField("urlParser");
                    f.setAccessible(true);
                    f.set(this, UrlParser.parse(dbUrl, props));
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }
        };
        flywayBuilder.dataSource(flywayDataSource); // TODO Remove this hack once a stable version of Flyway has this bug fixed
        return flywayBuilder;
    }

    private <T> T doOnCache(Table<?> table, Function<Cache<String, Object>, T> operation) {
        Semaphore semaphore = cacheLocks.get(table);
        try {
            semaphore.acquire();
        } catch (InterruptedException e) {
            return null;
        }
        try {
            return operation.apply(cacheManager.getCache(table.getName(), String.class, Object.class));
        } finally {
            semaphore.release();
        }
    }

    private void storeInCache(Table<?> table, String key, Object value) {
        doOnCache(table, cache -> {
            cache.put(key, value);
            return null;
        });
    }

    private void removeFromCache(Table<?> table, String key) {
        doOnCache(table, cache -> {
            cache.remove(key);
            return null;
        });
    }

    @SuppressWarnings("unchecked")
    private <T> T getFromCacheOr(Table<?> table, String key, Supplier<T> supplier) {
        return doOnCache(table, cache -> (T) Optional.ofNullable(cache.get(key)).orElseGet(() -> {
            T object = supplier.get();
            if (object != null) cache.put(key, object);
            return object;
        }));
    }

    private Miner minerFromRecord(MinersRecord record) {
        return new Miner(minerMaths, propertyService, SignumAddress.fromId(SignumID.fromLong(record.getAccountId())), new DbMinerStore(record.getAccountId()));
    }

    private void resetCache() {
        synchronized (cacheManager) {
            cacheManager.close();
            cacheManager.init();
        }
    }

    @Override
    public StorageService beginTransaction() throws SQLException {
        if (localConnection.get() != null) {
            throw new IllegalStateException("Already in transaction");
        }

        Connection connection = connectionPool.getConnection();
        connection.setAutoCommit(false);
        localConnection.set(connection);

        return this;
    }

    @Override
    public void commitTransaction() throws Exception {
        if (localConnection.get() != null) {
            localConnection.get().commit();
        } else {
            throw new IllegalStateException("Not in transaction");
        }
    }

    @Override
    public void rollbackTransaction() throws Exception {
        if (localConnection.get() != null) {
            localConnection.get().rollback();
            resetCache();
        } else {
            throw new IllegalStateException("Not in transaction");
        }
    }

    private void recalculateMinerCount() { // TODO increment would be faster...
        useDslContextVoid(context -> storeInCache(MINERS, "count", context.selectCount()
            .from(MINERS)
            .fetchOne(0, int.class)));
    }

    @Override
    public int getMinerCount() {
        return getFromCacheOr(MINERS, "count", () -> useDslContext(context -> context.selectCount()
            .from(MINERS)
            .fetchOne(0, int.class)));
    }

    @Override
    public List<Miner> getMiners() {
        return useDslContext(context -> context.select(MINERS.ACCOUNT_ID)
            .from(MINERS)
            .fetch(id -> getMiner(id.get(MINERS.ACCOUNT_ID))));
    }

    @Override
    public List<Miner> getMinersFiltered() {
        return useDslContext(context -> context.select(MINERS.ACCOUNT_ID)
            .from(MINERS)
            .fetch(id -> getMiner(id.get(MINERS.ACCOUNT_ID)))
            .stream()
            .filter(miner -> miner.getNConf() >= nMin)
            .collect(Collectors.toList()));
    }

    @Override
    public Miner getMiner(SignumAddress address) {
        return getMiner(address.getSignumID().getSignedLongId());
    }

    private Miner getMiner(long id) {
        try {
            return getFromCacheOr(MINERS, Long.toUnsignedString(id), () -> useDslContext(context -> context.selectFrom(MINERS)
                .where(MINERS.ACCOUNT_ID.eq(id))
                .fetchAny(this::minerFromRecord)));
        } catch (NullPointerException e) {
            return null;
        }
    }

    /**
     * Synchronized because...??? TODO!!
     */
    @Override
    public synchronized Miner newMiner(SignumAddress address) {
        // We do not need to add to cache as once inserted getMiner will add to cache
        return useDslContext(context -> {
            if (context.selectCount()
                .from(MINERS)
                .where(MINERS.ACCOUNT_ID.eq(address.getSignumID().getSignedLongId()))
                .fetchOne(0, int.class) > 0) {
                return getMiner(address);
            } else {
                context.insertInto(MINERS, MINERS.ACCOUNT_ID, MINERS.SHARE_PERCENT, MINERS.DONATION_PERCENT, MINERS.PENDING_BALANCE, MINERS.ESTIMATED_CAPACITY, MINERS.SHARE, MINERS.MINIMUM_PAYOUT, MINERS.NAME, MINERS.USER_AGENT)
                    .values(address.getSignumID().getSignedLongId(),
                        100 - (int) (100 * propertyService.getFloat(Props.winnerRewardPercentage)),
                        propertyService.getInt(Props.donationPercent),
                        0L, 0d, 0d, SignumValue.fromSigna(propertyService.getFloat(Props.defaultMinimumPayout)).toNQT().longValueExact(), "", "")
                    .execute();
                recalculateMinerCount();
                return getMiner(address);
            }
        });
    }

    @Override
    public PoolFeeRecipient getPoolFeeRecipient() {
        return new PoolFeeRecipient(propertyService, new DbRecipientStore(POOL_STATE_FEE_RECIPIENT_BALANCE), propertyService.getSignumAddress(Props.feeRecipient));
    }

    @Override
    public PoolFeeRecipient getPoolDonationRecipient() {
        return new PoolFeeRecipient(propertyService, new DbRecipientStore(POOL_STATE_DONATION_RECIPIENT_BALANCE), propertyService.getSignumAddress(Props.donationRecipient));
    }

//    private void setLastProcessedBlock(int block) {
//        useDslContextVoid(context -> {
//            context.mergeInto(POOL_STATE, POOL_STATE.KEY, POOL_STATE.VALUE)
//                .key(POOL_STATE.KEY)
//                .values(POOL_STATE_LAST_PROCESSED_BLOCK, Integer.toString(block))
//                .execute();
//            storeInCache(POOL_STATE, POOL_STATE_LAST_PROCESSED_BLOCK, block);
//        });
//    }

    private void setLastProcessedBlock(int block) {
        useDslContextVoid(context -> {
            context.insertInto(POOL_STATE)
                .columns(POOL_STATE.KEY, POOL_STATE.VALUE)
                .values(POOL_STATE_LAST_PROCESSED_BLOCK, Integer.toString(block))
                .onConflict(POOL_STATE.KEY)
                .doUpdate()
                .set(POOL_STATE.VALUE, Integer.toString(block))
                .execute();
            storeInCache(POOL_STATE, POOL_STATE_LAST_PROCESSED_BLOCK, block);
        });
    }
    @Override
    public int getLastProcessedBlock() {
        try {
            return getFromCacheOr(POOL_STATE, POOL_STATE_LAST_PROCESSED_BLOCK, () -> useDslContext(context -> context.select(POOL_STATE.VALUE)
                .from(POOL_STATE)
                .where(POOL_STATE.KEY.eq(POOL_STATE_LAST_PROCESSED_BLOCK))
                .fetchAny(result -> Integer.parseInt(result.get(POOL_STATE.VALUE)))));
        } catch (NullPointerException e) {
            int height = (int) burstNodeService.getMiningInfo().blockingFirst().getHeight() - ((propertyService.getInt(Props.processLag) + propertyService.getInt(Props.nAvg)) * 2);
            if (height < 0) height = 0;
            setLastProcessedBlock(height);
            return height;
        }
    }

    @Override
    public void incrementLastProcessedBlock() {
        int block = getLastProcessedBlock() + 1;
        setLastProcessedBlock(block);
    }

    @Override
    public Map<Long, List<StoredSubmission>> getBestSubmissions() {
        // We don't need to cache as getBestSubmissionForBlock will read from cache
        return useDslContext(context -> context.select(BEST_SUBMISSIONS.HEIGHT)
            .from(BEST_SUBMISSIONS)
            .fetch()
            .stream()
            .distinct()
            .collect(Collectors.toMap(height -> height.get(BEST_SUBMISSIONS.HEIGHT), height -> getBestSubmissionsForBlock(height.get(BEST_SUBMISSIONS.HEIGHT)))));
    }

    @Override
    public List<StoredSubmission> getBestSubmissionsForBlock(long blockHeight) {
        try {
            return getFromCacheOr(BEST_SUBMISSIONS, Long.toString(blockHeight), () -> useDslContext(context -> context.selectFrom(BEST_SUBMISSIONS)
                .where(BEST_SUBMISSIONS.HEIGHT.eq(blockHeight))
                .fetch(response -> new StoredSubmission(SignumAddress.fromId(SignumID.fromLong(response.getAccountId())), new BigInteger(response.getNonce()), response.getDeadline()))));
        } catch (NullPointerException e) {
            return null;
        }
    }

    @Override
    public void addBestSubmissionForBlock(long blockHeight, StoredSubmission submission) {
        List<StoredSubmission> submissions = getBestSubmissionsForBlock(blockHeight);
        if (submissions == null) submissions = new ArrayList<>();
        useDslContextVoid(context -> context.insertInto(BEST_SUBMISSIONS, BEST_SUBMISSIONS.HEIGHT, BEST_SUBMISSIONS.ACCOUNT_ID, BEST_SUBMISSIONS.NONCE, BEST_SUBMISSIONS.DEADLINE)
            .values(blockHeight, submission.getMiner().getSignumID().getSignedLongId(), submission.getNonce().toString(), submission.getDeadline())
            .execute());
        submissions.add(submission);
        storeInCache(BEST_SUBMISSIONS, Long.toUnsignedString(blockHeight), submissions);
    }

    @Override
    public void addWonBlock(WonBlock wonBlock) {
        // Won blocks are not cached. TODO cache!
        useDslContextVoid(context -> context.insertInto(WON_BLOCKS, WON_BLOCKS.BLOCK_HEIGHT, WON_BLOCKS.BLOCK_ID, WON_BLOCKS.GENERATOR_ID, WON_BLOCKS.NONCE, WON_BLOCKS.FULL_REWARD, WON_BLOCKS.POOL_SHARE)
            .values((long) wonBlock.getBlockHeight(), wonBlock.getBlockId().getSignedLongId(), wonBlock.getGeneratorId().getSignumID().getSignedLongId(), wonBlock.getNonce().toString(), wonBlock.getFullReward().toNQT().longValue(), wonBlock.getPoolShare().toNQT().longValue())
            .execute());
    }

    @Override
    public List<WonBlock> getWonBlocks(int limit) { // TODO cache
        return useDslContext(context -> context.selectFrom(WON_BLOCKS)
            .orderBy(WON_BLOCKS.BLOCK_HEIGHT.desc())
            .limit(limit)
            .fetch(record -> new WonBlock(record.getBlockHeight().intValue(), SignumID.fromLong(record.getBlockId()), SignumAddress.fromId(SignumID.fromLong(record.getGeneratorId())), new BigInteger(record.getNonce()), SignumValue.fromNQT(record.getFullReward()), SignumValue.fromNQT(record.getPoolShare() >= 0 ? record.getPoolShare() : record.getFullReward()))));
    }

    @Override
    public void addPayout(Payout payout) {
        // Payouts are not cached. TODO cache them!
        useDslContextVoid(context -> context.insertInto(PAYOUTS, PAYOUTS.TRANSACTION_ID, PAYOUTS.SENDER_PUBLIC_KEY, PAYOUTS.FEE, PAYOUTS.DEADLINE, PAYOUTS.ATTACHMENT)
            .values(payout.getTransactionId().getSignedLongId(), payout.getSenderPublicKey(), payout.getFee().toNQT().longValue(), (long) payout.getDeadline(), payout.getAttachment())
            .execute());
    }

    @Override
    public void removeDeadlinesBefore(long height) {
        useDslContextVoid(context -> context.delete(MINER_DEADLINES)
            .where(MINER_DEADLINES.HEIGHT.le(height))
            .execute());
    }


    @Override
    public void close() throws Exception {
        if (localConnection.get() != null) {
            localConnection.get().close();
            localConnection.set(null);
        } else {
            connectionPool.close();
            cacheManager.close();
        }
    }

    private class DbMinerStore implements MinerStore {
        private final long accountId;
        private final String accountIdStr;

        private DbMinerStore(long accountId) {
            this.accountId = accountId;
            this.accountIdStr = Long.toUnsignedString(accountId);
        }

        @Override
        public SignumValue getPendingBalance() {
            return getFromCacheOr(MINERS, accountIdStr + "pending", () -> useDslContext(context -> context.select(MINERS.PENDING_BALANCE)
                .from(MINERS)
                .where(MINERS.ACCOUNT_ID.eq(accountId))
                .fetchAny(record -> SignumValue.fromNQT(record.get(MINERS.PENDING_BALANCE)))));
        }

        @Override
        public void setPendingBalance(SignumValue pendingBalance) {
            useDslContextVoid(context -> context.update(MINERS)
                .set(MINERS.PENDING_BALANCE, pendingBalance.toNQT().longValueExact())
                .where(MINERS.ACCOUNT_ID.eq(accountId))
                .execute());
            storeInCache(MINERS, accountIdStr + "pending", pendingBalance);
        }

        @Override
        public double getSharedCapacity() {
            return getFromCacheOr(MINERS, accountIdStr + "sharedCapacity", () -> useDslContext(context -> context.select(MINERS.SHARED_CAPACITY)
                .from(MINERS)
                .where(MINERS.ACCOUNT_ID.eq(accountId))
                .fetchAny()
                .get(MINERS.SHARED_CAPACITY)));
        }

        @Override
        public void setSharedCapacity(double sharedCapacity) {
            useDslContextVoid(context -> context.update(MINERS)
                .set(MINERS.SHARED_CAPACITY, sharedCapacity)
                .where(MINERS.ACCOUNT_ID.eq(accountId))
                .execute());
            storeInCache(MINERS, accountIdStr + "sharedCapacity", sharedCapacity);
        }

        @Override
        public double getTotalCapacity() {
            return getFromCacheOr(MINERS, accountIdStr + "estimated", () -> useDslContext(context -> context.select(MINERS.ESTIMATED_CAPACITY)
                .from(MINERS)
                .where(MINERS.ACCOUNT_ID.eq(accountId))
                .fetchAny()
                .get(MINERS.ESTIMATED_CAPACITY)));
        }

        @Override
        public void setTotalCapacity(double estimatedCapacity) {
            useDslContextVoid(context -> context.update(MINERS)
                .set(MINERS.ESTIMATED_CAPACITY, estimatedCapacity)
                .where(MINERS.ACCOUNT_ID.eq(accountId))
                .execute());
            storeInCache(MINERS, accountIdStr + "estimated", estimatedCapacity);
        }


        @Override
        public int getSharePercent() {
            return getFromCacheOr(MINERS, accountIdStr + "sharePrecent", () -> useDslContext(context -> context.select(MINERS.SHARE_PERCENT)
                .from(MINERS)
                .where(MINERS.ACCOUNT_ID.eq(accountId))
                .fetchAny()
                .get(MINERS.SHARE_PERCENT)));
        }

        @Override
        public void setSharePercent(int sharePercent) {
            useDslContextVoid(context -> context.update(MINERS)
                .set(MINERS.SHARE_PERCENT, sharePercent)
                .where(MINERS.ACCOUNT_ID.eq(accountId))
                .execute());
            storeInCache(MINERS, accountIdStr + "sharePrecent", sharePercent);
        }

        @Override
        public int getDonationPercent() {
            return getFromCacheOr(MINERS, accountIdStr + "donationPrecent", () -> useDslContext(context -> context.select(MINERS.DONATION_PERCENT)
                .from(MINERS)
                .where(MINERS.ACCOUNT_ID.eq(accountId))
                .fetchAny()
                .get(MINERS.DONATION_PERCENT)));
        }

        @Override
        public void setDonationPercent(int donationPercent) {
            useDslContextVoid(context -> context.update(MINERS)
                .set(MINERS.DONATION_PERCENT, donationPercent)
                .where(MINERS.ACCOUNT_ID.eq(accountId))
                .execute());
            storeInCache(MINERS, accountIdStr + "donationPrecent", donationPercent);
        }


        @Override
        public double getShare() {
            return getFromCacheOr(MINERS, accountIdStr + "share", () -> useDslContext(context -> context.select(MINERS.SHARE)
                .from(MINERS)
                .where(MINERS.ACCOUNT_ID.eq(accountId))
                .fetchAny()
                .get(MINERS.SHARE)));
        }

        @Override
        public void setShare(double share) {
            useDslContextVoid(context -> context.update(MINERS)
                .set(MINERS.SHARE, share)
                .where(MINERS.ACCOUNT_ID.eq(accountId))
                .execute());
            storeInCache(MINERS, accountIdStr + "share", share);
        }

        @Override
        public SignumValue getMinimumPayout() {
            return getFromCacheOr(MINERS, accountIdStr + "minpayout", () -> useDslContext(context -> context.select(MINERS.MINIMUM_PAYOUT)
                .from(MINERS)
                .where(MINERS.ACCOUNT_ID.eq(accountId))
                .fetchAny(record -> SignumValue.fromNQT(record.get(MINERS.MINIMUM_PAYOUT)))));
        }

        @Override
        public void setMinimumPayout(SignumValue minimumPayout) {
            useDslContextVoid(context -> context.update(MINERS)
                .set(MINERS.MINIMUM_PAYOUT, minimumPayout.toNQT().longValueExact())
                .where(MINERS.ACCOUNT_ID.eq(accountId))
                .execute());
            storeInCache(MINERS, accountIdStr + "minpayout", minimumPayout);
        }

        @Override
        public List<Deadline> getDeadlines() {
            return useDslContext(context -> context.select(MINER_DEADLINES.BASE_TARGET, MINER_DEADLINES.SHARE_PERCENT, MINER_DEADLINES.HEIGHT, MINER_DEADLINES.DEADLINE,
                    MINER_DEADLINES.BOOST, MINER_DEADLINES.BOOST_POOL)
                .from(MINER_DEADLINES)
                .where(MINER_DEADLINES.ACCOUNT_ID.eq(accountId))
                .fetch()
                .map(record -> new Deadline(BigInteger.valueOf(record.get(MINER_DEADLINES.DEADLINE)),
                    BigInteger.valueOf(record.get(MINER_DEADLINES.BASE_TARGET)),
                    record.get(MINER_DEADLINES.SHARE_PERCENT), record.get(MINER_DEADLINES.HEIGHT),
                    record.field(MINER_DEADLINES.BOOST) != null ? record.get(MINER_DEADLINES.BOOST) : 0d,
                    record.field(MINER_DEADLINES.BOOST_POOL) != null ? record.get(MINER_DEADLINES.BOOST_POOL) : 0d)));
        }

        @Override
        public void setOrUpdateDeadline(long height, Deadline deadline) {
            useDslContextVoid(context -> context.insertInto(MINER_DEADLINES)
                .columns(
                    MINER_DEADLINES.ACCOUNT_ID,
                    MINER_DEADLINES.SHARE_PERCENT,
                    MINER_DEADLINES.HEIGHT,
                    MINER_DEADLINES.DEADLINE,
                    MINER_DEADLINES.BASE_TARGET,
                    MINER_DEADLINES.BOOST,
                    MINER_DEADLINES.BOOST_POOL
                )
                .values(
                    accountId,
                    deadline.getSharePercent(),
                    height,
                    deadline.getDeadline().longValue(),
                    deadline.getBaseTarget().longValue(),
                    deadline.getBoost(),
                    deadline.getBoostPool()
                )
                .onConflict(MINER_DEADLINES.ACCOUNT_ID, MINER_DEADLINES.HEIGHT)
                .doUpdate()
                .set(MINER_DEADLINES.SHARE_PERCENT, deadline.getSharePercent())
                .set(MINER_DEADLINES.DEADLINE, deadline.getDeadline().longValue())
                .set(MINER_DEADLINES.BASE_TARGET, deadline.getBaseTarget().longValue())
                .set(MINER_DEADLINES.BOOST, deadline.getBoost())
                .set(MINER_DEADLINES.BOOST_POOL, deadline.getBoostPool())
                .execute());
        }
    }

    private final class DbRecipientStore implements MinerStore.FeeRecipientStore {

        private final String key;

        public DbRecipientStore(String key) {
            this.key = key;
        }

        @Override
        public SignumValue getPendingBalance() {
            try {
                SignumValue pending = getFromCacheOr(POOL_STATE, key, () -> useDslContext(context -> context.select(POOL_STATE.VALUE)
                    .from(POOL_STATE)
                    .where(POOL_STATE.KEY.eq(key))
                    .fetchAny(record -> SignumValue.fromNQT(record.get(POOL_STATE.VALUE)))));
                return pending == null ? SignumValue.ZERO : pending;
            } catch (NullPointerException e) {
                return SignumValue.fromNQT(0);
            }
        }

        @Override
        public void setPendingBalance(SignumValue pending) {
            useDslContextVoid(context -> context.insertInto(POOL_STATE)
                .columns(POOL_STATE.KEY, POOL_STATE.VALUE)
                .values(key, pending.toNQT().toString())
                .onConflict(POOL_STATE.KEY)
                .doUpdate()
                .set(POOL_STATE.VALUE, pending.toNQT().toString())
                .execute());
            storeInCache(POOL_STATE, key, pending);
        }
    }
}
