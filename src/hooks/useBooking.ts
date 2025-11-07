import { handleError } from "@/helper/services/errorHandler"
import httpService from "@/helper/services/httpService"
import { addToast } from "@heroui/toast"
import { useMutation } from "@tanstack/react-query" 
import { URLS } from "@/helper/services/urls" 
import { IBooking } from "@/helper/model/business"

const useBooking = () => { 

    /** 🔹 Business */
    const bookingMutation = useMutation({
        mutationFn: (data: IBooking) =>
            httpService.post(URLS.BOOKING, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            }) 
        },
    })



    const isLoading = bookingMutation.isPending 

    return { 
        isLoading, 
        bookingMutation
    }
}

export default useBooking