"use client";
import React from "react";
import { TimeInput } from "@heroui/react";
import { useFormikContext, getIn, FormikValues } from "formik";
import { parseTime, Time } from "@internationalized/date";

interface IProps {
  borderWidth?: string
  name?: string;              // optional when not using formik
  label?: string;
  disabled?: boolean;
  is24Hour?: boolean;
  useFormik?: boolean;        // ✅ NEW — choose formik or standalone
  

  // Standalone props
  value?: string;             // ✅ "HH:mm"
  onChange?: (value: string) => void;
}

export default function CustomTimePicker({
  name = "",
  borderWidth,
  label,
  disabled = false,
  is24Hour = false,
  useFormik = true,
  value,
  onChange,
}: IProps) {
  
  /** ✅ FORMik handling (only if enabled) */
  let formikValue: string | undefined = undefined;
  let formikError: string | null = null;
  let formikTouched: boolean = false;
  let setFormikValue: ((field: string, val: any) => void) | null = null;

  if (useFormik) {
    try {
      const formik = useFormikContext<FormikValues>();
      formikError = getIn(formik.errors, name) || null;
      formikTouched = getIn(formik.touched, name) || false;
      formikValue = getIn(formik.values, name);
      setFormikValue = formik.setFieldValue;
    } catch {
      console.warn("CustomTimePicker: Formik not detected — using standalone mode.");
      useFormik = false;
    }
  }

  /** ✅ Convert string → Time object */
  const rawValue = useFormik ? formikValue : value;
  let timeValue: Time | undefined = undefined;

  if (rawValue) {
    try {
      timeValue = parseTime(rawValue);
    } catch {
      console.warn("Invalid time:", rawValue);
    }
  }

  /** ✅ Handle update */
  const handleChange = (item: Time | null) => {
    const formatted = item
      ? `${String(item.hour).padStart(2, "0")}:${String(item.minute).padStart(2, "0")}`
      : "";

    if (useFormik && setFormikValue) {
      setFormikValue(name, formatted);
    } else {
      onChange?.(formatted);
    }
  };

  return (
    <div className="w-full flex flex-col gap-0.5">
      {label && <p className="text-sm text-gray-700 font-medium">{label}</p>}

      <TimeInput
        isDisabled={disabled}
        value={timeValue}
        onChange={handleChange}
        hourCycle={is24Hour ? 24 : 12}
        style={{
          borderWidth: borderWidth ?? "1px"
        }}
        classNames={{
          inputWrapper: ` bg-white hover:bg-white border-gray-300 rounded-xl h-[45px] `,
          input: "text-gray-900",
        }}
      />

      {useFormik && formikTouched && formikError && (
        <p className="text-xs text-red-600 font-medium ml-2">{formikError}</p>
      )}
    </div>
  );
}
