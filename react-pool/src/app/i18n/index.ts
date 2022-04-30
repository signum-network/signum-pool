import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

export type locales =
    | "en"
    | "es"
    | "fr"
    | "de"
    | "it"
    | "pt"
    | "tr"
    | "nl"
    | "pl"
    | "ru"
    | "zh";

export type languages = { locale: locales; label: string };

export const availableLanguages: languages[] = [
    { locale: "en", label: "English" },
    { locale: "es", label: "Español" },
    { locale: "fr", label: "Français" },
    { locale: "de", label: "Deutsch" },
    { locale: "it", label: "Italiano" },
    { locale: "pt", label: "Português" },
    { locale: "tr", label: "Türk" },
    { locale: "nl", label: "Dutch" },
    { locale: "pl", label: "Polskie" },
    { locale: "ru", label: "русский" },
    { locale: "zh", label: "普通话" },
];

export const fallbackLng: locales = "en";
export const supportedLngs: locales[] = [
    "en",
    "es",
    "fr",
    "de",
    "it",
    "pt",
    "tr",
    "nl",
    "pl",
    "ru",
    "zh",
];

(async () => {
    await i18n
        .use(initReactI18next)
        .use(LanguageDetector)
        .use(HttpApi)
        .init({
            supportedLngs,
            fallbackLng,
            ns: ["translation", "custom"],
            defaultNS: "translation",
            debug: false,
            detection: {
                order: ["cookie", "localStorage", "htmlTag"],
                caches: ["cookie", "localStorage"],
            },
            backend: {
                loadPath: "/locales/{{lng}}/{{ns}}.json",
                allowMultiLoading: true,
            },
            react: {
                useSuspense: true,
            },
        });
})();
