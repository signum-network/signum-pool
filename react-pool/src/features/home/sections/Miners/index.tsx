import { useTranslation } from "react-i18next";
import { useState } from "react";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

type minersList = "yes" | "no";
const minersListKey = "showMinersList";

export const Miners = () => {
    const { t } = useTranslation();

    const defaultValue = localStorage.getItem(minersListKey) || "no";

    const [canSeeList, setCanSeeList] =
        // @ts-ignore
        useState<minersList>(defaultValue);

    const switchStatus = () => {
        const finalOption = isOpen ? "no" : "yes";
        setCanSeeList(finalOption);
        localStorage.setItem(minersListKey, finalOption);
    };

    const isOpen = canSeeList === "yes";

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
        >
            <Button
                color="primary"
                fullWidth
                variant="contained"
                sx={{
                    color: "white",
                    maxWidth: 450,
                    mx: "auto",
                    textTransform: "none",
                }}
                onClick={switchStatus}
                startIcon={
                    <ArrowCircleDownIcon
                        sx={{
                            transition: "0.3s all ease-in",
                            transform: isOpen ? "rotate(-180deg)" : undefined,
                        }}
                    />
                }
            >
                {!isOpen ? t("showMinerList") : t("hideMinerList")}
            </Button>

            <Collapse in={isOpen}>
                <h1>SHOWING CONTENT</h1>
            </Collapse>
        </Grid>
    );
};
