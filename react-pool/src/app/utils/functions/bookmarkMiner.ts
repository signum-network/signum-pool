import { isClientSide } from "./isClientSide";

const localStorageBookmarkKey = "bookmark";

export const getBookmarkedMiner = (): string => {
    if (!isClientSide()) return "";

    const storedValue = localStorage.getItem(localStorageBookmarkKey);
    if (!storedValue) return "";

    return storedValue;
};

export const saveBookmarkedMiner = (miner: string) => {
    localStorage.setItem(localStorageBookmarkKey, miner);
};
