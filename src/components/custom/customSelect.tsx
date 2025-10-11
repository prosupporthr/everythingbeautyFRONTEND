"use client";

import { Select, SelectItem } from "@heroui/react";
import { useFormikContext, getIn, FormikValues } from "formik";

interface CustomSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  height?: string
}

export default function CustomSelect({
  name,
  label,
  placeholder,
  options,
  height
}: CustomSelectProps) {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<FormikValues>();

  const value = getIn(values, name);
  const error = getIn(errors, name);
  const isTouched = getIn(touched, name);

  return (
    <div className="w-full flex flex-col gap-0.5">
      {label && (
        <p className="text-sm text-gray-900 font-medium">{label}</p>
      )}
      <Select
        // label={label}
        placeholder={placeholder}
        selectedKeys={value ? [value] : []}
        style={{ height: height ?? "45px", backgroundColor: "white", borderWidth: "1px", borderColor: "#d1d5dc", color: "#101828" }}
        onChange={(e) => setFieldValue(name, e.target.value)}
        isInvalid={Boolean(isTouched && error)}
        errorMessage={isTouched && error ? error : undefined} 
      >
        {options.map((opt) => (
          <SelectItem key={opt.value} id={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
