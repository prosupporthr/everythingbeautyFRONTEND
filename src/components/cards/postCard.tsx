"use client";
import { Heart, Send } from "iconsax-reactjs";
import { CustomButton, CustomImage, ImageCarousel } from "../custom";
import { IPostDetail } from "@/helper/model/business";
import { formatNumber } from "@/helper/utils/numberFormat";
import { ModalLayout } from "../shared";
import { usePathname, useRouter } from "next/navigation";
import {
    Avatar,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Spinner,
} from "@heroui/react";
import { textLimit } from "@/helper/utils/textlimit";
import { useEffect, useState } from "react";
import { CommentModal, DeleteModal } from "../modals";
import { IoIosMore } from "react-icons/io";
import moment from "moment-timezone";

interface IProps {
    postId: string;
    likeCount: {
        hasLiked: boolean;
        likes: number;
    };
}

export default function PostCard({
    item,
    isProfile,
    click,
}: {
    item: IPostDetail;
    isProfile?: boolean;
    click: (by: string) => void;
}) {
    const [show, setShow] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isShow, setIsShow] = useState("");
    const [isLoading, setIsLoading] = useState("");
    const [liked, setLiked] = useState<IProps>();
    const [activeId, setActiveId] = useState<string>(""); 

    const router = useRouter();

    const handleClick = (data: "edit" | "delete") => {
        setShow(false);
        if (data === "edit") {
            if (!item?.business?._id) {
                router.push(
                    `/dashboard/post/edit/${item?._id}`,
                );
            } else {
                router.push(
                    `/business/${item?.business?._id}/edit/${item?._id}/post`,
                );
            }
        } else {
            setIsOpen(true);
        }
    };

    useEffect(() => {
        setLiked({
            postId: item?._id,
            likeCount: {
                hasLiked: item?.hasLiked,
                likes: item?.likeCount,
            },
        });
    }, []);

    const handleLikePost = async () => {
        setIsLoading(item?._id);
        const like: IProps = (await click(item?._id)) as any;
        setLiked(like);
        setIsLoading("");
    };

    return (
        <div
            style={{ boxShadow: "0px 1px 2px 0px #0000000D" }}
            className=" w-full border border-[#CFC2D6] rounded-3xl h-fit flex flex-col gap-3 pb-4 "
        >
            <div className=" w-full flex items-center justify-between pt-4 px-4 ">
                <div className=" flex items-center gap-2 ">
                    {item?.creator?.data?.profilePicture && (
                        <div className=" w-10 h-10 rounded-full bg-gray-400 ">
                            <Avatar
                                size={"md"}
                                src={item?.creator?.data?.profilePicture}
                                name={item?.creator?.data?.firstName}
                            />
                        </div>
                    )}
                    <div className=" flex flex-col ">
                        <div className=" flex gap-2 items-center ">
                            <p className=" text-sm font-bold capitalize ">
                                {item?.creator?.data?.firstName+" "+item?.creator?.data?.lastName}
                            </p>
                        </div>
                        {/* <p className=" text-xs text-secondary ">
                            {textLimit(item?.business?.location, 20)}
                        </p> */}
                        <p className=" text-xs text-secondary ">
                            {moment(item?.createdAt).fromNow()}
                        </p>
                    </div>
                </div>
                {isProfile && (
                    <Popover
                        showArrow
                        isOpen={show}
                        onOpenChange={setShow}
                        backdrop={"opaque"}
                        offset={10}
                        placement="top"
                    >
                        <PopoverTrigger>
                            <div>
                                <button className=" w-8 h-8 rounded-full flex justify-center items-center bg-[#FCFCFC] ">
                                    <IoIosMore size={"20px"} />
                                </button>
                            </div>
                        </PopoverTrigger>

                        <PopoverContent className="w-[100px]">
                            <div className=" w-full flex flex-col gap-1 ">
                                <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 ">
                                    <button
                                        onClick={() => handleClick("edit")}
                                        className=" h-[40px] flex w-full justify-center items-center text-sm font-medium "
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className=" py-1 flex flex-col gap-2 ">
                                    <button
                                        onClick={() => handleClick("delete")}
                                        className=" h-[40px] text-[#FF554A] flex w-full justify-center items-center text-sm font-medium "
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            </div>
            {item?.images[0] && (
                <div
                    className={` {${isProfile ? " lg:h-[250px] " : "  lg:h-[300px]  "} } w-full h-[200px] flex px-2 `}
                >
                    {/* <CustomImage post src={item?.images[0]} alt="post" /> */}

                    <ImageCarousel images={item?.images} />
                </div>
            )}
            <div className=" w-full flex flex-col px-4 ">
                <p className=" text-sm mb-3 ">
                    {textLimit(item?.body, 120)}
                    {item?.body.length > 120 && (
                        <span
                            onClick={() => setIsShow(item?._id)}
                            className=" text-xs font-semibold text-brand cursor-pointer "
                        >
                            show more
                        </span>
                    )}
                </p>
                <div className=" w-full flex justify-between items-center ">
                    <div className=" flex gap-3 items-center ">
                        {isLoading === item?._id && <Spinner size="sm" />}
                        {isLoading !== item?._id && (
                            <button
                                disabled={isLoading === item?._id}
                                onClick={handleLikePost}
                                className=" gap-1 flex items-center "
                            >
                                <Heart
                                    color={
                                        liked?.likeCount?.hasLiked
                                            ? "red"
                                            : "black"
                                    }
                                    variant={
                                        liked?.likeCount?.hasLiked
                                            ? "Bold"
                                            : "Linear"
                                    }
                                    size={23}
                                />
                                <p className=" text-[10px] font-bold ">
                                    {liked?.likeCount?.likes}
                                </p>
                            </button>
                        )}
                        <CommentModal
                            post={item}
                            setActiveId={setActiveId}
                            activeId={activeId}
                        />
                    </div>
                    {/* <Send size={20} /> */}
                </div>
                {/* {item?.images[0] && <p className=" text-sm ">{item?.body}</p>} */}
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
                                    {textLimit(item?.product?.name, 40)}
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
                {/* {item?.userId !== user?._id && (
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
                )} */}
            </div>
            <DeleteModal
                isOpen={isOpen}
                onClose={setIsOpen}
                type={"Post"}
                id={item?._id}
                name={""}
            />
            <ModalLayout
                title="Post Content"
                isOpen={item?._id === isShow}
                onClose={() => setIsShow("")}
                nospace
            >
                <div className=" mb-4 max-h-[60vh] overflow-auto px-4 ">
                    <p className=" text-sm ">{item?.body}</p>
                </div>
            </ModalLayout>
        </div>
    );
}
