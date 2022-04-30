import { useTranslation } from "react-i18next";
import { useSnackbar } from "../../../../hooks/useSnackbar";

import copy from "copy-to-clipboard";
import Tooltip from "@mui/material/Tooltip";

import Typography from "@mui/material/Typography";

interface CtaTextProps {
    label: string;
    textToCopy: string;
    successMsg: string;
}

export const CtaText = ({ label, textToCopy, successMsg }: CtaTextProps) => {
    const { t } = useTranslation();
    const { showSuccess } = useSnackbar();

    return (
        <Tooltip title={`${t("copy")}`} arrow placement="right">
            <Typography
                fontWeight={700}
                color="primary"
                sx={{ cursor: "pointer", display: "inline-block" }}
                onClick={() => {
                    copy(textToCopy);
                    showSuccess(successMsg);
                }}
            >
                {label}
            </Typography>
        </Tooltip>
    );
};
