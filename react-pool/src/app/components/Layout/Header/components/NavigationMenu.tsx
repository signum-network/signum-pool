import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { NativeMenuLinks } from "../../links";
import { MenuOptions, MenuOptionLink } from "../../../MenuOptions";
import { openExternalUrl } from "../../../../utils/functions/stringMethods";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

export const NavigationMenu = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const visitPage = (linkData: any) => {
        if (linkData.newWindow) {
            return openExternalUrl(linkData.url);
        }

        navigate(linkData.url);
    };

    const links: MenuOptionLink[] = NativeMenuLinks.map((link) => ({
        icon: link.icon,
        label: t(link.label),
        onClick: () => {
            visitPage(link);
        },
    }));

    return (
        <Grid item>
            <MenuOptions links={links}>
                <Button
                    color={"inherit"}
                    sx={{
                        textTransform: "none",
                        px: 2,
                        fontSize: 15,
                        border: 1,
                        borderColor: "transparent",
                    }}
                >
                    {t("more")} ▾
                </Button>
            </MenuOptions>
        </Grid>
    );
};
