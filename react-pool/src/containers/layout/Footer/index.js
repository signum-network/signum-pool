// Material ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Styles
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <Grid
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      container
      className={styles.footerContainer}
      component="footer"
    >
      <Grid container direction="row" justify="center" alignItems="center">
        <Typography variant="body2" align="center">
          <a
            href="https://github.com/signum-network"
            target="_blank"
            rel="noreferrer"
          >
            <u>Github repo</u>
          </a>{" "}
          - Made with ❤️ By Signum Network @ (2019-
          {new Date().getFullYear()})
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;
