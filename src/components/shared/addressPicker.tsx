"use client"
import { IAddressDetail } from "@/helper/model/auth"; 
import useEditUser from "@/hooks/useEditUser";
import { useFetchData } from "@/hooks/useFetchData"; 
import { Switch } from "@heroui/react"; 
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import { IoTrashBin } from "react-icons/io5";
import { CustomUserLocation, CustomButton } from "../custom";
import { DeleteModal } from "../modals";
import LoadingLayout from "./loadingLayout";

interface IProps {
    ship?: boolean;
    setAddress?: (by: IAddressDetail) => void;
}

export default function AddressPicker({ ship, setAddress }: IProps) {
    const { id } = useParams<{ id: string }>();

    const { data: addressData, isLoading: loadingAddress } = useFetchData<
        IAddressDetail[]
    >({
        endpoint: `/address`,
        name: ["address", id],
    });

    const [addresses, setAddresses] = useState<IAddressDetail[]>([]);
    const [selected, setSelected] = useState<IAddressDetail>();
    const [isOpen, setIsOpen] = useState(false); 

    const { editAddressMutation, isLoading: loading } = useEditUser();

    /* ---------------- SYNC ADDRESS STATE ---------------- */
    useEffect(() => {
        if (addressData) {
            setAddresses(addressData);
        }
    }, [addressData]);

    /* ---------------- PRIMARY ADDRESS TOGGLE ---------------- */
    const handlePrimaryToggle = (item: IAddressDetail) => {
        setSelected(item);
        editAddressMutation.mutate({
            id: item._id,
            payload: {
                address: item.address,
                city: item?.city,
                state: item?.state,
                country: item?.country,
                lat: item?.lat,
                long: item?.long,
                isPrimary: true,
            },
        });
    };

    const deleteHandler = (item: IAddressDetail) => {
        setSelected(item);
        setIsOpen(true);
    };

    useEffect(() => {
        if (ship) {
            const primary = addressData?.find((item) => item.isPrimary);
            setAddress?.(primary as IAddressDetail);
        }
    }, [addressData]);

    return (
        <div className={` flex-1 ${ship ? "" : " px-6 "} `}>
            <p className="text-lg font-bold mb-3">Address</p>

            <LoadingLayout loading={loadingAddress} length={addresses.length}>
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
                                ></Switch>
                                <button
                                    type="button"
                                    onClick={() => deleteHandler(item)}
                                >
                                    <IoTrashBin
                                        size={20}
                                        className="cursor-pointer text-red-500"
                                    />
                                </button>
                                <CustomButton
                                    height="45px"
                                    className=" ml-auto "
                                    isLoading={
                                        loading && item?._id === selected?._id
                                    }
                                    onClick={() => handlePrimaryToggle(item)}
                                >
                                    Make Default
                                </CustomButton>
                            </div>
                        </div>
                    ))}
                </div>
            </LoadingLayout>

            <div className="mt-3 w-fit">
                <CustomUserLocation startContent={<IoIosAdd size={20} />} />
            </div>
            <DeleteModal
                isOpen={isOpen}
                onClose={setIsOpen}
                type={"Address"}
                id={selected?._id as string}
                name={selected?.address as string}
            />
        </div>
    );
}
