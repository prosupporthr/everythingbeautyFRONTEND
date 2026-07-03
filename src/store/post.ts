
// store/uiAtoms.tsc
import { IPostDetail } from "@/helper/model/business";
import { atom } from "jotai";

// Initial value is false
export const postData = atom<IPostDetail[]>([]);
export const postDeleted = atom<string[]>([]);
export const itemDeleted = atom<string[]>([]);
