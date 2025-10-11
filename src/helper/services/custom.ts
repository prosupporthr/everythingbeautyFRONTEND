import { addToast } from "@heroui/react";
import { useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import httpService from "./httpService";

interface MutationConfig<TResponse, TVariables> {
  /** API endpoint */
  url: string;
  /** HTTP method (default = POST) */
  method?: "post" | "put" | "patch" | "delete";
  /** Optional static success message */
  successMessage?: string;
  /** React-Query options */
  options?: UseMutationOptions<AxiosResponse<TResponse>, AxiosError, TVariables>;
}

/**
 * A reusable mutation hook with toast notifications and strong typing
 */
export function useAppMutation<TResponse = unknown, TVariables = unknown>({
  url,
  method = "post",
  successMessage,
  options
}: MutationConfig<TResponse, TVariables>): UseMutationResult<
  AxiosResponse<TResponse>,
  AxiosError,
  TVariables
> {
  return useMutation<AxiosResponse<TResponse>, AxiosError, TVariables>({
    mutationFn: (data: TVariables) => httpService[method]<TResponse>(url, data),
    onError: (error, variables, context) => {
      const message =
        (error.response?.data as { message?: string })?.message ??
        "Something went wrong";
      addToast({
        title: "Error",
        description: message,
        color: "danger",
        timeout: 3000,
      });
      options?.onError?.(error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      addToast({
        title: "Success",
        description: successMessage ?? (data.data as { message?: string })?.message ?? "Success",
        color: "success",
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}
