"use client"
import { ServicesForm } from "@/components/forms";
import { LoadingLayout } from "@/components/shared";
import { IServiceDetail } from "@/helper/model/business";
import useBusiness from "@/hooks/useBusiness"
import { useFetchData } from "@/hooks/useFetchData";
import { useParams } from "next/navigation"
import { useEffect } from "react";


export default function BusinessService() {


    const { formikService: formik, imageFile, setImageFile, isLoading } = useBusiness({
        services: true
    })

    const param = useParams();
    const id = param.slug as string;


    const { data, isLoading: loading } = useFetchData<IServiceDetail>({
        endpoint: `/service/${id}`, name: "service"
    })

    console.log(data);


    useEffect(() => {
        if (!formik.values?.businessId && data?.businessId && !loading) {
            formik.setValues({
                name: data.name || "",
                description: data.description || "",
                hourlyRate: data.hourlyRate || 0,
                allowReview: data.allowReview ?? false,
                businessId: data.businessId || "",
            });
        }
    }, [data]);

    return (
        <LoadingLayout loading={loading} >
            <ServicesForm formik={formik} imageFile={imageFile} setImageFile={setImageFile} isLoading={isLoading} preview={data?.pictures[0]} edit={true} />
        </LoadingLayout>
    )
}