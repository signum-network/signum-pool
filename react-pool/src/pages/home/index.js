// React
import { Fragment, useEffect, useState, useRef } from "react";

// React router dom
import { Link } from "react-router-dom";

// Redux integration with actions
import { connect } from "react-redux";

// Redux actions
import PropTypes from "prop-types";
import { fetchSignaPrice } from "../../utils/redux/actions/basicInfo";
import { selectBookmarkedMiner } from "../../utils/redux/actions/miners";
import { toggleModal } from "../../utils/redux/actions/minerModal";

// Material ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

// Material icons
import SearchIcon from "@material-ui/icons/Search";

// Styling
import styles from "./Home.module.css";

// Extra
import { POOLNameToUse, userKeyBook } from "../../utils/globalParameters";
import { thousands_separators } from "../../utils/functions/normal";

// Components
import MinersTable from "../../components/UI/minersTable/index";
import OutlinedTable from "../../components/UI/outlinedTable/index";

const Home = (props) => {
  // Props
  const { basicData, minerData, pricing, bookMarkedMiner } = props;

  // Inputs
  const fInput = useRef(null);

  // Searcher
  const searchDispatch = () => {
    // Get input value
    const value = fInput.current.value.trim().toUpperCase();

    // Check if user has typed something
    if (!value || value.trim() === "" || minerData.list.length === 0) {
      fInput.current.value = "";
      return false;
    }

    // Disable snackbar
    toggleSnackBar(false);

    // Found variable
    var foundMinerHome = false;

    // Promise in order to show miner
    return new Promise((resolve, reject) => {
      // Loop through users in order to find that account
      minerData.list.map((miner, index) => {
        // Get miner basic data
        const { data } = miner;

        // Basic identification
        const accountId =
          data.address && data.address.trim() !== ""
            ? data.address.toUpperCase()
            : null;

        const accountAddress =
          data.addressRS && data.addressRS.trim() !== ""
            ? data.addressRS.toUpperCase()
            : null;

        const name =
          data.name && data.name.trim() !== "" ? data.name.toUpperCase() : null;

        // Make basic research
        if (
          foundMinerHome === false &&
          (value === accountId ||
            value === accountAddress ||
            (name && name === value))
        ) {
          foundMinerHome = true;
          resolve(data);

          // Make basic research for "burst", "s", "ts" prefix addresses
        } else if (foundMinerHome === false) {
          let burstAddress = null;
          let sAddress = null;
          let tsAddress = null;

          // Check which prefix wallet has

          // Prefix BURST
          if (
            accountAddress.indexOf("B").toString() === "0" &&
            accountAddress.indexOf("U").toString() === "1" &&
            accountAddress.indexOf("R").toString() === "2" &&
            accountAddress.indexOf("S").toString() === "3"
          ) {
            burstAddress = accountAddress;
            sAddress = accountAddress.replace("BURST-", "S-");
            tsAddress = accountAddress.replace("BURST-", "TS-");

            // Prefix S
          } else if (
            accountAddress.indexOf("S") === 0 &&
            accountAddress.indexOf("-") === 1
          ) {
            burstAddress = accountAddress.replace("S-", "BURST-");
            sAddress = accountAddress;
            tsAddress = accountAddress.replace("S-", "TS-");

            // Prefix TS
          } else if (
            accountAddress.indexOf("T").toString() === "0" &&
            accountAddress.indexOf("S").toString() === "1" &&
            accountAddress.indexOf("-").toString() === "2"
          ) {
            burstAddress = accountAddress.replace("TS-", "BURST-");
            sAddress = accountAddress.replace("TS-", "S-");
            tsAddress = accountAddress;
          }

          // Check the if user typed one of the wallets with different prefix
          if (
            value === burstAddress ||
            value === sAddress ||
            value === tsAddress
          ) {
            foundMinerHome = true;
            resolve(data);

            // Tell the user it has not found any results
          } else if (
            index + 1 === minerData.list.length &&
            foundMinerHome === false
          ) {
            reject("notFound");
          }
        }
      });
    })
      .then((response) => {
        props.toggleModal(response);
        return true;
      })

      .catch((error) => {
        updateSnackBar();
        return false;
      });
  };

  // Snackbar manipulation
  const [showSnackBar, toggleSnackBar] = useState(false);

  const updateSnackBar = () => {
    toggleSnackBar((prev) => !prev);
  };

  // Bookmarked snackbar
  const [showBookMarkSnackBar, toggleBookMarkSnackBar] = useState(false);

  const bookMarkupdateSnackBar = () => {
    toggleBookMarkSnackBar((prev) => !prev);
  };

  // Table collapse manipulation
  const [checked, setChecked] = useState(false);

  const toogleMinersList = () => {
    setChecked((prev) => !prev);
  };

  // Delete bookmark miner
  const bookmarkDeleter = async () => {
    await localStorage.removeItem(userKeyBook);
    await props.selectBookmarkedMiner(null);
    toggleBookMarkSnackBar(true);
  };

  // ComponentDidMount
  useEffect(() => {
    const { fetchSignaPrice } = props;
    fetchSignaPrice(props.pricing.loadingData);
  }, []);

  const loadingTag = (
    <Grid item style={{ margin: "auto" }}>
      <CircularProgress color="primary" size={33.2} />
    </Grid>
  );

  return (
    <Fragment>
      {/* Snakbacr for miner not found*/}
      <Snackbar
        open={showSnackBar}
        autoHideDuration={3000}
        onClose={updateSnackBar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        style={{ width: "100%", maxWidth: "600px" }}
      >
        <Alert
          onClose={updateSnackBar}
          severity="error"
          style={{ width: "100%", borderRadius: 8 }}
        >
          <Typography>Miner not found ⚒️</Typography>
        </Alert>
      </Snackbar>

      {/* Snakbacr for deleted miner*/}
      <Snackbar
        open={showBookMarkSnackBar}
        autoHideDuration={3000}
        onClose={bookMarkupdateSnackBar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        style={{ width: "100%", maxWidth: "600px" }}
      >
        <Alert
          onClose={bookMarkupdateSnackBar}
          severity="success"
          style={{ width: "100%", borderRadius: 8 }}
        >
          <Typography>Bookmark deleted! ⚒️</Typography>
        </Alert>
      </Snackbar>

      {/* First section */}
      <Grid
        container
        className={styles.firstSection}
        direction="column"
        justify="center"
        alignItems="center"
        component="section"
      >
        <Typography component="h1" variant="h3" align="center">
          Welcome to {POOLNameToUse}
        </Typography>
        <Typography align="center" gutterBottom variant="h6">
          We are part of the community driven technology - Signum Blockchain{" "}
          <br />
          Let’s keep growing and start to mine now!
        </Typography>
        <Link to="/start-mining">
          <Typography
            color="primary"
            align="center"
            className={styles.redirectText}
          >
            Start mining
          </Typography>
        </Link>
      </Grid>

      {/* Second section */}
      <Grid
        container
        direction="row"
        alignItems="stretch"
        justify="space-between"
        wrap="nowrap"
        className={styles.inputContainer}
        component="form"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          searchDispatch();
        }}
      >
        <input
          autoComplete="off"
          type="text"
          placeholder="Your Signum address or account name"
          ref={fInput}
          disabled={minerData.loadingData}
        />

        <Button variant="contained" color="primary" type="submit">
          <SearchIcon fontSize="large"></SearchIcon>
        </Button>
      </Grid>

      {/* Third section */}
      <Grid
        container
        component="section"
        direction="row"
        justify="space-between"
        alignItems="center"
        wrap="wrap"
        className={styles.thirdSection}
      >
        {/* Physical size */}
        <Grid item>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Pool Physical
          </Typography>

          {minerData.loadingData === true ? (
            loadingTag
          ) : (
            <Typography variant="h5" gutterBottom>
              {minerData.poolCapacity}
            </Typography>
          )}
        </Grid>

        {/* Miners */}
        <Grid item>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Miners
          </Typography>

          {minerData.loadingData === true ? (
            loadingTag
          ) : (
            <Typography variant="h5" gutterBottom>
              {minerData.quantity}
            </Typography>
          )}
        </Grid>

        {/* Block height */}
        <Grid item>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Block Height
          </Typography>

          {basicData.loadingData === true ? (
            loadingTag
          ) : (
            <Typography variant="h5" gutterBottom>
              {thousands_separators(basicData.blockHeight)}
            </Typography>
          )}
        </Grid>

        {/* Price */}
        <Grid item>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Price <span>(USD)</span>
          </Typography>

          {pricing.loadingData === true ? (
            loadingTag
          ) : (
            <Typography variant="h5" gutterBottom>
              {"$" + pricing.usdPrice}
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Forth section */}
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        component="section"
        className={styles.forthSection}
      >
        <Typography className={styles.forthSectionTitle}>
          Bookmarked Miner
        </Typography>

        <OutlinedTable
          data={bookMarkedMiner.data}
          isLoading={bookMarkedMiner.loadingData}
          notFoundLabel="You have not bookmarked a miner 📌"
          fWidth="25%"
          sWidth="75%"
          onClickLastItem={bookmarkDeleter}
        />
      </Grid>

      {/* Check if pool has miners */}
      {props.minerData.list &&
      props.minerData.list.length &&
      props.minerData.loadingData === false &&
      props.minerData.list.length > 0 ? (
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
          component="section"
          style={{ margin: "2rem 0" }}
        >
          <Button
            variant="contained"
            className={styles.toggleBtn}
            onClick={toogleMinersList}
          >
            {checked === true ? "Hide miners list" : "Show miners list"}
          </Button>

          <Collapse in={checked} style={{ width: "100%" }}>
            <Grid container direction="column" className={styles.tableBtn}>
              <MinersTable data={props.minerData.list} />
            </Grid>
          </Collapse>
        </Grid>
      ) : (
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          component="section"
          className={styles.forthSection}
        >
          <OutlinedTable
            data={null}
            isLoading={props.minerData.loadingData}
            notFoundLabel="There is no miners, start inviting them! ⚒️"
            fWidth="25%"
            sWidth="75%"
            onClickLastItem={null}
          />
        </Grid>
      )}
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

    // Functions
    fetchSignaPrice: PropTypes.func.isRequired,
    selectBookmarkedMiner: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
  };
};

export default connect(mapStateToProps, {
  fetchSignaPrice,
  selectBookmarkedMiner,
  toggleModal,
})(Home);
