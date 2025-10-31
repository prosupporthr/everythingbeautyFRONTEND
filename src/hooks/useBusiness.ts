import { handleError } from "@/helper/services/errorHandler"
import httpService from "@/helper/services/httpService"
import { addToast } from "@heroui/toast"
import { useMutation } from "@tanstack/react-query"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"
import { useUploadMutation } from "./useUpload"
import { URLS } from "@/helper/services/urls"
import { useState } from "react"
import Cookies from "js-cookie" 
import { businessSchema, productSchema, serviceSchema } from "@/helper/services/validation" 
import { IBusiness, IProduct, IServices } from "@/helper/model/business"

interface IProps {
    services?: boolean,
    product?: boolean ,
    business?: boolean 
}

const useBusiness = (
  { services, product, business } : IProps
) => {

    const router = useRouter()
    const userId = Cookies.get("userid") as string
    const [imageFile, setImageFile] = useState<File | string | null>("");

    /** 🔹 Business */
    const businessMutation = useMutation({
        mutationFn: (data: IBusiness) =>
            httpService.post(URLS.BUSINESS, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            })
            router.push(`/`)
        },
    })
    
    /** 🔹 Service */
    const servicesMutation = useMutation({
        mutationFn: (data: IServices) =>
            httpService.post(URLS.SERVICE, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            })
            router.push(`/`)
        },
    })

    /** 🔹 Product */
    const productMutation = useMutation({
        mutationFn: (data: IProduct) =>
            httpService.post(URLS.PRODUCT, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            })
            router.push(`/`)
        },
    })

    const uploadMutation = useUploadMutation((res) => {

        const payload = { ...formik.values, pictures: [res + ""] }
        const payloadservices = { ...formikService.values, pictures: [res + ""] }
        const payloadproduct = { ...formikProduct.values, pictures: [res + ""] }

        if(business) {
            businessMutation.mutate(payload)
        } else if(services) {
            servicesMutation.mutate(payloadservices)
        } else if(product) {
            productMutation.mutate(payloadproduct)
        }
    })

    /** 🔹 Formik Instances */
    const formik = useFormik({
        initialValues: {
            "userId": userId,
            "name": "",
            "location": "",
            "long": "",
            "lat": "",
            "days": [],
            "openingTime": "",
            "closingTime": "",
            "chargeTiming": "",
            "pictures": []
        },
        validationSchema: businessSchema,
        onSubmit: () => {
            if (imageFile) {
                const formdata = new FormData()
                formdata.append("file", imageFile)
                uploadMutation.mutate(formdata)
            } else {
                addToast({
                    title: "Error",
                    description: "At least one picture is required",
                    color: "danger",
                })
            }
        },
    })


    /** 🔹 Formik Instances */
    const formikService = useFormik({
        initialValues: {
            "businessId": "6904afd64efca5874d0e4814",
            "name": "",
            "description": "",
            "hourlyRate": 0,
            "allowReview": false,
            "pictures": []
          },
        validationSchema: serviceSchema,
        onSubmit: () => {
            if (imageFile) {
                const formdata = new FormData()
                formdata.append("file", imageFile)
                uploadMutation.mutate(formdata)
            } else {
                addToast({
                    title: "Error",
                    description: "At least one picture is required",
                    color: "danger",
                })
            }
        },
    })

    /** 🔹 Formik Instances */
    const formikProduct = useFormik({
        initialValues: {
            "businessId": "6904afd64efca5874d0e4814",
            "name": "",
            "description": "",
            "price": 0,
            "allowReview": false,
            "pictures": []
          },
        validationSchema: productSchema,
        onSubmit: () => {
            if (imageFile) {
                const formdata = new FormData()
                formdata.append("file", imageFile)
                uploadMutation.mutate(formdata)
            } else {
                addToast({
                    title: "Error",
                    description: "At least one picture is required",
                    color: "danger",
                })
            }
        },
    })

    const isLoading = uploadMutation.isPending || businessMutation.isPending || servicesMutation.isPending || productMutation.isPending

    return {
        formik,
        formikService,
        formikProduct,
        isLoading,
        setImageFile,
        imageFile
    }
}

export default useBusiness