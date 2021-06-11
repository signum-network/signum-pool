// React
import { Fragment } from "react";

// Redux integration with actions
import { connect } from "react-redux";

// Material ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Hidden from "@material-ui/core/Hidden";
import Button from "@material-ui/core/Button";

// Styling
import styles from "./StartMining.module.css";
import homeStyles from "../home/Home.module.css";

// Extra
import {
  WALLETToUse,
  MINING_ADDRESSToUse,
  POOLNameToUse,
  MINING_GUIDEToUse,
} from "../../utils/globalParameters";

// SEO
import { Helmet } from "react-helmet";

const StartMining = (props) => {
  // Get props
  const { poolData } = props;

  // TabOpener
  const tabOpener = (route) => {
    window.open(route, "_blank");
  };

  return (
    <Fragment>
      {/* Basic SEO */}
      <Helmet>
        <title>{"Start mining • " + POOLNameToUse}</title>
      </Helmet>

      {/* First section */}
      <Grid
        container
        className={homeStyles.firstSection}
        direction="column"
        justify="center"
        alignItems="center"
        component="section"
      >
        <Typography component="h1" variant="h3" align="center">
          Quick Join guide
        </Typography>
        <Typography align="center" gutterBottom variant="h6">
          Join the sustainable <br />
          mining pool in a few steps.
        </Typography>
      </Grid>

      {/* Second section */}
      <Grid
        container
        className={styles.secondSection}
        direction="column"
        justify="center"
        alignItems="center"
        component="section"
      >
        <Typography align="center">
          Are you a new beginner? <br /> Welcome to the community ❤️ <br /> Read
          this{" "}
          <a href={MINING_GUIDEToUse} target="_blank" rel="noreferrer">
            simple mining guide
          </a>{" "}
          instead
        </Typography>
      </Grid>

      {/* Third section */}
      <Grid
        container
        className={styles.thirdSection}
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        component="section"
      >
        {/* First step */}
        <Grid item className={styles.thirSectionItem}>
          <Typography variant="h6">Step 1 - Account creation</Typography>
          <Typography gutterBottom>
            Before assigning the reward recipient, first you must have your
            Signum wallet.{" "}
            <Hidden smDown>
              <br></br>
            </Hidden>
            Meet the following wallets which you can manage your Signa and also
            join the pool.
          </Typography>

          <Grid
            container
            direction="row"
            alignItems="center"
            justify="flex-start"
            wrap="wrap"
            style={{ marginTop: "0.7em", marginBottom: "1em" }}
          >
            {/* Phoenix */}
            <Button
              onClick={() => {
                tabOpener("https://phoenix-wallet.rocks/");
              }}
              className={styles.walletsBtn}
            >
              🔷 Phoenix wallet
            </Button>

            {/* BTDEX */}
            <Button
              onClick={() => {
                tabOpener("https://btdex.trade/");
              }}
              className={styles.walletsBtn}
            >
              🔴 BTDEX
            </Button>

            {/* Online wallet */}
            <Button
              onClick={() => {
                tabOpener(WALLETToUse);
              }}
              className={styles.walletsBtn}
            >
              🌐 Online wallet
            </Button>
          </Grid>

          <Typography color="textSecondary" variant="subtitle2">
            Reminder: Never, ever give your passphare to anyone!
          </Typography>
        </Grid>

        {/* Second step */}
        <Grid item className={styles.thirSectionItem}>
          <Typography variant="h6">Step 2 - Reward recipient</Typography>
          <Typography gutterBottom>
            Now with your wallet, you must set the reward recipient to the
            following address:
          </Typography>
          <Typography
            gutterBottom
            style={{
              fontWeight: 700,
              color: "var(--main-client-color)",
              marginBottom: "0.5em",
            }}
          >
            {poolData.loadingData === false
              ? poolData.data.poolAccountRS
              : "Loading..."}
          </Typography>

          <Typography color="textSecondary" variant="subtitle2">
            Tip: It's recommended to use a local wallet
          </Typography>
        </Grid>

        {/* Thrid step */}
        <Grid item className={styles.thirSectionItem}>
          <Typography variant="h6">Step 3 - Block confirmation</Typography>
          <Typography gutterBottom>
            After you assign the reward recipient successfully, you will need to
            wait at least for 4 blocks confirmations <b>(Around 20 minutes)</b>.
          </Typography>
        </Grid>

        {/* Forth step */}
        <Grid item className={styles.thirSectionItem}>
          <Typography variant="h6">Step 4 - Mining address</Typography>
          <Typography gutterBottom>
            After the wait, you must configure your miner to use the following
            mining address:
          </Typography>
          <Typography
            gutterBottom
            style={{
              fontWeight: 700,
              color: "var(--main-client-color)",
              marginBottom: "0.5em",
            }}
          >
            {MINING_ADDRESSToUse}
          </Typography>

          <Typography color="textSecondary" variant="subtitle2">
            And then run your miner!
          </Typography>
        </Grid>
      </Grid>
    </Fragment>
  );
};

// Connect redux to website
const mapStateToProps = (state) => {
  return {
    // Data
    poolData: state.poolConfig,
  };
};

export default connect(mapStateToProps, {})(StartMining);
