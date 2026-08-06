"use client"
import { ModalLayout } from "@/components/custom";
import { Image } from "@heroui/react";
import { Spinner } from "@heroui/spinner";

export default function AccountVerified({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: (by: boolean) => void;
}) {
    return (
        <ModalLayout isOpen={isOpen} size="sm" onClose={() => setIsOpen(false)}>
            <div className=" w-full flex flex-col items-center gap-4 pt-4 justify-center ">
                <Image
                    src={"/images/logo.png"}
                    alt="logo"
                    className=" w-[120px] "
                />
                <div className=" flex flex-col items-center gap-1 ">
                    <p className=" text-2xl font-bold ">Signing In...</p>
                    <Spinner />
                    {/* <p className=" text-secondary text-sm " >You have successfully created account</p> */}
                </div>
                {/* <div className="  w-full " >
                    <CustomButton fullWidth >Login to continue</CustomButton>
                </div> */}
            </div>
        </ModalLayout>
    );
}
