
import { addToast } from "@heroui/toast"
import { AxiosError } from "axios"

/** 🔹 Shared error handler */
export const handleError = (error: AxiosError) => {
    const message =
        (error?.response?.data as { message?: string })?.message ||
        "Something went wrong"

        console.log(message);
        

    addToast({
        title: "Error",
        description: message === "Your are not authorized to carry out this action auth header" ? "Authentication required. Sign up or log in." : message,
        color: "danger",
        timeout: 3000,
    })
}