import { Locale } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { locales } from "./index";

export const SupportedFnsLocales = new Map<locales, Locale>([
    ["en", enUS],
    ["es", es],
]);
