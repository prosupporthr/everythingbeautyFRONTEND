"use client"
import { Button } from "@heroui/button"
import { useFormikContext, FormikValues, getIn } from "formik"
import React, { useState } from "react"
import ModalLayout from "./modalLayout"
import { CheckboxGroup, Checkbox } from "@heroui/react";
import { dayOfTheWeek } from "@/helper/services/databank";
import CustomButton from "./customButton"

interface IProps {
    name: string
    label?: string
    placeholder?: string
    height?: string
    disabled?: boolean
    rounded?: boolean
    startContent?: React.ReactNode
    endContent?: React.ReactNode
}

export default function CustomDayPicker(
    {
        name,
        label,
        placeholder,
        disabled,
        rounded,
        startContent,
        endContent,
    }: IProps
) {

    const { values, errors, touched, setFieldValue } = useFormikContext<FormikValues>()

    const [open, setOpen] = useState(false)

    const value = getIn(values, name) as number[]
    const error = getIn(errors, name) as string | undefined
    const isTouched = getIn(touched, name) as boolean | undefined

    const stringArray = value.map(String);

    const handleChange = (selected: string[]) => {
        // ✅ Convert string[] → number[] before saving to Formik
        const numberArray = selected.map(Number);
        setFieldValue(name, numberArray);
    };

    return (
        <div className="w-full flex flex-col gap-0.5">
            {label && (
                <p className="text-sm text-gray-700 font-medium">{label}</p>
            )}

            <Button
                disabled={disabled}
                onPress={() => setOpen(true)}
                startContent={startContent}
                endContent={endContent}
                radius={rounded ? "full" : "md"}
                variant="bordered"
                className={`bg-[#FDFDFD] border border-[#EAEBEDCC] text-gray-900 text-sm h-auto min-h-[45px] w-full justify-start px-3 ${disabled ? "opacity-60 cursor-not-allowed" : ""
                    }`}
            >
                {value.length > 0 ?
                    value.map((val) => {
                        const label =
                            dayOfTheWeek.find((d) => d.value === val)?.label ?? val;
                        return (
                            <span
                                key={val}
                                className="px-3 py-1 bg-gray-100 text-sm rounded-md"
                            >
                                {label}
                            </span>
                        );
                    }) : placeholder || "Select Business Days"}
            </Button>
            <ModalLayout size="xl" isOpen={open} title="Select Days" onClose={() => setOpen(false)} >
                <div className=" flex w-full flex-col gap-2 " >
                    <div className=" w-full flex  " >
                        <div className=" w-full flex flex-col gap-3 p-4 " >
                            <CheckboxGroup onChange={handleChange} defaultValue={stringArray} >
                                {dayOfTheWeek.map((item) => {
                                    return (
                                        <Checkbox value={item?.value + ""} >{item?.label}</Checkbox>
                                    )
                                })}
                            </CheckboxGroup>
                        </div>
                        <div className=" w-full flex flex-col gap-3 border-l border-[#F5F5F5] p-4 " >
                            <p className=" font-medium " >Selected Days</p>
                            <div className=" flex flex-wrap gap-3 " >
                                {value.length > 0 ? (
                                    value.map((val) => {
                                        const label =
                                            dayOfTheWeek.find((d) => d.value === val)?.label ?? val;
                                        return (
                                            <span
                                                key={val}
                                                className="px-3 py-1 bg-gray-100 text-sm rounded-md"
                                            >
                                                {label}
                                            </span>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-gray-500">No day selected</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className=" ml-auto max-w-[150px] w-full " >
                        <CustomButton onClick={() => setOpen(false)} fullWidth >Done</CustomButton>
                    </div>
                </div>
            </ModalLayout>

            {isTouched && error && (
                <p className="text-xs text-red-600 font-medium ml-2">{error}</p>
            )}
        </div>
    )
}