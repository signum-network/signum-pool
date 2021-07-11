// React translations
import { useTranslation } from "react-i18next";

// Material ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Styles
import styles from "./Footer.module.css";

const Footer = () => {
  // Translations details
  const { t } = useTranslation();

  return (
    <Grid
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      container
      className={styles.footerContainer}
      component="footer"
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body2" align="center">
          <a
            href="https://github.com/signum-network/signum-pool"
            target="_blank"
            rel="noreferrer"
          >
            <u>Github repo</u>
          </a>{" "}
          - {t("footerLabel")} @ (2019-
          {new Date().getFullYear()})
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;
