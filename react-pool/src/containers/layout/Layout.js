// React native dependencies
import { Fragment, useState, useEffect } from "react";

// Translations
import { useTranslation } from "react-i18next";

// React routern dom
import { useLocation } from "react-router-dom";

// Default components
import Header from "./Header/index";
import Footer from "./Footer/index";
import Sidebar from "./Sidebar/index";

// SEO
import { Helmet } from "react-helmet";
import { POOLNameToUse } from "../../utils/globalParameters";

const Layout = (props) => {
  // Translation details
  const { t } = useTranslation();

  // Route details
  let location = useLocation();

  // Sidebar manipulation
  const [showSidebar, updateSidebarStatus] = useState(false);

  const sidebarOpener = () => {
    updateSidebarStatus(true);
  };

  const sidebarCloser = () => {
    updateSidebarStatus(false);
  };

  // Embed mode manipulation
  const [isEmbedMode, updateEmbedModeStatus] = useState(false);

  useEffect(() => {
    // Check if user entered from embed mode
    if (location.search.includes(`embedMode=true`)) {
      updateEmbedModeStatus(true);
    }
  }, []);

  return (
    <Fragment>
      {/* Basic SEO */}
      <Helmet>
        <title>{`${t("HOMETAG")} • ${POOLNameToUse}`}</title>
      </Helmet>

      {
        /* Header */
        isEmbedMode === false ? <Header openSidebar={sidebarOpener} /> : null
      }

      {/* Sidebar */}
      <Sidebar showSideDrawer={showSidebar} closeSideDrawer={sidebarCloser} />

      {
        /* Divider */
        isEmbedMode === false ? (
          <div
            style={{
              width: "100vw",
              marginBottom: "79px",
              boxSizing: "border-box",
            }}
          ></div>
        ) : null
      }

      {
        /* Body */
        isEmbedMode === true ? (
          <div style={{ marginTop: "-55px", width: "100%" }}>
            {props.children}
          </div>
        ) : (
          props.children
        )
      }

      {/* Footer */}
      <Footer />
    </Fragment>
  );
};

export default Layout;
