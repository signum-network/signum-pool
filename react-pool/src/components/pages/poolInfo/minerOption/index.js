// Material-ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";

// Styling
import styles from "./minerOption.module.css";

const minerOptions = (props) => {
  // Get props
  const { data } = props;

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      style={{
        padding: "1rem",
        border: "1.5px solid #242424",
        borderRadius: "8px",
        background: "#121212",
      }}
    >
      {/* First paragraph */}
      <Typography variant="h6">Configuration with messages</Typography>
      <Typography gutterBottom>
        If you have already joined the pool, you can further configure it by{" "}
        <b>sending unencrypted text messages</b> from your miner account to the
        pool account (effective after {data.processLag}):
      </Typography>

      <Typography className={styles.blueLabel}>{data.poolAccountRS}</Typography>

      {/* Second paragraph */}
      <Typography variant="h6">Share Model</Typography>
      <Typography gutterBottom>
        Change your share model to 80 % by sending the following text message
        (any number <b>from 0 up to 100 is accepted</b>)
      </Typography>
      <Typography className={styles.blueLabel}>share 80</Typography>

      {/* Third paragraph */}
      <Typography variant="h6">Donation Percent</Typography>
      <Typography gutterBottom>
        Change your donation percent to 5 % by sending the following text
        message (any number <b>from 0 up to 100 is accepted</b>)
      </Typography>
      <Typography className={styles.blueLabel}>donate 5</Typography>

      {/* Fourth paragraph */}
      <Typography variant="h6">Minimum Payout</Typography>
      <Typography gutterBottom>
        Change your minimum payout to 100 SIGNA by sending the following text
        message (any number{" "}
        <b>higher than {data.minimumMinimumPayout} is accepted</b>):
      </Typography>
      <Typography className={styles.blueLabel}>pay 100</Typography>

      {/* Fifth paragraph */}
      <Typography variant="h6">Change multiple options</Typography>
      <Typography gutterBottom>
        You can also configure multiple parameters with a single message, for
        instance:
      </Typography>
      <Typography className={styles.blueLabel}>
        share 80 donate 5 pay 100
      </Typography>

      <Alert severity="info" style={{ width: "100%", fontSize: "1rem" }}>
        If you will change miner settings, always send{" "}
        <strong>unencrypted text messages</strong>
      </Alert>
    </Grid>
  );
};

export default minerOptions;
