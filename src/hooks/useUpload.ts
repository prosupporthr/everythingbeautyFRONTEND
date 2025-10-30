import { useMutation } from "@tanstack/react-query"
import { addToast } from "@heroui/toast"
import httpService from "@/helper/services/httpService"
import { AxiosError } from "axios"
import { URLS } from "@/helper/services/urls"

/**
 * Reusable verify OTP mutation
 * @param onSuccessCallback Optional custom callback after success
 */
export const useUploadMutation = <T>(
    onSuccessCallback: (data: T) => void
) => {

    const handleError = (error: AxiosError) => {
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

    return useMutation({
        mutationFn: async (data: FormData) => {
            const res = await httpService.post(URLS.UPLOAD, data,
                {
                    headers: {
                        'Content-Type': "multipart/form-data",
                    }
                })
            return res.data
        },
        onError: handleError,

        onSuccess: (res) => { 
            // Default navigation (can be overridden) 
            onSuccessCallback(res?.data?.url)
        },
    })
}
