"use client";
import { handleError } from "@/helper/services/errorHandler";
import httpService from "@/helper/services/httpService";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
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

interface IProps {
    services?: boolean;
    product?: boolean;
    business?: boolean;
    post?: boolean;
    staff?: boolean;
    edit?: boolean;
    staffId?: string; 
}

const useBusiness = ({ services, product, business, post, staff, edit, staffId}: IProps) => {
    const router = useRouter();
    const userId = localStorage.getItem("userid") as string;
    const [imageFile, setImageFile] = useState<File | string | null>("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const { refetch } = useUserStore();

    const param = useParams();
    const id = param.id as string;
    const slug = param.slug as string; 
    

    const queryClient = useQueryClient();

    /** 🔹 Business */
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

    /** 🔹 Business */
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

    /** 🔹 Service */
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
        },
    });

    /** 🔹 Service */
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

            queryClient.invalidateQueries({ queryKey: ["service"] });
            router.push(`/business/${id}/dashboard?tab=services`);
        },
    });

    /** 🔹 Service */
    const postMutation = useMutation({
        mutationFn: (data: IPost) => httpService.post(URLS.POST, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["post"] });
            router.push(`/business/${id}/dashboard?tab=post`);
        },
    });

    /** 🔹 Service */
    const postEditMutation = useMutation({
        mutationFn: (data: IPost) =>
            httpService.patch(URLS.POSTBYID(slug), data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });

            queryClient.invalidateQueries({ queryKey: ["post"] });
        },
    });

    /** 🔹 Service */
    const postDeleteMutation = useMutation({
        mutationFn: (data: string) => httpService.delete(URLS.POSTBYID(data)),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });

            console.log("post");
            queryClient.invalidateQueries({ queryKey: ["post"], exact: false });
        },
    });

    /** 🔹 Service */
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
            queryClient.invalidateQueries({ queryKey: ["service"] });
        },
    });

    /** 🔹 Product */
    const productMutation = useMutation({
        mutationFn: (data: IProduct) => httpService.post(URLS.PRODUCT, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            router.push(`/business/${id}/dashboard?tab=store`);
        },
    });

    /** 🔹 Product */
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

    /** 🔹 Product */
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

    /** 🔹 Product */
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

    /** 🔹 Product */
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
            queryClient.invalidateQueries({ queryKey: ["product"] });
        },
    });

    /** 🔹 Staff */
    const staffMutation = useMutation({
        mutationFn: (data: IStaff) =>
            httpService.post(URLS.STAFFBYBUSINESSID(id+""), data),
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

    /** 🔹 Staff */
    const staffEditMutation = useMutation({
        mutationFn: (data: IStaff) =>
            httpService.patch(URLS.STAFFBYID(staffId+""), data),
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

    /** 🔹 Staff */
    const changeStaffMutation = useMutation({
        mutationFn: (data: {
            newStaffId: string
        }) =>
            httpService.patch(URLS.TRANSFERSTAFFBYID(id), data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            }); 
            queryClient.invalidateQueries({ queryKey: ["booking"] });
        },
    });

    const uploadMutation = useUploadMutation((res: Array<string>) => {
        const payload = { ...formik.values, pictures: [res + ""] };

        const payloadservices = {
            ...formikService.values,
            pictures: res,
        };
        const payloadproduct = {
            ...formikProduct.values,
            pictures: res,
        };
        const payloadpost = {
            ...formikPost.values,
            images: res,
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
            if (slug && !imageFile) {
                servicesEditMutation.mutate(data);
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
    const formikPost = useFormik<IPost>({
        initialValues: {
            body: "",
        },
        validationSchema: postSchema,
        onSubmit: (data) => {
            if (slug && !imageFiles) {
                postEditMutation.mutate(data);
            } else if (imageFiles.length > 0) {
                const formdata = new FormData();
                formdata.append("file", imageFiles[0]);
                uploadMutation.mutate(formdata);
            } else {
                addToast({
                    title: "Error",
                    description: "Please upload at least one image",
                    color: "danger",
                });
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
            if (slug && !imageFile) {
                productEditMutation.mutate(data);
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

    const isLoading =
        uploadMutation.isPending ||
        postMutation.isPending ||
        postEditMutation.isPending ||
        businessMutation.isPending ||
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
        staffEditMutation.isPending;

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
