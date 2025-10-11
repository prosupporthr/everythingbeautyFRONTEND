import { CustomButton, ModalLayout } from "@/components/custom";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function AccountVerified(
    { isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (by: boolean) => void }
) {
    return (
        <ModalLayout isOpen={isOpen} size="sm"  onClose={() => setIsOpen(false)} >
            <div className=" w-full flex flex-col items-center gap-4 justify-center " >
                <IoCheckmarkCircle size={"115px"} color="#12DF56" />
                <div className=" flex flex-col gap-1 " >
                    <p className=" text-3xl font-bold " >Account verified </p>
                    <p className=" text-secondary text-sm " >You have successfully created account</p>
                </div>
                <div className="  w-full " >
                    <CustomButton fullWidth >Login to continue</CustomButton>
                </div>
            </div>
        </ModalLayout>
    )
}