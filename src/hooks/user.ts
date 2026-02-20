"use client";

import { useQuery } from "@tanstack/react-query";
import httpService from "@/helper/services/httpService";
import { AxiosError } from "axios";
import { IUserDetail } from "@/helper/model/user";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";

/** 🔹 Fetch user data */
async function fetchUser(userId: string): Promise<IUserDetail> {
    try {
        const res = await httpService.get<{ data: IUserDetail }>(
            `/user/${userId}`,
        );

        return res.data.data;
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;

        // Optional redirect logic
        if (typeof window !== "undefined") {
            localStorage.clear();
            window.location.href = "/";
        }

        throw new Error(err.response?.data?.message || err.message);
    }
}

/**
 * ✅ useUserStore
 * - Accepts userId directly
 * - Falls back to localStorage if not provided
 */
export function useUserStore(userId?: string) {
    const [user] = useAtom(userAtom);

    const id =
        userId ??
        (typeof window !== "undefined" ? localStorage.getItem("userid") : null);

    return useQuery({
        queryKey: ["user", id],
        queryFn: () => {
            if (!id) throw new Error("No user id found");
            return fetchUser(id);
        },
        enabled: !!id && !user?.id,
        staleTime: 1000 * 60 * 5,
    });
}
