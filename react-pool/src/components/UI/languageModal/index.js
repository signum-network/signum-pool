// React
import { Fragment } from "react";

// React translations
import { useTranslation } from "react-i18next";
import i18next from "i18next";

// Redux integration with actions
import { connect } from "react-redux";

// Redux functions
import PropTypes from "prop-types";
import { closeLanguageModal } from "../../../utils/redux/actions/languageModal";

// Material-ui
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

// Material-ui lists
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";

// Material-ui dialog
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

// Styling
import styles from "./languageModal.module.css";

// Extra
import { languagesList } from "../../../utils/globalLanguages";

const LanguageModal = (props) => {
  // Translations details
  const { t } = useTranslation();

  // Get props
  const { languageModal, closeLanguageModal } = props;

  // Modal close
  const closeModal = () => {
    closeLanguageModal();
  };

  // Language Picker
  const languageSwitcher = (code) => {
    // Switch language
    i18next.changeLanguage(code);

    // Close Modal automatically
    return closeLanguageModal();
  };

  return (
    <Fragment>
      <Dialog
        onClose={closeModal}
        aria-labelledby="customized-language-dialog-title"
        open={languageModal.show}
        fullWidth={true}
      >
        {/* Title */}
        <DialogTitle>{t("chooseLanguage")}</DialogTitle>

        {/* Content */}
        <List style={{ width: "100%" }}>
          {languagesList.map((item) => (
            <ListItem
              button
              onClick={() => languageSwitcher(item.code)}
              key={item.code}
            >
              <ListItemAvatar>
                <Avatar
                  style={{
                    color: "#ffffff",
                    backgroundColor: "rgba(0,0,0,0.2)",
                  }}
                >
                  {item.code.toLocaleUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>

        {/* Actions */}
        <Grid className={styles.actionsContainer}>
          <Button
            autoFocus
            onClick={closeModal}
            variant="outlined"
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
    languageModal: state.languageModal,

    // Functions
    closeLanguageModal: PropTypes.func.isRequired,
  };
};

export default connect(mapStateToProps, {
  closeLanguageModal,
})(LanguageModal);
