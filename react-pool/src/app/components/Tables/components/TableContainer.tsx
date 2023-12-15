import Paper from "@mui/material/Paper";

interface TableContainerProps {
    children: React.ReactNode;
}

export const TableContainer = ({ children }: TableContainerProps) => (
    <Paper variant="outlined" sx={{ width: "100%", p: 2, mb: 2 }}>
        {children}
    </Paper>
);
