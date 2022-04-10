import { formatAmount } from "./formatAmount";

export const formatCapacity = (capacity: string) => {
    const capacityFloat = parseFloat(capacity);

    if (capacityFloat > 1024)
        return formatAmount((capacityFloat / 1024).toFixed(3)) + " PiB";

    return formatAmount(parseFloat(capacity).toFixed(3)) + " TiB";
};
