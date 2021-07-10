// React translations
import { useTranslation, Trans } from "react-i18next";

// Material-ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";

// Styling
import styles from "./minerOption.module.css";

const MinerOptions = (props) => {
  // Translations details
  const { t } = useTranslation();

  // Get props
  const { data } = props;

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      style={{
        padding: "1rem",
        border: "1.5px solid #242424",
        borderRadius: "8px",
        background: "#121212",
      }}
    >
      {/* First paragraph */}
      <Typography variant="h6">{t("configurationWithMessages")}</Typography>

      <Typography gutterBottom>
        <Trans i18nKey="configurationWithMessagesParagraph">
          If you have already joined the pool, you can further configure it by
          <strong>sending unencrypted text messages</strong> from your miner
          account to the pool account (effective after
          {{ processLag: data.processLag }})
        </Trans>
      </Typography>

      <Typography className={styles.blueLabel}>{data.poolAccountRS}</Typography>

      {/* Second paragraph */}
      <Typography variant="h6">{t("shareModel")}</Typography>
      <Typography gutterBottom>
        <Trans i18nKey="shareModelParagraph">
          Change your share model to 80 % by sending the following text message
          (any number <strong>from 0 up to 100 is accepted</strong>)
        </Trans>
      </Typography>

      <Typography className={styles.blueLabel}>share 80</Typography>

      {/* Third paragraph */}
      <Typography variant="h6">{t("donationPercentage")}</Typography>
      <Typography gutterBottom>
        <Trans i18nKey="donationPercentageParagraph">
          Change your donation percent to 5 % by sending the following text
          message (any number <strong>from 0 up to 100 is accepted</strong>)
        </Trans>
      </Typography>

      <Typography className={styles.blueLabel}>donate 5</Typography>

      {/* Fourth paragraph */}
      <Typography variant="h6">{t("minimumPayout")}</Typography>
      <Typography gutterBottom>
        <Trans i18nKey="minimumPayoutParagraph">
          Change your minimum payout to 100 SIGNA by sending the following text
          message (any number
          <strong>
            higher than {{ minimumPayoutCount: data.minimumMinimumPayout }} is
            accepted
          </strong>
          ):
        </Trans>
      </Typography>

      <Typography className={styles.blueLabel}>pay 100</Typography>

      {/* Fifth paragraph */}
      <Typography variant="h6">{t("changeMultipleOptions")}</Typography>
      <Typography gutterBottom>
        {t("changeMultipleOptionsParagraph")}
      </Typography>

      <Typography className={styles.blueLabel}>
        share 80 donate 5 pay 100
      </Typography>

      <Alert severity="info" style={{ width: "100%", fontSize: "1rem" }}>
        <Trans i18nKey="minerOptionsAlert">
          If you will change miner settings, always send
          <strong>unencrypted text messages</strong>
        </Trans>
      </Alert>
    </Grid>
  );
};

export default MinerOptions;
