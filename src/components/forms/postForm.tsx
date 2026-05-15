"use client";
import { IPost, IProductDetail } from "@/helper/model/business";
import { FormikProps, FormikProvider } from "formik";
import { SlBag } from "react-icons/sl";
import { IoArrowBackOutline } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";
import MultipleImagePicker from "../shared/multipleImagePicker";
import { CustomButton, CustomImage, CustomInput } from "../custom";
import { RiSearch2Line } from "react-icons/ri";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller";
import { URLS } from "@/helper/services/urls";
import { formatNumber } from "@/helper/utils/numberFormat";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { LoadingLayout } from "../shared";

export default function PostForm({
    formik, 
    isLoading,
    edit,
    preview = [],
}: {
    formik: FormikProps<IPost>;
    imageFile: File | string | null;
    setImageFile: (by: File | string | null) => void;
    isLoading: boolean;
    edit?: boolean;
    preview?: string[];
}) {
    const param = useParams();
    const id = param.id as string;

    const effectiveBusinessId = id;

    const {
        items = [],
        ref,
        isLoading: loading,
        isFetchingMore
    } = useInfiniteScroller<IProductDetail>({
        queryKeyBase: "productfilter",
        endpoint: URLS.PRODUCTBUSINESSBYID(effectiveBusinessId),
        limit: 10,
    });
    const router = useRouter(); 

    console.log(formik.errors);
    

    return (
        <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} className=" w-full flex h-full flex-col gap-4 pt-10 px-4  ">
                <div className=" w-full max-w-[1276px] flex items-center gap-4 pb-5 ">
                    <button
                        onClick={() => router.back()}
                        className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary "
                    >
                        <IoArrowBackOutline size={"22px"} />
                    </button>
                    <p className=" font-bold ">
                        {edit ? "Edit" : "Create"} Post
                    </p>
                </div>
                <div className=" w-full flex justify-center mb-8 h-full ">
                    <div className=" w-full flex gap-6 ">
                        <div className=" w-full  ">
                            <MultipleImagePicker preview={preview} name="images" />
                        </div>
                        <div className=" w-full h-full flex flex-col gap-3 ">
                            <CustomInput
                                name="body"
                                label="Write a Caption"
                                textarea
                            />
                            <div className=" w-full flex flex-col gap-3 border rounded-2xl  ">
                                <div className=" flex gap-2 items-center pt-4 px-4 ">
                                    <SlBag size={17} />
                                    <p className=" text-sm font-semibold ">
                                        Tag Products
                                    </p>
                                </div>
                                <div className=" w-full px-4 ">
                                    <CustomInput
                                        notform
                                        name=""
                                        placeholder="Search product..."
                                        hasFrontIcon
                                        icon={<RiSearch2Line size={15} />}
                                    />
                                </div>
                                <LoadingLayout 
                                    loading={loading}
                                    refetching={isFetchingMore}
                                    length={items?.length}
                                    ref={ref}
                                >
                                    <div className=" h-[50%] overflow-y-auto flex p-4 flex-col gap-3 ">
                                        {items.map((item, index) => {
                                            return (
                                                <div className=" w-full flex items-center justify-between ">
                                                    <div className=" flex gap-2 items-center ">
                                                        <div className=" w-12 h-12 rounded-md ">
                                                            <CustomImage
                                                                src={
                                                                    item
                                                                        ?.pictures[0]
                                                                }
                                                                alt={index + ""}
                                                                fillContainer
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className=" text-sm font-semibold ">
                                                                {item?.name}
                                                            </p>
                                                            <p className=" text-xs text-secondary ">
                                                                {formatNumber(
                                                                    item?.price,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {formik.values
                                                        ?.productId ===
                                                        item?._id && (
                                                        <div className=" text-green-500 ">
                                                            <FaCheckCircle
                                                                size={25}
                                                            />
                                                        </div>
                                                    )}
                                                    {formik.values
                                                        ?.productId !==
                                                        item?._id && (
                                                        <button
                                                            onClick={() =>
                                                                formik.setFieldValue(
                                                                    "productId",
                                                                    item?._id,
                                                                )
                                                            }
                                                        >
                                                            <IoMdAddCircleOutline
                                                                size={25}
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </LoadingLayout>
                            </div>

                            <div className=" mt-auto w-full flex justify-end ">
                                <CustomButton isLoading={isLoading} height="45px" type="submit">
                                    Submit
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </FormikProvider>
    );
}
