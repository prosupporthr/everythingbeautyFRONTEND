
// store/uiAtoms.ts
import { IUserDetail } from "@/helper/model/user";
import { atom } from "jotai";

// Initial value is false
export const userAtom = atom<IUserDetail | null>();
