"use client";
import {
    CustomButton,
    CustomDayPicker,
    CustomInput,
    CustomLocation,
    CustomSelect,
    CustomTimePicker,
} from "@/components/custom";
import { ImagePicker, LoadingLayout } from "@/components/shared";
import { IBusinessDetails } from "@/helper/model/business";
import { chargeTiming } from "@/helper/services/databank";
import { URLS } from "@/helper/services/urls";
import useBusiness from "@/hooks/useBusiness";
import { useFetchData } from "@/hooks/useFetchData";
import { FormikProvider } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

export default function BusinessCreatePage() {
    const param = useParams();
    const id = param.id as string;

    const { data, isLoading: loading } = useFetchData<IBusinessDetails>({
        endpoint: URLS.BUSINESSBYID(id),
        name: ["business"],
    });

    const { formik, imageFile, setImageFile, isLoading } = useBusiness({
        business: true,
    });
    const router = useRouter();

    useEffect(()=> {
        if(!formik?.values?.name && data?.name){
            formik.setValues({
                userId: data?.creator?._id as string,
                name: data?.name,
                location: data?.location,
                long: data.long ,
                lat: data.lat,
                days: Array.isArray(data?.days)
                    ? [...data.days]
                    : formik.values.days,
                openingTime: data?.openingTime ?? formik.values.openingTime,
                closingTime: data?.closingTime ?? formik.values.closingTime,
                chargeTiming: data?.chargeTiming ?? formik.values.chargeTiming, 
                licenseNumber: data?.licenseNumber ?? formik.values.licenseNumber,
            })
        }
    }, [data, loading]); 

    console.log(formik.errors);
    console.log(formik.values);

    return (
        <LoadingLayout loading={loading}>
            <FormikProvider value={formik}>
                <div className=" w-full flex flex-col pt-10 px-4 items-center ">
                    <div className=" w-full max-w-[1276px] flex flex-col gap-4 pb-5 ">
                        <div className=" flex items-center gap-4 ">
                            <button
                                onClick={() => router.back()}
                                className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary "
                            >
                                <IoArrowBackOutline size={"22px"} />
                            </button>
                            <p className=" font-semibold text-2xl ">
                                Edit Business account
                            </p>
                        </div>
                        {/* {!tab && ( */}
                        <div className=" w-full flex justify-center ">
                            <div className=" max-w-[520px] w-full gap-6 flex flex-col ">
                                <div className=" flex flex-col gap-2 font-medium "></div>
                                <div className=" w-full flex flex-col gap-4 ">
                                    <div className=" w-full flex flex-col gap-4 justify-center items-center ">
                                        <ImagePicker
                                            imageFile={imageFile}
                                            preview={data?.pictures[0]}
                                            setImageFile={setImageFile}
                                        />
                                    </div>
                                    <CustomInput
                                        name="name"
                                        label="Business name"
                                    />
                                    <CustomLocation
                                        name="location"
                                        latname="lat"
                                        lngname="long"
                                        label="Location"
                                    />
                                    <CustomDayPicker
                                        name="days"
                                        label="Days available"
                                    />
                                    <CustomSelect
                                        name="chargeTiming"
                                        label="How do you charge?"
                                        options={chargeTiming}
                                        placeholder="Select Charge Timing"
                                    />
                                    <div className=" w-full flex lg:flex-row flex-col gap-4 ">
                                        <CustomTimePicker
                                            name="openingTime"
                                            label="Opening Time"
                                        />
                                        <CustomTimePicker
                                            name="closingTime"
                                            label="Closing Time"
                                        />
                                    </div>
                                    <CustomInput
                                        name="licenseNumber"
                                        label="License Number"
                                    />
                                </div>
                                <div className=" w-full max-w-[520px] flex gap-4 ">
                                    <CustomButton
                                        fullWidth
                                        variant="outline"
                                        onClick={() => router.back()}
                                    >
                                        Back
                                    </CustomButton>
                                    <CustomButton
                                        fullWidth
                                        isLoading={isLoading}
                                        onClick={formik.handleSubmit}
                                    >
                                        Continue
                                    </CustomButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FormikProvider>
        </LoadingLayout>
    );
}
