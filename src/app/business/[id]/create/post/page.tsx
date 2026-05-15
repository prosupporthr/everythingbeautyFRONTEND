"use client"
import { PostForm } from "@/components/forms";
import useBusiness from "@/hooks/useBusiness";


export default function CreatePost () {

    const { formikPost, imageFile, setImageFile, isLoading } = useBusiness({
        post: true
    })

    return(
        <PostForm imageFile={imageFile} setImageFile={setImageFile} isLoading={isLoading} formik={formikPost} />
    )
}