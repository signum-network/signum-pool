import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ListRender } from "./ListRender";
import { MenuOptionLink } from "../../../MenuOptions";
import { useAppDispatch } from "../../../../../states/hooks";
import { actions } from "../../../../../states/appState";
import { Links, NativeMenuLinks } from "../../links";
import { openExternalUrl } from "../../../../utils/functions/stringMethods";
import { extraLinks } from "../../../../utils/extraLinks";

import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

export const NavigationLinks = () => {
    const { t } = useTranslation();
    const { setIsOpenSidebar } = actions;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const visitPage = (link: any, newWindow: boolean = false) => {
        closeSideDrawer();

        if (link.newWindow || newWindow) {
            return openExternalUrl(link.url);
        }

        navigate(link.url);
    };

    const defaultLinks: MenuOptionLink[] = [...Links, ...NativeMenuLinks].map(
        (link) => ({
            icon: link.icon,
            label: t(link.label),
            onClick: () => {
                visitPage(link);
            },
        })
    );

    const formatedExtraLinks = extraLinks.map((link: any) => ({
        icon: <ControlPointIcon />,
        label: link.label,
        onClick: () => {
            visitPage(link, link.newTab);
        },
    }));

    const linksMergedWithAdditionals = [...defaultLinks, ...formatedExtraLinks];

    const closeSideDrawer = () => dispatch(setIsOpenSidebar(false));

    return (
        <Grid container>
            <List sx={{ width: "100%" }}>
                {linksMergedWithAdditionals.map((link, key) => (
                    <ListRender
                        key={key}
                        label={link.label}
                        icon={link.icon}
                        onClick={link.onClick}
                    />
                ))}
            </List>
        </Grid>
    );
};
