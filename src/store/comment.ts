
// store/uiAtoms.tsc
import { IChatMessage } from "@/helper/model/chat";
import { IComment } from "@/helper/model/post";
import { atom } from "jotai";

// Initial value is false
export const commentData = atom<IComment[]>([]);
export const replyData = atom<IComment[]>([]);
export const commentDeleted = atom<string[]>([]);
export const replyDeleted = atom<string[]>([]);
export const messageDeleted = atom<string[]>([]);
export const messageData = atom<IChatMessage[]>([]);