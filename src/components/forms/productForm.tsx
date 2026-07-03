"use client"
import { IProduct } from "@/helper/model/business"; 
import { FormikProps, FormikProvider } from "formik"; 
import { CustomInput, CustomButton } from "../custom";
import { MultipleImagePicker } from "../shared";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import ColorSelector from "../custom/customColorPicker";

export default function ProductForm(
    { formik, imageFiles, setImageFiles, isLoading, edit, previews, setPreviews } : { formik: FormikProps<IProduct>, imageFiles: File[], setImageFiles: (files: File[]) => void, isLoading: boolean, edit?: boolean, previews: string[], setPreviews: (previews: string[]) => void }
) {

    const router = useRouter()

    return( 
        <FormikProvider value={formik} >
            <div className=" w-full flex flex-col gap-4 pt-10 px-4 items-center " >
                <div className=" w-full max-w-[1276px] flex flex-col gap-4 pb-5 " >
                    <button onClick={() => router.back()} className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary " >
                        <IoArrowBackOutline size={"22px"} />
                    </button>
                </div> 
                <div className=" w-full flex justify-center mb-8 " >
                    <div className=" max-w-[520px] w-full gap-6 flex flex-col " >
                        <p className=" text-2xl font-semibold text-center " >Share pictures of your Product</p>
                        <div className={` w-full h-fit `}>
                            <MultipleImagePicker imageFiles={imageFiles} setImageFiles={setImageFiles} previews={previews} setPreviews={setPreviews} />
                        </div>
                        <CustomInput name="name" label="Tell us about your Product" />
                        <CustomInput textarea label="Describe your Product to make it stand out" name="description" />
                        <CustomInput label="Price per unit" name="price" type="number" />
                        <CustomInput label="Quantity" name="quantity" type="number" />
                        <ColorSelector />
                        {/* <div className=" w-full flex items-center justify-between " >
                            <p className=" font-medium " >Allowed Customers Review</p>
                            <Switch checked={formik.values.allowReview} color="success" onChange={(e) => formik.setFieldValue("allowReview", e.target.checked)} />
                        </div> */}
                        <div className=" w-full mt-4 lg:max-w-[240px] " >
                            <CustomButton fullWidth isLoading={isLoading} onClick={() => formik.handleSubmit()} >{edit ? "Edit" : "Create"} Product</CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        </FormikProvider>
    )
}