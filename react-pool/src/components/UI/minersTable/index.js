// React
import { useState } from "react";

// Redux integration with actions
import { connect } from "react-redux";

// Redux functions
import PropTypes from "prop-types";
import { toggleModal } from "../../../utils/redux/actions/minerModal";

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
import Button from "@material-ui/core/Button";

// Third party
import { isMobile } from "react-device-detect";

// Styling
import cssStyles from "./minersTable.module.css";

// Columns
const columns = [
  { id: "miner", label: "Miner", align: "center", minWidth: 150 },
  {
    id: "currentDeadline",
    label: "Current Deadline",
    align: "center",
    minWidth: 50,
  },
  {
    id: "confirmedDeadline",
    label: "Confirmed Deadlines",
    minWidth: 50,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "pendingBalance",
    label: "Pending Balance",
    minWidth: 50,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "physicalCapacity",
    label: "Physical Capacity",
    minWidth: 50,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "effectiveCapacity",
    label: "Effective Capacity",
    minWidth: 50,
    align: "center",
    format: (value) => value.toFixed(2),
  },
  {
    id: "committedBalance",
    label: "Committed Balance",
    minWidth: 50,
    align: "center",
    format: (value) => value.toFixed(2),
  },
  {
    id: "poCPlus",
    label: `PoC+ Boost`,
    minWidth: 50,
    align: "center",
    format: (value) => value.toFixed(2),
  },
  {
    id: "sharedCapacity",
    label: `Shared Capacity`,
    minWidth: 50,
    align: "center",
    format: (value) => value.toFixed(2),
  },
  {
    id: "Software",
    label: `Software`,
    minWidth: 150,
    align: "center",
    format: (value) => value.toFixed(2),
  },
  {
    id: "Actions",
    label: `Actions`,
    minWidth: 150,
    align: "center",
    format: (value) => value.toFixed(2),
  },
];

// Custom styling for columns
const useStyles = makeStyles({
  root: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    background: "#1f1f1f",
  },
  container: {
    maxHeight: isMobile ? 500 : 600,
  },
});

const StickyHeadTable = (props) => {
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
                              Update your miner!
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
                              Waiting deadline
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
                            View more
                          </Button>
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

// Connect redux to component
const mapStateToProps = (state) => {
  return {
    // Functions
    toggleModal: PropTypes.func.isRequired,
  };
};

export default connect(mapStateToProps, { toggleModal })(StickyHeadTable);
