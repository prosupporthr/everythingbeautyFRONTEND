"use client" 
import { ServicesForm } from "@/components/forms"; 
import useBusiness from "@/hooks/useBusiness" 


export default function BusinessService() { 

    const { formikService: formik, imageFile, setImageFile, isLoading } = useBusiness({
        services: true
    })

    return ( 
        <ServicesForm formik={formik} imageFile={imageFile} setImageFile={setImageFile} isLoading={isLoading} />
    )
}