"use client";
import { CustomButton } from "@/components/custom";
import { LoadingLayout, ShareBtn } from "@/components/shared";
import { IUserDetail } from "@/helper/model/user";
import { URLS } from "@/helper/services/urls";
import { dateFormat } from "@/helper/utils/dateFormat";
import { useFetchData } from "@/hooks/useFetchData";
import { userAtom } from "@/store/user";
import { Avatar } from "@heroui/react";
import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { lazy, Suspense, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

export default function ProfilePage() {
    const param = useParams();

    const router = useRouter();

    const id = param.id as string;

    // const { data, isLoading } = useUserStore();
    const { data, isLoading } = useFetchData<IUserDetail>({
        endpoint: URLS.USERUPDATE(id),
        name: ["user", id],
    });

    const [userData] = useAtom(userAtom);

    // Lazy load tab components
    const BusinessServices = lazy(() =>
        import("@/components/business").then((module) => ({
            default: module.BusinessServices,
        })),
    );
    const BusinessProduct = lazy(() =>
        import("@/components/business").then((module) => ({
            default: module.BusinessProduct,
        })),
    );

    const [selectedTab, setSelectedTab] = useState("services");

    return (
        <div className=" w-full min-h-[50vh] bg-[#F9F9F9] p-8 ">
            <LoadingLayout loading={isLoading}>
                <div className=" w-full flex flex-col py-10 gap-10 h-full rounded-2xl bg-white ">
                    <div className=" w-full flex flex-col px-4 lg:px-8 ">
                        <div className=" w-full max-w-[1276px] flex flex-col gap-4 pb-5 ">
                            <div className=" flex gap-3 pb-4 border-b items-center ">
                                <button
                                    onClick={() => router.back()}
                                    className=" w-10 h-10 lg:w-12 lg:h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary "
                                >
                                    <IoArrowBackOutline size={"22px"} />
                                </button>
                                <p className=" lg:text-2xl font-bold capitalize ">
                                    Profile
                                </p>
                                <div className=" ml-auto gap-4 flex items-center  ">
                                    {userData?._id === id && (
                                        <CustomButton
                                            onClick={() =>
                                                router.push(
                                                    `/profile/${id}/edit`,
                                                )
                                            }
                                            variant="outlinebrand"
                                            height="45px"
                                        >
                                            Edit Profile
                                        </CustomButton>
                                    )}
                                    <ShareBtn id={id} type="user" />
                                </div>
                            </div>
                            <div className=" w-full flex flex-col gap-4 ">
                                <div className=" w-full flex lg:flex-row flex-col items-center gap-4 ">
                                    <Avatar
                                        src={data?.profilePicture}
                                        className=" w-[150px] h-[150px] "
                                        name={data?.firstName}
                                    />
                                    <div className=" flex flex-col items-center lg:items-start gap-1 ">
                                        <div className=" flex items-center gap-1 ">
                                            <p className=" text-2xl font-semibold capitalize ">
                                                {data?.firstName +
                                                    " " +
                                                    data?.lastName}
                                            </p>
                                        </div>
                                        <p className=" text-sm font-medium ">
                                            {data?.email}
                                        </p>
                                        <p className=" text-secondary text-xs ">
                                            Joined{" "}
                                            {dateFormat(data?.createdAt ?? "")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" w-full flex-col flex gap-6 ">
                            {data?.about && (
                                <div className=" flex flex-col ">
                                    <p className=" font-semibold ">
                                        About Section
                                    </p>
                                    <p className=" text-sm max-w-[615px] ">
                                        {data?.about}
                                    </p>
                                </div>
                            )}

                            <div className=" w-full flex gap-4 ">
                                <CustomButton
                                    onClick={() => setSelectedTab("services")}
                                    variant={
                                        selectedTab === "services"
                                            ? "primary"
                                            : "outline"
                                    }
                                    height="40px"
                                    className={` !font-medium ${selectedTab === "services" ? "!bg-[#F7F2FF] !text-brand  " : ""} `}
                                >
                                    Services
                                </CustomButton>
                                <CustomButton
                                    onClick={() => setSelectedTab("store")}
                                    variant={
                                        selectedTab === "store"
                                            ? "primary"
                                            : "outline"
                                    }
                                    height="40px"
                                    className={` !font-medium  ${selectedTab === "store" ? "!bg-[#F7F2FF] !text-brand  " : ""}  `}
                                >
                                    Product
                                </CustomButton>
                            </div>
                            <Suspense
                                fallback={
                                    <div className=" py-4 lg:p-4 text-center ">
                                        Loading...
                                    </div>
                                }
                            >
                                {selectedTab === "services" && (
                                    <BusinessServices
                                        isProfile={userData?._id === id}
                                        businessId={data?.business?._id}
                                    />
                                )}
                                {selectedTab === "store" && (
                                    <BusinessProduct
                                        isProfile={userData?._id === id}
                                        businessId={data?.business?._id}
                                    />
                                )}
                            </Suspense>
                        </div>
                    </div>
                </div>
            </LoadingLayout>
        </div>
    );
}
