"use client" 
import { ProductForm } from "@/components/forms"; 
import useBusiness from "@/hooks/useBusiness" 

export default function BusinessProduct() {
  
    const { formikProduct: formik, imageFiles, setImageFiles, isLoading, previews, setPreviews } = useBusiness({
        product: true
    }) 

    return (
        <ProductForm formik={formik} imageFiles={imageFiles} setImageFiles={setImageFiles} isLoading={isLoading} previews={previews} setPreviews={setPreviews} />
    )
}