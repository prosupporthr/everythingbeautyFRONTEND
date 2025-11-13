"use client" 
import { ProductForm } from "@/components/forms"; 
import useBusiness from "@/hooks/useBusiness" 

export default function BusinessProduct() {
  
    const { formikProduct: formik, imageFile, setImageFile, isLoading } = useBusiness({
        product: true
    }) 

    return (
        <ProductForm formik={formik} imageFile={imageFile} setImageFile={setImageFile} isLoading={isLoading} />
    )
}