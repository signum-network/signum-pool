// React
import { Fragment } from "react";

// React router dom
import { withRouter, Link } from "react-router-dom";

// Material ui
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

// Material icons
import MenuIcon from "@material-ui/icons/Menu";

// Styling
import styles from "./Header.module.css";

// Extra
import {
  POOLNameToUse,
  EXPLORERToUse,
  WALLETToUse,
  FAUCETToUse,
  DISCORDToUse,
  SHOW_TRADING_LINK,
} from "../../../utils/globalParameters";

// Third-party
import clsx from "clsx";

const Header = (props) => {
  return (
    <Fragment>
      <Grid
        container
        className={styles.headerContainer}
        direction="row"
        alignItems="center"
        justify="center"
        alignContent="center"
        component="header"
      >
        <Grid
          item
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
          style={{
            maxWidth: "var(--main-client-width)",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Grid
            item
            alignItems="center"
            justify="flex-start"
            container
            style={{ width: "auto" }}
          >
            {/* Branding */}
            <Grid item className={styles.brandingContainer}>
              <Link to="/" className={styles.redirector} title="Go home">
                <img src="/assets/poolIcon.png" alt={POOLNameToUse} />
                <Typography variant="h6">{POOLNameToUse}</Typography>
              </Link>
            </Grid>

            {/* Nav links */}
            <Hidden smDown>
              <Grid className={styles.navLinksContainer}>
                {/* Home */}
                <Link
                  to="/"
                  className={clsx(
                    styles.navLink,
                    "defaultTransition",
                    props.location.pathname === "/"
                      ? styles.activeNavLink
                      : null
                  )}
                >
                  <Typography>Home</Typography>
                </Link>

                {/* Pool info */}
                <Link
                  to="/pool-info"
                  className={clsx(
                    styles.navLink,
                    "defaultTransition",
                    props.location.pathname === "/pool-info"
                      ? styles.activeNavLink
                      : null
                  )}
                >
                  <Typography>Pool info</Typography>
                </Link>

                {
                  // Trading viewer
                  // Check if user wants to have a trading link
                  SHOW_TRADING_LINK &&
                  SHOW_TRADING_LINK !== null &&
                  SHOW_TRADING_LINK !== undefined &&
                  SHOW_TRADING_LINK.toUpperCase() === "YES" ? (
                    <Link
                      to="/trading-view"
                      className={clsx(
                        styles.navLink,
                        "defaultTransition",
                        props.location.pathname === "/trading-view"
                          ? styles.activeNavLink
                          : null
                      )}
                    >
                      <Typography>Trading</Typography>
                    </Link>
                  ) : null
                }

                {/* Explorer */}
                <Hidden mdDown>
                  <a
                    href={EXPLORERToUse}
                    target="_blank"
                    rel="noreferrer"
                    className={clsx(styles.navLink, "defaultTransition")}
                  >
                    <Typography>Explorer</Typography>
                  </a>
                </Hidden>

                {/* Wallet */}
                <a
                  href={WALLETToUse}
                  target="_blank"
                  rel="noreferrer"
                  className={clsx(styles.navLink, "defaultTransition")}
                >
                  <Typography>Wallet</Typography>
                </a>

                {
                  // Faucet
                  // Check if user wants to have a faucet link
                  FAUCETToUse && FAUCETToUse !== null && FAUCETToUse !== "" ? (
                    <a
                      href={FAUCETToUse}
                      target="_blank"
                      rel="noreferrer"
                      className={clsx(styles.navLink, "defaultTransition")}
                    >
                      <Typography>Faucet</Typography>
                    </a>
                  ) : null
                }

                {/* Discord */}
                <a
                  href={DISCORDToUse}
                  target="_blank"
                  rel="noreferrer"
                  className={clsx(styles.navLink, "defaultTransition")}
                >
                  <Typography>Discord</Typography>
                </a>
              </Grid>
            </Hidden>
          </Grid>

          <Grid item>
            {/* Desktop button */}
            <Hidden smDown>
              <Link to="/start-mining">
                <Button
                  variant="contained"
                  color="primary"
                  className={styles.mainBtn}
                >
                  Start Mining
                </Button>
              </Link>
            </Hidden>

            {/* Mobile button */}
            <Hidden mdUp>
              <div
                className={styles.hamburguerButton}
                onClick={props.openSidebar}
              >
                <IconButton className={styles.menuButtonContainer}>
                  <MenuIcon className={styles.menuButton} />
                </IconButton>
              </div>
            </Hidden>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withRouter(Header);
