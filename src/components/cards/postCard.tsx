import { Heart, Send, Save2 } from "iconsax-reactjs";
import { CgComment } from "react-icons/cg";
import { CustomButton, CustomImage, CustomInput } from "../custom";
import { IPostDetail } from "@/helper/model/business";
import { formatNumber } from "@/helper/utils/numberFormat";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";
import { IUserDetail } from "@/helper/model/user";
import { UserCard } from "../shared";
import { useRouter } from "next/navigation";
import { Avatar } from "@heroui/react";
import { textLimit } from "@/helper/utils/textlimit";

export default function PostCard({ item }: { item: IPostDetail }) {
    const [user] = useAtom(userAtom);

    const router = useRouter();

    return (
        <div
            style={{ boxShadow: "0px 1px 2px 0px #0000000D" }}
            className=" w-full border rounded-3xl flex flex-col gap-3 pb-4 "
        >
            <div className=" w-full flex items-center justify-between pt-4 px-4 ">
                <div className=" flex items-center gap-2 ">
                    {item.business.pictures && (
                        <div className=" w-10 h-10 rounded-full bg-gray-400 ">
                            <Avatar
                                size={"md"}
                                src={item.business.pictures[0]}
                                name={item?.business.name}
                            />
                        </div>
                    )}
                    <div className=" flex flex-col ">
                        <p className=" text-sm font-bold capitalize ">
                            {item?.business.name}
                        </p>
                        <p className=" text-xs text-secondary ">
                            {textLimit(item?.business?.location, 20)}
                        </p>
                    </div>
                </div>
            </div>
            <div className=" w-full h-[200px] lg:h-[478px] flex ">
                <CustomImage src={item?.images[0]} alt="post" fillContainer />
            </div>
            <div className=" w-full flex flex-col px-4 ">
                <div className=" w-full flex justify-between items-center ">
                    <div className=" flex gap-3 items-center ">
                        <Heart size={16} />
                        <CgComment size={16} />
                        <Send size={16} />
                    </div>
                    <Save2 />
                </div>
                {/* <p className=" text-sm font-bold ">
                    Mercy Skin Care{" "}
                    <span className=" font-normal ">
                        Ready for the weekend glow? ✨ Our Signature
                    </span>{" "}
                </p> */}
                <p className=" text-sm ">{item?.body}</p>
                {/* <p className=" text-sm text-brand font-medium ">
                    #SkincareGoals #EverythingBeauty #GlowFacial #SalonLife
                    #BeautyTransformation
                </p> */}
                {item?.product?.pictures && (
                    <div className=" w-full border border-[#8127CF1A] mt-4 bg-[#F0F3FF] rounded-2xl h-[82px] p-4 flex justify-between ">
                        <div className=" flex items-center gap-2 ">
                            <div className=" w-12 h-12 rounded-xl flex justify-center items-center ">
                                {item?.product?.pictures && (
                                    <CustomImage
                                        src={item.product.pictures[0] + ""}
                                        alt="pic"
                                        fillContainer
                                    />
                                )}
                            </div>
                            <div className=" flex flex-col ">
                                <p className=" text-sm font-bold ">
                                    {item?.product?.name}
                                </p>
                                <p className=" text-xs text-secondary ">
                                    60 mins •{" "}
                                    {formatNumber(Number(item?.product?.price))}
                                </p>
                            </div>
                        </div>
                        <CustomButton
                            onClick={() =>
                                router.push(`/sales/${item?.productId}/product`)
                            }
                            height="40px"
                        >
                            Book
                        </CustomButton>
                    </div>
                )}
                {item?.userId !== user?._id && (
                    <div className=" w-full flex gap-2 mt-6 ">
                        <div className=" w-fit mt-1 ">
                            <UserCard size="sm" item={user as IUserDetail} />
                        </div>
                        <CustomInput
                            placeholder="Add a comment..."
                            notform
                            name={""}
                            textarea
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
