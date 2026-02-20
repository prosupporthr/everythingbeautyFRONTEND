import { useEffect, useMemo, useState, useRef, useCallback } from "react";
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
    limit = 5,
    enable = true,
    uniqueKey = "_id" as keyof T,
    socketEvent,
    enableSocket = false, 
}: UseInfiniteScrollerOptions<T>) {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState<T[]>([]);
    const [hasNextPage, setHasNextPage] = useState(true);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    /* ------------------ Query Key ------------------ */
    const queryKey = useMemo(
        () => [queryKeyBase, page, JSON.stringify(params)],
        [queryKeyBase, page, JSON.stringify(params)],
    );

    const { data, isLoading, isFetching, refetch } = useFetchData<any>({
        endpoint,
        queryKey,
        params: { ...params, limit, page },
        pagination: true,
        enable,
    });

    /* ------------------ Helper: Remove Duplicates ------------------ */
    const removeDuplicates = (array: T[]) => {
        const map = new Map<any, T>();

        for (const item of array) {
            const key = item[uniqueKey];
            map.set(key, item);
        }

        return Array.from(map.values());
    };

    /* ------------------ Infinite Scroll Observer ------------------ */
    const ref = useCallback(
        (node: HTMLElement | null) => {
            if (isLoading) return;

            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting && hasNextPage && !isFetching) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observerRef.current.observe(node);
        },
        [isLoading, hasNextPage, isFetching],
    );

    /* ------------------ Merge Pagination ------------------ */
    useEffect(() => {
        if (!data?.data) return;

        if(params.q) {
          setPage(1)
          setItems(data.data)
          return
        }

        setItems((prev) => {
            const merged =
                page === 1
                    ? (data.data as T[])
                    : [...prev, ...(data.data as T[])];

            return removeDuplicates(merged);
        });

        const total = Number(data?.total ?? 0);
        const loaded = page * limit;
        setHasNextPage(loaded < total);
    }, [data]);

    /* ------------------ Optional Realtime ------------------ */
    useEffect(() => {
        if (!enableSocket || !socketEvent) return;

        Socket.connect();

        const handleNewItem = (item: T) => {
            setItems((prev) => removeDuplicates([...prev, item]));

            requestAnimationFrame(() => {
                const el = scrollRef.current;
                if (el) {
                    el.scrollTo({
                        top: el.scrollHeight,
                        behavior: "smooth",
                    });
                }
            });
        };

        Socket.on(socketEvent, handleNewItem);

        return () => {
            Socket.off(socketEvent, handleNewItem);
        };
    }, [socketEvent, enableSocket]); 

    /* ------------------ Reset ------------------ */
    const reset = () => {
        setItems([]);
        setPage(1);
        setHasNextPage(true);
    };

    return {
        items,
        isLoading: isLoading && items.length === 0,
        isFetchingMore: isFetching && items.length > 0,
        hasNextPage,
        scrollRef,
        ref,
        refetch,
        setPage,
        reset,
    };
}
