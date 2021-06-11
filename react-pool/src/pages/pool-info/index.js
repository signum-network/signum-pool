// React
import { Fragment, useEffect, useState } from "react";

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

// SEO
import { Helmet } from "react-helmet";
import { POOLNameToUse } from "../../utils/globalParameters";

const PoolInfo = (props) => {
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
          elapsedTime = "Waiting...";
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
          title: "Pool Name",
          value: poolData.data.poolName,
          type: "info",
        },
        {
          title: "Pool Account",
          value: poolData.data.poolAccountRS,
          type: "info",
        },
        {
          title: "Number of blocks for averages",
          value: poolData.data.nAvg,
          type: "info",
        },
        {
          title: "Number of blocks to show a Miner",
          value: poolData.data.nMin,
          type: "info",
        },
        {
          title: "Max Deadline",
          value: poolData.data.maxDeadline,
          type: "info",
        },
        {
          title: "Process Lag",
          value: poolData.data.processLag,
          type: "info",
        },
        {
          title: "Fee Recipient",
          value: poolData.data.feeRecipientRS,
          type: "info",
        },
        {
          title: "Pool Fee",
          value: poolData.data.poolFee,
          type: "info",
        },
        {
          title: "Pool Solo Fee",
          sTitle: "Miners sharing less than 20%",
          value: poolData.data.poolSoloFee,
          type: "info",
        },
        {
          title: "Donation Recipient",
          value: poolData.data.donationRecipientRS,
          type: "info",
        },
        {
          title: "Default Donation",
          sTitle: "Configurable",
          value: poolData.data.donationPercent,
          type: "info",
        },
        {
          title: "Default Pool Share",
          sTitle: "Configurable",
          value: poolData.data.poolShare,
          type: "info",
        },
        {
          title: "Default Minimum Payout",
          sTitle: "Configurable",
          value: poolData.data.minimumPayout,
          type: "info",
        },
        {
          title: "Minimum Payouts at once",
          value: poolData.data.minPayoutsPerTransaction,
          type: "info",
        },
        {
          title: "Payout Transaction Fee",
          value: poolData.data.payoutTxFee,
          type: "info",
        },
        {
          title: "Pool Software Version",
          value: poolData.data.version,
          type: "info",
        },
      ];
    }

    dynamicTab = (
      <OutlinedTable
        data={tableData}
        isLoading={poolData.loadingData}
        notFoundLabel="Missing details, contact your support operator"
        fWidth="33%"
        sWidth="67%"
        onClickLastItem={null}
      />
    );

    // Blocks won tab
  } else if (currentTab === 1) {
    dynamicTab = LoadingDynamicTab;

    // Check if blocks data is loaded
    if (blockData.loadingData === false) {
      dynamicTab = <BlocksTable data={blockData.list} />;
    }
  } else if (currentTab === 2) {
    dynamicTab = LoadingDynamicTab;

    // Check if pool data is loaded
    if (poolData.loadingData === false) {
      dynamicTab = <MinerOptions data={poolData.data} />;
    }
  } else if (currentTab === 3) {
    dynamicTab = LoadingDynamicTab;

    // Check if top ten miners data is loaded
    if (minerData.loadingData === false && minerData.topTen) {
      dynamicTab = (
        <Grid container direction="column">
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
        <title>{"Pool info • " + POOLNameToUse}</title>
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
          Pool info
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
            title="Block Height"
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
            title="Elapsed time"
            width="23%"
            value={elapsedTimeValue}
            loading={loadingElapsedTime}
          />

          {/* Miners */}
          <InfoCard
            title="Miners"
            width="23%"
            value={minerData.loadingData === false ? minerData.quantity : ""}
            loading={minerData.loadingData}
          />

          {/* Pool size */}
          <InfoCard
            title="Pool Physical"
            width="23%"
            value={
              minerData.loadingData === false ? minerData.poolCapacity : ""
            }
            loading={minerData.loadingData}
          />

          {/* Second row */}

          {/* Best miner */}
          <InfoCard
            title="Best miner"
            width="48.6%"
            value={basicData.loadingData === false ? basicData.bestMiner : ""}
            loading={basicData.loadingData}
          />

          {/* Network difficulty */}
          <InfoCard
            title="Network"
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
        <Paper className={styles.tabsContainer}>
          <Tabs
            value={currentTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={toogleTab}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
          >
            <Tab className={styles.tabUnit} label="Basic info" />
            <Tab className={styles.tabUnit} label="Blocks won" />
            <Tab className={styles.tabUnit} label="Miner options" />
            <Tab className={styles.tabUnit} label="Top 10 miners" />
          </Tabs>
        </Paper>

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
