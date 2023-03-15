import { FC, createContext } from "react";
import { DeeplinkableWallet, GenericExtensionWallet } from "@signumjs/wallets";
import { Config } from "../utils/config";
import {
    isDevelopmentMode,
    isTestNet,
    dAppName,
    NetworkName,
    explorerUrl,
} from "../../enviroments";

// XT Wallet usage
const poolWebUrl = new URL(window.location.href);
const isUnsafeWebsite =
    !isDevelopmentMode &&
    poolWebUrl.protocol !== "https:" &&
    poolWebUrl.hostname !== "localhost";

export interface AppContextType {
    Fetcher: any;
    DAppName: string;
    Wallet: {
        Extension: GenericExtensionWallet;
        Deeplink: DeeplinkableWallet;
    };
    Ledger: {
        IsTestnet: boolean;
        Network: string;
        Explorer: string;
    };
    isUnsafeWebsite: boolean;
}

const config: AppContextType = {
    Fetcher: Config.fetcher,
    Wallet: {
        Extension: new GenericExtensionWallet(),
        Deeplink: new DeeplinkableWallet({ openInBrowser: true }),
    },
    DAppName: dAppName,
    Ledger: {
        IsTestnet: isTestNet,
        Network: NetworkName,
        Explorer: explorerUrl,
    },
    isUnsafeWebsite,
};

export const AppContext = createContext<AppContextType>(config);

export const AppContextProvider: FC = ({ children }) => {
    return <AppContext.Provider value={config}>{children}</AppContext.Provider>;
};
