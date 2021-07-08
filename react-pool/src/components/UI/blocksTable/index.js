// React
import { useState } from "react";

// React translations
import { useTranslation } from "react-i18next";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

// Extra
import { EXPLORERToUse } from "../../../utils/globalParameters";

// Third party
import { isMobile } from "react-device-detect";

// Styling
import cssStyles from "./blocksTable.module.css";

// Custom styling for columns
const useStyles = makeStyles({
  root: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    background: "#1f1f1f",
  },
  container: {
    maxHeight: isMobile ? "auto" : 600,
  },
});

const StickyHeadTable = (props) => {
  // Translations details
  const { t } = useTranslation();

  // Columns
  const nativeColumns = [
    { id: "height", label: t("height"), align: "center", minWidth: 100 },
    { id: "id", label: t("identification"), align: "center", minWidth: 100 },
    { id: "miner", label: t("winner"), align: "center", minWidth: 200 },
    { id: "reward", label: t("rewardAndFees"), align: "center", minWidth: 100 },
    { id: "poolShare", label: t("poolShare"), align: "center", minWidth: 100 },
  ];

  // Mobile columns
  const mobileColumns = [
    // Height column
    nativeColumns[0],

    // Winner
    nativeColumns[2],

    // Reward + Fees
    nativeColumns[3],

    // Pool Share
    nativeColumns[4],
  ];

  // Columns that website will use
  const columns = isMobile ? mobileColumns : nativeColumns;

  // Styling
  const classes = useStyles();

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 35 : 50);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Props
  const rows = props.data || [];

  return (
    <Paper className={classes.root} elevation={3}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  className={cssStyles.topColumns}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              // Dynamic pagination
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.miner || index}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];

                      // Normal info
                      let cellContent =
                        column.format && typeof value === "number"
                          ? column.format(value)
                          : value;

                      // Check if user is in "Minner column"
                      if (column.id === "miner") {
                        cellContent =
                          row.name &&
                          row.name !== null &&
                          row.name !== undefined
                            ? row.name
                            : row.generatorRS;

                        // Cell value
                        const cellValue = cellContent;

                        // Check if column is for "Miner name or address"
                        cellContent = (
                          <Typography
                            variant="body2"
                            title={t("viewMinerDetails")}
                            style={{
                              fontWeight: 500,
                              cursor: "pointer",
                              color: "white",
                              textDecoration: "underline",
                            }}
                            onClick={() => {
                              window.open(
                                `${EXPLORERToUse}?action=account&account=${row.generator}`,
                                "_blank"
                              );
                            }}
                          >
                            {cellValue}
                          </Typography>
                        );
                      }

                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className={cssStyles.bottomRows}
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

      {/* Pagination */}
      <TablePagination
        component="div"
        rowsPerPageOptions={[0]}
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        className={cssStyles.bottomPagination}
      />
    </Paper>
  );
};

export default StickyHeadTable;
