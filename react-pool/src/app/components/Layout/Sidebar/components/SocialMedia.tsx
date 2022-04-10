import { useTranslation } from "react-i18next";
import { ListRender } from "./ListRender";
import { openExternalUrl } from "../../../../utils/functions/stringMethods";

import copy from "copy-to-clipboard";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PublicIcon from "@mui/icons-material/Public";
import TelegramIcon from "@mui/icons-material/Telegram";

export const SocialMedia = () => {
    const { t } = useTranslation();
    const currentWindows = window.location.href;

    const fbShare = () =>
        openExternalUrl(
            `https://www.facebook.com/sharer/sharer.php?u=${currentWindows}`
        );

    const telegramShare = () =>
        openExternalUrl(
            `https://t.me/share/url?url=${currentWindows}&text=${t(
                "checkOutThisSite"
            )} 🔥`
        );

    const twitterShare = () =>
        openExternalUrl(
            `https://twitter.com/intent/tweet?url=${currentWindows}&text=${t(
                "checkOutThisSite"
            )} 🔥`
        );

    const whatsAppShare = () =>
        openExternalUrl(
            `https://wa.me/?text=${t("checkOutThisSite")} ${
                window.location.href
            }`
        );

    const copyUrl = () => {
        copy(currentWindows);
        return alert(t("linkCopied"));
    };

    return (
        <Grid container>
            <Typography align="center" sx={{ my: 2 }} width="100%" variant="h6">
                {t("shareWithCommunity")}
            </Typography>

            <List sx={{ width: "100%" }}>
                <ListRender
                    label="Telegram"
                    icon={<TelegramIcon />}
                    onClick={telegramShare}
                />

                <ListRender
                    label="Twitter"
                    icon={<TwitterIcon />}
                    onClick={twitterShare}
                />

                <ListRender
                    label="Facebook"
                    icon={<FacebookIcon />}
                    onClick={fbShare}
                />

                <ListRender
                    label="WhatsApp"
                    icon={<WhatsAppIcon />}
                    onClick={whatsAppShare}
                />

                <ListRender
                    label={t("copyURL")}
                    icon={<PublicIcon />}
                    onClick={copyUrl}
                />
            </List>
        </Grid>
    );
};
