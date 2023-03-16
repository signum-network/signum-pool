import { useTranslation } from "react-i18next";
import { formatDistance, subMinutes } from "date-fns";
import { useAppContext } from "../../../hooks/useAppContext";
import { useAppSelector } from "../../../../states/hooks";
import { selectCurrentRound } from "../../../../states/currentRoundState";
import { useDateFnsLocale } from "../../../hooks/useDateFnsLocale";
import { TableContainer as CustomTableContainer } from "../components/TableContainer";
import { LoadingData } from "../components/LoadingData";
import { poolNodeUrl } from "../../../../enviroments";
import { formatAmount } from "../../../utils/functions/formatAmount";
import { asRSAddress } from "../../../utils/functions/accountAddress";
import {
    viewAccountInExplorer,
    viewBlockInExplorer,
} from "../../../utils/explorer";
import { columns } from "./columns";

import useSWR from "swr";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";

export const PoolWonBlocks = () => {
    const { t } = useTranslation();
    const { Fetcher } = useAppContext();
    const { networkInfo } = useAppSelector(selectCurrentRound);
    const locale = useDateFnsLocale();

    const defaultSWRSettings = {
        refreshInterval: 60000,
        dedupingInterval: 50000,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    };

    const { data, isValidating, error } = useSWR(
        poolNodeUrl + "/api/getWonBlocks",
        Fetcher,
        defaultSWRSettings
    );

    if (isValidating && !data)
        return (
            <CustomTableContainer>
                <LoadingData />
            </CustomTableContainer>
        );

    const blocks = data.wonBlocks || [];

    const processingIndicator = (
        <Tooltip title={`${t("processing")}`} arrow>
            <CircularProgress size={22} />
        </Tooltip>
    );

    if ((!isValidating && !blocks.length) || error)
        return (
            <CustomTableContainer>
                <Typography variant="h6" align="center">
                    {t("noBlocksWon") + " 💎"}
                </Typography>
            </CustomTableContainer>
        );

    return (
        <Paper
            elevation={3}
            sx={{
                mt: 2,
                width: "100%",
                borderRadius: 1,
                overflow: "hidden",
            }}
        >
            <TableContainer sx={{ maxHeight: { xs: undefined, lg: 650 } }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    sx={{
                                        minWidth: column.minWidth,
                                        borderRight: 1,
                                        borderColor: "divider",
                                        "&:last-child": { borderRight: 0 },
                                    }}
                                >
                                    {t(column.id)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {blocks.map((block: any) => {
                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={block.height}
                                >
                                    {columns.map((column) => {
                                        let cellContent: any = "-";

                                        switch (column.id) {
                                            case "blockHeight":
                                                const blockHeight =
                                                    block.height;

                                                let formatedTimeStamp = "";

                                                if (networkInfo.blockHeight) {
                                                    const currentBlockHeight =
                                                        networkInfo.blockHeight;

                                                    const differenceInBlocks =
                                                        currentBlockHeight -
                                                        blockHeight;

                                                    const differenceInMinutes =
                                                        differenceInBlocks * 4;

                                                    const currentDate =
                                                        new Date();

                                                    const blockSpecificDate =
                                                        subMinutes(
                                                            currentDate,
                                                            differenceInMinutes
                                                        );

                                                    formatedTimeStamp =
                                                        formatDistance(
                                                            blockSpecificDate,
                                                            currentDate,
                                                            {
                                                                addSuffix: true,
                                                                locale,
                                                            }
                                                        );
                                                }

                                                cellContent = (
                                                    <Grid
                                                        container
                                                        direction="column"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        <u
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => {
                                                                viewBlockInExplorer(
                                                                    blockHeight
                                                                );
                                                            }}
                                                        >
                                                            {formatAmount(
                                                                blockHeight
                                                            )}
                                                        </u>

                                                        {formatedTimeStamp && (
                                                            <Typography
                                                                color="textSecondary"
                                                                variant="subtitle2"
                                                            >
                                                                {
                                                                    formatedTimeStamp
                                                                }
                                                            </Typography>
                                                        )}
                                                    </Grid>
                                                );

                                                break;

                                            case "rewardAndFees":
                                                const reward = block.reward;

                                                if (
                                                    reward === "Processing..."
                                                ) {
                                                    cellContent =
                                                        processingIndicator;
                                                } else {
                                                    cellContent = reward;
                                                }

                                                break;

                                            case "miner":
                                                const miner = block.generator;
                                                const minerLabel =
                                                    block.name ||
                                                    asRSAddress(miner);

                                                cellContent = (
                                                    <u
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => {
                                                            viewAccountInExplorer(
                                                                miner
                                                            );
                                                        }}
                                                    >
                                                        {minerLabel}
                                                    </u>
                                                );
                                                break;

                                            case "poolReward":
                                                const poolReward =
                                                    block.poolShare;

                                                if (
                                                    poolReward ===
                                                    "Processing..."
                                                ) {
                                                    cellContent =
                                                        processingIndicator;
                                                } else {
                                                    cellContent = poolReward;
                                                }
                                                break;

                                            default:
                                                return null;
                                        }

                                        return (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                sx={{
                                                    borderRight: 1,
                                                    borderColor: "divider",
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                    "&:last-child": {
                                                        borderRight: 0,
                                                    },
                                                }}
                                            >
                                                {cellContent}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
