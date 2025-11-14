// api.ts 
import httpService, { unsecureHttpService } from "./httpService";

// Generic type for API response
export type ApiResponse<T> = {
  data: T;
  success: boolean;
};

export const fetchUnsecureData = async <T>(endpoint: string): Promise<T> => {
  const response = await unsecureHttpService.get<ApiResponse<T>>(endpoint);
  return response.data.data; // Extract only the `data` field
};

export const fetchSecureData = async <T>(
  endpoint: string,
  params?: Record<string, unknown> // more specific than `any`
): Promise<T> => {
  const response = await httpService.get<ApiResponse<T>>(endpoint, { params });
  return response.data.data; // extract only the `data` field
};
