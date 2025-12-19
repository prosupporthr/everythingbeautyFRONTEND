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
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  withTime?: boolean;
  defaultHour?: number;
  defaultMinute?: number;

  /** Standalone mode */
  useFormik?: boolean;
  value?: string;
  onChange?: (value: string) => void;

  /** NEW — Date of Birth mode (18+ only) */
  isDOB?: boolean;
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
  isDOB = false,
}: IProps) {
  // If DOB mode is enabled, disable time selection
  if (isDOB) {
    withTime = false;
  }

  /** Try to use Formik if enabled */
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
      console.warn("CustomDateTimePicker: Formik not detected — switching to standalone mode.");
      useFormik = false;
    }
  }

  /** RAW value (Formik or standalone) */
  const rawValue = useFormik ? formikValue : value;
  let dateValue: DateValue | null = null;

  /** Convert ISO → DatePicker value */
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

  /** Handle user selection */
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

  /** ---------- DOB MODE RESTRICTIONS (compute without subtractYears) ---------- */
  const localTZ = getLocalTimeZone();
  const todayDate = today(localTZ);

  // Compute JS date for today minus 18 years
  const jsToday = new Date();
  // Use localTZ offset if necessary — but for DOB boundary a plain JS date is fine:
  jsToday.setFullYear(jsToday.getFullYear() - 18);

  const yyyy = jsToday.getFullYear();
  const mm = String(jsToday.getMonth() + 1).padStart(2, "0");
  const dd = String(jsToday.getDate()).padStart(2, "0");

  // maxDOB = today - 18 years, as CalendarDate via parseDate
  const maxDOB = parseDate(`${yyyy}-${mm}-${dd}`);
  const minDOB = parseDate("1900-01-01"); // Earliest allowed DOB

  /** ---------- NORMAL MODE RESTRICTIONS ---------- */
  const minNormal = today(localTZ); // Cannot pick past days for normal mode

  return (
    <div className="w-full flex flex-col gap-0.5">
      {label && <p className="text-sm text-gray-700 font-medium">{label}</p>}

      <DatePicker
        isDisabled={disabled}
        value={dateValue ?? undefined}
        granularity={withTime && !isDOB ? "minute" : "day"}
        minValue={isDOB ? minDOB : minNormal}
        maxValue={isDOB ? maxDOB : undefined}
        hourCycle={12}
        style={{
          borderWidth: borderWidth ?? "1px",
        }}
        onChange={handleChange}
        classNames={{
          inputWrapper: "bg-white border-gray-300 rounded-xl h-[45px]",
          input: "text-gray-900",
        }}
      />

      {useFormik && formikTouched && formikError && (
        <p className="text-xs text-red-600 font-medium ml-2">{formikError}</p>
      )}
    </div>
  );
}
