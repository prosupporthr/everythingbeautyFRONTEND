
import * as Yup from "yup"

/** 🔹 Formik Schemas */
export const emailSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
})

export const otpSchema = Yup.object({
    code: Yup.string().required("Required"),
})

export const userSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    phoneNumber: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    dateOfBirth: Yup.string().required("Required"),
})

export const businessSchema = Yup.object({
    userId: Yup.string().required("User ID is required"),
    name: Yup.string().required("Name is required"),
    location: Yup.string().required("Location is required"),
    long: Yup.string().required(),
    lat: Yup.string().required(),
    days: Yup.array().min(1, "Select at least one day"),
    openingTime: Yup.string().required(),
    closingTime: Yup.string().required(),
    chargeTiming: Yup.string().required(),
    // pictures: Yup.array().min(1, "At least one picture is required"),
});

export const serviceSchema = Yup.object().shape({
    businessId: Yup.string().required("Business ID is required"),
    name: Yup.string().required("Business name is required"),
    description: Yup.string().required("Description is required"),
    hourlyRate: Yup.number()
        .nullable()
        .min(0, "Hourly rate must be positive")
        .required("Hourly rate is required"),
    allowReview: Yup.boolean(),
});

export const productSchema = Yup.object().shape({
    businessId: Yup.string().required("Business ID is required"),
    name: Yup.string().required("Business name is required"),
    description: Yup.string().required("Description is required"),
    quantity: Yup.string().required("Quantity is required"),
    price: Yup.number()
        .nullable()
        .min(0, "Hourly rate must be positive")
        .required("Hourly rate is required"),
    allowReview: Yup.boolean(),
});



export const reviewSchema = Yup.object().shape({
    userId: Yup.string()
        .required("User ID is required"),

    businessId: Yup.string()
        .required("Business ID is required"),

    description: Yup.string()
        .trim()
        .required("Description is required")
        .min(5, "Description must be at least 5 characters"),

    rating: Yup.number()
        .required("Rating is required")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot be more than 5"),
});