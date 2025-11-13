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
}

export const useFetchData = <T>({
  endpoint,
  name,
  params,
  id,
  queryKey = [],
  enable = true,
}: UseFetchDataOptions): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey: [name, endpoint, id, ...queryKey, JSON.stringify(params ?? {})],
    queryFn: () => fetchSecureData<T>(endpoint, params),
    enabled: enable,
  });
};

export const useUnsecureFetchData = <T>({
  endpoint,
  name,
  params,
  id,
  queryKey = [],
  enable = true,
}: UseFetchDataOptions): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey: [name, endpoint, id, ...queryKey, JSON.stringify(params ?? {})],
    queryFn: () => fetchSecureData<T>(endpoint, params),
    enabled: enable,
  });
};
