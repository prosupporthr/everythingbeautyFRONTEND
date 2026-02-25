"use client"
import { FormikProvider } from "formik";
import { CustomInput } from "../custom";
import useMessage from "@/hooks/useMessage";
import { TbPhoto } from "react-icons/tb";
import { RiSendPlane2Line } from "react-icons/ri";
import { Spinner } from "@heroui/spinner";
import { IChatList } from "@/helper/model/chat";
import { FormEvent, useEffect } from "react";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";

export default function MessageForm(
    { selected } : { selected: IChatList }
) {

    const { formik, isLoading } = useMessage()
    const [user] = useAtom(userAtom)

    useEffect(()=> {
        formik.setFieldValue("chatId", selected?._id)
        formik.setFieldValue("senderId", user?._id)
    }, [selected]) 

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        if(formik.values?.message) { 
            formik.handleSubmit()
        }
    }

    return (
        <FormikProvider value={formik} >
            <form onSubmit={handleSubmit} className=" w-full h-[70px] lg:h-[123px] px-3 lg:px-6 flex gap-3 items-center border-t " >
                <TbPhoto size={"24px"} />
                <CustomInput rounded="999px" name={"message"} placeholder="Say something......" />
                <button type="submit" disabled={isLoading || !formik.values?.message} className=" p-2 " >
                    {isLoading ? (
                        <Spinner size="md" />
                    ) : (
                        <RiSendPlane2Line size={"24px"} />
                    )}
                </button>
            </form>
        </FormikProvider>
    )
}