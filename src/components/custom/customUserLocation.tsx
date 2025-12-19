"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@heroui/button"
import { useFormikContext, getIn, FormikValues } from "formik"
import ModalLayout from "./modalLayout"
import { MapView } from "../map_component"
import useEditUser from "@/hooks/useEditUser"
import { addToast } from "@heroui/toast"
import { Loader } from "../shared"
import { RiEdit2Fill } from "react-icons/ri"

interface IProps {
    label?: string
    placeholder?: string
    latname?: string,
    lngname?: string,
    disabled?: boolean
    edit?: boolean,
    id?: string
    startContent?: React.ReactNode
    endContent?: React.ReactNode
}

interface IOtherAddress {
    country: string,
    state: string,
    city: string
}

export default function CustomUserLocation({
    label,
    latname,
    lngname,
    disabled,
    edit,
    id,
    startContent,
    endContent,
}: IProps) {
    // const { values, errors, touched, setFieldValue } = useFormikContext<FormikValues>()

    const [marker, setMarker] = React.useState({} as google.maps.LatLngLiteral | null)
    const [address, setAddress] = React.useState("")
    const [addressOther, setAddressOther] = React.useState<IOtherAddress>({} as IOtherAddress)

    const { addressMutation, editAddressMutation, isLoading, open, setOpen } = useEditUser()

    console.log("lat "+latname);
    console.log("lng "+lngname);
    

    const selectLocation = (item: google.maps.LatLngLiteral) => {
        setMarker(item)
        // setFieldValue(latname, item?.lat+"")
        // setFieldValue(lngname, item.lng+"")
    }

    const selectAddress = (item: string) => {
        // setFieldValue(name, item)
        setAddress(item)
    }

    const selectOtherAddress = (item: IOtherAddress) => {
        setAddressOther(item);
    }

    const handleSubmit = () => {

        if (!address) {

            addToast({
                title: "SucceWarningss",
                description: "Select Address in the map",
                color: "warning",
            })
        } else {
            if(edit) {
                editAddressMutation.mutate({
                    id: id as string,
                    payload: {
                        address: address,
                        city: addressOther?.city,
                        state: addressOther?.state,
                        country: addressOther?.country,
                        lat: marker?.lat + "",
                        long: marker?.lng + "",
                        isPrimary: true
                    }
                }) 
                return
            } 
            addressMutation.mutate({
                address: address,
                city: addressOther?.city,
                state: addressOther?.state,
                country: addressOther?.country,
                lat: marker?.lat + "",
                long: marker?.lng + "",
                isPrimary: true
            })
        }
    }
    console.log(id);
    

    return (
        <Loader loading={isLoading} >
            <div className="w-full flex flex-col gap-0.5">
                {label && (
                    <p className="text-sm text-gray-700 font-medium">{label}</p>
                )}

                {!edit && (
                    <Button
                        disabled={disabled}
                        onPress={() => setOpen(true)}
                        startContent={startContent}
                        endContent={endContent}
                        radius={"full"}
                        variant="bordered"
                        className={`bg-[#FDFDFD] border border-[#EAEBEDCC] text-gray-900 text-sm h-auto min-h-[45px] justify-start px-3 pr-4 ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        {"Add"}
                    </Button>
                )}

                {edit && (
                    <button
                        type="button"
                        className=" ml-auto "
                        onClick={() => setOpen(true)}
                    >
                        <RiEdit2Fill size={"25px"} />
                    </button>
                )}
                <ModalLayout size="2xl" isOpen={open} title="Select Location" onClose={() => setOpen(false)} >
                    <MapView
                        setOpen={setOpen}
                        other
                        marker={marker}
                        setAddress={selectAddress}
                        handleSubmit={handleSubmit}
                        setOtherAddress={selectOtherAddress}
                        setMarker={selectLocation}
                        zoom={15}
                        latlng={
                            latname
                                ? {
                                    lat: Number(latname),
                                    lng: Number(lngname)
                                }
                                : {
                                    lat: 0,
                                    lng: 0
                                }
                        }
                        height={'50vh'}
                    />
                </ModalLayout>
            </div>
        </Loader>
    )
}
