// React
import { Fragment, useState } from "react";

// React translations
import { useTranslation } from "react-i18next";

// React router
import { useHistory } from "react-router-dom";

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
import TranslateIcon from "@material-ui/icons/Translate";

// Material ui menu
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

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

// Url parameters
import { extraLinksArrayExport } from "../../../utils/globalUrl";

// Third-party
import clsx from "clsx";

const Header = (props) => {
  // Translations details
  const { t } = useTranslation();

  // Route details
  let router = useHistory();

  // Menu manipulation
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // SideDrawer manipulation
  const goToSite = async (route, newPage = false) => {
    // Open tab in new page
    if (newPage === true) {
      return window.open(route, "_blank").focus();
    }

    return new Promise(async (resolve) => {
      await router.push(route);
      resolve(true);
    }).then(() => {
      window.scrollTo(0, 0);
    });
  };

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
            maxWidth: "1600px",
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
                  <Typography>{t("home")}</Typography>
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
                  <Typography>{t("_POOLINFO")}</Typography>
                </Link>

                {/* Miners */}
                <Link
                  to="/miners"
                  className={clsx(
                    styles.navLink,
                    "defaultTransition",
                    props.location.pathname === "/miners"
                      ? styles.activeNavLink
                      : null
                  )}
                >
                  <Typography>{t("miners")}</Typography>
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
                      <Typography>{t("trading")}</Typography>
                    </Link>
                  ) : null
                }

                {/* Discord */}
                <a
                  className={clsx(
                    styles.navLink,
                    "defaultTransition",
                    styles.discordLink
                  )}
                  onClick={() => {
                    goToSite(DISCORDToUse, true);
                  }}
                >
                  <Typography>{t("discord")}</Typography>
                </a>

                {/* Extra menu options */}
                <div
                  style={{
                    width: "auto",
                    display: "inline-block",
                    position: "relative",
                  }}
                >
                  <a
                    onClick={handleMenuClick}
                    className={clsx(styles.navLink, "defaultTransition")}
                  >
                    <Typography>{t("extra")}</Typography>
                  </a>

                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem
                      onClick={() => {
                        goToSite(DISCORDToUse, true);
                        handleMenuClose();
                      }}
                      className={styles.discordExtraLink}
                    >
                      {t("discord")}
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        goToSite(EXPLORERToUse, true);
                        handleMenuClose();
                      }}
                    >
                      {t("explorer")}
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        goToSite(WALLETToUse, true);
                        handleMenuClose();
                      }}
                    >
                      {t("wallet")}
                    </MenuItem>

                    {
                      // Faucet
                      // Check if user wants to have a faucet link
                      FAUCETToUse &&
                      FAUCETToUse !== null &&
                      FAUCETToUse !== "" ? (
                        <MenuItem
                          onClick={() => {
                            goToSite(FAUCETToUse, true);
                            handleMenuClose();
                          }}
                        >
                          {t("faucet")}
                        </MenuItem>
                      ) : null
                    }

                    {
                      // Render dynamic options
                      // Extra options put by pool operator
                      extraLinksArrayExport.map((item) => {
                        return (
                          <MenuItem
                            onClick={() => {
                              goToSite(item.url, item.newTab);
                              handleMenuClose();
                            }}
                          >
                            {item.label}
                          </MenuItem>
                        );
                      })
                    }
                  </Menu>
                </div>
              </Grid>
            </Hidden>
          </Grid>

          <Grid item className={styles.headerRightSideContainer}>
            {/* Desktop button */}
            <Hidden smDown>
              <Button
                className={styles.languageBtn}
                startIcon={<TranslateIcon />}
                onClick={props.openLanguageModal}
              >
                {t("languageName")}
              </Button>

              <Link to="/start-mining">
                <Button
                  variant="contained"
                  color="primary"
                  className={styles.mainBtn}
                >
                  {t("buttonCta")}
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
