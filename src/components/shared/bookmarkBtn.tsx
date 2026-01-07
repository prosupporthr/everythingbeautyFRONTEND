import { IProductDetail, IServiceDetail } from "@/helper/model/business"
import useBusiness from "@/hooks/useBusiness"
import { userAtom } from "@/store/user"
import { Spinner } from "@heroui/spinner"
import { useAtom } from "jotai"
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io"

export default function BookmarkBtn({ item, type }: { item?: IServiceDetail | IProductDetail, type: "service" | "product" }) {

    const currentType = type === "service" ? "serviceId" : "productId"
    const { bookmarkMutation } = useBusiness({})
    const [user] = useAtom(userAtom)

    const handleBookmark = () => {
        bookmarkMutation.mutate({
            userId: user?._id as string,
            type: type,
            [currentType]: item?._id
        })
    }

    return (
        <div className=" w-fit " >
            <button onClick={handleBookmark} disabled={bookmarkMutation?.isPending} className=" w-8 h-8 rounded-full flex justify-center items-center border " >
                {bookmarkMutation?.isPending ? (
                    <Spinner size="sm" />
                ) : (
                    <>
                        {item?.hasBookmarked ? (
                            <IoMdHeart size={"16px"} color="red" />
                        ) : (
                            <IoMdHeartEmpty size={"16px"} color="gray" />
                        )}
                    </>
                )}
            </button>
        </div>
    )
}