import { useTranslation } from "react-i18next";
import { locales, availableLanguages } from "../../../../i18n";
import { useAppSelector, useAppDispatch } from "../../../../../states/hooks";
import {
    actions,
    selectIsOpenLanguageDialog,
} from "../../../../../states/appState";

import i18next from "i18next";
import useTheme from "@mui/material/styles/useTheme";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

export const LanguageDialog = () => {
    const { t } = useTranslation();
    const { setIsOpenLanguageDialog } = actions;
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const isOpenLanguageDialog = useAppSelector(selectIsOpenLanguageDialog);

    const closeDialog = () => {
        dispatch(setIsOpenLanguageDialog(false));
    };

    const languageSwitcher = (locale: locales) => {
        i18next.changeLanguage(locale);
        return closeDialog();
    };

    return (
        <Dialog
            onClose={closeDialog}
            open={isOpenLanguageDialog}
            fullWidth={true}
        >
            <DialogTitle>{t("chooseLanguage")}</DialogTitle>

            <List style={{ width: "100%" }}>
                {availableLanguages.map((item) => (
                    <ListItem
                        button
                        onClick={() => languageSwitcher(item.locale)}
                        key={item.locale}
                    >
                        <ListItemAvatar>
                            <Avatar
                                style={{
                                    color: "white",
                                    backgroundColor: theme.palette.primary.main,
                                }}
                                variant="rounded"
                            >
                                {item.locale.toLocaleUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>

            <DialogActions>
                <Button
                    autoFocus
                    onClick={closeDialog}
                    sx={{ color: "white" }}
                    variant="contained"
                    fullWidth
                >
                    {t("close")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
