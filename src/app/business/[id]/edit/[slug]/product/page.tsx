"use client"
import { ProductForm } from "@/components/forms";
import { LoadingLayout } from "@/components/shared";
import { IProductDetail } from "@/helper/model/business";
import useBusiness from "@/hooks/useBusiness"
import { useFetchData } from "@/hooks/useFetchData";
import { useParams } from "next/navigation";
import { useEffect } from "react";


export default function BusinessProduct() {

    const { formikProduct: formik, imageFile, setImageFile, isLoading } = useBusiness({
        product: true
    })

    const param = useParams();
    const id = param.slug as string;


    const { data, isLoading: loading } = useFetchData<IProductDetail>({
        endpoint: `/product/${id}`, name: "product"
    })

    useEffect(() => {
        if (!formik.values?.businessId && data?.businessId && !loading) {
            formik.setValues({
                name: data.name || "",
                description: data.description || "",
                price: data.price || 0,
                allowReview: data.allowReview ?? false,
                businessId: data.businessId || "", 
            });
        }
    }, [data]);

    return (
        <LoadingLayout loading={loading} >
            <ProductForm formik={formik} imageFile={imageFile} setImageFile={setImageFile} isLoading={isLoading} edit={true} preview={data?.pictures[0]} />
        </LoadingLayout>
    )
}