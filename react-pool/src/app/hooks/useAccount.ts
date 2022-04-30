import { useAppSelector } from "../../states/hooks";
import { selectWalletPublicKey } from "../../states/appState";
import { Address } from "@signumjs/core";

export const useAccount = () => {
    const publicKey = useAppSelector(selectWalletPublicKey);
    let address: Address | null = null;

    try {
        address = publicKey ? Address.fromPublicKey(publicKey) : null;
    } catch (e) {
        address = null;
    }

    return {
        accountId: address?.getNumericId(),
        publicKey: address?.getPublicKey(),
    };
};
