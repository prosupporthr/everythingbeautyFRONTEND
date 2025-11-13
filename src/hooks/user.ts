"use client";

import { useQuery } from "@tanstack/react-query";
import httpService from "@/helper/services/httpService";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import { IUserDetail } from "@/helper/model/user"; 

/** 🔹 Fetch user data using the userid from cookies */
async function fetchUser(): Promise<IUserDetail | null> {
  const id = localStorage.getItem("userid") as string;
  if (!id) return null;

  try {
    const res = await httpService.get<{ data: IUserDetail }>(`/user/${id}`); 
    return res.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;

    // 🧹 Clear tokens and redirect on failure
    // Cookies.remove("userid");
    // Cookies.remove("accesstoken");
    localStorage.clear()
    // if (typeof window !== "undefined") {
    //   window.location.href = "/";
    // }

    throw new Error(err.response?.data?.message || err.message);
  }
}

/**
 * ✅ useUser — TanStack Query hook replacement for userAtom
 * - Fetches user info with caching and automatic re-fetch
 * - Handles error + redirect logic
 */
export function useUserStore() {
  const id = Cookies.get("userid");
  return useQuery({
    queryKey: ["user", id],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false, // Avoid retry loops if unauthorized
  });
}
