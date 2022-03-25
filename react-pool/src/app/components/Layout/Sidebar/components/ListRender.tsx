import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HelpIcon from "@mui/icons-material/Help";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface ListRenderProps {
    onClick: any;
    icon: any;
    label: string;
    showArrow?: boolean;
}

export const ListRender = ({
    onClick,
    icon,
    label,
    showArrow = true,
}: ListRenderProps) => {
    return (
        <ListItem
            button
            onClick={onClick}
            sx={{ width: "100%", py: 2, borderRadius: 2 }}
        >
            <ListItemIcon style={{ minWidth: "37px" }}>
                {icon || <HelpIcon />}
            </ListItemIcon>

            <ListItemText primary={label} />

            {showArrow && <ChevronRightIcon />}
        </ListItem>
    );
};
