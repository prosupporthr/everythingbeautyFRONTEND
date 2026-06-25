"use client";
import { BusinessServiceCard, StaffCard } from "@/components/cards";
import { CustomButton, CustomImage } from "@/components/custom";
import { StaffForm } from "@/components/forms";
import { LoadingLayout, ModalLayout } from "@/components/shared";
import {
    IBusinessDetails,
    IServiceDetail,
    IStaffDetail,
} from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller";
import { useFetchData } from "@/hooks/useFetchData";
import { ProfileAdd } from "iconsax-reactjs";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Staff() {
    const param = useParams();
    const id = param.id as string;
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const {
        items = [],
        ref,
        isLoading,
        isFetchingMore,
    } = useInfiniteScroller<IServiceDetail>({
        queryKeyBase: "productfilter",
        endpoint: URLS.SERVICEBUSINESSBYID(id),
        limit: 10,
    });

    const {
        data,
        isLoading: loading,
        isRefetching,
    } = useFetchData<IBusinessDetails>({
        endpoint: URLS.BUSINESSBYID(id),
        name: ["business", id],
    });

    return (
        <LoadingLayout loading={loading}>
            <div className=" w-full flex flex-col gap-4 ">
                <div className=" w-full flex flex-col h-[505px] relative rounded-2xl ">
                    <div className=" w-full h-full absolute inset-0 rounded-2xl ">
                        {!isRefetching && (
                            <CustomImage
                                src={data?.pictures[0] + ""}
                                alt="logo"
                                fillContainer
                            />
                        )}
                    </div>
                    <div className=" bg-black absolute rounded-3xl z-5 inset-0 opacity-30 " />
                    <div className=" w-full h-full flex flex-col px-8 relative z-10 gap-4 justify-center text-white ">
                        <p className=" text-5xl font-bold max-w-[500px] ">
                            Welcome to {data?.name}
                        </p>
                        <p className=" text-sm max-w-[500px] font-medium ">
                            We are thrilled to have you join our elite circle of
                            stylists and skincare specialists. At chacha hair
                            palour we redefine elegance through expert hair
                            weaving and bespoke skincare treatments.
                        </p>
                        <div className=" flex gap-4 mt-4 ">
                            <CustomButton
                                onClick={() =>
                                    router.push(`/business/${data?._id}/edit`)
                                }
                            >
                                Edit Business
                            </CustomButton>
                            <CustomButton
                                onClick={() =>
                                    router.push(`/business/${data?._id}/create/services`)
                                }
                                variant="outlinebrand"
                            >
                                Add Services
                            </CustomButton>
                        </div>
                    </div>
                </div>
                <div className=" w-full flex flex-col gap-4 mt-5 ">
                    <div className=" flex flex-col gap-2 ">
                        <p className=" text-2xl font-bold ">
                            Check out our services
                        </p>
                        <p className=" max-w-[646px] text-sm ">
                            Add your stylists and beauty professionals to get
                            started. You can also skip this for now and add them
                            later from your dashboard.
                        </p>
                    </div>
                    <LoadingLayout
                        loading={isLoading}
                        refetching={isFetchingMore}
                        length={items?.length}
                        ref={ref}
                    >
                        <div className=" w-full grid lg:grid-cols-4 gap-4 ">
                            {items?.map((item) => {
                                return (
                                    <BusinessServiceCard
                                        item={item}
                                        option={true}
                                        key={item?._id}
                                    />
                                );
                            })}
                        </div>
                    </LoadingLayout>
                    <div className=" w-full flex flex-col py-7 border mt-6 items-center justify-center rounded-3xl bg-[#7D23E40D] border-[#7D23E41A] p-6 gap-4 ">
                        <p className=" font-semibold text-brand ">
                            OUR CORE EXPERTISE
                        </p>
                        <div className=" max-w-[700px] w-full flex flex-wrap gap-4 justify-center ">
                            <div
                                style={{
                                    boxShadow: "0px 1px 2px 0px #0000000D",
                                }}
                                className=" h-[42px] px-5 bg-white flex justify-center items-center rounded-full border border-[#7D23E433] "
                            >
                                <p className=" text-sm font-medium text-brand ">
                                    Hair Weaving
                                </p>
                            </div>
                            <div
                                style={{
                                    boxShadow: "0px 1px 2px 0px #0000000D",
                                }}
                                className=" h-[42px] px-5 bg-white flex justify-center items-center rounded-full border border-[#7D23E433] "
                            >
                                <p className=" text-sm font-medium text-brand ">
                                    Advanced Skincare
                                </p>
                            </div>
                            <div
                                style={{
                                    boxShadow: "0px 1px 2px 0px #0000000D",
                                }}
                                className=" h-[42px] px-5 bg-white flex justify-center items-center rounded-full border border-[#7D23E433] "
                            >
                                <p className=" text-sm font-medium text-brand ">
                                    Precision Cutting
                                </p>
                            </div>
                            <div
                                style={{
                                    boxShadow: "0px 1px 2px 0px #0000000D",
                                }}
                                className=" h-[42px] px-5 bg-white flex justify-center items-center rounded-full border border-[#7D23E433] "
                            >
                                <p className=" text-sm font-medium text-brand ">
                                    Color Artistry
                                </p>
                            </div>
                            <div
                                style={{
                                    boxShadow: "0px 1px 2px 0px #0000000D",
                                }}
                                className=" h-[42px] px-5 bg-white flex justify-center items-center rounded-full border border-[#7D23E433] "
                            >
                                <p className=" text-sm font-medium text-brand ">
                                    Bridal Styling
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalLayout
                    size="3xl"
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                >
                    <StaffForm isOpen={isOpen} setIsOpen={setIsOpen} />
                </ModalLayout>
            </div>
        </LoadingLayout>
    );
}
