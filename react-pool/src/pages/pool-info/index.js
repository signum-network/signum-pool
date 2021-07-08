// React
import { Fragment, useEffect, useState } from "react";

// React translations
import { useTranslation } from "react-i18next";

// Redux integration with actions
import { connect } from "react-redux";

// Redux actions
import PropTypes from "prop-types";
import { fetchBlocksData } from "../../utils/redux/actions/basicInfo";

// Material ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

// Material ui navigation
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// Styling
import styles from "./Pool.module.css";

// Components
import Spinner from "../../components/UI/Spinner/index";
import BlocksTable from "../../components/UI/blocksTable/index";
import MinersTable from "../../components/UI/minersTable/index";
import OutlinedTable from "../../components/UI/outlinedTable/index";
import MinerOptions from "../../components/pages/poolInfo/minerOption/index";

// Extra
import { thousands_separators } from "../../utils/functions/normal";
import { formatTime } from "../../utils/functions/blockchain";

// Third-party
import { isMobile } from "react-device-detect";
import clsx from "clsx";

// SEO
import { Helmet } from "react-helmet";
import { POOLNameToUse } from "../../utils/globalParameters";

const PoolInfo = (props) => {
  // Translations details
  const { t } = useTranslation();

  // Get props
  const { basicData, minerData, blockData, poolData, fetchBlocksData } = props;

  // Handle navigation
  const [currentTab, updateTab] = useState(0);

  const toogleTab = (event, newValue) => {
    updateTab(newValue);
  };

  // Handle elapsed time
  const [loadingElapsedTime, updateLoadingElapseTime] = useState(true);
  const [elapsedTimeValue, updateElapsedTimeValue] = useState("");

  // Initial dataFetch
  const initialDataFetch = async () => {
    // Key in localstorage
    const roundStartKey = "roundStartKey";

    // Update roundStart
    await localStorage.setItem(roundStartKey, basicData.roundStart);

    // Check if there is a round start
    if (
      basicData.loadingData === false &&
      basicData.roundStart &&
      basicData.roundStart !== null &&
      basicData.roundStart !== undefined &&
      loadingElapsedTime === true
    ) {
      setInterval(() => {
        let elapsedTime = formatTime(
          parseInt((new Date().getTime() / 1000).toFixed()) -
            localStorage.getItem(roundStartKey)
        );

        if (
          !elapsedTime ||
          elapsedTime === null ||
          elapsedTime === undefined ||
          elapsedTime.trim() === "" ||
          elapsedTime === ""
        ) {
          elapsedTime = t("waiting");
        }

        updateElapsedTimeValue(elapsedTime);
      }, 1000);

      // Update status
      setInterval(() => {
        if (loadingElapsedTime === true) {
          updateLoadingElapseTime(false);
        }
      }, 1000);
    }
  };

  // Elapsed time manipulation
  useEffect(() => {
    initialDataFetch();
  }, [basicData]);

  // Go to second tab
  const goToMinerOptions = () => {
    updateTab(2);
  };

  // Loading spinner
  const loadingTag = (
    <Grid item style={{ margin: "auto" }}>
      <CircularProgress color="primary" size={33.2} />
    </Grid>
  );

  // Info card
  const InfoCard = (props) => (
    <Grid item className={styles.InfoCard} style={{ width: props.width }}>
      <Typography
        variant="h6"
        color="textSecondary"
        style={{ fontWeight: 400, marginBottom: 5 }}
      >
        {props.title}
      </Typography>

      {props.loading === true ? (
        loadingTag
      ) : (
        <Typography
          variant="h6"
          gutterBottom
          style={{ fontWeight: 700, fontSize: "1.25rem" }}
        >
          {props.value}
        </Typography>
      )}
    </Grid>
  );

  // Dynamic render tabs
  let dynamicTab = null;

  const LoadingDynamicTab = (
    <Grid container justify="center">
      <Spinner />
    </Grid>
  );

  // Basic info pool
  if (currentTab === 0) {
    let tableData = [];

    if (poolData.loadingData === false) {
      tableData = [
        {
          title: t("poolName"),
          value: poolData.data.poolName,
          type: "info",
        },
        {
          title: t("poolAccount"),
          value: poolData.data.poolAccountRS,
          type: "info",
        },
        {
          title: t("nBlocksAverage"),
          value: poolData.data.nAvg,
          type: "info",
        },
        {
          title: t("nBlocksToShowMiner"),
          value: poolData.data.nMin,
          type: "info",
        },
        {
          title: t("maxDeadline"),
          value: poolData.data.maxDeadline,
          type: "info",
        },

        {
          title: t("processLag"),
          value: poolData.data.processLag,
          type: "info",
        },
        {
          title: t("feeRecipient"),
          value: poolData.data.feeRecipientRS,
          type: "info",
        },
        {
          title: t("poolFee"),
          value: poolData.data.poolFee,
          type: "info",
        },
        {
          title: t("poolSoloFee"),
          sTitle: t("minersSharingLess"),
          value: poolData.data.poolSoloFee,
          type: "info",
        },
        {
          title: t("donationRecipient"),
          value: poolData.data.donationRecipientRS,
          type: "info",
        },
        {
          title: t("defaultDonation"),
          sTitle: t("configurable"),
          value: poolData.data.donationPercent,
          type: "info",
          onClick: goToMinerOptions,
        },
        {
          title: t("defaultPoolShare"),
          sTitle: t("configurable"),
          value: poolData.data.poolShare,
          type: "info",
          onClick: goToMinerOptions,
        },
        {
          title: t("defaultMinimumPayout"),
          sTitle: t("configurable"),
          value: poolData.data.minimumPayout,
          type: "info",
          onClick: goToMinerOptions,
        },

        {
          title: t("minimumPayoutsAtOnce"),
          value: poolData.data.minPayoutsPerTransaction,
          type: "info",
        },
        {
          title: t("payOutTransactionFee"),
          value: poolData.data.payoutTxFee,
          type: "info",
        },
        {
          title: t("poolVersion"),
          value: poolData.data.version,
          type: "info",
        },
      ];
    }

    dynamicTab = (
      <Grid container className={styles.containedContent}>
        <OutlinedTable
          data={tableData}
          isLoading={poolData.loadingData}
          notFoundLabel={t("missingDetails")}
          fWidth="33%"
          sWidth="67%"
          onClickLastItem={null}
        />
      </Grid>
    );

    // Blocks won tab
  } else if (currentTab === 1) {
    dynamicTab = LoadingDynamicTab;

    // Check if blocks data is loaded
    if (blockData.loadingData === false) {
      dynamicTab = (
        <Grid container className={styles.containedContent}>
          <BlocksTable data={blockData.list} />
        </Grid>
      );
    }
  } else if (currentTab === 2) {
    dynamicTab = LoadingDynamicTab;

    // Check if pool data is loaded
    // For showing miner options data
    if (poolData.loadingData === false) {
      dynamicTab = (
        <Grid container className={styles.containedContent}>
          <MinerOptions data={poolData.data} />
        </Grid>
      );
    }
  } else if (currentTab === 3) {
    dynamicTab = LoadingDynamicTab;

    // Check if top ten miners data is loaded
    if (minerData.loadingData === false && minerData.topTen) {
      dynamicTab = (
        <Grid container style={{ paddingLeft: "0.9em", paddingRight: "0.9em" }}>
          <MinersTable data={minerData.topTen} />
        </Grid>
      );
    }
  }

  // Listener event for every tab changed
  useEffect(() => {
    if (currentTab === 1 && blockData.loadingData === true) {
      fetchBlocksData(blockData.loadingData);

      // Fetch data every 120 seconds
      setInterval(() => {
        fetchBlocksData(true);
      }, 120000);
    }
  }, [currentTab]);

  return (
    <Fragment>
      {/* Basic SEO */}
      <Helmet>
        <title>{`${t("_POOLINFO")} • ${POOLNameToUse}`}</title>
      </Helmet>

      {/* First section */}
      <Grid
        container
        className={styles.firstSection}
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        component="section"
      >
        <Typography component="h1" variant="h4" align="center">
          {t("_POOLINFO")}
        </Typography>

        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="stretch"
          wrap="wrap"
          style={{ marginTop: "1.5rem" }}
        >
          {/* Block height */}
          <InfoCard
            title={t("blockHeight")}
            width="23%"
            value={
              basicData.loadingData === false
                ? thousands_separators(basicData.blockHeight)
                : ""
            }
            loading={basicData.loadingData}
          />

          {/* Elapsed */}
          <InfoCard
            title={t("elapsedTime")}
            width="23%"
            value={elapsedTimeValue}
            loading={loadingElapsedTime}
          />

          {/* Miners */}
          <InfoCard
            title={t("miners")}
            width="23%"
            value={minerData.loadingData === false ? minerData.quantity : ""}
            loading={minerData.loadingData}
          />

          {/* Pool size */}
          <InfoCard
            title={t("poolPhysical")}
            width="23%"
            value={
              minerData.loadingData === false ? minerData.poolCapacity : ""
            }
            loading={minerData.loadingData}
          />

          {/* Second row */}

          {/* Best miner */}
          <InfoCard
            title={t("bestMiner")}
            width="48.6%"
            value={basicData.loadingData === false ? basicData.bestMiner : ""}
            loading={basicData.loadingData}
          />

          {/* Network difficulty */}
          <InfoCard
            title={t("network")}
            width="48.6%"
            value={
              basicData.loadingData === false ? basicData.networkDifficulty : ""
            }
            loading={basicData.loadingData}
          />
        </Grid>
      </Grid>

      {/* Second section */}
      <Grid
        container
        className={styles.secondSection}
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
      >
        {/* Tabs container */}
        <Grid container className={styles.containedContent}>
          <Paper className={clsx(styles.tabsContainer)}>
            <Tabs
              value={currentTab}
              indicatorColor="primary"
              textColor="primary"
              onChange={toogleTab}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
            >
              <Tab className={styles.tabUnit} label={t("basicInfo")} />
              <Tab className={styles.tabUnit} label={t("_BLOCKWON")} />
              <Tab className={styles.tabUnit} label={t("_MINEROPTIONS")} />
              <Tab className={styles.tabUnit} label={t("topTenMiners")} />
            </Tabs>
          </Paper>
        </Grid>

        {/* Dynamic data */ dynamicTab}
      </Grid>
    </Fragment>
  );
};

// Connect redux to website
const mapStateToProps = (state) => {
  return {
    // Data
    basicData: state.basicInfo,
    minerData: state.miners,
    blockData: state.blocksWon,
    poolData: state.poolConfig,

    // Functions
    fetchBlocksData: PropTypes.func.isRequired,
  };
};

export default connect(mapStateToProps, {
  fetchBlocksData,
})(PoolInfo);
