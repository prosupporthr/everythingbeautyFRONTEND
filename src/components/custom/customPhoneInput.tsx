"use client";
import React from "react";
import { useField } from "formik";
import PhoneInput, { Value } from "react-phone-number-input";
import "react-phone-number-input/style.css"; 

interface FormikPhoneInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const FormikPhoneInput: React.FC<FormikPhoneInputProps> = ({
  name,
  label,
  placeholder = "Enter phone number",
  disabled,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div className=" flex flex-col gap-0.5 w-full ">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <PhoneInput
        id={name}
        defaultCountry="NG"
        value={field.value as Value}
        onChange={(value) => helpers.setValue(value || "")}
        onBlur={() => helpers.setTouched(true)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full border rounded-lg px-3 h-[45px] text-[14px] 
          ${meta.touched && meta.error ? "border-red-500" : "border-gray-300"}
        `}
      />

      {meta.touched && meta.error && (
        <p className="text-[12px] text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default FormikPhoneInput;
