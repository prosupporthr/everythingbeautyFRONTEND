import { IBusinessDetails } from "@/helper/model/business";
import { CustomButton, CustomImage } from "../custom";
import { StarRating, Verified } from "../shared";
import { textLimit } from "@/helper/utils/textlimit"; 
import { useRouter } from "next/navigation";

export default function LandingBusinessCard({
    item,
    small,
}: {
    item: IBusinessDetails;
    small?: boolean;
}) {

    const router = useRouter()

    return (
        <div
            className={` bg-white ${small ? " h-fit p-2 " : " h-[350px] p-4 "} rounded-2xl flex flex-col gap-4 items-center justify-center shadow-md`}
        >
            <div
                className={` ${small ? " h-[150px] " : " h-full "} rounded-2xl w-full bg-gray-200 relative `}
            >
                <CustomImage
                    nopopup
                    alt={item?.name}
                    style={{
                        borderRadius: "16px",
                    }}
                    src={item?.pictures[0]}
                    fillContainer
                />
                <Verified item={item} />
            </div>
            <div
                className={` ${small ? " flex-col text-black " : " justify-between  items-center "} w-full flex `}
            >
                <div
                    className={` ${small ? " flex-col w-full " : " flex-col "} flex items-start `}
                >
                    <p className=" font-bold capitalize text-sm ">
                        {item?.name}
                    </p>
                    <div className=" flex items-center ">
                        <p className=" text-secondary text-xs ">
                            {textLimit(item?.location, 20)}
                        </p>
                        <StarRating rating={Number(item?.rating)} />
                    </div>
                </div>
                <div className={` ${small ? " w-full mt-3 " : " w-fit px-2 "}  `}>
                    <CustomButton
                        fontSize="12px"
                        fontWeight="bold"
                        height="40px"
                        fullWidth={small}
                        onClick={() =>
                            router.push(`/sales/${item?._id}/services`)
                        }
                    >
                        Book Now
                    </CustomButton>
                </div>
            </div>
        </div>
    );
}
