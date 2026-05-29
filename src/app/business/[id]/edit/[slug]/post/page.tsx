"use client";
import { PostForm } from "@/components/forms";
import { LoadingLayout } from "@/components/shared";
import { IPostDetail, IProductDetail } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import useBusiness from "@/hooks/useBusiness";
import { useFetchData } from "@/hooks/useFetchData";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function CreatePost() {
    const {
        formikPost,
        imageFiles,
        setImageFiles,
        isLoading,
        previews,
        setPreviews,
    } = useBusiness({
        post: true,
    });

    const param = useParams();
    const id = param.slug as string;

    const { data, isLoading: loading } = useFetchData<IPostDetail>({
        endpoint: URLS.POSTBYID(id),
        name: ["post", id as string],
    });

    useEffect(() => {
        if (!formikPost.values?.body && data?._id && !loading) {
            formikPost.setValues({
                images: [],
                body: data.body,
                productId: data?.productId,
            });
            setPreviews(data?.images);
        }
    }, [data, loading]);

    return (
        <LoadingLayout loading={loading}>
            <PostForm
                edit
                imageFiles={imageFiles}
                preview={previews}
                setImageFiles={setImageFiles}
                setPreviews={setPreviews}
                isLoading={isLoading}
                formik={formikPost}
            />
        </LoadingLayout>
    );
}
