// React
import React, { Fragment, Suspense, useEffect, useState } from "react";

// React router dom
import { Switch, Route, withRouter, useLocation } from "react-router-dom";

// React translations
import { useTranslation } from "react-i18next";

// Redux integration with actions
import { connect } from "react-redux";

// Redux functions
import PropTypes from "prop-types";
import { fetchBasicInfo, fetchPoolInfo } from "./utils/redux/actions/basicInfo";
import { fetchMinersData } from "./utils/redux/actions/miners";

// Default modules
import Loading from "./containers/layout/loading/index";
import Layout from "./containers/layout/Layout";

// Components
import MinerModal from "./components/UI/minerModal";

// 404 page
import ErrorPage from "./pages/404/Error";

// Google analytics
import ReactGA from "react-ga";

// Extra
import { googleTrackingID_ToUse } from "./utils/globalParameters";

// Import pages
const Home = React.lazy(() => {
  return import("./pages/home/index");
});

const StartMining = React.lazy(() => {
  return import("./pages/start-mining/index");
});

const PoolInfo = React.lazy(() => {
  return import("./pages/pool-info/index");
});

const TradingViewer = React.lazy(() => {
  return import("./pages/trading-view/index");
});

const MinersList = React.lazy(() => {
  return import("./pages/miners/index");
});

const Routes = (props) => {
  // Translations details
  const { t } = useTranslation();

  // Route details
  const location = useLocation();

  // Enable anaylitics pageview dispatch
  const [initialized, setInitialized] = useState(false);

  // Get initial props
  let {
    // Data
    basicData,
    minerData,

    // Functions
    fetchBasicInfo,
    fetchPoolInfo,
    fetchMinersData,
  } = props;

  const initialDataFetcher = async () => {
    // Verify in which page the user is visiting

    // Get pool config
    await fetchPoolInfo(true, t);

    // Get basic data
    await fetchBasicInfo(basicData, false, t);

    // Get miners
    await fetchMinersData(minerData, false, t);

    // After 10 seconds, it will start an interval
    setTimeout(() => {
      // Interval for fetching data every 60 seconds
      setInterval(async () => {
        // Get miners
        await fetchMinersData(minerData, true, t);
      }, 60000);

      // Interval for fetching data every 10 seconds
      setInterval(async () => {
        // Get basic data
        await fetchBasicInfo(basicData, true, t);
      }, 10000);
    }, 10000);
  };

  // ComponentDidMount
  useEffect(() => {
    initialDataFetcher();

    // Google Analytics start
    if (
      googleTrackingID_ToUse &&
      googleTrackingID_ToUse !== "" &&
      googleTrackingID_ToUse.trim() !== ""
    ) {
      // Initiate analytics
      ReactGA.initialize(googleTrackingID_ToUse);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (
      googleTrackingID_ToUse &&
      googleTrackingID_ToUse !== "" &&
      googleTrackingID_ToUse.trim() !== "" &&
      initialized
    ) {
      // Register pageview
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }, [initialized, location]);

  return (
    <Fragment>
      {/* Miner modal */}
      <MinerModal />

      <Layout>
        <Switch>
          {/* Trading view */}
          <Route
            path="/trading-view"
            exact
            render={() => (
              <Suspense fallback={<Loading />}>
                <TradingViewer />
              </Suspense>
            )}
          />

          {/* Pool info */}
          <Route
            path="/pool-info"
            exact
            render={() => (
              <Suspense fallback={<Loading />}>
                <PoolInfo />
              </Suspense>
            )}
          />

          {/* Miners list */}
          <Route
            path="/miners"
            exact
            render={() => (
              <Suspense fallback={<Loading />}>
                <MinersList />
              </Suspense>
            )}
          />

          {/* Start mining */}
          <Route
            path="/start-mining"
            exact
            render={() => (
              <Suspense fallback={<Loading />}>
                <StartMining />
              </Suspense>
            )}
          />

          {/* Index */}
          <Route
            path="/"
            exact
            render={() => (
              <Suspense fallback={<Loading />}>
                <Home />
              </Suspense>
            )}
          />

          {/* 404 page */}
          <Route component={ErrorPage} />
        </Switch>
      </Layout>
    </Fragment>
  );
};

// Connect redux to website
const mapStateToProps = (state) => {
  return {
    // Data
    basicData: state.basicInfo,
    minerData: state.miners,
    pricing: state.pricing,
    bookMarkedMiner: state.bookMarkedMiner,
    poolData: state.poolConfig,

    // Functions
    fetchBasicInfo: PropTypes.func.isRequired,
    fetchPoolInfo: PropTypes.func.isRequired,
    fetchMinersData: PropTypes.func.isRequired,
  };
};

export default connect(mapStateToProps, {
  fetchBasicInfo,
  fetchPoolInfo,
  fetchMinersData,
})(withRouter(Routes));
