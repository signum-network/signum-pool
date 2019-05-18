/*
 * This file is generated by jOOQ.
 */
package burst.pool.migrator.db.tables;


import burst.pool.migrator.db.DefaultSchema;
import burst.pool.migrator.db.Indexes;
import burst.pool.migrator.db.Keys;
import burst.pool.migrator.db.tables.records.MinerDeadlinesRecord;
import org.jooq.*;
import org.jooq.impl.DSL;
import org.jooq.impl.TableImpl;

import javax.annotation.Generated;
import java.util.Arrays;
import java.util.List;


/**
 * This class is generated by jOOQ.
 */
@Generated(
    value = {
        "http://www.jooq.org",
        "jOOQ version:3.11.9"
    },
    comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class MinerDeadlines extends TableImpl<MinerDeadlinesRecord> {

    private static final long serialVersionUID = 1468171889;

    /**
     * The reference instance of <code>miner_deadlines</code>
     */
    public static final MinerDeadlines MINER_DEADLINES = new MinerDeadlines();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<MinerDeadlinesRecord> getRecordType() {
        return MinerDeadlinesRecord.class;
    }

    /**
     * The column <code>miner_deadlines.db_id</code>.
     */
    public final TableField<MinerDeadlinesRecord, Long> DB_ID = createField("db_id", org.jooq.impl.SQLDataType.BIGINT.nullable(false).identity(true), this, "");

    /**
     * The column <code>miner_deadlines.account_id</code>.
     */
    public final TableField<MinerDeadlinesRecord, Long> ACCOUNT_ID = createField("account_id", org.jooq.impl.SQLDataType.BIGINT.defaultValue(DSL.field("NULL", org.jooq.impl.SQLDataType.BIGINT)), this, "");

    /**
     * The column <code>miner_deadlines.height</code>.
     */
    public final TableField<MinerDeadlinesRecord, Long> HEIGHT = createField("height", org.jooq.impl.SQLDataType.BIGINT.defaultValue(DSL.field("NULL", org.jooq.impl.SQLDataType.BIGINT)), this, "");

    /**
     * The column <code>miner_deadlines.deadline</code>.
     */
    public final TableField<MinerDeadlinesRecord, Long> DEADLINE = createField("deadline", org.jooq.impl.SQLDataType.BIGINT.defaultValue(DSL.field("NULL", org.jooq.impl.SQLDataType.BIGINT)), this, "");

    /**
     * The column <code>miner_deadlines.base_target</code>.
     */
    public final TableField<MinerDeadlinesRecord, Long> BASE_TARGET = createField("base_target", org.jooq.impl.SQLDataType.BIGINT.defaultValue(DSL.field("NULL", org.jooq.impl.SQLDataType.BIGINT)), this, "");

    /**
     * Create a <code>miner_deadlines</code> table reference
     */
    public MinerDeadlines() {
        this(DSL.name("miner_deadlines"), null);
    }

    /**
     * Create an aliased <code>miner_deadlines</code> table reference
     */
    public MinerDeadlines(String alias) {
        this(DSL.name(alias), MINER_DEADLINES);
    }

    /**
     * Create an aliased <code>miner_deadlines</code> table reference
     */
    public MinerDeadlines(Name alias) {
        this(alias, MINER_DEADLINES);
    }

    private MinerDeadlines(Name alias, Table<MinerDeadlinesRecord> aliased) {
        this(alias, aliased, null);
    }

    private MinerDeadlines(Name alias, Table<MinerDeadlinesRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""));
    }

    public <O extends Record> MinerDeadlines(Table<O> child, ForeignKey<O, MinerDeadlinesRecord> key) {
        super(child, key, MINER_DEADLINES);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Schema getSchema() {
        return DefaultSchema.DEFAULT_SCHEMA;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Index> getIndexes() {
        return Arrays.<Index>asList(Indexes.MINER_DEADLINES_MINER_DEADLINES_INDEX, Indexes.MINER_DEADLINES_PRIMARY);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Identity<MinerDeadlinesRecord, Long> getIdentity() {
        return Keys.IDENTITY_MINER_DEADLINES;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public UniqueKey<MinerDeadlinesRecord> getPrimaryKey() {
        return Keys.KEY_MINER_DEADLINES_PRIMARY;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<UniqueKey<MinerDeadlinesRecord>> getKeys() {
        return Arrays.<UniqueKey<MinerDeadlinesRecord>>asList(Keys.KEY_MINER_DEADLINES_PRIMARY, Keys.KEY_MINER_DEADLINES_MINER_DEADLINES_INDEX);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public MinerDeadlines as(String alias) {
        return new MinerDeadlines(DSL.name(alias), this);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public MinerDeadlines as(Name alias) {
        return new MinerDeadlines(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public MinerDeadlines rename(String name) {
        return new MinerDeadlines(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public MinerDeadlines rename(Name name) {
        return new MinerDeadlines(name, null);
    }
}
