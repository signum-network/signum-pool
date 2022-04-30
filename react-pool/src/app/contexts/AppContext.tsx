import { FC, createContext } from "react";
import { DeeplinkableWallet, GenericExtensionWallet } from "@signumjs/wallets";
import { Config } from "../utils/config";
import {
    isTestNet,
    dAppName,
    dAppNetwork,
    explorerUrl,
} from "../../enviroments";

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
        Network: dAppNetwork,
        Explorer: explorerUrl,
    },
};

export const AppContext = createContext<AppContextType>(config);

export const AppContextProvider: FC = ({ children }) => {
    return <AppContext.Provider value={config}>{children}</AppContext.Provider>;
};
