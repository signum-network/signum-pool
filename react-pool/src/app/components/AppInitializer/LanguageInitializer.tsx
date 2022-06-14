import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supportedLngs } from "../../i18n";

import i18next from "i18next";

export const LanguageInitializer = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const languageInUrl = async () => {
        const foundLanguage = searchParams.get("lang");

        // @ts-ignore
        if (foundLanguage && supportedLngs.includes(foundLanguage)) {
            await i18next.changeLanguage(foundLanguage);
            setSearchParams({});
        }
    };

    useEffect(() => {
        languageInUrl();
    }, []);

    return null;
};
