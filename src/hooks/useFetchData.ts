"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchSecureData, fetchUnsecureData } from "@/helper/services/api";

interface UseFetchDataOptions {
  endpoint: string;
  name?: string[];
  params?: Record<string, unknown>;
  id?: string | number;
  queryKey?: (string | number | undefined)[];
  enable?: boolean;
  pagination?: boolean;
  noCache?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnMount?: boolean | "always";
  refetchOnReconnect?: boolean;
  refetchOnWindowFocus?: boolean;
}

const buildQueryKey = (
  name?: string[],
  endpoint?: string,
  id?: string | number,
  queryKey: (string | number | undefined)[] = [],
  params?: Record<string, unknown>
) => {
  return [
    ...(name ?? []),     // Safe spread
    endpoint,
    id,
    ...queryKey,
    params ? JSON.stringify(params) : "{}",
  ];
};

export const useFetchData = <T>({
  endpoint,
  name,
  params,
  id,
  queryKey = [],
  pagination,
  enable = true,
  noCache = false,
  staleTime,
  gcTime,
  refetchOnMount,
  refetchOnReconnect,
  refetchOnWindowFocus,
}: UseFetchDataOptions): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey: buildQueryKey(name, endpoint, id, queryKey, params),
    queryFn: () => fetchSecureData<T>(endpoint, params, pagination),
    enabled: enable,
    staleTime: staleTime ?? (noCache ? 0 : undefined),
    gcTime: gcTime ?? (noCache ? 0 : undefined),
    ...(refetchOnMount !== undefined && { refetchOnMount }),
    ...(refetchOnReconnect !== undefined && { refetchOnReconnect }),
    ...(refetchOnWindowFocus !== undefined && { refetchOnWindowFocus }),
  });
};

export const useUnsecureFetchData = <T>({
  endpoint,
  name,
  params,
  id,
  queryKey = [],
  enable = true,
  noCache = false,
  staleTime,
  gcTime,
  refetchOnMount,
  refetchOnReconnect,
  refetchOnWindowFocus,
}: UseFetchDataOptions): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey: buildQueryKey(name, endpoint, id, queryKey, params),
    queryFn: () => fetchUnsecureData<T>(endpoint, params), // FIXED
    enabled: enable,
    staleTime: staleTime ?? (noCache ? 0 : undefined),
    gcTime: gcTime ?? (noCache ? 0 : undefined),
    ...(refetchOnMount !== undefined && { refetchOnMount }),
    ...(refetchOnReconnect !== undefined && { refetchOnReconnect }),
    ...(refetchOnWindowFocus !== undefined && { refetchOnWindowFocus }),
  });
};
