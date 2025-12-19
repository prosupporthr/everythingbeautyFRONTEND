"use client";

import {
    CustomButton,
    CustomInput,
    CustomPhoneInput,
    CustomSelect,
    CustomUserLocation,
    DateOfBirthPicker,
} from "@/components/custom";
import CustomDateTimePicker from "@/components/custom/customDatePicker";
import { DeleteModal } from "@/components/modals";
import { ImagePicker, LoadingLayout } from "@/components/shared";
import { IAddressDetail } from "@/helper/model/auth";
import { IUserDetail } from "@/helper/model/user";
import useEditUser from "@/hooks/useEditUser";
import { useFetchData } from "@/hooks/useFetchData";
import { userAtom } from "@/store/user";
import { Spinner } from "@heroui/spinner";
import { Switch } from "@heroui/switch";
import { FormikProvider } from "formik";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { IoTrashBin } from "react-icons/io5";

export default function EditProfile() {
    const { id } = useParams<{ id: string }>();

    const { data: user, isLoading } = useFetchData<IUserDetail>({
        endpoint: `/user/${id}`,
        name: ["user", id],
    });

    const {
        data: addressData,
        isLoading: loadingAddress,
    } = useFetchData<IAddressDetail[]>({
        endpoint: `/address`,
        name: ["address", id],
    });

    const [addresses, setAddresses] = useState<IAddressDetail[]>([]);
    const [selected, setSelected] = useState<IAddressDetail>()
    const [isOpen, setIsOpen] = useState(false)


    const [_, setUser] = useAtom(userAtom)

    const { editAddressMutation, isLoading: loading } = useEditUser()

    const {
        formik,
        isLoading: updating,
        imageFile,
        setImageFile,
    } = useEditUser();

    /* ---------------- SYNC ADDRESS STATE ---------------- */
    useEffect(() => {
        if (addressData) {
            setAddresses(addressData);
        }
    }, [addressData]);

    const [ email, setEmail ] = useState("")

    /* ---------------- PREFILL FORM ---------------- */
    useEffect(() => {
        if (!user) return;

        if(email) return

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

        setEmail(user?.email)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(()=> {
        setUser(user)
    }, [user])

    /* ---------------- PRIMARY ADDRESS TOGGLE ---------------- */
    const handlePrimaryToggle = (item: IAddressDetail) => {
        setSelected(item)
        editAddressMutation.mutate({
            id: item._id,
            payload: {
                address: item.address,
                city: item?.city,
                state: item?.state,
                country: item?.country,
                lat: item?.lat,
                long: item?.long,
                isPrimary: true
            }
        })
    };

    const deleteHandler = (item: IAddressDetail) => {
        setSelected(item)
        setIsOpen(true)
    }

    console.log(formik.values?.dateOfBirth);
    

    return (
        <FormikProvider value={formik}>
            <div className="w-full min-h-[50vh] bg-[#F9F9F9] p-8">
                <LoadingLayout loading={isLoading}>
                    <div className="bg-white rounded-2xl py-10">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* ---------------- LEFT ---------------- */}
                            <form onSubmit={formik.handleSubmit} className="lg:w-[502px] px-6 border-r">
                                <ImagePicker
                                    imageFile={imageFile}
                                    setImageFile={setImageFile}
                                    preview={user?.profilePicture}
                                    type="user"
                                />

                                <div className="flex flex-col gap-3 mt-6">
                                    <CustomInput label="First name" name="firstName" />
                                    <CustomInput label="Last name" name="lastName" />
                                    <CustomPhoneInput label="Mobile number" name="phoneNumber" />
                                    {/* <CustomDateTimePicker
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                        withTime={false}
                                        isDOB={true}
                                    /> */}
                                    <DateOfBirthPicker label="Date of Birth" name="dateOfBirth" />
                                    <CustomSelect
                                        name="gender"
                                        label="Gender"
                                        options={[
                                            { label: "Male", value: "male" },
                                            { label: "Female", value: "female" },
                                            { label: "Other", value: "other" },
                                        ]}
                                    />

                                    <CustomInput label="About" name="about" textarea />
                                </div>

                                <CustomButton
                                    className="mt-6"
                                    isLoading={updating}
                                    type="submit"
                                >
                                    Update Profile
                                </CustomButton>
                            </form>

                            {/* ---------------- RIGHT ---------------- */}
                            <div className="flex-1 px-6">
                                <p className="text-lg font-bold mb-3">Address</p>

                                <LoadingLayout
                                    loading={loadingAddress}
                                    lenght={addresses.length}
                                >
                                    <div className="flex flex-col gap-3">
                                        {addresses.map((item) => (
                                            <div
                                                key={item._id}
                                                className="p-6 rounded-2xl shadow flex flex-col gap-1"
                                            >
                                                <CustomUserLocation
                                                    edit
                                                    id={item?._id}
                                                    latname={item.lat}
                                                    lngname={item.long}
                                                />

                                                <p className="text-sm font-semibold">
                                                    Address:
                                                    <span className="font-normal text-secondary">
                                                        {" "}
                                                        {item.address}
                                                    </span>
                                                </p>

                                                <p className="text-sm font-semibold">
                                                    City:
                                                    <span className="font-normal text-secondary">
                                                        {" "}
                                                        {item.city}
                                                    </span>
                                                </p>

                                                <p className="text-sm font-semibold">
                                                    State:
                                                    <span className="font-normal text-secondary">
                                                        {" "}
                                                        {item.state}
                                                    </span>
                                                </p>

                                                <p className="text-sm font-semibold">
                                                    Country:
                                                    <span className="font-normal text-secondary">
                                                        {" "}
                                                        {item.country}
                                                    </span>
                                                </p>

                                                <div className="flex items-center gap-3 mt-2">
                                                    <Switch
                                                        size="sm"
                                                        isSelected={item.isPrimary}
                                                    >
                                                    </Switch>
                                                    <button type="button" onClick={() => deleteHandler(item)} >
                                                        <IoTrashBin
                                                            size={20}
                                                            className="cursor-pointer text-red-500"
                                                        />
                                                    </button>
                                                    <CustomButton height="45px" className=" ml-auto " isLoading={loading && item?._id === selected?._id} onClick={() => handlePrimaryToggle(item)} >
                                                        Make Default
                                                    </CustomButton>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </LoadingLayout>

                                <div className="mt-3 w-fit">
                                    <CustomUserLocation
                                        startContent={<IoIosAdd size={20} />}
                                    />
                                </div>
                                <DeleteModal isOpen={isOpen} onClose={setIsOpen} type={"Address"} id={selected?._id as string} name={selected?.address as string} />
                            </div>
                        </div>
                    </div>
                </LoadingLayout>
            </div>
        </FormikProvider>
    );
}
