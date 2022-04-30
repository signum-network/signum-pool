import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../../../../hooks/useSnackbar";

import { useAppSelector, useAppDispatch } from "../../../../../states/hooks";
import { actions, selectSearchedMiner } from "../../../../../states/appState";
import { selectMiners } from "../../../../../states/minersState";
import { asRSAddress } from "../../../../utils/functions/accountAddress";
import {
    SpecificMiner,
    SpecificMinerProps,
} from "../../../Tables/SpecificMiner";

import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export const SearchMinerDialog = () => {
    const { t } = useTranslation();
    const { showError, showSuccess } = useSnackbar();
    const { setSearchMiner, setBookmarkedMiner } = actions;
    const { miners } = useAppSelector(selectMiners);
    const dispatch = useAppDispatch();
    const searchedMinerState = useAppSelector(selectSearchedMiner);

    const [minerData, setMinerData] = useState<SpecificMinerProps>();

    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const openDialog = () => setIsOpenDialog(true);
    const closeDialog = () => {
        setIsOpenDialog(false);
        resetMinerQuery();
    };

    const searchMiner = () => {
        let isMinerFound = false;
        const query = searchedMinerState.trim();
        const queryLowercased = query.toLowerCase();
        const minerAmount = miners.length;

        miners.forEach((miner, index) => {
            if (isMinerFound) return;
            const { accountId, name } = miner;
            const minerRSAddress = asRSAddress(accountId);
            const minerNo = index + 1;

            if (
                query === accountId ||
                query === name ||
                query === minerRSAddress
            ) {
                isMinerFound = true;
                minerFound(miner);
            } else if (
                queryLowercased === minerRSAddress.toLowerCase() ||
                (name && queryLowercased === name.toLowerCase())
            ) {
                isMinerFound = true;
                minerFound(miner);
            }

            // If nor miners are found, just launch the alert on last array item
            if (minerAmount === minerNo && !isMinerFound) minerNotFound();
        });
    };

    const minerFound = (minerData: SpecificMinerProps) => {
        setMinerData({ ...minerData });
        openDialog();
    };

    const resetMinerQuery = () => dispatch(setSearchMiner(""));

    const minerNotFound = () => {
        showError(t("minerNotFound"));
        resetMinerQuery();
    };

    const bookmarkMiner = () => {
        dispatch(setBookmarkedMiner(minerData!.accountId));
        showSuccess(t("minerAdded"));
    };

    useEffect(() => {
        if (searchedMinerState) searchMiner();
    }, [searchedMinerState]);

    const btnStyling = {
        fontSize: 16,
        width: { xs: "100%", md: "48%" },
        mb: 2,
        textTransform: "none",
    };

    return (
        <Dialog
            fullWidth
            open={isOpenDialog}
            onClose={closeDialog}
            scroll="paper"
        >
            <DialogTitle id="scroll-dialog-title">
                {t("minerDetails")}
            </DialogTitle>
            <DialogContent dividers>
                {minerData && (
                    <SpecificMiner
                        showExplorerButton
                        accountId={minerData.accountId}
                        name={minerData.name}
                        pendingBalance={minerData.pendingBalance}
                        physicalCapacity={minerData.physicalCapacity || 0}
                        effectiveCapacity={minerData.effectiveCapacity || 0}
                        sharedCapacity={minerData.sharedCapacity || 0}
                        shareModel={minerData.shareModel || 0}
                        donationPercent={minerData.donationPercent || 0}
                        totalCommitment={minerData.totalCommitment || ""}
                        commitmentPerTiB={minerData.commitmentPerTiB || ""}
                        pocBoost={minerData.pocBostPool || 0}
                        confirmedDeadlines={minerData.confirmedDeadlines || 0}
                        currentRoundBestDeadline={
                            minerData.currentRoundBestDeadline || ""
                        }
                        poolShare={minerData.poolShare || 0}
                        minimumPayout={minerData.minimumPayout || ""}
                        minerAgent={minerData.minerAgent || ""}
                        onClose={closeDialog}
                    />
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    justifyContent: "space-between",
                    pt: 2,
                    flexWrap: "wrap",
                }}
            >
                <Button
                    color="inherit"
                    size="large"
                    sx={btnStyling}
                    onClick={closeDialog}
                >
                    {t("close")}
                </Button>

                <Button
                    color="inherit"
                    size="large"
                    variant="outlined"
                    sx={btnStyling}
                    onClick={bookmarkMiner}
                >
                    {t("bookmarkMiner")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
