import { useTranslation } from "react-i18next";
import { deadlines } from "../index";
import { formatAmount } from "../../../../utils/functions/formatAmount";
import { colors } from "../../../../../enviroments";
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    Area,
    Tooltip,
    CartesianGrid,
} from "recharts";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface CustomTooltipProps {
    active?: boolean;
    payload?: any;
}

export const MinerDeadlinesGraph = ({
    boost,
    deadlines,
    heights,
}: deadlines) => {
    const { t } = useTranslation();
    const { graph } = colors;

    const mergedDeadlineData = heights.map((block, index) => {
        const deadlineFormatted =
            deadlines[index] > 1
                ? Math.floor(Math.log(deadlines[index] / boost[index]) * 43.79)
                : 0;

        return {
            height: block,
            deadlines: deadlineFormatted,
            deadlineText:
                deadlines[index] > 1
                    ? deadlineFormatted + ` ${t("second_other")}`
                    : 0,
        };
    });

    const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
        if (active)
            return (
                <Paper
                    sx={{ p: 2, border: 1, borderColor: "divider" }}
                    elevation={24}
                >
                    <Grid item>
                        <Typography
                            align="center"
                            variant="h6"
                            fontWeight={700}
                        >
                            {payload[0].payload.deadlineText}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="textSecondary"
                            align="center"
                        >
                            {`${t("blockHeight")} ` +
                                formatAmount(payload[0].payload.height)}
                        </Typography>
                    </Grid>
                </Paper>
            );

        return null;
    };

    if (!boost.length || !deadlines.length || !heights.length)
        return (
            <Typography variant="h5">{`${t("noDeadlineData")} ⚒️`}</Typography>
        );

    return (
        <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={mergedDeadlineData}>
                {/* Defs, vector gradient */}
                <defs>
                    <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0%" stopColor={graph} stopOpacity={0.4} />
                        <stop
                            offset="85%"
                            stopColor={graph}
                            stopOpacity={0.05}
                        />
                    </linearGradient>
                </defs>

                {/* Value */}
                <Area
                    dataKey="deadlines"
                    stroke={graph}
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
    );
};
