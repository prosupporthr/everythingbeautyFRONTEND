
import { addToast } from "@heroui/toast"
import { AxiosError } from "axios"

/** 🔹 Shared error handler */
export const handleError = (error: AxiosError) => {
    const message =
        (error?.response?.data as { message?: string })?.message ||
        "Something went wrong"
    addToast({
        title: "Error",
        description: message,
        color: "danger",
        timeout: 3000,
    })
}