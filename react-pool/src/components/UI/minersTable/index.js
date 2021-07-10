// React
import { useState } from "react";

// React translations
import { useTranslation } from "react-i18next";

// Redux integration with actions
import { connect } from "react-redux";

// Redux functions
import PropTypes from "prop-types";
import { toggleModal } from "../../../utils/redux/actions/minerModal";

// Material UI
import { makeStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";

// Third party
import { isMobile } from "react-device-detect";

// Styling
import cssStyles from "./minersTable.module.css";

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
    { id: "miner", align: "center", minWidth: 150 },

    {
      id: "currentDeadline",
      align: "center",
      minWidth: 50,
    },

    {
      id: "confirmedDeadline",
      minWidth: 50,
      align: "center",
      format: (value) => value.toLocaleString("en-US"),
    },

    {
      id: "pendingBalance",
      minWidth: 50,
      align: "center",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "physicalCapacity",
      minWidth: 50,
      align: "center",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "effectiveCapacity",
      minWidth: 50,
      align: "center",
      format: (value) => value.toFixed(2),
    },
    {
      id: "committedBalance",
      minWidth: 50,
      align: "center",
      format: (value) => value.toFixed(2),
    },
    {
      id: "poCPlus",
      minWidth: 50,
      align: "center",
      format: (value) => value.toFixed(2),
    },
    {
      id: "sharedCapacity",
      minWidth: 50,
      align: "center",
      format: (value) => value.toFixed(2),
    },
    {
      id: "Software",
      minWidth: 150,
      align: "center",
      format: (value) => value.toFixed(2),
    },
    {
      id: "Actions",
      minWidth: 150,
      align: "center",
      format: (value) => value.toFixed(2),
    },
  ];

  // Mobile columns
  const mobileColumns = [
    // Miner column
    nativeColumns[0],

    // Pending balance
    nativeColumns[3],

    // Physical Capacity
    nativeColumns[4],

    // Confirmed deadlines
    nativeColumns[2],

    // View more
    nativeColumns[10],
  ];

  // Columns that website will use
  const columns = isMobile ? mobileColumns : nativeColumns;

  // Styling
  const classes = useStyles();

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Redux props
  const { toggleModal } = props;

  // Miner data modal opener
  const minerShowData = (data) => {
    toggleModal(data);
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
                  {t(column.id)}
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

                      // Check if column is software
                      if (column.id === "Software") {
                        // Check if miner is updated
                        if (
                          value &&
                          value.trim() !== "" &&
                          (value.toLowerCase().includes("unknown") ||
                            value.toLowerCase().includes("update"))
                        ) {
                          cellContent = (
                            <a
                              href="https://signum.network/mining.html"
                              target="_blank"
                              rel="noreferrer"
                              className={cssStyles.updateAlert}
                            >
                              {t("updateSoftware")}
                            </a>
                          );
                        } else if (
                          value &&
                          value.trim() !== "" &&
                          value.trim().includes("...")
                        ) {
                          // Check if miner is waiting a deadline
                          cellContent = (
                            <span className={cssStyles.deadLineAlert}>
                              {t("waitingDeadline")}
                            </span>
                          );
                        }
                      } else if (column.id === "Actions") {
                        // Check if column is for "Button view more"
                        cellContent = (
                          <Button
                            fullWidth
                            className={cssStyles.viewMoreBtn}
                            onClick={() => minerShowData(row.data)}
                          >
                            {t("viewMore")}
                          </Button>
                        );
                      } else if (column.id === "miner") {
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
                            onClick={() => minerShowData(row.data)}
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
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className={cssStyles.bottomPagination}
      />
    </Paper>
  );
};

// Connect redux to component
const mapStateToProps = (state) => {
  return {
    // Functions
    toggleModal: PropTypes.func.isRequired,
  };
};

export default connect(mapStateToProps, { toggleModal })(StickyHeadTable);
