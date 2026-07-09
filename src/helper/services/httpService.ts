"use client";

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

const axiosConfig = {
  baseURL: BASE_URL,
};

export const httpService = axios.create(axiosConfig);
export const unsecureHttpService = axios.create(axiosConfig);

const onResponse = (response: AxiosResponse) => response;

const onError = (error: AxiosError) => Promise.reject(error);

const addAuthHeaders = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accesstoken");

    config.headers.set("user-type", "USER");

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return config;
};

httpService.interceptors.request.use(addAuthHeaders, onError);

httpService.interceptors.response.use(onResponse, onError);
unsecureHttpService.interceptors.response.use(onResponse, onError);

export default httpService;