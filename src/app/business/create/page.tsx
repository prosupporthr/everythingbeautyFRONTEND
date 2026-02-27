"use client"
import { CustomButton, CustomDayPicker, CustomInput, CustomLocation, CustomSelect, CustomTimePicker } from "@/components/custom";
import { ImagePicker } from "@/components/shared";
import { chargeTiming } from "@/helper/services/databank";
import useBusiness from "@/hooks/useBusiness";
import { FormikProvider } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { IoArrowBackOutline } from "react-icons/io5";

export default function BusinessCreatePage() {

    const { formik, imageFile, setImageFile, isLoading } = useBusiness({
        business: true
    })
    const router = useRouter()
    const query = useSearchParams();
    const tab = query?.get("tab") as string | null;

    /** 🔹 Continue handler */
    const handleContinue = async () => {
        // Run validation manually
        const errors = await formik.validateForm();

        // If no errors, continue
        if (Object.keys(errors).length === 0) {
            router.push("/business/create?tab=photo");
        } else {
            // Mark all fields as touched so errors show up
            formik.setTouched(
                Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
                true
            );
        }
    };  

    return (
        <FormikProvider value={formik} >
            <div className=" w-full flex flex-col pt-10 px-4 items-center " >
                <div className=" w-full max-w-[1276px] flex flex-col gap-4 pb-5 " >
                    <div className=" w-full flex gap-8 " >
                        <div className=" w-full h-3 rounded-4xl bg-brand " />
                        <div className={` w-full h-3 rounded-4xl ${tab ? "bg-brand" : " bg-[#F4F4F4] "} `} />
                    </div>
                    <button onClick={()=> router.back()} className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary " >
                        <IoArrowBackOutline size={"22px"} />
                    </button>
                    {!tab && (
                        <div className=" w-full flex justify-center " >
                            <div className=" max-w-[520px] w-full gap-6 flex flex-col " >
                                <div className=" flex flex-col gap-2 font-medium " >
                                    <p className=" text-brand " >Step 1</p>
                                    <p className=" text-secondary " >Business account set up</p>
                                    <p className=" font-medium text-2xl lg:text-4xl " >Describe your brand and Business to make it stand out</p>
                                </div>
                                <div className=" w-full flex flex-col gap-4 " >
                                    <CustomInput name="name" label="Business name" />
                                    <CustomLocation name="location" latname="lat" lngname="long" label="Location" />
                                    <CustomDayPicker name="days" label="Days available" />
                                    <CustomSelect name="chargeTiming" label="How do you charge?" options={chargeTiming} placeholder="Select Charge Timing" />
                                    <div className=" w-full flex lg:flex-row flex-col gap-4 " >
                                        <CustomTimePicker name="openingTime" label="Opening Time" />
                                        <CustomTimePicker name="closingTime" label="Closing Time" />
                                    </div>
                                    <CustomInput name="licenseNumber" label="License Number(Optional)" />
                                </div>
                                <div className=" w-full max-w-[240px] " >
                                    <CustomButton fullWidth onClick={handleContinue} >Continue</CustomButton>
                                </div>
                            </div>
                        </div>
                    )}
                    {tab && (
                        <div className=" w-full flex justify-center " >
                            <div className=" max-w-[520px] w-full gap-6 flex flex-col " >
                                <div className=" flex flex-col gap-2 font-medium " >
                                    <p className=" text-brand " >Step 2</p>
                                    <p className=" text-secondary " >Pictures</p>
                                    <p className=" font-medium text-2xl lg:text-4xl " >Share pictures of your place</p>
                                </div>
                                <div className=" w-full flex flex-col gap-4 " >
                                    <ImagePicker imageFile={imageFile} setImageFile={setImageFile} />
                                </div>
                                <div className=" w-full max-w-[520px] flex gap-4 " >
                                    <CustomButton fullWidth variant="outline" onClick={() => router.back()} >Back</CustomButton>
                                    <CustomButton fullWidth isLoading={isLoading} onClick={formik.handleSubmit} >Continue</CustomButton>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </FormikProvider>
    )
}