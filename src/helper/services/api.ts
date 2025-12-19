// api.ts 
import httpService, { unsecureHttpService } from "./httpService";

// Generic type for API response
export type ApiResponse<T> = {
  data: T;
  success: boolean;
};

export const fetchUnsecureData = async <T>(endpoint: string, params?: Record<string, unknown> | undefined): Promise<T> => {
  const response = await unsecureHttpService.get<ApiResponse<T>>(endpoint, { params });
  return response.data.data; // Extract only the `data` field
};

export const fetchSecureData = async <T>(
  endpoint: string,
  params?: Record<string, unknown>, // more specific than `any`
  pagination?: boolean
): Promise<T> => {
  const response = await httpService.get<ApiResponse<T>>(endpoint, { params });
  if (pagination) {
    // If pagination, T is expected to be the full ApiResponse shape.
    return response.data as unknown as T;
  } else {
    // If not paginated, T is the data field directly.
    return response.data.data;
  }
};
