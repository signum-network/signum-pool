import useTheme from "@mui/material/styles/useTheme";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

interface InfoCardProps {
    title: string;
    value: string;
    loading?: boolean;
}

export const InfoCard = ({ title, value, loading }: InfoCardProps) => {
    const theme = useTheme();

    const fontFamily = "Montserrat, sans-serif";

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Typography
                variant="h6"
                color="textSecondary"
                fontWeight={500}
                sx={{ fontFamily }}
            >
                {title}
            </Typography>

            {loading === true ? (
                <CircularProgress color="primary" size={25} />
            ) : (
                <Typography variant="h6" fontWeight={700} sx={{ fontFamily }}>
                    {value}
                </Typography>
            )}
        </Paper>
    );
};
