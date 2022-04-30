import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

export const useExtensionWallet = () => {
    const { Wallet } = useContext(AppContext);
    return Wallet.Extension;
};
