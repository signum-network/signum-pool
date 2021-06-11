// React
import { Fragment, useState } from "react";

// Redux integration with actions
import { connect } from "react-redux";

// Redux functions
import PropTypes from "prop-types";
import { selectBookmarkedMiner } from "../../../utils/redux/actions/miners";
import { toggleModal } from "../../../utils/redux/actions/minerModal";

// Material-ui
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

// Material-ui dialog
import Dialog from "@material-ui/core/Dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";

// Material icons
import CloseIcon from "@material-ui/icons/Close";
import BlurOnIcon from "@material-ui/icons/BlurOn";

// Styling
import styles from "./minerModal.module.css";

// Extra
import { userKeyBook, EXPLORERToUse } from "../../../utils/globalParameters";

const MinnerModal = (props) => {
  // Get props
  const { minerModal, minerData, toggleModal, selectBookmarkedMiner } = props;

  // Close modal
  const closeModal = () => {
    toggleModal(null);
  };

  // Bookmark miner
  const bookmarkMiner = async () => {
    const accountId = minerModal.data.address;
    const data = minerData.list;

    // Check if user is not adding the same account
    const currentKey = localStorage.getItem(userKeyBook);
    if (
      currentKey &&
      currentKey !== null &&
      currentKey !== undefined &&
      currentKey === accountId
    ) {
      return false;
    }

    // Save id
    await localStorage.setItem(userKeyBook, accountId);

    // Update redux
    await selectBookmarkedMiner(data);

    await toggleSnackBar(true);
  };

  // Open explorer
  const viewAccountInExplorer = () => {
    const accountId = minerModal.data.address;

    window.open(
      `${EXPLORERToUse}?action=account&account=${accountId}`,
      "_blank"
    );
  };

  // Snackbar manipulation
  const [showSnackBar, toggleSnackBar] = useState(false);

  const updateSnackBar = () => {
    toggleSnackBar((prev) => !prev);
  };

  // Item
  const RowItemRender = (props) => (
    <Grid item className={styles.tableItem}>
      <Grid item className={styles.tableItemLeftSide}>
        <Typography>{props.title}</Typography>
      </Grid>
      <Grid item className={styles.tableItemRightSide}>
        <Typography>{props.value}</Typography>
      </Grid>
    </Grid>
  );

  return (
    <Fragment>
      {/* Snakbacr for bookmarked miner*/}
      <Snackbar
        open={showSnackBar}
        autoHideDuration={3000}
        onClose={updateSnackBar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        style={{ width: "100%", maxWidth: "600px" }}
      >
        <Alert
          onClose={updateSnackBar}
          severity="success"
          style={{ width: "100%", borderRadius: 8 }}
        >
          <Typography>Bookmark added! ⚒️</Typography>
        </Alert>
      </Snackbar>

      <Dialog
        onClose={closeModal}
        aria-labelledby="customized-dialog-title"
        open={minerModal.show}
        fullWidth={true}
      >
        {/* Title */}
        <Grid className={styles.titleContainer}>
          <Typography variant="h6">Miner details</Typography>

          <IconButton aria-label="close" onClick={closeModal}>
            <CloseIcon />
          </IconButton>
        </Grid>

        {/* Content */}
        <MuiDialogContent className={styles.contentContainer} dividers>
          {/* Address */}
          <RowItemRender
            title="Miner Address"
            value={minerModal.data.addressRS}
          />

          {
            /* Name */
            minerModal.data.name &&
            minerModal.data.name !== null &&
            minerModal.data.name !== undefined ? (
              <RowItemRender title="Miner Name" value={minerModal.data.name} />
            ) : null
          }

          {/* Account id */}
          <RowItemRender title="Account ID" value={minerModal.data.address} />

          {/* Pending balance */}
          <RowItemRender
            title="Pending Balance"
            value={minerModal.data.pendingBalance}
          />

          {/* Minimum Payout */}
          <RowItemRender
            title="Minimum Payout"
            value={minerModal.data.minimumPayout}
          />

          {/* Share Model */}
          <RowItemRender
            title="Share Model"
            value={minerModal.data.sharePercent + "%"}
          />

          {/* Donation Percent */}
          <RowItemRender
            title="Donation Percent"
            value={minerModal.data.donationPercent + "%"}
          />

          {/* Physical Capacity	*/}
          <RowItemRender
            title="Physical Capacity"
            value={minerModal.data.physicalCapacity}
          />

          {/* Commitment/TiB	*/}
          <RowItemRender
            title="Commitment/TiB"
            value={minerModal.data.commitment}
          />

          {/* PoC+ Boost Pool */}
          <RowItemRender
            title="PoC+ Boost Pool"
            value={minerModal.data.poCPlus}
          />

          {/* Effective Shared */}
          <RowItemRender
            title="Effective Shared"
            value={minerModal.data.effectiveCapacity}
          />

          {/* Confirmed Deadlines */}
          <RowItemRender
            title="Confirmed Deadlines"
            value={minerModal.data.confirmedDeadline}
          />

          {/* Pool Share */}
          <RowItemRender title="Pool Share" value={minerModal.data.poolShare} />

          {/* Software */}
          <RowItemRender title="Software" value={minerModal.data.Software} />

          {/* View miner in explorer */}
          <Grid item className={styles.tableItem}>
            <Button
              color="primary"
              variant="contained"
              startIcon={<BlurOnIcon />}
              className={styles.explorerButton}
              onClick={viewAccountInExplorer}
            >
              View miner in explorer
            </Button>
          </Grid>
        </MuiDialogContent>

        {/* Actions */}
        <Grid className={styles.actionsContainer}>
          <Button
            autoFocus
            onClick={bookmarkMiner}
            variant="outlined"
            className={styles.buttonActions}
          >
            Bookmark miner 📌
          </Button>

          <Button
            autoFocus
            onClick={closeModal}
            variant="outlined"
            className={styles.buttonActions}
          >
            Close
          </Button>
        </Grid>
      </Dialog>
    </Fragment>
  );
};

// Connect redux to component
const mapStateToProps = (state) => {
  return {
    // Data
    minerModal: state.minerModal,
    minerData: state.miners,

    // Functions
    toggleModal: PropTypes.func.isRequired,
    selectBookmarkedMiner: PropTypes.func.isRequired,
  };
};

export default connect(mapStateToProps, { toggleModal, selectBookmarkedMiner })(
  MinnerModal
);
