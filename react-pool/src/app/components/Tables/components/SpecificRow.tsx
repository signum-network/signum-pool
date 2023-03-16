import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface SpecificRowProps {
    title: string;
    bigTitle?: boolean;
    secondTitle?: string;
    value?: string | number;
    onClick?: () => void;
    children?: Element | React.ReactNode;
}

export const SpecificRow = ({
    title,
    bigTitle,
    secondTitle,
    value,
    onClick = undefined,
    children,
}: SpecificRowProps) => {
    return (
        <Grid
            container
            xs={12}
            item
            direction="row"
            alignItems="flex-start"
            sx={{
                pt: 2,
                pb: 1,
                borderBottom: 1,
                borderColor: "divider",
                "&:last-child": { border: 0 },
            }}
        >
            <Grid
                item
                xs={12}
                md={4}
                mb={1}
                sx={{ flexDirection: { xs: "row", md: "column" } }}
            >
                <Typography
                    variant={bigTitle ? "h6" : "body1"}
                    sx={{
                        display: { xs: "inline-block", md: "flex" },
                        minWidth: { xs: 300, lg: 600 },
                    }}
                >
                    {title}
                </Typography>

                {secondTitle && (
                    <Typography
                        variant="body2"
                        color="primary"
                        sx={{
                            ml: { xs: 1, md: 0 },
                            display: { xs: "inline-block", md: "flex" },
                        }}
                    >
                        {secondTitle}
                    </Typography>
                )}
            </Grid>

            {children ? (
                <Grid item xs={12} mb={1}>
                    {children}
                </Grid>
            ) : (
                <Grid item xs={12} md={8} mb={1}>
                    <Typography
                        fontWeight={700}
                        onClick={onClick}
                        sx={{
                            cursor: onClick ? "pointer" : undefined,
                        }}
                    >
                        {value}
                    </Typography>
                </Grid>
            )}
        </Grid>
    );
};
