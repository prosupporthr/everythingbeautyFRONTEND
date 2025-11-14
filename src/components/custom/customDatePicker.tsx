"use client";
import React from "react";
import { DatePicker, DateValue } from "@heroui/react";
import { useFormikContext, getIn, FormikValues } from "formik";
import {
  getLocalTimeZone,
  today,
  toZoned,
  fromDate,
  CalendarDateTime,
  parseDate,
  parseDateTime,
} from "@internationalized/date";

interface IProps {
  borderWidth?: string;
  name?: string; // ✅ optional for standalone mode
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  withTime?: boolean;
  defaultHour?: number;
  defaultMinute?: number;

  /** ✅ Standalone mode props */
  useFormik?: boolean;
  value?: string; // ISO string
  onChange?: (value: string) => void;
}

export default function CustomDateTimePicker({
  borderWidth,
  name = "",
  label,
  disabled,
  withTime = true,
  defaultHour = 9,
  defaultMinute = 0,
  useFormik = true,
  value,
  onChange,
}: IProps) {
  /** ✅ Try to use Formik if enabled */
  let formikValue: string | undefined;
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
      console.warn("CustomDateTimePicker: Formik not detected — using standalone mode.");
      useFormik = false;
    }
  }

  /** ✅ RAW value (either from Formik or from props) */
  const rawValue = useFormik ? formikValue : value;
  let dateValue: DateValue | null = null;

  /** ✅ Convert ISO → DatePicker value */
  if (rawValue) {
    try {
      const js = new Date(rawValue);
      const zoned = fromDate(js, getLocalTimeZone());

      if (withTime) {
        dateValue = parseDateTime(
          `${zoned.year}-${String(zoned.month).padStart(2, "0")}-${String(
            zoned.day
          ).padStart(2, "0")}T${String(zoned.hour).padStart(2, "0")}:${String(
            zoned.minute
          ).padStart(2, "0")}`
        );
      } else {
        dateValue = parseDate(
          `${zoned.year}-${String(zoned.month).padStart(2, "0")}-${String(
            zoned.day
          ).padStart(2, "0")}`
        );
      }
    } catch (err) {
      console.warn("Invalid date value:", rawValue, err);
    }
  }

  /** ✅ When user picks a date/time */
  const handleChange = (item: DateValue | null) => {
    if (!item) {
      if (useFormik && setFormikValue) setFormikValue(name, null);
      else onChange?.("");
      return;
    }

    let zoned;

    if (withTime) {
      if ("hour" in item) {
        zoned = toZoned(item, getLocalTimeZone());
      } else {
        const withDefault = new CalendarDateTime(
          item.year,
          item.month,
          item.day,
          defaultHour,
          defaultMinute
        );
        zoned = toZoned(withDefault, getLocalTimeZone());
      }
    } else {
      zoned = toZoned(item, getLocalTimeZone());
    }

    const iso = new Date(
      zoned.toDate().getTime() - new Date().getTimezoneOffset() * 60000
    ).toISOString();

    if (useFormik && setFormikValue) setFormikValue(name, iso);
    else onChange?.(iso);
  };

  return (
    <div className="w-full flex flex-col gap-0.5">
      {label && (
        <p className="text-sm text-gray-700 font-medium">{label}</p>
      )}

      <DatePicker
        isDisabled={disabled}
        value={dateValue ?? undefined}
        granularity={withTime ? "minute" : "day"}
        minValue={today(getLocalTimeZone())}
        hourCycle={12}
        style={{
          borderWidth: borderWidth ?? "1px", 
        }}
        onChange={handleChange}
        classNames={{
          inputWrapper:
            "bg-white border-gray-300 rounded-xl h-[45px]",
          input: "text-gray-900",
        }}
      />

      {useFormik && formikTouched && formikError && (
        <p className="text-xs text-red-600 font-medium ml-2">
          {formikError}
        </p>
      )}
    </div>
  );
}
