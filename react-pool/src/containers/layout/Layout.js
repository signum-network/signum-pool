// React native dependencies
import { Fragment, useState, useEffect } from "react";

// React routern dom
import { useLocation } from "react-router-dom";

// Translations
import { useTranslation } from "react-i18next";

// Redux integration with actions
import { connect } from "react-redux";
import { openLanguageModal } from "../../utils/redux/actions/languageModal";

// Redux functions
import PropTypes from "prop-types";

// Default components
import Header from "./Header/index";
import Footer from "./Footer/index";
import Sidebar from "./Sidebar/index";
import LanguageModal from "../../components/UI/languageModal/index";

// SEO
import { Helmet } from "react-helmet";
import { POOLNameToUse } from "../../utils/globalParameters";

const Layout = (props) => {
  // Translation details
  const { t } = useTranslation();

  // Get props
  const { openLanguageModal } = props;

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
        isEmbedMode === false ? (
          <Header
            openSidebar={sidebarOpener}
            openLanguageModal={openLanguageModal}
          />
        ) : null
      }

      {/* Sidebar */}
      <Sidebar
        showSideDrawer={showSidebar}
        closeSideDrawer={sidebarCloser}
        openLanguageModal={openLanguageModal}
      />

      {/* Divider */}
      <div
        style={{
          width: "100vw",
          marginBottom: isEmbedMode ? "50px" : "79px",
          boxSizing: "border-box",
        }}
      ></div>

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

      {/* LanguageModal */}
      <LanguageModal />

      {/* Footer */}
      <Footer />
    </Fragment>
  );
};

// Connect redux to website
const mapStateToProps = (state) => {
  return {
    // Data
    languageModal: state.languageModal,

    // Functions
    openLanguageModal: PropTypes.func.isRequired,
  };
};

export default connect(mapStateToProps, {
  openLanguageModal,
})(Layout);
