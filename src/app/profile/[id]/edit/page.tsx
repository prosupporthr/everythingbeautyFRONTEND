"use client";

import {
    CustomButton,
    CustomInput,
    CustomPhoneInput,
    CustomSelect, 
    DateOfBirthPicker,
} from "@/components/custom"; 
import { AddressPicker, ImagePicker, LoadingLayout } from "@/components/shared";
import { IAddressDetail } from "@/helper/model/auth";
import { IUserDetail } from "@/helper/model/user";
import useEditUser from "@/hooks/useEditUser";
import { useFetchData } from "@/hooks/useFetchData";
import { userAtom } from "@/store/user"; 
import { FormikProvider } from "formik";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"; 

export default function EditProfile() {
    const { id } = useParams<{ id: string }>();

    const { data: user, isLoading } = useFetchData<IUserDetail>({
        endpoint: `/user/${id}`,
        name: ["user", id],
    }); 

    const [_, setUser] = useAtom(userAtom);
 

    const {
        formik,
        isLoading: updating,
        imageFile,
        setImageFile,
    } = useEditUser();
 

    const [email, setEmail] = useState("");

    /* ---------------- PREFILL FORM ---------------- */
    useEffect(() => {
        if (!user) return;

        if (email) return;

        formik.setValues({
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            phoneNumber: user.phoneNumber ?? "",
            dateOfBirth: user.dateOfBirth ?? "",
            gender: user.gender ?? "",
            about: user.about ?? "",
            homeAddress: user.homeAddress ?? "",
            state: user.state ?? "",
            officeAddress: user.officeAddress ?? "",
            country: user.country ?? "",
        });

        setEmail(user?.email);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        setUser(user);
    }, [user]);

    return (
        <FormikProvider value={formik}>
            <div className="w-full min-h-[50vh] bg-[#F9F9F9] p-8">
                <LoadingLayout loading={isLoading}>
                    <div className="bg-white rounded-2xl py-10">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* ---------------- LEFT ---------------- */}
                            <form
                                onSubmit={formik.handleSubmit}
                                className="lg:w-[502px] px-6 border-r"
                            >
                                <ImagePicker
                                    imageFile={imageFile}
                                    setImageFile={setImageFile}
                                    preview={user?.profilePicture}
                                    type="user"
                                />

                                <div className="flex flex-col gap-3 mt-6">
                                    <CustomInput
                                        label="First name"
                                        name="firstName"
                                    />
                                    <CustomInput
                                        label="Last name"
                                        name="lastName"
                                    />
                                    <CustomPhoneInput
                                        label="Mobile number"
                                        name="phoneNumber"
                                    />
                                    {/* <CustomDateTimePicker
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                        withTime={false}
                                        isDOB={true}
                                    /> */}
                                    <DateOfBirthPicker
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                    />
                                    <CustomSelect
                                        name="gender"
                                        label="Gender"
                                        options={[
                                            { label: "Male", value: "male" },
                                            {
                                                label: "Female",
                                                value: "female",
                                            },
                                            { label: "Other", value: "other" },
                                        ]}
                                    />

                                    <CustomInput
                                        label="About"
                                        name="about"
                                        textarea
                                    />
                                </div>

                                <CustomButton
                                    className="mt-6"
                                    isLoading={updating}
                                    type="submit"
                                >
                                    Update Profile
                                </CustomButton>
                            </form>

                            <AddressPicker />
                        </div>
                    </div>
                </LoadingLayout>
            </div>
        </FormikProvider>
    );
}
