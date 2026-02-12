"use client"
import { CustomInput } from "@/components/custom"; 
import { PaymentBtn } from "@/components/shared";
import { IUserDetail } from "@/helper/model/user";
import { userAtom } from "@/store/user";
import { walletAtom } from "@/store/wallet";
import { useAtom } from "jotai";
import { useState } from "react";

export default function WalletPage() {

    const [ value, setValue ] = useState("")

    const [ user ] = useAtom(userAtom)
    const [ walletID ] = useAtom(walletAtom)

    return (
        <div className=" w-full flex flex-col gap-4 " >
            <CustomInput type="number" label="Enter Amount" name="" notform localValue={value} setLocalValue={setValue} />
            {/* <CustomButton isDisabled={!value || Number(value) === 0 ? true : false} >Fund Wallet</CustomButton> */}

            <PaymentBtn title="Fund Wallet" fullWidth type={"wallet_top_up"} id={walletID} amount={Number(value)} user={user as IUserDetail} />
        </div>
    );
}
