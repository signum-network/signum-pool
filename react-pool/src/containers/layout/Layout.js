// React native dependencies
import { Fragment, useState } from "react";

// Default components
import Header from "./Header/index";
import Footer from "./Footer/index";
import Sidebar from "./Sidebar/index";

// SEO
import { Helmet } from "react-helmet";
import { POOLNameToUse } from "../../utils/globalParameters";

const Layout = (props) => {
  // Sidebar manipulation
  const [showSidebar, updateSidebarStatus] = useState(false);

  const sidebarOpener = () => {
    updateSidebarStatus(true);
  };

  const sidebarCloser = () => {
    updateSidebarStatus(false);
  };

  return (
    <Fragment>
      {/* Basic SEO */}
      <Helmet>
        <title>{"Mining Pool • " + POOLNameToUse}</title>
      </Helmet>

      {/* Header */}
      <Header openSidebar={sidebarOpener} />

      {/* Sidebar */}
      <Sidebar showSideDrawer={showSidebar} closeSideDrawer={sidebarCloser} />

      {/* Divider */}
      <div
        style={{
          width: "100vw",
          marginBottom: "79px",
          boxSizing: "border-box",
        }}
      ></div>

      {/* Body */}
      {props.children}

      {/* Footer */}
      <Footer />
    </Fragment>
  );
};

export default Layout;
