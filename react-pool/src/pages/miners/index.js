// React
import { Fragment } from "react";

// React translations
import { useTranslation } from "react-i18next";

// Redux integration with actions
import { connect } from "react-redux";

// Material ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Styling
import styles from "./miners.module.css";

// Components
import MinersTable from "../../components/UI/minersTable/index";
import OutlinedTable from "../../components/UI/outlinedTable/index";

// SEO
import { Helmet } from "react-helmet";
import { POOLNameToUse } from "../../utils/globalParameters";

const MinersList = (props) => {
  // Translations details
  const { t } = useTranslation();

  // Get props
  const { minerData } = props;

  return (
    <Fragment>
      {/* Basic SEO */}
      <Helmet>
        <title>{`${t("miners")} • ${POOLNameToUse}`}</title>
      </Helmet>

      {/* First section */}
      <Grid
        container
        className={styles.firstSection}
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        component="section"
      >
        <Typography
          component="h1"
          variant="h4"
          align="center"
          style={{ marginBottom: "1rem" }}
        >
          {t("MINERSTAG")}
        </Typography>
      </Grid>

      {/* Check if pool has miners */}
      {minerData.list &&
      minerData.list.length &&
      minerData.loadingData === false &&
      minerData.list.length > 0 ? (
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          component="section"
          style={{
            margin: "auto",
            marginBottom: "1.2rem",
            padding: "0 1rem",
            maxWidth: 1920,
          }}
        >
          <MinersTable data={minerData.list} />
        </Grid>
      ) : (
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          component="section"
          className={styles.noMinerSection}
        >
          <OutlinedTable
            data={null}
            isLoading={minerData.loadingData}
            notFoundLabel={t("noMiners") + " ⚒️"}
            fWidth="25%"
            sWidth="75%"
            onClickLastItem={null}
          />
        </Grid>
      )}
    </Fragment>
  );
};

// Connect redux to website
const mapStateToProps = (state) => {
  return {
    // Data
    basicData: state.basicInfo,
    minerData: state.miners,
  };
};

export default connect(mapStateToProps, {})(MinersList);
