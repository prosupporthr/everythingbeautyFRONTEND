"use client"
import { Heart, Send } from "iconsax-reactjs"; 
import { CustomButton, CustomImage, CustomInput } from "../custom";
import { IPostDetail } from "@/helper/model/business";
import { formatNumber } from "@/helper/utils/numberFormat";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";
import { IUserDetail } from "@/helper/model/user";
import { UserCard } from "../shared";
import { useParams, useRouter } from "next/navigation";
import { Avatar, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { textLimit } from "@/helper/utils/textlimit";
import { useEffect, useState } from "react";
import { CommentModal, DeleteModal } from "../modals";
import { IoIosMore } from "react-icons/io";

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
    const [user] = useAtom(userAtom);
    const [show, setShow] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [liked, setLiked] = useState<IProps>();
    const param = useParams();
    const id = param.id as string;

    const router = useRouter();

    const handleClick = (data: "edit" | "delete") => {
        setShow(false);
        if (data === "edit") {
            router.push(`/business/${id}/edit/${item?._id}/post`);
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
        setIsLoading(true);
        const like: IProps = (await click(item?._id)) as any;
        setLiked(like);
        setIsLoading(false);
    };

    return (
        <div
            style={{ boxShadow: "0px 1px 2px 0px #0000000D" }}
            className=" w-full border rounded-3xl h-fit flex flex-col gap-3 pb-4 "
        >
            <div className=" w-full flex items-center justify-between pt-4 px-4 ">
                <div className=" flex items-center gap-2 ">
                    {item?.business?.pictures && (
                        <div className=" w-10 h-10 rounded-full bg-gray-400 ">
                            <Avatar
                                size={"md"}
                                src={item?.business?.pictures[0]}
                                name={item?.business.name}
                            />
                        </div>
                    )}
                    <div className=" flex flex-col ">
                        <p className=" text-sm font-bold capitalize ">
                            {item?.business?.name}
                        </p>
                        <p className=" text-xs text-secondary ">
                            {textLimit(item?.business?.location, 20)}
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
                            <button className=" w-8 h-8 rounded-full flex justify-center items-center bg-[#FCFCFC] ">
                                <IoIosMore size={"20px"} />
                            </button>
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
                    className={` {${isProfile ? " lg:h-[250px] " : "  lg:h-[478px]  "} } w-full h-[200px] flex `}
                >
                    <CustomImage post src={item?.images[0]} alt="post" />
                </div>
            )}
            <div className=" w-full flex flex-col px-4 ">
                {!item?.images[0] && (
                    <p className=" text-sm mb-3 ">{item?.body}</p>
                )}
                <div className=" w-full flex justify-between items-center ">
                    <div className=" flex gap-3 items-center ">
                        <button
                            disabled={isLoading}
                            onClick={handleLikePost}
                            className=" gap-1 flex items-center "
                        >
                            <Heart
                                color={
                                    liked?.likeCount?.hasLiked ? "red" : "black"
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
                        <CommentModal item={item} />
                    </div>
                    <Send size={20} />
                </div>
                {item?.images[0] && <p className=" text-sm ">{item?.body}</p>}
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
            <DeleteModal
                isOpen={isOpen}
                onClose={setIsOpen}
                type={"Post"}
                id={item?._id}
                name={""}
            />
        </div>
    );
}
