import { useContext } from "react";
import { AppContext, AppContextType } from "../contexts/AppContext";

export const useAppContext = (): AppContextType => {
    return useContext(AppContext);
};
