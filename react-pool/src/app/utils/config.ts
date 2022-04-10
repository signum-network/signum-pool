const fetcher = async <JSON = any>(
    input: RequestInfo,
    init?: RequestInit
): Promise<JSON | null> => {
    try {
        const res = await fetch(input, init);
        if (res.status >= 200 && res.status < 300) {
            return res.json();
        }
    } catch (e) {}
    return null;
};

export const Config = {
    fetcher,
};
