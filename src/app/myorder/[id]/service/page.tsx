"use client";

import { IoArrowBackOutline } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";
import { RiCalendar2Line } from "react-icons/ri";
import { CustomButton, CustomImage } from "@/components/custom";
import { useFetchData } from "@/hooks/useFetchData";
import {
    IBookingDetail,
    IBusinessDetails,
    ISelectStaff,
    IStaffDetail,
} from "@/helper/model/business";
import {
    LoadingLayout,
    PaymentBtn,
    PaymentMethod,
    UserCard,
} from "@/components/shared";
import { formatNumber } from "@/helper/utils/numberFormat";
import { IUserDetail } from "@/helper/model/user";
import { dateTimeFormat } from "@/helper/utils/dateFormat";
import { RatingBusinessModal, SelectStaffModal } from "@/components/modals";
import useRating from "@/hooks/useRating";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";
import { useEffect, useState } from "react";
import { URLS } from "@/helper/services/urls";
import { StaffCard } from "@/components/cards";

export default function BookedServicesPage() {
    const router = useRouter();
    const param = useParams();

    const id = param.id as string;
    const [user] = useAtom(userAtom);

    const [selectedStaff, setSelectedStaff] = useState<ISelectStaff>({
        label: "",
        value: "",
    });

    const { data, isLoading } = useFetchData<IBookingDetail>({
        endpoint: `/booking/${id}`,
        name: ["booking", id],
    });

    const [isShow, setIsShow] = useState(false);

    const { data: hasReview } = useFetchData<boolean>({
        endpoint: `/review/has-reviewed/${user?._id}/${data?.businessId}`,
        name: ["has-reviewed", id],
        enable: user?._id && data?.businessId ? true : false,
    });

    const { data: staff, isLoading: loadingstaff } = useFetchData<IStaffDetail>(
        {
            endpoint: URLS.STAFFBYID(
                selectedStaff?.value
                    ? selectedStaff?.value
                    : data?.staffId + "",
            ),
            name: ["staff", data?.staffId + "", selectedStaff?.value],
        },
    );

    const { formik, isLoading: loading, isOpen, setIsOpen, tab } = useRating();

    useEffect(() => {
        if (data?.businessId) {
            formik.setFieldValue("businessId", data?.businessId);
        }

        if (user?._id) {
            formik.setFieldValue("userId", user?._id);
        }
    }, [data?.businessId, user?._id]);

    useEffect(() => {
        if (staff && !selectedStaff?.label) {
            setSelectedStaff({
                label: staff?.name,
                value: staff?._id,
            });
        }
    }, [staff]);

    return (
        <div className=" w-full min-h-[50vh] ">
            <LoadingLayout loading={isLoading}>
                <div className=" w-full flex flex-col py-6 lg:py-10 gap-10 h-full ">
                    <div className=" w-full flex flex-col px-6 lg:px-8 ">
                        <div className=" w-full  flex flex-col gap-4 pb-5 ">
                            <div className=" flex gap-3 items-center ">
                                <button
                                    onClick={() => router.back()}
                                    className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary "
                                >
                                    <IoArrowBackOutline size={"22px"} />
                                </button>
                                <p className=" text-lg lg:text-2xl font-bold capitalize ">
                                    My booking
                                </p>
                            </div>

                            <div className=" w-full flex lg:flex-row flex-col gap-6 lg:gap-12 lg:p-4 ">
                                <div className=" w-full flex flex-col gap-4 ">
                                    <div className=" lg:flex hidden items-center gap-3 pb-3 border-b ">
                                        <div className=" w-fit ">
                                            <div className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary ">
                                                <RiCalendar2Line
                                                    size={"20px"}
                                                />
                                            </div>
                                        </div>
                                        <div className=" flex flex-col text-xs ">
                                            <p className=" font-bold ">{`You won't be charged until Vendors accepts your request.`}</p>
                                            <p className=" font-medium ">{`This usually takes up to 24 hours`}</p>
                                        </div>
                                    </div>
                                    <div className=" w-full flex gap-4 lg:flex-row flex-col lg:gap-2 lg:items-center pb-3 border-b ">
                                        <div className=" w-full lg:w-[123px] h-[200px] lg:h-[103px] rounded-2xl bg-gray-200 ">
                                            <CustomImage
                                                alt={
                                                    data?.service
                                                        ?.name as string
                                                }
                                                style={{
                                                    borderRadius: "16px",
                                                }}
                                                src={
                                                    data?.service
                                                        ?.pictures[0] as string
                                                }
                                                fillContainer
                                            />
                                        </div>
                                        <div className=" lg:hidden flex items-center gap-3 pb-3 border-b ">
                                            <div className=" w-fit ">
                                                <div className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary ">
                                                    <RiCalendar2Line
                                                        size={"20px"}
                                                    />
                                                </div>
                                            </div>
                                            <div className=" flex flex-col text-xs ">
                                                <p className=" font-bold ">{`You won't be charged until Vendors accepts your request.`}</p>
                                                <p className=" font-medium ">{`This usually takes up to 24 hours`}</p>
                                            </div>
                                        </div>
                                        <div className=" flex flex-col gap-1 text-sm ">
                                            <div className=" flex gap-4 items-center ">
                                                <p className=" text-secondary w-[100px] ">
                                                    Service:
                                                </p>
                                                <p className=" font-bold text-left capitalize ">
                                                    {data?.service?.name}
                                                </p>
                                            </div>
                                            <div className=" flex gap-4 items-center ">
                                                <p className=" text-secondary w-[100px] ">
                                                    Time & Date:
                                                </p>
                                                <p className=" font-bold text-left ">
                                                    {dateTimeFormat(
                                                        data?.bookingDate as string,
                                                    )}
                                                </p>
                                            </div>
                                            <div className=" flex gap-4 items-center ">
                                                <p className=" text-secondary w-[100px] ">
                                                    Price:
                                                </p>
                                                <p className=" font-bold text-left ">
                                                    {formatNumber(
                                                        Number(
                                                            data?.service
                                                                ?.hourlyRate,
                                                        ),
                                                    )}
                                                </p>
                                            </div>
                                            <div className=" flex gap-4 items-center ">
                                                <p className=" text-secondary w-[100px] ">
                                                    Status:
                                                </p>
                                                <p
                                                    className={` ${data?.status === "APPROVED" ? " border border-success-200 text-success-600 " : " border-warning-200 text-warning-600 "} text-[10px] px-2 h-[25px] rounded-2xl flex justify-center items-center font-bold text-left `}
                                                >
                                                    {data?.status}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className=" w-full flex-col flex gap-2 pb-3 border-b ">
                                        <p className=" font-semibold ">
                                            Customer Information
                                        </p> 
                                        <p className=" text-sm font-medium capitalize ">
                                            <span className=" font-bold ">
                                                Full Name:
                                            </span>{" "}
                                            {
                                                data?.user?.firstName+" "+data?.user?.lastName
                                            }
                                        </p>
                                        <p className=" text-sm font-medium ">
                                            <span className=" font-bold ">
                                                Phone Number:
                                            </span>{" "}
                                            {
                                                data?.user?.phoneNumber
                                            }
                                        </p>
                                        <p className=" text-sm font-medium ">
                                            <span className=" font-bold ">
                                                Email Address:
                                            </span>{" "}
                                            {
                                                data?.user?.email
                                            }
                                        </p>
                                    </div>
                                    <div className=" w-full flex-col flex gap-2 pb-3 border-b ">
                                        <p className=" font-semibold ">
                                            Business Information
                                        </p>
                                        <p className=" text-sm font-medium mt-3 ">
                                            <span className=" font-bold ">
                                                Address:
                                            </span>{" "}
                                            {data?.service?.business?.location}
                                        </p>
                                        <p className=" text-sm font-medium ">
                                            <span className=" font-bold ">
                                                Phone Number:
                                            </span>{" "}
                                            {
                                                data?.service?.business?.creator
                                                    ?.phoneNumber
                                            }
                                        </p>
                                    </div>

                                    <div className=" w-full flex-col flex gap-2 pb-3 border-b ">
                                        <UserCard
                                            item={
                                                data?.service?.business
                                                    ?.creator as IUserDetail
                                            }
                                            showDetail
                                        />
                                    </div>

                                    {data?.status === "APPROVED" &&
                                        !hasReview && (
                                            <div className=" lg:max-w-[300px] w-full ">
                                                <CustomButton
                                                    onClick={() =>
                                                        setIsOpen(true)
                                                    }
                                                    fullWidth
                                                >
                                                    Rate Business
                                                </CustomButton>
                                            </div>
                                        )}
                                    {data?.status === "AWAITING_APPROVAL" && (
                                        <PaymentMethod />
                                    )}
                                    {data?.status === "AWAITING_APPROVAL" && (
                                        <div className=" lg:max-w-[300px] w-full ">
                                            <PaymentBtn
                                                type={"booking"}
                                                title="Make Payment"
                                                ordered
                                                id={data?._id}
                                                amount={data?.totalPrice}
                                                user={user as IUserDetail}
                                                isClosable
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className=" w-fit flex-col flex gap-3 pb-3 border-b ">
                                    <div className=" flex justify-between items-center ">
                                        <p className=" font-bold ">
                                            Selected Staff:
                                        </p>
                                    </div>
                                    <LoadingLayout loading={loadingstaff}>
                                        <StaffCard
                                            item={staff as IStaffDetail}
                                        />
                                    </LoadingLayout>

                                    <div className={` `}>
                                        <CustomButton
                                            fullWidth
                                            onClick={() => setIsShow(true)}
                                            isLoading={isLoading}
                                        >
                                            {"Change Staff"}
                                        </CustomButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LoadingLayout>

            <SelectStaffModal
                selectStaff={selectedStaff}
                setSelectStaff={setSelectedStaff}
                id={data?.businessId + ""}
                isOpen={isShow}
                onClose={setIsShow}
                type="user"
                currentId={data?.staffId}
            />
            <RatingBusinessModal
                tab={tab}
                open={isOpen}
                setOpen={setIsOpen}
                data={data?.service?.business as IBusinessDetails}
                formik={formik}
                loading={loading}
            />
        </div>
    );
}
