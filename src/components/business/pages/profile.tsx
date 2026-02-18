"use client";
import { CustomButton } from "@/components/custom";
import { CancelSubscriptionBtn } from "@/components/modals";
import { LoadingLayout } from "@/components/shared";
import { IUserDetail } from "@/helper/model/user";
import { dateFormat } from "@/helper/utils/dateFormat";
import { useFetchData } from "@/hooks/useFetchData";
import { userAtom } from "@/store/user";
import { Avatar } from "@heroui/react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

export default function DashboardProfile() {
    const router = useRouter();

    const [userData] = useAtom(userAtom);

    // const { data, isLoading } = useUserStore();
    const { data, isLoading } = useFetchData<IUserDetail>({
        endpoint: `/user/${userData?._id}`,
        name: ["user", userData?._id as string],
        enable: userData?._id ? true : false,
    });

    return (
        <LoadingLayout loading={isLoading}>
            <div className=" w-full flex flex-col py-10 gap-10 h-full rounded-2xl bg-white shadow ">
                <div className=" w-full flex flex-col px-4 lg:px-8 ">
                    <div className=" w-full max-w-[1276px] flex flex-col gap-4 pb-5 ">
                        <div className=" flex gap-3 pb-4 border-b items-center ">
                            <p className=" lg:text-xl font-bold capitalize ">
                                My Profile
                            </p>
                            <div className=" ml-auto  ">
                                <CustomButton
                                    onClick={() =>
                                        router.push(
                                            `/profile/${userData?._id}/edit`,
                                        )
                                    }
                                    variant="outlinebrand"
                                    height="45px"
                                >
                                    Edit Profile
                                </CustomButton>
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
                                <p className=" font-semibold ">About Section</p>
                                <p className=" text-sm max-w-[615px] ">
                                    {data?.about}
                                </p>
                            </div>
                        )}
                        <CancelSubscriptionBtn />
                    </div>
                </div>
            </div>
        </LoadingLayout>
    );
}
