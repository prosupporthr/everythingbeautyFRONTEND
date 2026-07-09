"use client"
import { PostForm } from "@/components/forms";
import useBusiness from "@/hooks/useBusiness";


export default function CreatePost () {

    const { formikPost, imageFiles, setImageFiles, isLoading, previews, setPreviews } = useBusiness({
        post: true
    })

    return(
        <PostForm client preview={previews} setPreviews={setPreviews} imageFiles={imageFiles} setImageFiles={setImageFiles} isLoading={isLoading} formik={formikPost} />
    )
}