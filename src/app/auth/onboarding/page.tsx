"use client";

import { CustomButton, CustomInput, CustomPhoneInput, CustomSelect, DateOfBirthPicker } from "@/components/custom";
import CustomDateTimePicker from "@/components/custom/customDatePicker";
import { ImagePicker, Loader } from "@/components/shared";
import useUser from "@/hooks/useUser";
import { FormikProvider } from "formik";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {

    const { formik, imageFile, setImageFile, isLoading, isSuccess } = useUser();
    const router = useRouter();
    const query = useSearchParams();
    const tab = query?.get("tab") as string | null;

    /** 🔹 Gender options */
    const genderOptions = [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
    ];

    /** 🔹 Continue handler */
    const handleContinue = async () => {
        // Run validation manually
        const errors = await formik.validateForm();

        // If no errors, continue
        if (Object.keys(errors).length === 0) {
            router.push("/auth/onboarding?tab=photo");
        } else {
            // Mark all fields as touched so errors show up
            formik.setTouched(
                Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
                true
            );
        }
    };

    console.log(formik?.values?.dateOfBirth);
    


    return (
        <Loader loading={isLoading || isSuccess} >

            <FormikProvider value={formik}>
                <div className="w-full flex flex-col items-center justify-center">
                    {/* 🔹 Step 1: User Info */}
                    {!tab && (
                        <div className="w-full lg:max-w-[435px] bg-white flex flex-col items-center gap-6 ">
                            <div className="flex flex-col gap-0.5 text-center">
                                <p className="text-2xl font-semibold">Finish signing up</p>
                                <p className="text-sm text-gray-500">
                                    Please provide your basic information to continue
                                </p>
                            </div>

                            <div className="w-full flex flex-col gap-3">
                                <CustomInput
                                    label="First name"
                                    name="firstName"
                                    placeholder="Enter your first name"
                                />
                                <CustomInput
                                    label="Last name"
                                    name="lastName"
                                    placeholder="Enter your last name"
                                />
                                <CustomPhoneInput
                                    label="Mobile number"
                                    name="phoneNumber"
                                    placeholder="Enter your mobile number"
                                />
                                <DateOfBirthPicker label="Date of Birth" name="dateOfBirth" />
                                <CustomSelect
                                    label="Gender"
                                    name="gender"
                                    placeholder="Select gender"
                                    options={genderOptions}
                                />
                            </div>

                            <CustomButton
                                onClick={handleContinue}
                                fullWidth
                                height="56px"
                            >
                                Continue
                            </CustomButton>
                        </div>
                    )}

                    {/* 🔹 Step 2: Profile Photo */}
                    {tab === "photo" && (
                        <div className="w-full lg:max-w-[502px] flex flex-col gap-6 items-center bg-white">
                            <ImagePicker
                                imageFile={imageFile}
                                setImageFile={setImageFile}
                                type="user"
                            />

                            <p className="text-2xl font-semibold text-center">
                                Add a profile photo
                            </p>
                            <p className="text-sm text-gray-500 text-center">
                                Upload a picture to help personalize your account
                            </p>

                            <div className="flex gap-4 w-full mt-8">
                                <CustomButton
                                    onClick={() => router.back()}
                                    variant="outline"
                                    fullWidth
                                    height="56px"
                                >
                                    Back
                                </CustomButton>
                                <CustomButton
                                    isLoading={isLoading}
                                    onClick={formik.handleSubmit}
                                    fullWidth
                                    height="56px"
                                >
                                    Submit
                                </CustomButton>
                            </div>
                        </div>
                    )}
                </div>
            </FormikProvider>
        </Loader>
    );
}
