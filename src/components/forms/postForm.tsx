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
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";

export default function PostForm({
    formik,
    isLoading,
    edit,
    preview = [],
    setPreviews,
    imageFiles,
    setImageFiles,
    modal,
    client
}: {
    formik: FormikProps<IPost>;
    imageFiles: File[];
    setImageFiles: (files: File[]) => void;
    isLoading: boolean;
    edit?: boolean;
    preview?: string[];
    setPreviews: (preview: string[]) => void;
    modal?: boolean;
    client?: boolean;
}) {
    const param = useParams();
    const id = param.id as string;

    const [user] = useAtom(userAtom);

    const effectiveBusinessId = id;

    const {
        items = [],
        ref,
        isLoading: loading,
        isFetchingMore,
    } = useInfiniteScroller<IProductDetail>({
        queryKeyBaseArray: ["productfilter", effectiveBusinessId],
        endpoint: URLS.PRODUCTBUSINESSBYID(effectiveBusinessId),
        limit: 10,
    });

    const router = useRouter();
    return (
        <FormikProvider value={formik}>
            <form
                onSubmit={formik.handleSubmit}
                className={` w-full flex h-full justify-center flex-col gap-4 ${modal ? " pt-4 " : " pt-10  px-4"} `}
            >
                {!modal && (
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
                )}
                <div
                    className={` w-full flex justify-center  ${client ? " max-w-[700px] mx-auto " : ""} ${modal ? " mb-8 " : " mb-8 h-full "} `}
                >
                    <div
                        className={` ${(modal || client) ? " flex-col " : " flex-row "} w-full flex gap-4 `}
                    >
                        <div
                            className={`" w-full ${modal ? " " : "h-fit"} `}
                        >
                            <MultipleImagePicker
                                imageFiles={imageFiles}
                                setImageFiles={setImageFiles}
                                previews={preview}
                                setPreviews={setPreviews}
                            />
                        </div>
                        <div
                            className={` w-full ${modal ? "" : "  h-full "} flex flex-col gap-3 `}
                        >
                            <CustomInput
                                name="body"
                                label="What is on your mind today?"
                                textarea
                            />
                            {user?.business?._id && (
                                <div className=" w-full flex flex-col gap-3 border rounded-2xl  ">
                                    <div className=" flex gap-2 items-center pt-4 px-4 ">
                                        <SlBag size={17} />
                                        <p className=" text-sm font-semibold ">
                                            Tag Products
                                        </p>
                                    </div>
                                    <div className=" w-full px-4 ">
                                        <CustomInput
                                            type="search"
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
                                                                    alt={
                                                                        index +
                                                                        ""
                                                                    }
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
                            )}

                            <div
                                className={` ${modal ? "" : "mt-auto"} w-full flex justify-end `}
                            >
                                <CustomButton
                                    isLoading={isLoading}
                                    height="45px"
                                    type="submit"
                                    isDisabled={imageFiles.length === 0 && !formik?.values?.body && preview?.length === 0}
                                >
                                   {edit ? "Edit" : ""} Post
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </FormikProvider>
    );
}
