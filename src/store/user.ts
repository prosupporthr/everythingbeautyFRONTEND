// atoms/user.ts
import { atom } from "jotai";
import { AxiosError } from "axios";
import httpService from "@/helper/services/httpService";
import Cookies from "js-cookie"; 
import { IUserDetail } from "@/helper/model/user";

type UserState = {
  data: IUserDetail | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  data: null,
  isLoading: false,
  error: null,
};

export const userAtom = atom<UserState>(initialState);

const id = Cookies.get("userid");
// Actions atom (dispatcher)
export const userActionsAtom = atom(
  null,
  async (get, set, action: { type: "fetch"; payload?: unknown }) => {
    switch (action.type) {
      case "fetch":
        try {
          if (id) {
            set(userAtom, { ...get(userAtom), isLoading: true });

            const res = await httpService.get<{ data: IUserDetail }>(`/user/${id}`);

            set(userAtom, {
              data: res.data.data,
              isLoading: false,
              error: null
            });
          };


        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;

          if (id) {
            // ✅ Clear token & redirect
            Cookies.remove("userid");
            Cookies.remove("accesstoken");
            window.location.href = "/";
          }

          set(userAtom, {
            ...get(userAtom),
            isLoading: false,
            error: err.response?.data?.message || err.message,
          });
        }
        break;
    }
  }
);
