"use client"
import React, { useState } from "react"
import { Button } from "@heroui/button"
import { useFormikContext, getIn, FormikValues } from "formik"
import ModalLayout from "./modalLayout"
import { MapView } from "../map_component"

interface IProps {
    name: string
    label?: string
    placeholder?: string
    latname: string,
    lngname: string,
    height?: string
    disabled?: boolean
    rounded?: boolean
    startContent?: React.ReactNode
    endContent?: React.ReactNode 
}

export default function CustomButtonField({
    name,
    label,
    latname,
    lngname,
    placeholder, 
    disabled,
    rounded,
    startContent,
    endContent, 
}: IProps) {
    const { values, errors, touched, setFieldValue } = useFormikContext<FormikValues>()

    const [open, setOpen] = useState(false)

    const [marker, setMarker] = React.useState({} as google.maps.LatLngLiteral | null)

    const value = getIn(values, name) as string
    const lat = getIn(values, latname) as string
    const lng = getIn(values, lngname) as string
    const error = getIn(errors, name) as string | undefined
    const isTouched = getIn(touched, name) as boolean | undefined
 
    const selectLocation = (item: google.maps.LatLngLiteral) => {
        setMarker(item)
        setFieldValue(latname, item?.lat+"")
        setFieldValue(lngname, item.lng+"")
    }
 
    const selectAddress = (item: string) => {
        setFieldValue(name, item)
    }
    
    return (
        <div className="w-full flex flex-col gap-0.5">
            {label && (
                <p className="text-sm text-gray-700 font-medium">{label}</p>
            )}

            <Button
                disabled={disabled}
                onPress={()=> setOpen(true)}
                startContent={startContent}
                endContent={endContent}
                radius={rounded ? "full" : "md"}
                variant="bordered"
                className={`bg-[#FDFDFD] border border-[#EAEBEDCC] text-gray-900 text-sm h-auto min-h-[45px] w-full justify-start px-3 ${disabled ? "opacity-60 cursor-not-allowed" : ""
                    }`}
            >
                {value || placeholder || "Select Business Location"}
            </Button>
            <ModalLayout size="2xl" isOpen={open} title="Select Location" onClose={() => setOpen(false)} >
                <MapView setOpen={setOpen} marker={marker} setAddress={selectAddress} setMarker={selectLocation} zoom={15} latlng={lat + " " + lng} height={'50vh'}/>
            </ModalLayout>

            {isTouched && error && (
                <p className="text-xs text-red-600 font-medium ml-2">{error}</p>
            )}
        </div>
    )
}
