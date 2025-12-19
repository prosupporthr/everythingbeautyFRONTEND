import { atom } from "jotai";
import type { IChatMessage } from "@/helper/model/chat";
// import { ChatModel } from "../models/Chat-model"; 

// Centralized atom to avoid circular imports between component and hooks
export const ACTIVE_CHAT_MESSAGES_ATOM = atom<IChatMessage[]>([]);
export const ACTIVE_CHAT_ID_ATOM = atom<string | null>(null);
// export const ACTIVE_CHAT_ATOM = atom<ChatModel | null>(null);
export const REPLY_ATOM = atom<IChatMessage | null>(null);
export const PAGE_ATOM = atom<number>(1);
export const LIMIT_ATOM = atom<number>(10);
export const TOTAL_ATOM = atom<number>(0);
