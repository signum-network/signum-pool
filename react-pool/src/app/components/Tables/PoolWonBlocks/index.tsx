/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../../hooks/useAppContext";
import { TableContainer as CustomTableContainer } from "../components/TableContainer";
import { LoadingData } from "../components/LoadingData";
import { poolNodeUrl } from "../../../../enviroments";
import { formatAmount } from "../../../utils/functions/formatAmount";
import { columns } from "./columns";

import useSWR from "swr";
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

    const defaultSWRSettings = {
        refreshInterval: 60000,
        dedupingInterval: 50000,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    };

    const { data, isValidating, error } = useSWR(
        poolNodeUrl + "api/getWonBlocks",
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
                                    }}
                                    css={css`
                                        :last-child {
                                            border-right: 0 !important;
                                        }
                                    `}
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
                                                cellContent = formatAmount(
                                                    block.height
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
                                                cellContent = block.generator;
                                                break;

                                            case "id":
                                                cellContent = block.id;
                                                break;

                                            case "poolShare":
                                                const poolShare =
                                                    block.poolShare;

                                                if (
                                                    poolShare ===
                                                    "Processing..."
                                                ) {
                                                    cellContent =
                                                        processingIndicator;
                                                } else {
                                                    cellContent = poolShare;
                                                }

                                                break;

                                            default:
                                                // cellContent = value;
                                                break;
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
                                                }}
                                                css={css`
                                                    :last-child {
                                                        border-right: 0 !important;
                                                    }
                                                `}
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
