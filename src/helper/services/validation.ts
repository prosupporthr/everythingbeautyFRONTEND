
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