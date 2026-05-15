"use client";
import { CustomButton, CustomInput, CustomSelect } from "@/components/custom";
import { AddressPicker, ModalLayout } from "@/components/shared";
import { IAddressDetail } from "@/helper/model/auth"; 
import { DISTANCE_UNITS, MASS_UNITS } from "@/helper/model/ship"; 
import useShipping from "@/hooks/useShipping";
import { userAtom } from "@/store/user";
import { FormikProvider } from "formik";
import { Calendar2, Copy } from "iconsax-reactjs";
import { useAtom } from "jotai"; 
import { useEffect, useState } from "react";
import { HiMiniCheckBadge } from "react-icons/hi2";

export default function Shippment() {
    const { formik, setIsOpen, isOpen, isLoading } = useShipping();

    // const param = useParams();

    // const id = param.id as string;
    const [user] = useAtom(userAtom);

    const [defaultAddress, setDefaultAddress] = useState({} as IAddressDetail); 
    
    useEffect(() => {
        if (defaultAddress?._id && user?._id) {
            formik.setFieldValue("address_from.city", defaultAddress?.city);
            formik.setFieldValue(
                "address_from.country",
                defaultAddress?.country,
            );
            formik.setFieldValue("address_from.email", user?.email);
            formik.setFieldValue(
                "address_from.name",
                user?.firstName + " " + user?.lastName,
            );
            formik.setFieldValue("address_from.phone", user?.phoneNumber);
            formik.setFieldValue("address_from.state", defaultAddress?.state);
            formik.setFieldValue(
                "address_from.street",
                defaultAddress?.address,
            );
        }
    }, [defaultAddress]);

    return (
        <FormikProvider value={formik}>
            <div className=" w-full flex flex-col py-6 lg:py-10 gap-10 h-full ">
                <div className=" w-full flex flex-col justify-center items-center px-6 lg:px-8 ">
                    <form onSubmit={formik.handleSubmit} className=" max-w-[600px] flex flex-col gap-6 w-full ">
                        {formik.values?.parcels.map((_, index) => {
                            return (
                                <div
                                    key={index}
                                    className=" w-full flex flex-col gap-4 "
                                >
                                    <p className=" text-lg font-semibold ">
                                        Package Dimension
                                    </p>
                                    <CustomSelect
                                        name={`parcels[${index}].distance`}
                                        label="Distance"
                                        options={DISTANCE_UNITS}
                                    />
                                    <CustomInput
                                        name={`parcels[${index}].length`}
                                        type="number"
                                        label={`Length(${formik.values?.parcels[index]?.distance})`}
                                    />
                                    <CustomInput
                                        name={`parcels[${index}].height`}
                                        type="number"
                                        label={`Height(${formik.values?.parcels[index]?.distance})`}
                                    />
                                    <CustomInput
                                        name={`parcels[${index}].weight`}
                                        type="number"
                                        label={`Weight(${formik.values?.parcels[index]?.distance})`}
                                    />
                                    <CustomSelect
                                        name={`parcels[${index}].mass_unit`}
                                        label="Unit Mass"
                                        options={MASS_UNITS}
                                    />
                                    <CustomInput
                                        name={`parcels[${index}].width`}
                                        type="number"
                                        label={`Width(${formik.values?.parcels[index]?.mass_unit})`}
                                    />
                                </div>
                            );
                        })}
                        <AddressPicker setAddress={setDefaultAddress} ship />
                        <div className=" w-full flex gap-4 ">
                            <CustomButton variant="outlinebrand" >Cancel</CustomButton>
                            <CustomButton type="submit" isLoading={isLoading} >Create Shipment</CustomButton>
                        </div>
                    </form>
                    <ModalLayout
                        size="full"
                        isOpen={isOpen}
                        onClose={()=> setIsOpen(false)}
                    >
                        <div className=" w-full h-full flex flex-col gap-4 items-center justify-center ">
                            <HiMiniCheckBadge
                                size={140}
                                className="text-green-600"
                            />
                            <div className="  max-w-[510px] w-full ">
                                <div className=" flex flex-col gap-1  ">
                                    <p className=" text-3xl font-bold ">
                                        Shipment Successfully Created
                                    </p>
                                    <p className=" text-secondary max-w-[444.5px] text-center ">
                                        Your package details have been saved and
                                        it is ready to be processed.
                                    </p>
                                </div>
                                <div className=" max-w-[510px] w-full bg-[#F8F2FF] border-2 border-brand rounded-2xl h-[150px] flex justify-center items-center flex-col ">
                                    <p className=" text-xs font-medium text-secondary ">
                                        TRACKING NUMBER
                                    </p>
                                    <p className=" text-2xl font-bold text-brand ">
                                        LGF-98234-X1
                                    </p>
                                    <button className=" flex items-center gap-1 ">
                                        <Copy size={12} />
                                        <p className=" text-sm font-semibold text-brand ">
                                            Copy
                                        </p>
                                    </button>
                                </div>
                                <div className=" max-w-[510px] w-full  h-[118px] flex gap-2 ">
                                    <div className=" w-full flex flex-col px-4 justify-center h-full gap-1 border border-[#CEC2D5] rounded-2xl ">
                                        <div className=" flex items-center gap-1 ">
                                            <Calendar2 size={16} />
                                            <p className=" text-xs font-medium ">
                                                Estimated Delivery
                                            </p>
                                        </div>
                                        <p className=" text-xl font-semibold ">
                                            Oct 26, 2023
                                        </p>
                                        <p className=" text-xs text-secondary ">
                                            By End of Day
                                        </p>
                                    </div>
                                    <div className=" w-full flex flex-col px-4 justify-center h-full gap-1 border border-[#CEC2D5] rounded-2xl ">
                                        <div className=" flex items-center gap-1 ">
                                            <Calendar2 size={16} />
                                            <p className=" text-xs font-medium ">
                                                Package Dimensions
                                            </p>
                                        </div>
                                        <p className=" text-xl font-semibold ">
                                            Standard Carton
                                        </p>
                                        <p className=" text-xs text-secondary ">
                                            14" x 10" x 8" • 6.2 lbs
                                        </p>
                                    </div>
                                </div>
                                <div className="max-w-[510px] h-fit w-full flex p-4 justify-between gap-1 border border-[#CEC2D5] rounded-2xl ">
                                    <div className=" w-fit flex flex-col ">
                                        <div className=" flex items-center gap-1 ">
                                            <Calendar2 size={16} />
                                            <p className=" text-xs font-medium ">
                                                Shipping Address
                                            </p>
                                        </div>
                                        <p className=" text-xl font-semibold ">
                                            Acme Corp Logistics
                                        </p>
                                        <p className=" max-w-[205px] text-sm text-secondary ">
                                            4500 Freight Parkway, Dock 12 <br />
                                            Chicago, L 60607 <br />
                                            United States
                                        </p>
                                    </div>
                                    <div className=" border border-[#CEC2D5] rounded-xl bg-[#E5E2E1] h-[96px] w-[96px] mt-auto "></div>
                                </div>
                                <div className=" max-w-[510px] mt-6 flex items-center h-fit w-full gap-3 ">
                                    <CustomButton>
                                        Print Shipping label
                                    </CustomButton>
                                    <CustomButton variant="outlinebrand">
                                        Track Shipment
                                    </CustomButton>
                                    <button className=" text-xs px-3 ">
                                        Return to Dashboard
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ModalLayout>
                </div>
            </div>
        </FormikProvider>
    );
}
