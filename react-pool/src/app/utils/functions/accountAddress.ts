import { isTestNet } from "../../../enviroments";
import { Address, AddressPrefix } from "@signumjs/core";

export const asAccountAddress = (accountId: string): Address => {
    const Prefix = isTestNet ? AddressPrefix.TestNet : AddressPrefix.MainNet;
    return Address.create(accountId, Prefix);
};

export const asRSAddress = (accountId: string): string => {
    return asAccountAddress(accountId).getReedSolomonAddress();
};
