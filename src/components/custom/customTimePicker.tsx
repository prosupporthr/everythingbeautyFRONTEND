"use client";
import React from "react";
import { TimeInput } from "@heroui/react";
import { useFormikContext, getIn, FormikValues } from "formik";
import { parseTime, Time } from "@internationalized/date";

interface IProps {
  name: string;
  label?: string;
  disabled?: boolean;
  is24Hour?: boolean; // 12-hour or 24-hour format
}

export default function CustomTimePicker({
  name,
  label,
  disabled = false,
  is24Hour = false,
}: IProps) {
  const { errors, touched, setFieldValue, values } =
    useFormikContext<FormikValues>();

  const error = getIn(errors, name) as string | undefined;
  const isTouched = getIn(touched, name) as boolean | undefined;
  const rawValue = getIn(values, name) as string | undefined;

  // 🔹 Convert string ("14:30") to Time object
  let formikValue: Time | null = null;
  if (rawValue) {
    try {
      formikValue = parseTime(rawValue);
    } catch {
      console.warn("Invalid time value:", rawValue);
    }
  }

  // 🔹 When user picks a time, store it as "HH:mm"
  const handleChange = (item: Time | null) => {
    if (!item) {
      setFieldValue(name, "");
      return;
    }

    const formattedTime = `${String(item.hour).padStart(2, "0")}:${String(
      item.minute
    ).padStart(2, "0")}`;

    setFieldValue(name, formattedTime);
  };

  return (
    <div className="w-full flex flex-col gap-0.5">
      {label && <p className="text-sm text-gray-700 font-medium">{label}</p>}

      <TimeInput
        isDisabled={disabled}
        value={formikValue ?? undefined}
        onChange={handleChange}
        hourCycle={is24Hour ? 24 : 12}
        classNames={{
          inputWrapper:
            "bg-white border border-gray-300 rounded-xl h-[45px]",
          input: "text-gray-900",
        }}
      />

      {isTouched && error && (
        <p className="text-xs text-red-600 font-medium ml-2">{error}</p>
      )}
    </div>
  );
}
