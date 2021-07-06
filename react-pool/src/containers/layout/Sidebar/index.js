// React router
import { useHistory } from "react-router-dom";

// Material ui
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

// Material ui list
import Divider from "@material-ui/core/Divider";

// Material ui icons
import CloseIcon from "@material-ui/icons/Close";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import DnsRoundedIcon from "@material-ui/icons/DnsRounded";
import GroupIcon from "@material-ui/icons/Group";
import BlurOnIcon from "@material-ui/icons/BlurOn";
import AccountBalanceWalletRoundedIcon from "@material-ui/icons/AccountBalanceWalletRounded";
import CardGiftcardRoundedIcon from "@material-ui/icons/CardGiftcardRounded";
import QuestionAnswerRoundedIcon from "@material-ui/icons/QuestionAnswerRounded";
import TransformIcon from "@material-ui/icons/Transform";
import ControlPointIcon from "@material-ui/icons/ControlPoint";

import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import TelegramIcon from "@material-ui/icons/Telegram";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import PublicIcon from "@material-ui/icons/Public";

// Styling
import styles from "./Sidebar.module.css";

// Components
import ListRender from "./components/list/index";

// Third-party
import copy from "copy-to-clipboard";

// Extra
import {
  EXPLORERToUse,
  WALLETToUse,
  FAUCETToUse,
  DISCORDToUse,
  SHOW_TRADING_LINK,
} from "../../../utils/globalParameters";

// Extra url
import { extraLinksArrayExport } from "../../../utils/globalUrl";

