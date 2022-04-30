import { isClientSide } from "./isClientSide";

export const truncateText = (value: string, length: number) => {
    if (value.length > length) {
        return value.substring(0, length) + "...";
    }

    return value;
};

export const openExternalUrl = (url: string): void => {
    if (!isClientSide()) {
        return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
};
