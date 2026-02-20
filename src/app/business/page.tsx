"use client"; 
import { PaymentBtn } from "@/components/shared";
import { IUserDetail } from "@/helper/model/user";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { IoArrowBackOutline } from "react-icons/io5";
import { LuCalendarFold } from "react-icons/lu";

export default function BusinessPage() {

    const router = useRouter();
    const [user] = useAtom(userAtom);

    return (
        <div className=" w-full flex flex-col items-center ">
            <div className=" w-full flex flex-col items-center px-8 ">
                <div className=" w-full max-w-[1276px] flex flex-col gap-4 pb-5 ">
                    <div className=" w-full flex gap-5 h-[78px] border-b border-gray-100 items-center text-primary ">
                        <button onClick={() => router.back()}>
                            <IoArrowBackOutline size={"22px"} />
                        </button>
                        <p className=" text-2xl font-medium ">
                            Create a business portfolio
                        </p>
                    </div>
                    <div className=" w-full flex gap-8 ">
                        <div className=" w-full flex flex-col gap-4 ">
                            <div className=" w-full flex items-center border-b border-gray-100 gap-2 pb-4 ">
                                <div className=" w-12 h-12 rounded-full border border-[#E7E7E7] bg-[#FAFAFA] flex justify-center items-center ">
                                    <LuCalendarFold />
                                </div>
                                <div className=" flex flex-col ">
                                    <p className=" text-xs font-bold ">{`You won't be charged until Vendors accepts your request.`}</p>
                                    <p className=" text-xs font-medium ">
                                        {" "}
                                        This usually takes up to 24 hours
                                    </p>
                                </div>
                            </div>
                            <div className=" max-w-[542px] w-full mx-auto rounded-2xl py-9 px-4 flex flex-col gap-6 border border-[#F5F5F5] items-center ">
                                <p className=" text-3xl font-bold ">
                                    Unlock Premium
                                </p>
                                <p className=" text-xs w-[220px] text-center ">
                                    Get access to all features, exclusive
                                    content, and priority support.
                                </p>
                                <div className=" max-w-[384px] w-full text-white gap-2 bg-brand rounded-2xl p-4 h-[138px] flex flex-col items-center justify-center ">
                                    <p className=" text-2xl font-semibold ">
                                        Only $9.99 one time Payment
                                    </p>
                                    <p className=" text-xs ">
                                        No hidden fees- cancel anytime.
                                    </p>
                                </div>
                                <div className=" flex flex-col gap-1 items-center ">
                                    <p className=" font-bold ">
                                        Premium Includes:
                                    </p>
                                    <p className=" text-xs ">
                                        create business portfolio
                                    </p>
                                    <p className=" text-xs ">Become a vendor</p>
                                </div>
                                <div className=" max-w-[384px] w-full text-white gap-2 bg-brand rounded-2xl p-4 h-[64px] flex flex-col items-center justify-center ">
                                    <p className=" text-2xl font-bold ">
                                        Upgrade for $9.99
                                    </p>
                                </div>
                            </div>
                            <div className=" w-full flex justify-between border-b border-t border-gray-100 gap-4 py-4 ">
                                <div className=" flex flex-col ">
                                    <p className=" font-medium ">
                                        Cancellation policy
                                    </p>
                                    <p className=" text-xs ">
                                        Free cancellation up until 4 Apr .
                                        Cancel before check in on 10 Apr for a
                                        50% refund. No refunds{" "}
                                    </p>
                                </div>
                                <p className=" text-sm text-brand ">Details</p>
                            </div>
                            {/* <CustomButton onClick={()=> router.push("/business/create")} >Pay</CustomButton>
                            <PaymentExpired /> */}

                            <PaymentBtn
                                title="Make Payment"
                                fullWidth
                                type={"monthly_subscription"}
                                id={user?._id as string}
                                amount={9.99}
                                user={user as IUserDetail}
                            />
                        </div>
                        <div className=" w-full flex ">
                            <div className=" w-full h-fit bg-white p-6 border border-[#EAEBEDCC] flex flex-col gap-2 rounded-2xl ">
                                <div className=" w-full flex items-center justify-between ">
                                    <p className=" text-sm text-secondary ">
                                        Amount
                                    </p>
                                    <p className=" text-sm text-secondary ">
                                        $9
                                    </p>
                                </div>
                                <div className=" w-full flex items-center mt-2 justify-between ">
                                    <p className=" text-sm text-black ">
                                        Pricing
                                    </p>
                                </div>
                                <div className=" w-full flex items-center justify-between ">
                                    <p className=" text-sm text-secondary ">
                                        Taxes
                                    </p>
                                    <p className=" text-sm text-secondary ">
                                        $1
                                    </p>
                                </div>
                                <div className=" w-full text-black flex items-center justify-between pt-2 border-t border-gray-100 ">
                                    <p className=" text-sm ">Total</p>
                                    <p className=" text-xl font-bold ">$9.99</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
