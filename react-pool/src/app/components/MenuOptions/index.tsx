import { useState } from "react";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";

export type MenuOptionLink = { icon?: any; label: string; onClick: any };

interface MenuOptionsProps {
    links: MenuOptionLink[];
    children?: any;
}

export const MenuOptions = ({ links, children }: MenuOptionsProps) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Grid item>
            <Grid item container onClick={handleClick}>
                {children}
            </Grid>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {links.map((item) => (
                    <MenuItem
                        key={item.label}
                        onClick={() => {
                            item.onClick();
                            handleClose();
                        }}
                    >
                        {item.icon ? (
                            <ListItemIcon>{item.icon}</ListItemIcon>
                        ) : null}
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </Grid>
    );
};
