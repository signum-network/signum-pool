// React
import { Fragment, useState } from "react";

// React translations
import { useTranslation } from "react-i18next";

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
import Alert from "@material-ui/core/Alert";

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

const MinerModal = (props) => {
  // Translations details
  const { t } = useTranslation();

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
    await selectBookmarkedMiner(data, t);

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
      {/* Snackbar for bookmarked miner*/}
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
          <Typography>{`${t("minerAdded")} ⚒️`}</Typography>
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
          <Typography variant="h6">{t("minerDetails")}</Typography>

          <IconButton aria-label="close" onClick={closeModal}>
            <CloseIcon />
          </IconButton>
        </Grid>

        {/* Content */}
        <MuiDialogContent className={styles.contentContainer} dividers>
          {/* View miner in explorer */}
          <Grid item className={styles.tableItem}>
            <Button
              color="primary"
              variant="contained"
              startIcon={<BlurOnIcon />}
              className={styles.explorerButton}
              onClick={viewAccountInExplorer}
              fullWidth
            >
              {t("viewMinerInExplorer")}
            </Button>
          </Grid>

          {/* Address */}
          <RowItemRender
            title={t("minerAddress")}
            value={minerModal.data.addressRS}
          />

          {
            /* Name */
            minerModal.data.name &&
            minerModal.data.name !== null &&
            minerModal.data.name !== undefined ? (
              <RowItemRender
                title={t("minerName")}
                value={minerModal.data.name}
              />
            ) : null
          }

          {/* Account id */}
          <RowItemRender
            title={t("accountID")}
            value={minerModal.data.address}
          />

          {/* Pending balance */}
          <RowItemRender
            title={t("pendingBalance")}
            value={minerModal.data.pendingBalance}
          />

          {/* Minimum Payout */}
          <RowItemRender
            title={t("minimumPayout")}
            value={minerModal.data.minimumPayout}
          />

          {/* Share Model */}
          <RowItemRender
            title={t("shareModel")}
            value={minerModal.data.sharePercent + "%"}
          />

          {/* Donation Percent */}
          <RowItemRender
            title={t("donationPercentage")}
            value={minerModal.data.donationPercent + "%"}
          />

          {/* Physical Capacity	*/}
          <RowItemRender
            title={t("physicalCapacity")}
            value={minerModal.data.physicalCapacity}
          />

          {/* Commitment/TiB	*/}
          <RowItemRender
            title={t("commitmentTiB")}
            value={minerModal.data.commitment}
          />

          {/* PoC+ Boost Pool */}
          <RowItemRender
            title={t("poCPlusPool")}
            value={minerModal.data.poCPlus}
          />

          {/* Effective Shared */}
          <RowItemRender
            title={t("effectiveShared")}
            value={minerModal.data.effectiveCapacity}
          />

          {/* Confirmed Deadlines */}
          <RowItemRender
            title={t("confirmedDeadline")}
            value={minerModal.data.confirmedDeadline}
          />

          {/* Pool Share */}
          <RowItemRender
            title={t("poolShare")}
            value={minerModal.data.poolShare}
          />

          {/* Software */}
          <RowItemRender
            title={t("Software")}
            value={minerModal.data.Software}
          />
        </MuiDialogContent>

        {/* Actions */}
        <Grid className={styles.actionsContainer}>
          <Button
            autoFocus
            onClick={bookmarkMiner}
            variant="outlined"
            color="inherit"
            className={styles.buttonActions}
          >
            {`${t("bookmarkMiner")} 📌`}
          </Button>

          <Button
            autoFocus
            onClick={closeModal}
            variant="outlined"
            color="inherit"
            className={styles.buttonActions}
          >
            {t("close")}
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
  MinerModal
);
