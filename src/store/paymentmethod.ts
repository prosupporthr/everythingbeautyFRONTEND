
// store/uiAtoms.ts
import { atom } from "jotai";

// Initial value is false
export const paymentMethodAtom = atom<"stripe" | "wallet">("stripe");
