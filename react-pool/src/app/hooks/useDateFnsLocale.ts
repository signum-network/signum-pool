import { Locale } from "date-fns";
import { useTranslation } from "react-i18next";
import { SupportedFnsLocales } from "../i18n/SupportedFnsLocales";

export const useDateFnsLocale = (): Locale | undefined => {
    const { i18n } = useTranslation();
    const { resolvedLanguage } = i18n;

    return (
        // @ts-ignore
        SupportedFnsLocales.get(resolvedLanguage) ||
        SupportedFnsLocales.get("en")
    );
};
