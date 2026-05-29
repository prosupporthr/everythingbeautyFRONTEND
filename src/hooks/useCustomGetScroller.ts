import {
    useEffect,
    useMemo,
    useState,
    useRef,
    useCallback,
} from "react";

import { useFetchData } from "@/hooks/useFetchData";
import { Socket } from "@/helper/utils/socket-io";

interface UseInfiniteScrollerOptions<T> {
    queryKeyBase: string;
    endpoint: string;
    params?: Record<string, any>;
    limit?: number;
    enable?: boolean;
    uniqueKey?: keyof T;
    socketEvent?: string;
    enableSocket?: boolean;
}

export function useInfiniteScroller<T>({
    queryKeyBase,
    endpoint,
    params = {},
    limit = 10,
    enable = true,
    uniqueKey = "_id" as keyof T,
    socketEvent,
    enableSocket = false,
}: UseInfiniteScrollerOptions<T>) {
    /* ---------------- STATE ---------------- */
    const [page, setPage] = useState(1);
    const [items, setItems] = useState<T[]>([]);
    const [hasNextPage, setHasNextPage] = useState(true);

    /* ---------------- REFS ---------------- */
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const hasNextPageRef = useRef(hasNextPage);
    hasNextPageRef.current = hasNextPage;
    const isFetchingRef = useRef(false);

    // Tracks the highest page the user has scrolled to
    const maxPageRef = useRef(1);

    // When invalidation fires, we reload pages 1..maxPage sequentially
    const reloadQueueRef = useRef<number[]>([]);
    const isReloadingRef = useRef(false);
    const reloadAccumulatorRef = useRef<T[]>([]);

    /* ---------------- QUERY KEY ---------------- */
    const serializedParams = useMemo(
        () => JSON.stringify(params),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(params)],
    );

    const queryKey = useMemo(
        () => [queryKeyBase, serializedParams, page],
        [queryKeyBase, serializedParams, page],
    );

    /* ---------------- FETCH ---------------- */
    const {
        data,
        isLoading,
        isFetching,
        refetch: _refetch,
    } = useFetchData<any>({
        endpoint,
        queryKey,
        params: {
            ...params,
            page,
            limit,
        },
        pagination: true,
        enable,
    });

    isFetchingRef.current = isFetching || isLoading;

    /* ---------------- REMOVE DUPLICATES ---------------- */
    const uniqueKeyRef = useRef(uniqueKey);
    uniqueKeyRef.current = uniqueKey;

    const removeDuplicates = useCallback((array: T[]) => {
        const map = new Map<any, T>();
        array.forEach((item) => {
            map.set(item[uniqueKeyRef.current], item);
        });
        return Array.from(map.values());
    }, []);

    /* ---------------- RESET WHEN PARAMS CHANGE ---------------- */
    const prevSerializedParams = useRef(serializedParams);
    useEffect(() => {
        if (prevSerializedParams.current === serializedParams) return;
        prevSerializedParams.current = serializedParams;

        // Full reset — params changed, start fresh
        maxPageRef.current = 1;
        reloadQueueRef.current = [];
        isReloadingRef.current = false;
        reloadAccumulatorRef.current = [];

        setPage(1);
        setItems([]);
        setHasNextPage(true);
    }, [serializedParams]);

    /* ---------------- DETECT INVALIDATION & START RELOAD ---------------- */
    useEffect(() => {
        // isLoading (not just isFetching) means the cache was invalidated/cleared
        // isFetching alone means a background refetch — we don't want to reset for that
        if (!isLoading) return;

        const pagesToReload = Array.from(
            { length: maxPageRef.current },
            (_, i) => i + 1,
        );

        // Queue all pages from 1 to maxPage for sequential reloading
        reloadQueueRef.current = pagesToReload;
        isReloadingRef.current = true;
        reloadAccumulatorRef.current = [];

        // Start from page 1
        setPage(1);
        setItems([]);
        setHasNextPage(true);
    }, [isLoading]);

    /* ---------------- MERGE PAGINATION ---------------- */
    useEffect(() => {
        if (isLoading || !data?.data) return;

        const total = Number(data?.total ?? 0);

        if (isReloadingRef.current) {
            // Accumulate pages silently during reload
            reloadAccumulatorRef.current = removeDuplicates([
                ...reloadAccumulatorRef.current,
                ...data.data,
            ]);

            // Dequeue next page
            reloadQueueRef.current.shift();
            const nextPage = reloadQueueRef.current[0];

            if (nextPage) {
                // More pages to reload — advance
                setPage(nextPage);
            } else {
                // All pages reloaded — flush accumulator to items
                isReloadingRef.current = false;
                const finalItems = reloadAccumulatorRef.current;
                reloadAccumulatorRef.current = [];
                setItems(finalItems);

                const loaded = maxPageRef.current * limit;
                setHasNextPage(loaded < total);
            }
        } else {
            // Normal pagination scroll
            setItems((prev) => {
                const merged =
                    page === 1
                        ? [...data.data]
                        : [...prev, ...data.data];
                return removeDuplicates(merged);
            });

            maxPageRef.current = Math.max(maxPageRef.current, page);

            const loaded = page * limit;
            setHasNextPage(loaded < total);
        }
    }, [data, isLoading, page, limit, removeDuplicates]);

    /* ---------------- INTERSECTION OBSERVER ---------------- */
    const ref = useCallback((node: HTMLElement | null) => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        if (!node) return;

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting &&
                    hasNextPageRef.current &&
                    !isFetchingRef.current &&
                    !isReloadingRef.current // don't paginate during reload
                ) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 0.5 },
        );

        observerRef.current.observe(node);
    }, []);

    /* ---------------- SOCKET REALTIME ---------------- */
    useEffect(() => {
        if (!enableSocket || !socketEvent) return;

        Socket.connect();

        const handleNewItem = (item: T) => {
            setItems((prev) => removeDuplicates([item, ...prev]));
            requestAnimationFrame(() => {
                scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            });
        };

        Socket.on(socketEvent, handleNewItem);
        return () => {
            Socket.off(socketEvent, handleNewItem);
        };
    }, [socketEvent, enableSocket, removeDuplicates]);

    /* ---------------- MANUAL REFETCH ---------------- */
    const refetch = useCallback(() => {
        const pagesToReload = Array.from(
            { length: maxPageRef.current },
            (_, i) => i + 1,
        );

        reloadQueueRef.current = pagesToReload;
        isReloadingRef.current = true;
        reloadAccumulatorRef.current = [];

        setPage(1);
        setItems([]);
        setHasNextPage(true);
        _refetch();
    }, [_refetch]);

    /* ---------------- RESET FUNCTION ---------------- */
    const reset = useCallback(() => {
        maxPageRef.current = 1;
        reloadQueueRef.current = [];
        isReloadingRef.current = false;
        reloadAccumulatorRef.current = [];

        setItems([]);
        setPage(1);
        setHasNextPage(true);
    }, []);

    return {
        items,
        page,
        setPage,
        hasNextPage,
        isLoading: isLoading && items.length === 0,
        isFetchingMore: isFetching && items.length > 0,
        scrollRef,
        ref,
        refetch,
        reset,
    };
}