"use client"
import { Input, Textarea } from "@heroui/input"
import React from "react"
import { useFormikContext, getIn, FormikValues } from "formik"
import { allowOnlyAlphaNumeric, allowOnlyAlphaNumericNoSpace } from "@/helper/utils/inputfilter"

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
  endContent?: React.ReactNode,
  setLocalValue?: (by: string) => void,
  localValue?: string,
  notform?: boolean
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
  notform
}: IProps) {
  // const { values, errors, touched, setFieldValue } =
  //   useFormikContext<FormikValues>()



  // ---- Handle Formik Mode ----
  let formik: any = {}
  if (!notform) {
    formik = useFormikContext<FormikValues>()
  }

  const value = notform ? localValue : getIn(formik.values, name)
  const error = notform ? undefined : getIn(formik.errors, name)
  const isTouched = notform ? false : getIn(formik.touched, name)

  const changeHandler = (val: string) => {

    console.log(val);
    console.log(type);
    

    const sanitizedValue =
      type === "number" ? val : 
      type === "email" ? val : 
      name === "firstName" || name === "lastName" ? allowOnlyAlphaNumericNoSpace(val) :
      textarea ? val 
        : allowOnlyAlphaNumeric(val)

    if (notform) {
      setLocalValue?.(sanitizedValue)
      return
    }

    if (type === "number") {
      formik.setFieldValue(name, Number(sanitizedValue))
    } else {
      formik.setFieldValue(name, sanitizedValue)
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
              endContent={
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
              value={(value === 0 + "" || !value) ? "" : value}
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
