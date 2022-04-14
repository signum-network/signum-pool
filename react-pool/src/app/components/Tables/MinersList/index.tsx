/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";
import { useAppSelector } from "../../../../states/hooks";
import { selectMiners } from "../../../../states/minersState";
import { selectPoolConfig } from "../../../../states/poolConfigState";
import { formatTime } from "../../../utils/functions/formatTime";
import { formatCapacity } from "../../../utils/functions/formatCapacity";
import { asRSAddress } from "../../../utils/functions/accountAddress";
import { columns } from "./columns";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";

type showAllMiners = "yes" | "no";
const showAllMinersKey = "showAllMiners";

interface MinersListProps {
    showTopMiners?: boolean;
}

export const MinersList = ({ showTopMiners = false }: MinersListProps) => {
    const { t } = useTranslation();
    const miningData = useAppSelector(selectMiners);
    const { blocksForAverage, processLag } = useAppSelector(selectPoolConfig);
    const {
        isLoading,
        miners,
        totalPhysicalCapacity,
        totalSharedCapacity,
        totalEffectiveCapacity,
    } = miningData;

    const maxSubmissions = blocksForAverage + processLag;

    const defaultValue = localStorage.getItem(showAllMinersKey) || "no";

    const [canSeeAllMiners, setCanSeeAllMiners] =
        // @ts-ignore
        useState<showAllMiners>(defaultValue);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 50 : 100);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const switchSeeAllMinersStatus = () => {
        const finalOption = canShowAllMiners ? "no" : "yes";
        setCanSeeAllMiners(finalOption);
        localStorage.setItem(showAllMinersKey, finalOption);
    };

    const canShowAllMiners = canSeeAllMiners === "yes";

    const rows = showTopMiners ? miners.slice(0, 10) : miners;

    if (isLoading)
        return <Skeleton width="100%" height={100} animation="wave" />;

    return (
        <Paper
            elevation={3}
            sx={{
                mt: 2,
                overflow: "hidden",
            }}
        >
            <TableContainer>
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
                                    TBD
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            // Dynamic pagination
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((miner, index) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={index}
                                    >
                                        {columns.map((column) => {
                                            // Get specific miner data
                                            // @ts-ignore
                                            const value = miner[column.id];

                                            let cellContent = null;

                                            switch (column.id) {
                                                case "miner":
                                                    cellContent = (
                                                        <Tooltip
                                                            placement="right"
                                                            title={
                                                                t(
                                                                    "viewMinerDetails"
                                                                ) || ""
                                                            }
                                                            arrow
                                                        >
                                                            <Typography
                                                                fontWeight="inherit"
                                                                fontSize="inherit"
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    textDecoration:
                                                                        "underline",
                                                                }}
                                                            >
                                                                {miner.name ||
                                                                    asRSAddress(
                                                                        miner.accountId
                                                                    )}
                                                            </Typography>
                                                        </Tooltip>
                                                    );
                                                    break;

                                                case "currentDeadline":
                                                    const currentDeadlineData =
                                                        formatTime(
                                                            // @ts-ignore
                                                            miner.currentRoundBestDeadline
                                                        );

                                                    if (
                                                        currentDeadlineData ===
                                                        "waiting..."
                                                    ) {
                                                        cellContent = (
                                                            <Tooltip
                                                                title={
                                                                    t(
                                                                        "waiting"
                                                                    ) || ""
                                                                }
                                                                arrow
                                                            >
                                                                <CircularProgress
                                                                    size={22}
                                                                />
                                                            </Tooltip>
                                                        );
                                                    } else {
                                                        cellContent =
                                                            currentDeadlineData;
                                                    }

                                                    break;

                                                case "confirmedDeadline":
                                                    cellContent =
                                                        miner.confirmedDeadlines +
                                                        "/" +
                                                        maxSubmissions;
                                                    break;

                                                case "physicalCapacity":
                                                    cellContent =
                                                        formatCapacity(
                                                            // @ts-ignore
                                                            miner.physicalCapacity
                                                        );
                                                    break;

                                                case "effectiveCapacity":
                                                    cellContent =
                                                        formatCapacity(
                                                            // @ts-ignore
                                                            miner.effectiveCapacity
                                                        );
                                                    break;

                                                case "sharedCapacity":
                                                    cellContent =
                                                        formatCapacity(
                                                            // @ts-ignore
                                                            miner.sharedCapacity
                                                        );
                                                    break;

                                                case "shareModel":
                                                    cellContent = value + "%";
                                                    break;

                                                case "committedBalance":
                                                    cellContent =
                                                        miner.totalCommitment;
                                                    break;

                                                case "pocBoost":
                                                    cellContent = miner.pocBoost
                                                        ? miner.pocBoost.toFixed(
                                                              3
                                                          )
                                                        : 0;

                                                    break;

                                                default:
                                                    cellContent = value;
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

            <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
            >
                {!isMobile && rows.length > 100 && (
                    <Grid item>
                        <Button
                            variant="outlined"
                            sx={{ mr: 2, px: 4, textTransform: "none" }}
                            onClick={switchSeeAllMinersStatus}
                        >
                            {!canShowAllMiners
                                ? t("showAllMiners")
                                : t("stopShowAllMiners")}
                        </Button>
                    </Grid>
                )}

                <Grid item>
                    <TablePagination
                        component="div"
                        rowsPerPageOptions={[0]}
                        count={rows.length}
                        rowsPerPage={canShowAllMiners ? 500 : rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};