const Sidebar = (props) => {
  // Route details
  let router = useHistory();

  // Props details
  const { showSideDrawer, closeSideDrawer } = props;

  // SideDrawer manipulation
  const goToSite = async (route, newPage = false) => {
    closeSideDrawer();

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

  // Conditional components
  let divider = <Divider style={{ width: "100%" }} light={true} />;

  // Render sidebar
  return (
    <Drawer anchor="top" open={showSideDrawer} onClose={closeSideDrawer}>
      <div className={styles.sideBarContainer}>
        {/* Close section */}
        <Box
          width="100%"
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <IconButton
            aria-label="close"
            size="medium"
            onClick={closeSideDrawer}
          >
            <CloseIcon style={{ fontSize: 37 }} />
          </IconButton>
        </Box>

        {/* First section */}
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          px={1}
          mb={2}
        >
          <Typography
            align="center"
            variant="body1"
            color="textPrimary"
            className={styles.firstTitle}
          >
            Made with ⚡ <br /> for enthusiasts by enthusiasts
          </Typography>
        </Box>

        {
          // Grey divider
          divider
        }

        {/* Second section */}
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          mt={1}
          mb={3}
        >
          {/* Home */}
          <ListRender
            onClick={() => {
              goToSite("/");
            }}
            icon={
              <HomeRoundedIcon
                style={{ fontSize: 27, color: "var(--primary-error-color)" }}
              />
            }
            textList="Home"
          />

          {/* Pool info */}
          <ListRender
            onClick={() => {
              goToSite("/pool-info");
            }}
            icon={
              <DnsRoundedIcon
                style={{ fontSize: 27, color: "var(--primary-error-color)" }}
              />
            }
            textList="Pool info"
          />

          {/* Miners lists*/}
          <ListRender
            onClick={() => {
              goToSite("/miners");
            }}
            icon={
              <GroupIcon
                style={{ fontSize: 27, color: "var(--primary-error-color)" }}
              />
            }
            textList="Miners"
          />

          {
            // Trading viewer
            // Check if user wants to have a trading link
            SHOW_TRADING_LINK &&
            SHOW_TRADING_LINK !== null &&
            SHOW_TRADING_LINK !== undefined &&
            SHOW_TRADING_LINK.toUpperCase() === "YES" ? (
              <ListRender
                onClick={() => {
                  goToSite("/trading-view");
                }}
                icon={
                  <TransformIcon
                    style={{
                      fontSize: 27,
                      color: "var(--secondary-dark-color)",
                    }}
                  />
                }
                textList="Trading"
              />
            ) : null
          }

          {/* Discord */}
          <ListRender
            onClick={() => {
              goToSite(DISCORDToUse, true);
            }}
            icon={
              <QuestionAnswerRoundedIcon
                style={{ fontSize: 27, color: "var(--secondary-dark-color)" }}
              />
            }
            textList="Discord"
          />

          {/* Explorer */}
          <ListRender
            onClick={() => {
              goToSite(EXPLORERToUse, true);
            }}
            icon={
              <BlurOnIcon
                style={{ fontSize: 27, color: "var(--secondary-dark-color)" }}
              />
            }
            textList="Explorer"
          />

          {/* Wallet */}
          <ListRender
            onClick={() => {
              goToSite(WALLETToUse, true);
            }}
            icon={
              <AccountBalanceWalletRoundedIcon
                style={{ fontSize: 27, color: "var(--secondary-dark-color)" }}
              />
            }
            textList="Wallet"
          />

          {
            // Faucet
            // Check if user wants to have a faucet link
            FAUCETToUse && FAUCETToUse !== null && FAUCETToUse !== "" ? (
              <ListRender
                onClick={() => {
                  goToSite(FAUCETToUse, true);
                }}
                icon={
                  <CardGiftcardRoundedIcon
                    style={{
                      fontSize: 27,
                      color: "var(--secondary-dark-color)",
                    }}
                  />
                }
                textList="Faucet"
              />
            ) : null
          }

          {extraLinksArrayExport &&
          extraLinksArrayExport.length &&
          extraLinksArrayExport.length > 0 ? (
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              wrap="wrap"
            >
              {divider}

              <Typography
                align="center"
                style={{ width: "100%", fontWeight: 500, marginTop: "1em" }}
              >
                Additional Links
              </Typography>
            </Box>
          ) : null}

          {
            // Render dynamic options
            // Extra options put by pool operator
            extraLinksArrayExport.map((item) => {
              return (
                <ListRender
                  onClick={() => {
                    goToSite(item.url, item.newTab);
                  }}
                  icon={
                    <ControlPointIcon
                      style={{
                        fontSize: 27,
                        color: "var(--secondary-dark-color)",
                      }}
                    />
                  }
                  textList={item.label}
                />
              );
            })
          }
        </Box>

        {
          // Grey divider
          divider
        }

        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{
            color: "#fff",
            textTransform: "none",
            fontSize: "1rem",
            padding: "0.5rem 4rem",
            borderRadius: "8px",
            margin: "1em auto",
          }}
          onClick={() => {
            goToSite("/start-mining");
          }}
        >
          Start Now!
        </Button>

        {
          // Grey divider
          divider
        }

        {/* Share section */}
        <Box mt={2} width="100%"></Box>
        <Typography align="center" style={{ width: "100%" }}>
          Share it with your community!
        </Typography>

        <Box
          mt={2}
          width="100%"
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          alignItems="center"
          flexWrap="wrap"
        >
          <Box width={{ xs: "100%", md: "48%" }}>
            <ListRender
              onClick={() => {
                const mainLink = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
                window.open(mainLink);
              }}
              icon={<FacebookIcon style={{ fontSize: 25 }} />}
              textList="Facebook"
              hideArrow
            />
          </Box>
          <Box width={{ xs: "100%", md: "48%" }}>
            <ListRender
              onClick={() => {
                const mainLink = `https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this amazing site! 🔥`;
                window.open(mainLink);
              }}
              icon={<TwitterIcon style={{ fontSize: 25 }} />}
              textList="Twitter"
              hideArrow
            />
          </Box>

          <Box width={{ xs: "100%", md: "48%" }}>
            <ListRender
              onClick={() => {
                const mainLink = `https://t.me/share/url?url=${window.location.href}&text=Check out this amazing site! 🔥`;
                window.open(mainLink);
              }}
              icon={<TelegramIcon style={{ fontSize: 25 }} />}
              textList="Telegram"
              hideArrow
            />
          </Box>

          <Box width={{ xs: "100%", md: "48%" }}>
            <ListRender
              onClick={() => {
                const mainLink = `https://wa.me/?text=Check out this amazing site!, ${window.location.href}`;
                window.open(mainLink);
              }}
              icon={<WhatsAppIcon style={{ fontSize: 25 }} />}
              textList="WhatsApp"
              hideArrow
            />
          </Box>

          <Box width="100%">
            <ListRender
              onClick={async () => {
                const mainLink = window.location.href;
                await copy(mainLink);
                alert("Link copied successfully!");
                return closeSideDrawer();
              }}
              icon={<PublicIcon style={{ fontSize: 25 }} />}
              textList="Copy URL or Link"
              fullWidth={true}
            />
          </Box>
        </Box>
      </div>
    </Drawer>
  );
};

export default Sidebar;
