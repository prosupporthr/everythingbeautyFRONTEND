"use client"
import { CustomButton, CustomInput } from "@/components/custom";
import { ImagePicker } from "@/components/shared";
import useBusiness from "@/hooks/useBusiness"
import { Switch } from "@heroui/switch";
import { FormikProvider } from "formik"
import { useRouter } from "next/navigation"
import { IoArrowBackOutline } from "react-icons/io5";


export default function BusinessService() {

    const router = useRouter()

    const { formikService: formik, imageFile, setImageFile, isLoading } = useBusiness({
        services: true
    })

    return (
        <FormikProvider value={formik} >
            <div className=" w-full flex flex-col gap-4 pt-10 px-4 items-center " >
                <div className=" w-full max-w-[1276px] flex flex-col gap-4 pb-5 " >
                    <button onClick={() => router.back()} className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary " >
                        <IoArrowBackOutline size={"22px"} />
                    </button>
                </div> 
                <div className=" w-full flex justify-center mb-8 " >
                    <div className=" max-w-[520px] w-full gap-6 flex flex-col " >
                        <p className=" text-2xl font-semibold text-center " >Share pictures of your service</p>
                        <ImagePicker setImageFile={setImageFile} imageFile={imageFile} />
                        <CustomInput name="name" label="Tell us what services you offering" />
                        <CustomInput textarea label="Describe your service to make it stand out" name="description" />
                        <CustomInput label="Price per Hour" name="hourlyRate" type="number" />
                        <div className=" w-full flex items-center justify-between " >
                            <p className=" font-medium " >Allowed Customers Review</p>
                            <Switch checked={formik.values.allowReview} color="success" onChange={(e) => formik.setFieldValue("allowReview", e.target.checked)} />
                        </div>
                        <div className=" w-full mt-4 lg:max-w-[240px] " >
                            <CustomButton fullWidth isLoading={isLoading} onClick={() => formik.handleSubmit()} >Create Service</CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        </FormikProvider>
    )
}