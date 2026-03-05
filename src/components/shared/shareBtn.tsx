import { addToast } from "@heroui/toast";
import { HiOutlineShare } from "react-icons/hi";

export default function ShareBtn({
    type,
    id,
}: {
    type: "product" | "services" | "user";
    id: string;
}) {
    const BASE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN_URL as string;

    const copyItem = () => {
        navigator.clipboard.writeText(
            type === "user"
                ? `${BASE_DOMAIN}/profile/${id}/opengraph`
                : `${BASE_DOMAIN}/sales/${id}/${type}/opengraph`,
        );
        addToast({
            title: "copied successful",
            color: "success",
        });
    };

    return (
        <div className=" w-fit ">
            <button
                onClick={copyItem}
                className=" w-8 h-8 rounded-full flex justify-center items-center border "
            >
                <HiOutlineShare />
            </button>
        </div>
    );
}
