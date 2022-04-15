import { useAppDispatch, useAppSelector } from "../../states/hooks";
import { actions, selectAppSnackbar } from "../../states/appState";

type SnackbarType = "error" | "warning" | "info" | "success";

export const useSnackbar = () => {
    const appSnackbar = useAppSelector(selectAppSnackbar);
    const dispatch = useAppDispatch();

    const showSnackbar = (msg: string, type: SnackbarType) => {
        dispatch(
            actions.setSnackbar({
                show: true,
                label: msg,
                severity: type,
            })
        );
    };

    const hideSnackbar = () => {
        dispatch(
            actions.setSnackbar({
                show: false,
                label: appSnackbar.label,
                severity: appSnackbar.severity,
            })
        );
    };

    return {
        showSuccess: (msg: string) => showSnackbar(msg, "success"),
        showInfo: (msg: string) => showSnackbar(msg, "info"),
        showWarning: (msg: string) => showSnackbar(msg, "warning"),
        showError: (msg: string) => showSnackbar(msg, "error"),
        hideSnackbar,
    };
};
