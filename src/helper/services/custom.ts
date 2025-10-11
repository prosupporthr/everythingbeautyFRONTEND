import { addToast } from "@heroui/react";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import httpService from "./httpService";

interface MutationConfig<TResponse, TVariables, TContext = unknown> {
  /** API endpoint */
  url: string;
  /** HTTP method (default = POST) */
  method?: "post" | "put" | "patch" | "delete";
  /** Optional static success message */
  successMessage?: string;
  /** React-Query options */
  options?: UseMutationOptions<
    AxiosResponse<TResponse>,
    AxiosError,
    TVariables,
    TContext
  >;
}

/**
 * ✅ Reusable mutation hook with HeroUI toast + full typing support
 */
export function useAppMutation<
  TResponse = unknown,
  TVariables = unknown,
  TContext = unknown
>({
  url,
  method = "post",
  successMessage,
  options,
}: MutationConfig<TResponse, TVariables, TContext>): UseMutationResult<
  AxiosResponse<TResponse>,
  AxiosError,
  TVariables,
  TContext
> {
  return useMutation<AxiosResponse<TResponse>, AxiosError, TVariables, TContext>({
    mutationFn: (data: TVariables) =>
      httpService.request<TResponse>({
        url,
        method,
        data,
      }),
    ...options,
    onError: (error, variables, context) => {
      const message =
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        "Something went wrong";

      addToast({
        title: "Error",
        description: message,
        color: "danger",
        timeout: 3000,
      });
// @ts-expect-error cant debug this
      options?.onError?.(error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      const responseMessage =
        (data.data as { message?: string })?.message ??
        successMessage ??
        "Success";

      addToast({
        title: "Success",
        description: responseMessage,
        color: "success",
        timeout: 3000,
      });
      // @ts-expect-error cant debug this
      options?.onSuccess?.(data, variables, context);
    },
  });
}
