"use client";
import { CustomButton, ImageCarousel } from "@/components/custom";
import { DeleteModal } from "@/components/modals";
import { BookmarkBtn, LoadingLayout } from "@/components/shared";
import { BookmarkList } from "@/components/user";
import { IProductDetail, IServiceDetail } from "@/helper/model/business";
import { formatNumber } from "@/helper/utils/numberFormat"; 
import { useFetchData } from "@/hooks/useFetchData";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiStar } from "react-icons/hi2";

interface IBookmark {
    _id: string;
    isDeleted: boolean;
    userId: string;
    productId?: IProductDetail;
    product?: IProductDetail;
    service: IServiceDetail;
    serviceId: IServiceDetail;
    type: "product" | "service";
    createdAt: string;
    updatedAt: string;
}

export default function Bookmark() {
    const [user] = useAtom(userAtom);
    const router = useRouter();
    const [selected, setSelected] = useState<{
        id: string;
        name: string;
    }>({
        id: "",
        name: "",
    });
    const [isOpen, setIsOpen] = useState(false);

    const { data, isLoading } = useFetchData<IBookmark[]>({
        endpoint: `/bookmarks/user/${user?._id}`,
        name: ["bookmarks"],
    });

    const deleteHandler = (name: string, id: string) => {
        setSelected({
            name,
            id,
        });
        setIsOpen(true);
    };

    return (
        <div className=" w-full flex-1 relative flex flex-col py-6 px-6 gap-8 lg:px-8 items-center  ">
            <div className=" w-full flex flex-col gap-4 ">
                <div className=" flex flex-col ">
                    <p className=" text-2xl font-medium capitalize ">
                        Favourite
                    </p>
                    <p className=" text-sm ">
                        See all orders on Everything Beauty
                    </p>
                </div>
            </div>
            <BookmarkList />
        </div>
    );
}
