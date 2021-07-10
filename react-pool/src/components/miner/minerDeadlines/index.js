// React
import { Fragment, useState, useEffect } from "react";

// React translations
import { useTranslation } from "react-i18next";

// Redux integration with actions
import { connect } from "react-redux";

// Material-ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

// Styling
import styles from "./minerDeadlines.module.css";

// React charts
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Graph color
import { DEFAULTGRAPHCOLORTOUSE } from "../../../utils/globalColor";

// Extra
import { thousands_separators } from "../../../utils/functions/normal";

const MinerDeadLinesGraph = (props) => {
  // Translations details
  const { t } = useTranslation();

  // Get props
  const { bookMarkedMinerData } = props;
  const { deadlineData, loadingData } = bookMarkedMinerData;

  // Manage state
  const [isLoading, updateLoadingStatus] = useState(true);
  const [minerMiningData, updateMinerMiningData] = useState([]);

  // Merge miner data
  const mergeDeadlinesWithHeight = async (deadlineData) => {
    // Classify deadlines and height
    const { deadlines, heights, boost } = deadlineData;

    let newArray = [];

    // Format

    // Iterate through every height
    await heights.map((block, index) => {
      // Format deadline text
      let deadlineFormatted =
        deadlines[index] > 1
          ? parseInt(Math.log(deadlines[index] / boost[index]) * 43.79)
          : 0;

      newArray.push({
        height: block,
        deadlines: deadlineFormatted,
        deadlineText:
          deadlines[index] > 1 ? deadlineFormatted + ` ${t("seconds")}` : 0,
      });
    });

    // Migrate data
    await updateMinerMiningData(newArray);

    //  Stop loading
    await updateLoadingStatus(false);
  };

  // Check if data is loaded
  useEffect(() => {
    if (loadingData === false && deadlineData && deadlineData !== null) {
      mergeDeadlinesWithHeight(deadlineData);
    }
  }, [loadingData]);

  // Custom tooltip
  const CustomTooltip = (props) => {
    const { active, payload, label } = props;

    if (active) {
      return (
        <Grid item className={styles.CustomTooltip}>
          <Typography align="center" variant="h6">
            {payload[0].payload.deadlineText}
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            {`${t("blockHeight")} ` +
              thousands_separators(payload[0].payload.height)}
          </Typography>
        </Grid>
      );
    }

    return null;
  };

  // Conditional rendering

  // Check if the redux store has not data about past deadlines
  if (!deadlineData || deadlineData === null) {
    return (
      <Typography variant="h6" className={styles.noDataText}>
        {`${t("noDeadlineData")} ⚒️`}
      </Typography>
    );
  }

  // Check if data is still loading
  if (isLoading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ margin: "1em auto" }}
      >
        <CircularProgress color="primary" size={50} />
      </Grid>
    );
  }

  return (
    <Fragment>
      <ResponsiveContainer width="100%" height={props.chartHeight}>
        <AreaChart data={minerMiningData}>
          {/* Defs, vector gradient */}
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={DEFAULTGRAPHCOLORTOUSE}
                stopOpacity={0.4}
              />
              <stop
                offset="85%"
                stopColor={DEFAULTGRAPHCOLORTOUSE}
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>

          {/* Value */}
          <Area
            dataKey="deadlines"
            stroke={DEFAULTGRAPHCOLORTOUSE}
            fill="url(#colorGradient)"
          />

          {/* X axis */}
          <XAxis dataKey="height" axisLine={false} />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Cartesian Grid */}
          <CartesianGrid opacity={0.05} vertical={false} />
        </AreaChart>
      </ResponsiveContainer>
    </Fragment>
  );
};

// Connect redux to component
const mapStateToProps = (state) => {
  return {
    // Data
    bookMarkedMinerData: state.bookMarkedMiner,
  };
};

export default connect(mapStateToProps, {})(MinerDeadLinesGraph);
