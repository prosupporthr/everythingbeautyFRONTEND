"use client";
import { IBusinessDetails, IServiceDetail } from "@/helper/model/business";
import { StarRating } from "../shared";
import { CustomButton, CustomImage } from "../custom";
import { useRouter } from "next/navigation";
import { textLimit } from "@/helper/utils/textlimit";
import { formatNumber } from "@/helper/utils/numberFormat";
import { useState } from "react";

export default function BusinessServiceCard({
    item,
}: {
    item: IBusinessDetails;
    setLocation?: (location: google.maps.LatLngLiteral | null) => void;
    location?: google.maps.LatLngLiteral | null;
}) {
    const router = useRouter();

    const formatTime = (timeString: string) => {
        // Create a dummy date object with the specified time
        const [hours, minutes] = timeString.split(":");
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));

        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }).format(date);
    };

    const ServiceCard = (service: IServiceDetail) => {
        return (
            <div className=" w-full flex flex-col gap-2 py-1 ">
                <div className=" w-full flex font-semibold justify-between text-sm items-center ">
                    <p className=" capitalize  ">
                        {textLimit(service.name, 20)}
                    </p>
                    <p>{formatNumber(service?.hourlyRate)}/hr</p>
                </div>
                <div className=" w-full flex flex-wrap gap-3 ">
                    <div className=" w-fit  px-2  border border-brand flex justify-center items-center h-[35px] font-semibold text-brand text-xs rounded-xl">
                        {formatTime(item?.openingTime)}
                    </div>
                    <div className=" w-fit border border-brand flex justify-center items-center px-2 h-[35px] font-semibold text-brand text-xs rounded-xl">
                        {formatTime(item?.closingTime)}
                    </div>
                </div>
            </div>
        );
    };

    // const handleClick = (e: React.MouseEvent<HTMLParagraphElement>) => {

    //     if (setLocation) {
    //         setLocation({
    //             lat: typeof item?.lat === "string" ? parseFloat(item.lat) : item?.lat ?? 0,
    //             lng: typeof item?.long === "string" ? parseFloat(item.long) : item?.long ?? 0
    //         });
    //         setOpen(true)
    //     }
    // }

    const [show, setShow] = useState(false);

    const handleClick = (e: any) => {
        e.stopPropagation();
        setShow((prev) => !prev);
    };

    return (
        <div
            onClick={() => router.push(`/sales/${item?._id}/services`)}
            className={` w-full flex flex-col gap-2 rounded-[10px] shadow p-4 h-fit `}
        >
            <div className="w-full h-[200px] relative rounded-lg rounded-bl-lg bg-gray-200">
                <CustomImage
                    style={{ borderRadius: "8px" }}
                    src={item?.pictures[0]}
                    fillContainer
                    alt={item?.name}
                />
            </div>
            <div
                className={` w-full flex ${item?.services?.length > 0 ? " border-b " : ""} flex-col gap-1 px-2 py-2 `}
            >
                <div className=" w-full flex font-bold items-center justify-between ">
                    <p className=" font-bold capitalize ">{item?.name}</p>
                    {/* <p className=" font-bold text-sm " >2.1 KM</p> */}
                </div>
                <StarRating rating={item?.rating} />
                <p
                    // onClick={(e) => handleClick(e)}
                    className=" font-medium text-sm text-brand cursor-pointer "
                >
                    {textLimit(item?.location, 20)}
                </p>
            </div>
            {show && (
                <>
                    {item?.services?.length > 0 && (
                        <div className=" w-full flex-col flex gap-2 ">
                            {item?.services?.slice(0, 2)?.map((item) => {
                                return <ServiceCard {...item} />;
                            })}
                        </div>
                    )}
                </>
            )}
            <div className=" w-full flex justify-center pt-2 items-center ">
                <button
                    disabled={item?.services?.length === 0}
                    className=" text-brand text-sm w-full disabled:opacity-25 font-semibold "
                    onClick={(e) => handleClick(e)}
                >
                    {show ? "Hide" : "Show more"}
                </button>
            </div>
        </div>
    );
}
