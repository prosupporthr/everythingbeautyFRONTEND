"use client"
import { CustomButton, CustomInput } from "@/components/custom";
import { ProductForm } from "@/components/forms";
import { ImagePicker } from "@/components/shared";
import useBusiness from "@/hooks/useBusiness"
import { Switch } from "@heroui/switch";
import { FormikProvider } from "formik"
import { useRouter } from "next/navigation"
import { IoArrowBackOutline } from "react-icons/io5";


export default function BusinessProduct() {

    const router = useRouter()

    const { formikProduct: formik, imageFile, setImageFile, isLoading } = useBusiness({
        product: true
    }) 

    return (
        <ProductForm formik={formik} imageFile={imageFile} setImageFile={setImageFile} isLoading={isLoading} />
    )
}