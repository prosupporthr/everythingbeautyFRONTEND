import { handleError } from "@/helper/services/errorHandler"
import httpService from "@/helper/services/httpService"
import { addToast } from "@heroui/toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"
import { useUploadMutation } from "./useUpload"
import { URLS } from "@/helper/services/urls"
import { useState } from "react" 
import { IOnboarding } from "@/helper/model/auth"
import { userSchema } from "@/helper/services/validation"
import { useAtom } from "jotai"
import { userAtom } from "@/store/user"


const useUser = () => {

    const router = useRouter()
    const userId =  typeof window !== "undefined"
      ? localStorage.getItem("userid") as string
      : ""; 

      const [ _, setUser ] = useAtom(userAtom)

      
    const [imageFile, setImageFile] = useState<File | string | null>("");
    const queryClient = useQueryClient()

    /** 🔹 Login */
    const userMutation = useMutation({
        mutationFn: (data: IOnboarding) =>
            httpService.patch(URLS.USERUPDATE(userId), data),
        onError: handleError,
        onSuccess: (res) => {
                queryClient.invalidateQueries({ queryKey: ["user"] }) 
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            })

            console.log(res);
            setUser(res?.data?.data)
            
            router.push(`/?id=${res?.data?.data?._id}`)
        },
    })

    const uploadMutation = useUploadMutation((res) => {

        const payload = {...formik.values, profilePicture: res+""}

        userMutation.mutate(payload)
    })

    /** 🔹 Formik Instances */
    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            gender: "",
            profilePicture: "",
            dateOfBirth: ""
        },
        validationSchema: userSchema,
        onSubmit: () => { 
            if (imageFile) {
                const formdata = new FormData()
                formdata.append("file", imageFile)
                uploadMutation.mutate(formdata )
            }
        },
    })

    const isLoading = uploadMutation.isPending || userMutation.isPending

    const isSuccess = userMutation.isSuccess || uploadMutation.isSuccess

    return {
        formik,
        isLoading,
        isSuccess,
        setImageFile,
        imageFile
    }
}

export default useUser