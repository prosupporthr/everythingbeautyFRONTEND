"use client";
import { Input, Textarea } from "@heroui/input";
import React from "react";
import { useFormikContext, getIn, FormikValues } from "formik";
import { allowOnlyAlphaNumericNoSpace } from "@/helper/utils/inputfilter";
import { capitalize } from "lodash";

interface IProps {
    name: string;
    height?: string;
    placeholder?: string;
    placement?: "inside" | "outside" | "outside-left" | "outside-top";
    label?: string;
    type?: React.HTMLInputTypeAttribute;
    hasFrontIcon?: boolean;
    hasBackIcon?: boolean;
    icon?: React.ReactNode;
    iconback?: React.ReactNode;
    textarea?: boolean;
    disabled?: boolean;
    rounded?: string;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    setLocalValue?: (by: string) => void;
    localValue?: string;
    notform?: boolean;
    maxLength?: number;
}

export default function CustomInput({
    name,
    placement = "outside-top",
    placeholder,
    height,
    label,
    type,
    disabled,
    textarea,
    rounded,
    localValue,
    setLocalValue,
    startContent,
    endContent,
    notform,
    maxLength,
}: IProps) {
    // ---- Handle Formik Mode ----
    const formik = !notform ? useFormikContext<FormikValues>() : null;

    const value = notform ? localValue : getIn(formik?.values, name);
    const error = notform ? undefined : getIn(formik?.errors, name);
    const isTouched = notform ? false : getIn(formik?.touched, name);

    const changeHandler = (val: string) => {
        let sanitizedValue =
            name === "firstName" || name === "lastName"
                ? allowOnlyAlphaNumericNoSpace(val)
                : val;

        if (maxLength) {
            sanitizedValue = sanitizedValue.slice(0, maxLength);
        }

        if (notform) {
            setLocalValue?.(sanitizedValue);
            return;
        }

        if (type === "number") {
            formik?.setFieldValue(name, Number(sanitizedValue));
        } else {
            formik?.setFieldValue(name, sanitizedValue);
        }
    };

    return (
        <div className="w-full flex flex-col gap-0.5">
            {label && (
                <p className="text-sm text-gray-700 font-medium">{label}</p>
            )}

            {/* Default input */}
            {textarea ? (
                <div className="w-full flex flex-col gap-1">
                    <Textarea
                        disabled={disabled}
                        placeholder={placeholder}
                        maxLength={maxLength ?? 1000}
                        labelPlacement={placement}
                        classNames={{
                            inputWrapper: `bg-[#FDFDFD] border border-[#EAEBEDCC] rounded-xl p-3 min-h-[${height ?? "100px"}]`,
                            input: "text-gray-900",
                        }}
                        value={value}
                        onValueChange={changeHandler}
                    />
                    <p className="text-xs text-gray-500 font-medium">
                        {value?.length}/{maxLength ?? 1000}
                    </p>
                </div>
            ) : (
                <>
                    {type === "search" ||
                        ((type === "email" || name === "message" )&& (
                            <div className="w-full flex flex-col gap-1">
                                <Input
                                    disabled={disabled}
                                    placeholder={placeholder}
                                    labelPlacement={placement}
                                    type={type}
                                    startContent={startContent}
                                    endContent={endContent}
                                    classNames={{
                                        inputWrapper: rounded
                                            ? "bg-white rounded-full border border-gray-300 h-[45px] outline-none text-sm "
                                            : " rounded-xl bg-[#FDFDFD] border border-[#EAEBEDCC]  h-[45px]", // 👈 force height
                                        input: "text-gray-900 h-full w-full text-sm  outline-none ",
                                    }}
                                    value={value}
                                    onValueChange={changeHandler}
                                />
                            </div>
                        ))}

                    {type !== "number" &&
                        type !== "search" &&
                        type !== "email" && name !== "message" && (
                            <div className="w-full flex flex-col gap-1">
                                <Input
                                    disabled={disabled}
                                    placeholder={placeholder}
                                    labelPlacement={placement}
                                    type={type}
                                    maxLength={(name === "firstName" || name === "lastName") ? (maxLength ?? 100) : undefined}
                                    startContent={startContent}
                                    endContent={endContent}
                                    classNames={{
                                        inputWrapper: rounded
                                            ? "bg-white rounded-full border border-gray-300 h-[45px] outline-none text-sm "
                                            : " rounded-xl bg-[#FDFDFD] border border-[#EAEBEDCC]  h-[45px]", // 👈 force height
                                        input: "text-gray-900 h-full w-full text-sm  outline-none ",
                                    }}
                                    value={value}
                                    onValueChange={changeHandler}
                                />
                                {name !== "firstName" && name !== "lastName" && (
                                    <p className="text-xs text-gray-500 font-medium">
                                        {value?.length}/{maxLength ?? 100}
                                    </p>
                                )}
                            </div>
                        )}

                    {/* Number-only input */}
                    {type === "number" && (
                        <Input
                            placeholder={placeholder}
                            labelPlacement={placement}
                            type="text"
                            maxLength={maxLength ?? 100}
                            value={value === 0 + "" || !value ? "" : value}
                            disabled={disabled}
                            classNames={{
                                inputWrapper:
                                    "bg-white border border-gray-300 rounded-md h-[45px]", // 👈 force height
                                input: "text-gray-900 h-full capitalize ",
                            }}
                            startContent={startContent}
                            onValueChange={(item: string) => {
                                if (/^\d*$/.test(item)) {
                                    changeHandler(item);
                                }
                            }}
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    formik?.submitForm();
                                }
                            }}
                        />
                    )}
                </>
            )}

            {/* Error message */}
            {isTouched && error && (
                <p className="text-xs text-red-600 font-medium ml-2">{error}</p>
            )}
        </div>
    );
}
