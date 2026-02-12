"use client"
import { IBusinessDetails, IRatingForm } from "@/helper/model/business";
import { ModalLayout } from "../shared";
import { FormikProps, FormikProvider } from "formik";
import { CustomButton, CustomImage, CustomInput, CustomStarRating } from "../custom";


export default function RatingBusinessModal(
    { open, setOpen, data, formik, loading, tab }: { tab: boolean, open: boolean, setOpen: (by: boolean) => void, data: IBusinessDetails, formik: FormikProps<IRatingForm>, loading: boolean }
) {

    return (
        <FormikProvider value={formik} >
            <ModalLayout size={tab ? "xs" : "md"} isOpen={open} onClose={() => setOpen(false)} showCloseIcon={false} >
                {!tab && (
                    <form onSubmit={formik.handleSubmit} className=" w-full flex-col flex gap-4 items-center " >
                        <div className=" w-full h-[200px] rounded-2xl bg-gray-400 " >

                        <CustomImage alt={(data?.name) as string} style={{
                                borderRadius: "16px"
                            }} fillContainer src={(data?.pictures[0]) as string} />
                        </div>
                        <div className=" w-full flex flex-col items-center " >
                            <p className=" font-bold text-lg " >{data?.name}</p>
                            <p className=" text-sm " >Business</p>
                        </div>
                        <p className=" font-bold text-lg ">⭐ Rate Your Experience</p>
                        <p className=" text-secondary text-sm " >How satisfied are you with Our Services ?</p>
                        <CustomStarRating name={"rating"} />
                        <CustomInput name="description" textarea placeholder="" />
                        <div className=" w-full flex gap-2 pb-3 " >
                            <CustomButton fullWidth type="submit" isLoading={loading} >Submit</CustomButton>
                            <CustomButton fullWidth type="button" onClick={() => setOpen(false)} variant="outline" >Not Yet</CustomButton>
                        </div>
                    </form>
                )}
                {tab && (
                    <div className=" w-full flex-col flex gap-4 items-center " >
                        <div className=" w-full flex flex-col text-center items-center " >
                            <p className=" font-bold text-lg " >Thank you! 🎉</p>
                            <p className=" text-sm text-secondary " >Your feedback has been submitted successfully.</p>
                        </div>
                        <div className=" w-[150px] pb-3 " >
                            <CustomButton fullWidth onClick={() => setOpen(false)} type="button" height="42px" >Close</CustomButton>
                        </div>
                    </div>
                )}
            </ModalLayout>
        </FormikProvider>
    )
}