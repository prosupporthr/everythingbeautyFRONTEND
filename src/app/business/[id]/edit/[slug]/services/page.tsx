"use client"
import { ServicesForm } from "@/components/forms";
import { LoadingLayout } from "@/components/shared";
import { IServiceDetail } from "@/helper/model/business";
import useBusiness from "@/hooks/useBusiness"
import { useFetchData } from "@/hooks/useFetchData";
import { useParams } from "next/navigation"
import { useEffect } from "react";


export default function BusinessService() {


    const { formikService: formik, imageFiles, setImageFiles, isLoading, previews, setPreviews } = useBusiness({
        services: true
    })

    const param = useParams();
    const id = param.slug as string;


    const { data, isLoading: loading } = useFetchData<IServiceDetail>({
        endpoint: `/service/${id}`, name: ["service", id as string],
        noCache: true,
    });

    useEffect(() => {
        if (!formik.values?.businessId && data?.businessId && !loading) {
            formik.setValues({
                name: data.name || "",
                description: data.description || "",
                hourlyRate: data.hourlyRate || 0,
                allowReview: data.allowReview ?? false,
                businessId: data.businessId || "",
                acceptsInitialDeposit: data?.acceptsInitialDeposit,
                initialDepositPercentage: data?.initialDepositPercentage
            });
            setPreviews(data?.pictures);
        }
    }, [data]);

    return (
        <LoadingLayout loading={loading} >
            <ServicesForm formik={formik} imageFiles={imageFiles} setImageFiles={setImageFiles} isLoading={isLoading} preview={previews} setPreviews={setPreviews} edit={true} />
        </LoadingLayout>
    )
}