"use client"
import { Input, Textarea } from "@heroui/input"
import React from "react"
import { useFormikContext, getIn, FormikValues } from "formik"

interface IProps {
  name: string
  height?: string
  placeholder?: string
  placement?: "inside" | "outside" | "outside-left" | "outside-top"
  label?: string
  type?: React.HTMLInputTypeAttribute
  hasFrontIcon?: boolean
  hasBackIcon?: boolean
  icon?: React.ReactNode
  iconback?: React.ReactNode
  textarea?: boolean
  disabled?: boolean,
  rounded?: string
  startContent?: React.ReactNode
  endContent?: React.ReactNode
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
  startContent,
  endContent
}: IProps) {
  const { values, errors, touched, setFieldValue } =
    useFormikContext<FormikValues>()

  const value = getIn(values, name) as string
  const error = getIn(errors, name) as string | undefined
  const isTouched = getIn(touched, name) as boolean | undefined

  const changeHandler = (val: string) => {
    if (type === "number") {
      setFieldValue(name, Number(val))
    } else {
      setFieldValue(name, val)
    }
  }

  return (
    <div className="w-full flex flex-col gap-0.5">
      {label && (
        <p className="text-sm text-gray-700 font-medium">{label}</p>
      )}

      {/* Default input */}
      {textarea ? (
        <Textarea
          disabled={disabled}
          placeholder={placeholder} 
          labelPlacement={placement}
          classNames={{
            inputWrapper:
              `bg-[#FDFDFD] border border-[#EAEBEDCC] rounded-xl p-3 min-h-[${height ?? "100px"}]`,
            input: "text-gray-900",
          }}
          value={value}
          onValueChange={changeHandler}
        />
      ) : (
        <>
          {type !== "number" && (
            <Input
              disabled={disabled}
              placeholder={placeholder}
              labelPlacement={placement}
              type={type}
              startContent={
                startContent
              }
              endContent= {
                endContent
              }
              classNames={{
                inputWrapper:
                  rounded ? "bg-white rounded-full border border-gray-300 h-[45px] outline-none text-sm " :
                  " rounded-xl bg-[#FDFDFD] border border-[#EAEBEDCC]  h-[45px]", // 👈 force height
                input: "text-gray-900 h-full w-full text-sm  outline-none ",
              }} 
              value={value}
              onValueChange={changeHandler}
            />
          )}

          {/* Number-only input */}
          {type === "number" && (
            <Input
              placeholder={placeholder}
              labelPlacement={placement}
              type="text"
              value={value}
              disabled={disabled}
              classNames={{
                inputWrapper:
                  "bg-white border border-gray-300 rounded-md h-[45px]", // 👈 force height
                input: "text-gray-900 h-full ",
              }}
              startContent={
                startContent
              }
              onValueChange={(item: string) => {
                if (/^\d*$/.test(item)) {
                  changeHandler(item)
                }
              }}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault()
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
  )
}
