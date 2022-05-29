import { Locale } from "date-fns";
import {
    enUS,
    es,
    fr,
    de,
    it,
    pt,
    tr,
    nl,
    pl,
    ru,
    zhHK,
} from "date-fns/locale";
import { locales } from "./index";

export const SupportedFnsLocales = new Map<locales, Locale>([
    ["en", enUS],
    ["es", es],
    ["fr", fr],
    ["de", de],
    ["it", it],
    ["pt", pt],
    ["tr", tr],
    ["nl", nl],
    ["pl", pl],
    ["ru", ru],
    ["zh", zhHK],
]);
