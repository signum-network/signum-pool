import { useMemo } from "react";
import { useAppSelector } from "../../states/hooks";
import { selectWalletNodeHost } from "../../states/appState";
import { LedgerClientFactory } from "@signumjs/core";

export const useLedger = () => {
    const nodeHost = useAppSelector(selectWalletNodeHost);

    return useMemo(() => {
        if (!nodeHost) return null;
        console.debug("Connected to new host", nodeHost);
        return LedgerClientFactory.createClient({ nodeHost });
    }, [nodeHost]);
};
