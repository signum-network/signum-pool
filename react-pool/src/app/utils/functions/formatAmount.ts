import { locales } from "../../i18n";
import { SupportedAmountLocales } from "../../i18n/SupportedAmountLocales";
import { isClientSide } from "./isClientSide";

export const formatAmount = (
    input: string | number | undefined,
    shortHand: boolean = false
) => {
    if (input === 0 || input === "0" || input === undefined) return "0";
    if (typeof input === "string") input = parseFloat(input);
    let selectedLocale: locales = "en";

    if (isClientSide()) {
        // @ts-ignore
        selectedLocale = localStorage.getItem("i18nextLng") || "en";
    }

    if (shortHand) {
        return input.toLocaleString("en", {
            notation: "compact",
        });
    }

    return input.toLocaleString(SupportedAmountLocales.get(selectedLocale));
};
