import useMessage from "@/hooks/useMessage";
import { CustomButton } from "../custom";
import { IBusinessDetails } from "@/helper/model/business";
import { IUserDetail } from "@/helper/model/user";

export default function MessageBtn (
    { user, business, creator }: { user: IUserDetail, business: IBusinessDetails, creator: IUserDetail }
) {

    const { createChatMutation, isLoading } = useMessage();

    return (
        <CustomButton height="40px" isLoading={isLoading} onClick={() => createChatMutation.mutate({
            senderId: user?._id,
            recipientId: creator?._id,
            businessId: business?._id,
            creatorId: user?._id
        })} >Message</CustomButton>
    )
}