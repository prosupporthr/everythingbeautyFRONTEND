"use client";

import { Select, SelectItem } from "@heroui/react";
import { useFormikContext, getIn, FormikValues } from "formik";

interface CustomMultiSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

/**
 * ✅ Allows selecting from a predefined list
 * ✅ Displays and keeps values that are not in `options`
 */
export default function CustomMultiSelect({
  name,
  label,
  placeholder,
  options,
}: CustomMultiSelectProps) {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<FormikValues>();

  const value: string[] = getIn(values, name) || [];
  const error = getIn(errors, name);
  const isTouched = getIn(touched, name);

  // ➕ Find items in value that are missing from options
  const missingValues = value.filter(
    (v) => !options.some((opt) => opt.value === v)
  );

  return (
    <div className="w-full flex flex-col gap-0.5">
      {label && (
        <p className="text-sm text-gray-700 font-medium">{label}</p>
      )}

      <Select
        placeholder={placeholder}
        selectionMode="multiple"
        selectedKeys={value}
        onSelectionChange={(keys) =>
          setFieldValue(name, Array.from(keys) as string[])
        }
        isInvalid={Boolean(isTouched && error)}
        errorMessage={isTouched && error ? error : undefined}
      >
        <>
          {options.map((opt) => (
            <SelectItem key={opt.value} id={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </>
        <>

          {missingValues.map((v) => (
            <SelectItem key={v} id={v}>
              {v} {/* fallback to showing the raw value */}
            </SelectItem>
          ))}
        </>
      </Select>
    </div>
  );
}
