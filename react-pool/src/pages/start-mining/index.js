// React
import { Fragment } from "react";

// React translations
import { useTranslation, Trans } from "react-i18next";

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
  // Translations details
  const { t } = useTranslation();

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
        <title>{`${t("_STARTMININGTAG")} • ${POOLNameToUse}`}</title>
      </Helmet>

      {/* First section */}
      <Grid
        container
        className={homeStyles.firstSection}
        direction="column"
        justifyContent="center"
        alignItems="center"
        component="section"
      >
        <Typography component="h1" variant="h3" align="center">
          {t("startMiningTagTitle")}
        </Typography>

        <Typography align="center" gutterBottom variant="h6">
          <Trans i18nKey="startMiningTagDescription">
            Join the sustainable <br />
            mining pool in a few steps.
          </Trans>
        </Typography>
      </Grid>

      {/* Second section */}
      <Grid
        container
        className={styles.secondSection}
        direction="column"
        justifyContent="center"
        alignItems="center"
        component="section"
      >
        <Typography align="center">
          <Trans i18nKey="startingMemberParagraphFLine">
            Are you new to Signum mining? <br /> Welcome to the community ❤️
            <br /> Read this
          </Trans>{" "}
          <a href={MINING_GUIDEToUse} target="_blank" rel="noreferrer">
            {t("simpleMiningGuideLabel")}
          </a>{" "}
          {t("insteadLabel")}
        </Typography>
      </Grid>

      {/* Third section */}
      <Grid
        container
        className={styles.thirdSection}
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        component="section"
      >
        {/* First step */}
        <Grid item className={styles.thirSectionItem}>
          <Typography variant="h6">{t("_STARTMININGFIRSTSTEP")}</Typography>
          <Typography gutterBottom>
            {t("startMiningFirstStepText") + " "}
            <Hidden smDown>
              <br></br>
            </Hidden>
            {t("startMiningFirstStepSecondText")}
          </Typography>

          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
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
              🌐 {t("onlineWallet")}
            </Button>
          </Grid>

          <Typography color="textSecondary" variant="subtitle2">
            {t("startMiningFirstStepThirdText")}
          </Typography>
        </Grid>

        {/* Second step */}
        <Grid item className={styles.thirSectionItem}>
          <Typography variant="h6">{t("_STARTMININGSECONDSTEP")}</Typography>
          <Typography gutterBottom>{t("startMiningSecondStepText")}</Typography>
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
              : t("loading")}
          </Typography>

          <Typography color="textSecondary" variant="subtitle2">
            {t("startMiningSecondStepSecondText")}
          </Typography>
        </Grid>

        {/* Thrid step */}
        <Grid item className={styles.thirSectionItem}>
          <Typography variant="h6">{t("_STARTMININGTHIRDSTEP")}</Typography>
          <Typography gutterBottom>
            <Trans i18nKey="startMiningThirdStepText">
              After you assign the reward recipient successfully, you will need
              to wait for at least 4 block confirmations
              <strong>(approximately 20 minutes)</strong>.
            </Trans>
          </Typography>
        </Grid>

        {/* Forth step */}
        <Grid item className={styles.thirSectionItem}>
          <Typography variant="h6">{t("_STARTMININGFOURTHSTEP")}</Typography>
          <Typography gutterBottom>{t("startMiningFourthStepText")}</Typography>

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
            {t("startMiningFourthStepSecondText")}
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
