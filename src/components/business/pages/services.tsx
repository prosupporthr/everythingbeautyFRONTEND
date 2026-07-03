"use client";
import { BusinessServiceCard, ServiceCard } from "@/components/cards";
import { LoadingLayout } from "@/components/shared";
import { IServiceDetail } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { itemDeleted } from "@/store/post";

export default function Services({
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
    } = useInfiniteScroller<IServiceDetail>({
        queryKeyBaseArray: ["services", effectiveBusinessId],
        endpoint: URLS.SERVICEBUSINESSBYID(effectiveBusinessId),
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
                {items?.filter((item) => !deletedItem.includes(item?._id))?.map((item) => {
                    return (
                        <ServiceCard
                            item={item}
                            option={isProfile}
                            key={item?._id}
                        />
                    );
                })}
            </div>
        </LoadingLayout>
    );
}
