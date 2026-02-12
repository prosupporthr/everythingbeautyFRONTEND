import * as Yup from "yup";

/** 🔹 Formik Schemas */
export const emailSchema = Yup.object({
    email: Yup.string().trim().email("Invalid email").required("Required"),
});

export const otpSchema = Yup.object({
    code: Yup.string().trim().required("Required"),
});

export const userSchema = Yup.object({
    firstName: Yup.string().trim().required("Required"),
    lastName: Yup.string().trim().required("Required"),
    phoneNumber: Yup.string().trim().required("Required"),
    gender: Yup.string().trim().required("Required"),
    dateOfBirth: Yup.string().trim().required("Required"),
});

export const profileSchema = Yup.object({
    firstName: Yup.string().trim().required("First name is required"),

    lastName: Yup.string().trim().required("Last name is required"),

    phoneNumber: Yup.string()
        .trim()
        .matches(/^[0-9+\-() ]+$/, "Phone number is not valid")
        .required("Phone number is required"),

    dateOfBirth: Yup.string().required("Date of birth is required"),

    gender: Yup.string()
        .oneOf(["male", "female", "other"], "Invalid gender")
        .required("Gender is required"),
});

export const businessSchema = Yup.object({
    userId: Yup.string().trim().required("User ID is required"),
    name: Yup.string().trim().required("Name is required"),
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
    businessId: Yup.string().required("Business is required"),

    name: Yup.string()
        .trim()
        .min(2, "Service name must be at least 2 characters")
        .required("Service name is required"),

    description: Yup.string()
        .trim()
        .min(10, "Description must be at least 10 characters")
        .required("Description is required"),

    hourlyRate: Yup.number()
        .typeError("Hourly rate must be a number")
        .positive("Hourly rate must be greater than 0")
        .required("Hourly rate is required"),

    allowReview: Yup.boolean(),

    acceptsInitialDeposit: Yup.boolean(),

    initialDepositPercentage: Yup.number()
        .typeError("Initial deposit must be a number")
        .min(1, "Initial deposit cannot be less than 1%")
        .max(50, "Initial deposit cannot be more than 50%")
        .required("Initial deposit is required")
        .when("acceptsInitialDeposit", {
            is: true,
            then: (schema) =>
                schema.required("Initial deposit percentage is required"), 
        }),
});

export const productSchema = Yup.object().shape({
    businessId: Yup.string().trim().required("Business ID is required"),
    name: Yup.string().trim().required("Business name is required"),
    description: Yup.string().trim().required("Description is required"),
    quantity: Yup.number()
        .min(1, "Quantity must be greater than zero")
        .required("Quantity is required"),
    price: Yup.number()
        .min(1, "Hourly rate must be greater than zero")
        .required("Price is required"),
    allowReview: Yup.boolean(),
});

export const reviewSchema = Yup.object().shape({
    userId: Yup.string().trim().required("User ID is required"),

    businessId: Yup.string().trim().required("Business ID is required"),

    description: Yup.string()
        .trim()
        .required("Description is required")
        .min(5, "Description must be at least 5 characters"),

    rating: Yup.number()
        .required("Rating is required")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot be more than 5"),
});
