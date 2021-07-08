// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// Styling
import styles from "./outlinedTable.module.css";

// Components
import Spinner from "../Spinner/index";

// Miner past deadlines graph
import MinerDeadLinesGraph from "../../miner/minerDeadlines/index";

const OutLinedTable = (props) => {
  const { isLoading, data, notFoundLabel, onClickLastItem } = props;

  let content = null;

  // Check if user has not found any results
  if ((!data || (!data.length && data.length === 0)) && isLoading === false) {
    content = (
      <Typography
        variant="h6"
        color="textSecondary"
        align="center"
        style={{ width: "100%", fontSize: 18 }}
      >
        {notFoundLabel}
      </Typography>
    );
  } else if (data && data.length && data.length > 0) {
    content = data.map((item, key) => {
      // Check if item has value
      if (!item || !item.type) {
        return null;
      }

      // Render type of data
      switch (item.type) {
        // Only info row
        case "info":
          // Check if user has dynamic Onlick
          const onClickAction =
            item.onClick && item.onClick !== null && item.onClick !== undefined
              ? item.onClick
              : null;

          return (
            <Grid container item className={styles.tableItem} key={key}>
              <Grid
                item
                className={styles.tableItemLeftSide}
                style={{
                  width: props.fWidth,
                  cursor: onClickAction ? "pointer" : null,
                }}
                onClick={onClickAction}
              >
                <Typography>{item.title}</Typography>
                {item.sTitle && item.sTitle.trim() !== "" ? (
                  <Typography component="span">{item.sTitle}</Typography>
                ) : null}
              </Grid>
              <Grid
                item
                className={styles.tableItemRightSide}
                style={{ width: props.sWidth }}
              >
                <Typography>{item.value}</Typography>
              </Grid>
            </Grid>
          );

        // Last row action
        case "action":
          return (
            <Grid item className={styles.tableItem} key={key}>
              <Button className={styles.optionBtn} onClick={onClickLastItem}>
                {item.label}
              </Button>
            </Grid>
          );

        // Custom row
        case "BookmarkedMinerDeadlines":
          return (
            <Grid
              container
              item
              className={styles.tableItem}
              key={key}
              wrap="wrap"
              direction="column"
            >
              <Grid
                item
                className={styles.tableItemLeftSide}
                style={{ width: "100%" }}
              >
                <Typography>{item.title}</Typography>
              </Grid>

              {/* Miners past deadlines graph */}
              <Grid item style={{ width: "100%" }}>
                <MinerDeadLinesGraph chartHeight={250} />
              </Grid>
            </Grid>
          );

        default:
          return null;
      }
    });
  }

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      className={styles.outlinedTable}
    >
      {isLoading === true ? <Spinner /> : content}
    </Grid>
  );
};

// Type of data
// info:   title, sTitle, value, fWidth, sWidth
// action: label, onClick

export default OutLinedTable;
