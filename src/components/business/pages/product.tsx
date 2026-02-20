"use client";
import { BusinessProductCard } from "@/components/cards";
import { LoadingLayout } from "@/components/shared";
import { IProductDetail } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller";
import { useFetchData } from "@/hooks/useFetchData";
import { useParams } from "next/navigation"; 

export default function Product({
    isProfile,
    businessId,
}: {
    isProfile?: boolean;
    businessId?: string;
}) {
    const param = useParams();
    const id = param.id as string;

    const effectiveBusinessId = businessId ?? id ?? "";

    const {
        items = [],
        ref,
        isLoading,
        isFetchingMore,
    } = useInfiniteScroller<IProductDetail>({
        queryKeyBase: "productfilter",
        endpoint: URLS.PRODUCTBUSINESSBYID(effectiveBusinessId),
        limit: 10,
        enable: !isProfile ? true : businessId ? true : false,
    });

    return (
        <LoadingLayout
            loading={isLoading}
            refetching={isFetchingMore}
            length={items?.length}
            ref={ref}
        >
            <div className=" w-full grid lg:grid-cols-4 gap-4 ">
                {items?.map((item) => {
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
