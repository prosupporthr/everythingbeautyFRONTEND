"use client";
import { BusinessProductCard } from "@/components/cards";
import { LoadingLayout } from "@/components/shared";
import { IProductDetail } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller"; 
import { itemDeleted } from "@/store/post";
import { useParams } from "next/navigation"; 
import { useAtom } from "jotai";

export default function Product({
    isProfile,
    businessId,
}: {
    isProfile?: boolean;
    businessId?: string;
}) {
    const param = useParams();
    const id = param.id as string;
    const [deletedItem] = useAtom(itemDeleted);
    const effectiveBusinessId = businessId ?? id ?? "";

    const {
        items = [],
        ref,
        isLoading,
        isFetchingMore,
    } = useInfiniteScroller<IProductDetail>({
        queryKeyBaseArray: ["product", effectiveBusinessId],
        endpoint: URLS.PRODUCTBUSINESSBYID(effectiveBusinessId),
        limit: 10,
        enable: !isProfile ? true : businessId ? true : false,
        noCache: true,
    });

    return (
        <LoadingLayout
            loading={isLoading}
            refetching={isFetchingMore}
            length={items?.filter((item) => !deletedItem.includes(item?._id))?.length}
            ref={ref}
        >
            <div className=" w-full grid lg:grid-cols-4 gap-4 ">
                {items?.filter((item) => !deletedItem.includes(item?._id)).map((item) => {
                    return (
                        <BusinessProductCard
                            isProfile={isProfile}
                            item={item}
                            key={item?._id}
                        />
                    );
                })}
            </div>
        </LoadingLayout>
    );
}
