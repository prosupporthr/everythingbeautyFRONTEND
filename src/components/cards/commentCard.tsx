import { IComment } from "@/helper/model/post";
import { Heart, Trash } from "iconsax-reactjs";
import { HiReply } from "react-icons/hi";
import { UserCard } from "../shared";
import moment from "moment";
import { Spinner } from "@heroui/react"; 
import { useEffect, useState } from "react";
import { DeleteModal } from "../modals";

interface IProps {
    reply?: boolean;
    item: IComment; 
    setCommentId?: (by: { id: string; name: string; message: string }) => void;
    onLike: ()=> void;
    onDelete: ()=> void;
    loadingLike?: string;
    newLikeData?: IComment;
}

export default function CommentCard({
    reply,
    item, 
    setCommentId, 
    onLike, 
    loadingLike,
    newLikeData
}: IProps) { 

    const [ isLiked, setIsLiked ] = useState({ hasLiked: false, likeCount: 0 });

    useEffect(() => {
        if (newLikeData && newLikeData?._id === item?._id) {
            setIsLiked({ hasLiked: newLikeData?.hasLiked, likeCount: newLikeData?.likeCount });
        }
    }, [newLikeData]);
 
    console.log(newLikeData);
    console.log(item);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => { 
        setIsLiked({ hasLiked: item?.hasLiked, likeCount: item?.likeCount }); 
    }, []);

    return (
        <div className=" w-full flex flex-col gap-2 ">
            <div className=" w-full flex gap-2  ">
                <UserCard item={item?.user} />
                <div className=" flex-1 flex-col gap-1 flex ">
                    <div className=" w-full flex justify-between ">
                        <p className=" text-sm font-bold capitalize ">
                            {item?.user?.firstName + " " + item?.user?.lastName}
                        </p>
                        <p className=" text-secondary text-xs ">
                            {moment(item?.createdAt).fromNow()}
                        </p>
                    </div>
                    <p className=" text-sm text-secondary ">{item?.body}</p>
                    <div className=" flex items-center gap-3 ">
                        {!reply && (
                            <button
                                onClick={() =>
                                    setCommentId?.({
                                        id: item?._id,
                                        name:
                                            item?.user?.firstName +
                                            " " +
                                            item?.user?.lastName,
                                        message: item?.body,
                                    })
                                }
                                className=" flex gap-1 items-center "
                            >
                                <HiReply size={15} />
                                <p className=" text-xs font-semibold ">Reply</p>
                            </button>
                        )}
                        <button onClick={onLike} disabled={loadingLike === item?._id} className=" flex gap-1 items-center ">
                            {loadingLike === item?._id ? <Spinner size="sm" /> : <Heart variant={isLiked?.hasLiked ? "Bold" : "Linear"} color={isLiked?.hasLiked ? "red" : "black"} size={15} />}
                            <p className=" text-xs font-semibold ">{isLiked?.likeCount}</p>
                        </button>
                        <button onClick={() => setIsOpen(true)} className=" flex gap-1 text-red-500 items-center ">
                            <Trash size={15} /> 
                        </button>
                    </div>
                </div>
            </div>

            <DeleteModal
                isOpen={isOpen}
                onClose={setIsOpen}
                type={reply ? "Reply" : "Comment"}
                id={item?._id}
                name={""}
            />
        </div>
    );
}
