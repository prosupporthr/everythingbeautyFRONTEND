"use client";

import { useQuery } from "@tanstack/react-query";
import httpService from "@/helper/services/httpService";
import { AxiosError } from "axios";
import { IUserDetail } from "@/helper/model/user";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai"; 

/** 🔹 Fetch user data using the userid from cookies */
async function fetchUser(): Promise<IUserDetail | null> { 

    try {
        const res = await httpService.get<{ data: IUserDetail }>(`/user/me`);

        console.log(res);

        return res.data.data;
    } catch (error) {
        console.log("error");

        const err = error as AxiosError<{ message?: string }>;

        console.log("error");

        console.log(error);

        // 🧹 Clear tokens and redirect on failure
        // Cookies.remove("userid");
        // Cookies.remove("accesstoken");
        // localStorage.clear();
        // if (typeof window !== "undefined") {
        //     window.location.href = "/";
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
    const [user] = useAtom(userAtom);
    const id =
        typeof window !== "undefined" ? localStorage.getItem("userid") : null;

    return useQuery({
        queryKey: ["user", id],
        queryFn: fetchUser,
        // staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: user?.firstName ? false : !id ? false : true,
    });
}
