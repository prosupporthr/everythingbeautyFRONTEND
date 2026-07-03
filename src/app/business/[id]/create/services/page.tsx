"use client" 
import { ServicesForm } from "@/components/forms"; 
import useBusiness from "@/hooks/useBusiness" 


export default function BusinessService() { 

    const { formikService: formik, imageFiles, setImageFiles, isLoading, previews, setPreviews } = useBusiness({
        services: true
    })

    return ( 
        <ServicesForm formik={formik} imageFiles={imageFiles} setImageFiles={setImageFiles} isLoading={isLoading} preview={previews} setPreviews={setPreviews} />
    )
}