import { FC, createContext } from "react";
import { Config } from "../utils/config";

export interface AppContextType {
    Fetcher: any;
}

const config: AppContextType = {
    Fetcher: Config.fetcher,
};

export const AppContext = createContext<AppContextType>(config);

export const AppContextProvider: FC = ({ children }) => {
    return <AppContext.Provider value={config}>{children}</AppContext.Provider>;
};
