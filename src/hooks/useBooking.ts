import { handleError } from "@/helper/services/errorHandler"
import httpService from "@/helper/services/httpService"
import { addToast } from "@heroui/toast"
import { useMutation } from "@tanstack/react-query" 
import { URLS } from "@/helper/services/urls" 
import { IBooking, IOrder } from "@/helper/model/business"
import { useRouter } from "next/navigation"

const useBooking = () => { 

    const router = useRouter()

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
            router.push("/")
        },
    })


    /** 🔹 Product */
    const orderMutation = useMutation({
        mutationFn: (data: IOrder) =>
            httpService.post(URLS.ORDER, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            }) 
            router.push("/")
        },
    })



    const isLoading = bookingMutation.isPending || orderMutation.isPending

    return { 
        isLoading, 
        bookingMutation,
        orderMutation
    }
}

export default useBooking