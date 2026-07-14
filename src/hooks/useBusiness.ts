"use client";
import { handleError } from "@/helper/services/errorHandler";
import httpService from "@/helper/services/httpService";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useUploadMutation } from "./useUpload";
import { URLS } from "@/helper/services/urls";
import { useState } from "react";
import {
    businessSchema,
    postSchema,
    productSchema,
    serviceSchema,
    staffSchema,
} from "@/helper/services/validation";
import {
    IBookingmark,
    IBusiness,
    IPost,
    IProduct,
    IServices,
    IStaff,
} from "@/helper/model/business";
import { useUserStore } from "./user";
import { useAtom } from "jotai";
import { itemDeleted, postData, postDeleted } from "@/store/post";
import { userAtom } from "@/store/user";

interface IProps {
    services?: boolean;
    product?: boolean;
    business?: boolean;
    post?: boolean;
    staff?: boolean;
    edit?: boolean;
    staffId?: string;
    noredirect?: boolean;
}

// SSR-safe localStorage read. Client components in the App Router still
// execute once on the server for the initial HTML — `localStorage` isn't
// defined there, so reading it unguarded throws during SSR.
function getUserId(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("userid") ?? "";
}

const useBusiness = ({
    services,
    product,
    business,
    post,
    staff,
    edit,
    staffId,
    noredirect,
}: IProps) => {
    const router = useRouter();
    const [user] = useAtom(userAtom);
    const [imageFile, setImageFile] = useState<File | string | null>("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const userId = user?._id as string;

    const { refetch } = useUserStore();

    const param = useParams();
    const id = param.id as string;
    const slug = param.slug as string;
    const [postdata, setPost] = useAtom(postData);
    const [deletedPost, setDeletedPost] = useAtom(postDeleted);
    const [deletedItem, setDeletedItem] = useAtom(itemDeleted);
    const pathname = usePathname();

    const queryClient = useQueryClient();

    /** 🔹 Business: create */
    const businessMutation = useMutation({
        mutationFn: (data: IBusiness) => httpService.post(URLS.BUSINESS, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["business"] });
            refetch();
            router.push(`/`);
        },
    });

    /** 🔹 Business: edit */
    const businessEditMutation = useMutation({
        mutationFn: (data: IBusiness) =>
            httpService.patch(URLS.BUSINESSBYID(id), data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["business"] });
            router.push(`/business/${id}/dashboard`);
        },
    });

    /** 🔹 Service: create */
    const servicesMutation = useMutation({
        mutationFn: (data: IServices) => httpService.post(URLS.SERVICE, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            if (id) {
                router.push(`/business/${id}/dashboard?tab=services`);
            }
            setIsOpen(false);
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });

    /** 🔹 Service: edit */
    const servicesEditMutation = useMutation({
        mutationFn: (data: IServices) =>
            httpService.patch(URLS.SERVICEBYID(slug), data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });

            queryClient.invalidateQueries({ queryKey: ["services"] });
            router.push(`/business/${id}/dashboard?tab=services`);
        },
    });

    /** 🔹 Post: create */
    const postMutation = useMutation({
        mutationFn: (data: IPost) => httpService.post(URLS.POST, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });

            formikPost.resetForm();
            setImageFiles([])
            setImageFile("")

            const clone = [res?.data?.data, ...postdata];

            setPost(clone);
            setIsOpen(false);

            queryClient.invalidateQueries({ queryKey: ["post"] });
            if (!noredirect) {
                if (pathname.includes("business")) {
                    router.push(`/business/${id}/dashboard?tab=post`);
                } else {
                    router.push(`/dashboard/${userId}?tab=post`);
                }
            }
        },
    });

    /** 🔹 Post: edit */
    const postEditMutation = useMutation({
        mutationFn: (data: IPost) =>
            httpService.patch(URLS.POSTBYID(slug ? slug : id), data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });

            formikPost.resetForm();
            setImageFiles([])
            setImageFile("")
            queryClient.invalidateQueries({ queryKey: ["post"] });
            if (pathname.includes("business")) {
                router.push(`/post`);
            } else {
                router.push(`/post`);
            }
        },
    });

    /** 🔹 Post: delete */
    const postDeleteMutation = useMutation({
        mutationFn: (data: string) => httpService.delete(URLS.POSTBYID(data)),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            setDeletedPost([...deletedPost, res?.data?.data?.id]);
            queryClient.invalidateQueries({ queryKey: ["post"], exact: false });
        },
    });

    /** 🔹 Service: delete */
    const servicesDeleteMutation = useMutation({
        mutationFn: (data: string) =>
            httpService.delete(URLS.SERVICEBYID(data)),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            setDeletedItem([...deletedItem, res?.data?.data?._id]);
            queryClient.invalidateQueries({ queryKey: ["service"] });
        },
    });

    /** 🔹 Product: create */
    const productMutation = useMutation({
        mutationFn: (data: IProduct) => httpService.post(URLS.PRODUCT, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["product"] });
            router.push(`/business/${id}/dashboard?tab=store`);
        },
    });

    /** 🔹 Bookmark: create */
    const bookmarkMutation = useMutation({
        mutationFn: (data: IBookingmark) =>
            httpService.post(URLS.BOOKMARK, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["service"] });
            queryClient.invalidateQueries({ queryKey: ["business"] });
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            queryClient.invalidateQueries({ queryKey: ["product"] });
        },
    });

    /** 🔹 Bookmark: delete */
    const bookmarkdeleteMutation = useMutation({
        mutationFn: (data: string) =>
            httpService.delete(URLS.BOOKMARKBYID(data)),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
        },
    });

    /** 🔹 Product: edit */
    const productEditMutation = useMutation({
        mutationFn: (data: IProduct) =>
            httpService.patch(URLS.PRODUCTBYID(slug), data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });

            queryClient.invalidateQueries({ queryKey: ["product"] });
            router.push(`/business/${id}/dashboard?tab=store`);
        },
    });

    /** 🔹 Product: delete */
    const productDeleteMutation = useMutation({
        mutationFn: (data: string) =>
            httpService.delete(URLS.PRODUCTBYID(data)),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            setDeletedItem([...deletedItem, res?.data?.data?._id]);
            queryClient.invalidateQueries({ queryKey: ["product"] });
        },
    });

    /** 🔹 Staff: delete */
    const staffDeleteMutation = useMutation({
        mutationFn: (data: string) => httpService.delete(URLS.STAFFBYID(data)),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            setDeletedItem([...deletedItem, res?.data?.data?._id]);
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
    });

    /** 🔹 Staff: create */
    const staffMutation = useMutation({
        mutationFn: (data: IStaff) =>
            httpService.post(URLS.STAFFBYBUSINESSID(id + ""), data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
    });

    /** 🔹 Staff: edit */
    const staffEditMutation = useMutation({
        mutationFn: (data: IStaff) =>
            httpService.patch(URLS.STAFFBYID(staffId + ""), data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
    });

    /** 🔹 Staff: transfer */
    const changeStaffMutation = useMutation({
        mutationFn: (data: { newStaffId: string }) =>
            httpService.patch(URLS.TRANSFERSTAFFBYID(id), data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["booking"] });
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
    });

    const uploadMutation = useUploadMutation((res: Array<string>) => {
        const payload = { ...formik.values, pictures: [res + ""] };

        const payloadservices = {
            ...formikService.values,
            pictures: [...previews, ...res],
        };
        const payloadproduct = {
            ...formikProduct.values,
            pictures: [...previews, ...res],
        };
        const payloadpost = {
            ...formikPost.values,
            images: [...previews, ...res],
        };

        const payloadstaff = {
            ...formikStaff.values,
            image: res[0],
        };

        if (business) {
            if (id) {
                businessEditMutation.mutate(payload);
            } else {
                businessMutation.mutate(payload);
            }
        } else if (services) {
            if (slug) {
                servicesEditMutation.mutate(payloadservices);
            } else {
                servicesMutation.mutate(payloadservices);
            }
        } else if (product) {
            if (slug) {
                productEditMutation.mutate(payloadproduct);
            } else {
                productMutation.mutate(payloadproduct);
            }
        } else if (post) {
            if (slug) {
                postEditMutation.mutate(payloadpost);
            } else {
                postMutation.mutate(payloadpost);
            }
        } else if (staff) {
            if (edit) {
                staffEditMutation.mutate(payloadstaff);
            } else {
                staffMutation.mutate(payloadstaff);
            }
        }
    });

    /** 🔹 Formik Instances */
    const formik = useFormik<IBusiness>({
        initialValues: {
            userId: userId,
            name: "",
            location: "",
            long: "",
            lat: "",
            days: [],
            openingTime: "",
            closingTime: "",
            chargeTiming: "",
            pictures: [],
            licenseNumber: "",
        },
        validationSchema: businessSchema,
        onSubmit: (data) => {
            if (id && !imageFile) {
                businessEditMutation.mutate(data);
            } else if (imageFile) {
                const formdata = new FormData();
                formdata.append("file", imageFile);
                uploadMutation.mutate(formdata);
            } else {
                addToast({
                    title: "Error",
                    description: "At least one picture is required",
                    color: "danger",
                });
            }
        },
    });

    /** 🔹 Formik Instances */
    const formikService = useFormik<IServices>({
        initialValues: {
            businessId: slug ? "" : id,
            name: "",
            description: "",
            hourlyRate: "",
            allowReview: false,
            initialDepositPercentage: "",
            acceptsInitialDeposit: true,
        },
        validationSchema: serviceSchema,
        onSubmit: (data) => {
            if (slug && imageFiles.length === 0) {
                servicesEditMutation.mutate({
                    ...data,
                    pictures: [...previews],
                });
            } else if (imageFiles.length > 0) {
                const formdata = new FormData();
                imageFiles.forEach((file) => {
                    formdata.append("file", file);
                });
                uploadMutation.mutate(formdata);
            } else {
                addToast({
                    title: "Error",
                    description: "At least one picture is required",
                    color: "danger",
                });
            }
        },
    });

    /** 🔹 Formik Instances */
    const formikPost = useFormik<IPost>({
        initialValues: {
            body: "",
        },
        // validationSchema: postSchema,
        onSubmit: (data) => {
            if ((slug || edit) && imageFiles.length === 0) {
                postEditMutation.mutate({
                    ...data,
                    images: [...previews],
                });
            } else if (imageFiles.length > 0) {
                const formdata = new FormData();
                imageFiles.forEach((file) => {
                    formdata.append("file", file);
                });
                uploadMutation.mutate(formdata);
            } else {
                postMutation.mutate(data);
            }
        },
    });

    /** 🔹 Formik Instances */
    const formikStaff = useFormik<IStaff>({
        initialValues: {
            name: "",
            email: "",
            address: "",
            porfolioLink: "",
            primarySpeciality: "",
            yearsOfExperience: "",
            skills: [],
        },
        validationSchema: staffSchema,
        onSubmit: (data) => {
            if (edit && !imageFile) {
                staffEditMutation.mutate(data);
            } else if (imageFile) {
                const formdata = new FormData();
                formdata.append("file", imageFile);
                uploadMutation.mutate(formdata);
            } else {
                addToast({
                    title: "Error",
                    description: "At least one picture is required",
                    color: "danger",
                });
            }
        },
    });

    /** 🔹 Formik Instances */
    const formikProduct = useFormik<IProduct>({
        initialValues: {
            businessId: slug ? "" : id,
            name: "",
            description: "",
            price: "",
            allowReview: false,
            quantity: "",
        },
        validationSchema: productSchema,
        onSubmit: (data) => {
            if (slug && imageFiles.length === 0) {
                productEditMutation.mutate({
                    ...data,
                    pictures: [...previews],
                });
            } else if (imageFiles.length > 0) {
                const formdata = new FormData();
                imageFiles.forEach((file) => {
                    formdata.append("file", file);
                });
                uploadMutation.mutate(formdata);
            } else {
                addToast({
                    title: "Error",
                    description: "At least one picture is required",
                    color: "danger",
                });
            }
        },
    });

    const isLoading =
        uploadMutation.isPending ||
        postMutation.isPending ||
        postEditMutation.isPending ||
        businessMutation.isPending ||
        businessEditMutation.isPending ||
        servicesMutation.isPending ||
        servicesEditMutation.isPending ||
        servicesDeleteMutation.isPending ||
        productMutation.isPending ||
        productEditMutation.isPending ||
        productDeleteMutation.isPending ||
        bookmarkMutation.isPending ||
        bookmarkdeleteMutation.isPending ||
        postDeleteMutation.isPending ||
        staffMutation.isPending ||
        staffEditMutation.isPending ||
        staffDeleteMutation.isPending ||
        changeStaffMutation.isPending;

    return {
        formik,
        formikPost,
        formikService,
        formikProduct,
        formikStaff,
        isLoading,
        productDeleteMutation,
        servicesDeleteMutation,
        postDeleteMutation,
        bookmarkMutation,
        staffMutation,
        staffEditMutation,
        bookmarkdeleteMutation,
        changeStaffMutation,
        staffDeleteMutation,
        userId,
        setImageFile,
        imageFile,
        isOpen,
        setIsOpen,
        imageFiles,
        setImageFiles,
        previews,
        setPreviews,
    };
};

export default useBusiness;
