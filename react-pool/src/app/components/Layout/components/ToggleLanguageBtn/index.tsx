import { useTranslation } from "react-i18next";
import { actions } from "../../../../../states/appState";
import { useAppDispatch } from "../../../../../states/hooks";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import TranslateIcon from "@mui/icons-material/Translate";

export const ToggleLanguageBtn = () => {
    const { t } = useTranslation();
    const { setIsOpenLanguageDialog } = actions;
    const dispatch = useAppDispatch();

    const openLanguageModal = () => dispatch(setIsOpenLanguageDialog(true));

    return (
        <Tooltip title={t("chooseLanguage") || "Choose a Language"} arrow>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={openLanguageModal}
                sx={{
                    marginLeft: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    p: 1,
                }}
            >
                <TranslateIcon sx={{ margin: { xs: 0.5, md: 0 } }} />
            </IconButton>
        </Tooltip>
    );
};
