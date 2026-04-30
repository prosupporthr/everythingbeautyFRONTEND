"use client";

import { IShipmentForm } from "@/helper/model/ship";
import { handleError } from "@/helper/services/errorHandler";
import httpService from "@/helper/services/httpService";
import { URLS } from "@/helper/services/urls";
import { reviewSchema } from "@/helper/services/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import { useState } from "react";

const useShipping = () => {
    const queryClient = useQueryClient(); 
    const param = useParams();
    const id = param.id as string;

    const [ isOpen, setIsOpen ] = useState(false)

    /** 🔹 Formik Instances */
    const formik = useFormik<IShipmentForm>({
        initialValues: {
            address_from: {
                email: "",
                phone: "",
                state: "",
                city: "",
                street: "",
                name: "",
                country: "",
            },

            address_to: {
                email: "",
                phone: "",
                state: "",
                city: "",
                street: "",
                name: "",
                country: "",
            },

            parcels: [
                {
                    mass_unit: "kg",
                    distance: "ft",
                    weight: "",
                    height: "",
                    length: "",
                    width: "",
                },
            ],
        },
        validationSchema: reviewSchema,
        onSubmit: (data) => {
            createShipping.mutate(data);
            queryClient.invalidateQueries({ queryKey: ["has-reviewed"] });
        },
    });

    /** 🔹 Business */
    const createShipping = useMutation({
        mutationFn: (data: IShipmentForm) =>
            httpService.post(URLS.SHIPPING(id), data),
        onError: handleError,
        onSuccess: () => {
            // setTab(true);
            setIsOpen(true)
        },
    });

    const isLoading = createShipping?.isPending;

    return {
        formik,
        createShipping,
        isLoading, 
        isOpen,
        setIsOpen
    };
};

export default useShipping;
