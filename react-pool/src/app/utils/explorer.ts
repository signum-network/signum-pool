import { explorerUrl } from "../../enviroments";
import { openExternalUrl } from "./functions/stringMethods";

export const getExplorerUrl = (url: string): string => {
    if (url.startsWith("/")) {
        url = url.slice(1);
    }

    return explorerUrl + "/" + url;
};

// Pre-defined URLs

export const viewAccountInExplorer = (accountId: string): void => {
    openExternalUrl(getExplorerUrl("/address/" + accountId));
};

export const viewBlockInExplorer = (blockHeight: string): void => {
    openExternalUrl(getExplorerUrl("/block/" + blockHeight));
};
