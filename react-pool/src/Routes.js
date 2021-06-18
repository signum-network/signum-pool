// React
import React, { Fragment, Suspense, useEffect } from "react";

// React router dom
import { Switch, Route, withRouter } from "react-router-dom";

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

const Routes = (props) => {
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
    await fetchPoolInfo();

    // Get basic data
    await fetchBasicInfo(basicData);

    // Get miners
    await fetchMinersData(minerData);

    // After 10 seconds, it will start an interval
    setTimeout(() => {
      // Interval for fetching data every 60 seconds
      setInterval(async () => {
        // Get miners
        await fetchMinersData(minerData, true);
      }, 60000);

      // Interval for fetching data every 10 seconds
      setInterval(async () => {
        // Get basic data
        await fetchBasicInfo(basicData, true);
      }, 10000);
    }, 10000);
  };

  // ComponentDidMount
  useEffect(() => {
    initialDataFetcher();
  }, []);

  return (
    <Fragment>
      {/* Miner modal */}
      <MinerModal />

      <Layout>
        <Switch>
          {/* Pool info */}
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
