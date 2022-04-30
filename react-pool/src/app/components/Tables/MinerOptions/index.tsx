import { useTranslation } from "react-i18next";
import { TableContainer } from "../components/TableContainer";
import { LoadingData } from "../components/LoadingData";
import { SpecificRow } from "../components/SpecificRow";
import { useAppSelector } from "../../../../states/hooks";
import { selectPoolConfig } from "../../../../states/poolConfigState";
import { asRSAddress } from "../../../utils/functions/accountAddress";
import { CtaText } from "./components/CtaText";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

export const MinerOptions = () => {
    const { t } = useTranslation();
    const { isLoading, poolAccount, minimumPayoutAllowed } =
        useAppSelector(selectPoolConfig);

    return (
        <TableContainer>
            {isLoading && <LoadingData />}

            {!isLoading && (
                <Grid container item direction="column">
                    {!!poolAccount && (
                        <SpecificRow
                            title={t("configurationWithMessages")}
                            bigTitle
                        >
                            <Typography gutterBottom>
                                {t("configurationWithMessagesDescription", {
                                    blockAmount: 10,
                                })}
                            </Typography>

                            <CtaText
                                label={asRSAddress(poolAccount)}
                                textToCopy={poolAccount}
                                successMsg={t("addressCopied")}
                            />
                        </SpecificRow>
                    )}

                    <SpecificRow title={t("shareModel")} bigTitle>
                        <Typography gutterBottom>
                            {t("optionShareModelDescription")}
                        </Typography>

                        <CtaText
                            label="share 80"
                            textToCopy="share 80"
                            successMsg={t("messageCopied")}
                        />
                    </SpecificRow>

                    <SpecificRow title={t("donationPercent")} bigTitle>
                        <Typography gutterBottom>
                            {t("optionDonationPercentDescription")}
                        </Typography>

                        <CtaText
                            label="donate 5"
                            textToCopy="donate 5"
                            successMsg={t("messageCopied")}
                        />
                    </SpecificRow>

                    {!!minimumPayoutAllowed && (
                        <SpecificRow title={t("minimumPayout")} bigTitle>
                            <Typography gutterBottom>
                                {t("optionMinimumPayoutDescription", {
                                    minimumPayout: minimumPayoutAllowed,
                                })}
                            </Typography>

                            <CtaText
                                label="pay 100"
                                textToCopy="pay 100"
                                successMsg={t("messageCopied")}
                            />
                        </SpecificRow>
                    )}

                    <SpecificRow title={t("changeMultipleOptions")} bigTitle>
                        <Typography gutterBottom>
                            {t("optionchangeMultipleOptionsDescription")}
                        </Typography>

                        <CtaText
                            label="share 90 donate 15 pay 75"
                            textToCopy="share 90 donate 15 pay 75"
                            successMsg={t("messageCopied")}
                        />
                    </SpecificRow>

                    <SpecificRow title={t("notice_other")} bigTitle>
                        <Stack sx={{ width: "100%" }} spacing={2}>
                            <Alert severity="info">
                                {t("optionNoticeFirstDescription") + ", "}
                                <b>{t("optionNoticeSecondDescription")}</b>
                            </Alert>

                            <Alert severity="success">
                                {t("optionNoticeThirdDescription")}
                            </Alert>

                            <Alert severity="warning">
                                {t("optionNoticeWarningDescription")}
                            </Alert>
                        </Stack>
                    </SpecificRow>
                </Grid>
            )}
        </TableContainer>
    );
};
