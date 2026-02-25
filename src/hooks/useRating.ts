"use client"

import { IRatingForm } from "@/helper/model/business"
import { handleError } from "@/helper/services/errorHandler"
import httpService from "@/helper/services/httpService"
import { URLS } from "@/helper/services/urls"
import { reviewSchema } from "@/helper/services/validation"
import { userAtom } from "@/store/user"
import { addToast } from "@heroui/toast"
import { useMutation } from "@tanstack/react-query"
import { useFormik } from "formik"
import { useAtom } from "jotai"
import { useParams } from "next/navigation"
import { useState } from "react"


const useRating = () => {

    // const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false)
    const [tab, setTab] = useState(false) 

    /** 🔹 Formik Instances */
    const formik = useFormik({
        initialValues: {
            "userId": "",
            "businessId": "",
            "description": "",
            "rating": 0
        },
        validationSchema: reviewSchema,
        onSubmit: (data) => {
            ratingBusinessMutation.mutate(data)
        },
    })

    /** 🔹 Business */
    const ratingBusinessMutation = useMutation({
        mutationFn: (data: IRatingForm) =>
            httpService.post(URLS.REVIEW, data),
        onError: handleError,
        onSuccess: () => { 
            setTab(true)
        },
    })

    const isLoading = ratingBusinessMutation?.isPending

    return {
        formik,
        ratingBusinessMutation,
        isLoading,
        isOpen,
        setIsOpen,
        setTab,
        tab
    }
}

export default useRating