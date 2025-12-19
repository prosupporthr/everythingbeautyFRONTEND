
type StorageType = "local" | "session";

interface StorageOptions {
    storage?: StorageType;
    fallback?: string | null;
}

export const getStorageItem = (
    key: string,
    options: StorageOptions = {}
): string | null => {
    const {
        storage = "session",
        fallback = null,
    } = options;

    if (typeof window === "undefined") return fallback;

    try {
        const store =
            storage === "local" ? localStorage.getItem(key) : sessionStorage.getItem(key);

        return store ?? fallback;
    } catch {
        return fallback;
    }
};
