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
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  withTime?: boolean;
  defaultHour?: number;
  defaultMinute?: number;
}

export default function CustomDateTimePicker({
  name,
  label,
  disabled,
  withTime = true,
  defaultHour = 9,
  defaultMinute = 0,
}: IProps) {
  const { errors, touched, setFieldValue, values } =
    useFormikContext<FormikValues>();

  const error = getIn(errors, name) as string | undefined;
  const isTouched = getIn(touched, name) as boolean | undefined;

  // ✅ Convert ISO → DateValue (preserving local timezone)
  const rawValue = getIn(values, name) as string | undefined;
  let formikValue: DateValue | null = null;

  if (rawValue) {
    try {
      const jsDate = new Date(rawValue);
      // Convert JS Date → Zoned Date (keeps local date correctly)
      const zoned = fromDate(jsDate, getLocalTimeZone());
      formikValue = withTime
        ? parseDateTime(
          `${zoned.year}-${String(zoned.month).padStart(2, "0")}-${String(
            zoned.day
          ).padStart(2, "0")}T${String(zoned.hour).padStart(
            2,
            "0"
          )}:${String(zoned.minute).padStart(2, "0")}`
        )
        : parseDate(
          `${zoned.year}-${String(zoned.month).padStart(2, "0")}-${String(
            zoned.day
          ).padStart(2, "0")}`
        );
    } catch (e: unknown) {
      console.warn("Invalid date in formik value:", rawValue + e);
    }
  }

  const changeHandler = (item: DateValue | null) => {
    if (!item) {
      setFieldValue(name, null);
      return;
    }

    let zoned;
    if (withTime) {
      if ("hour" in item) {
        zoned = toZoned(item, getLocalTimeZone());
      } else {
        const withDefaultTime = new CalendarDateTime(
          item.year,
          item.month,
          item.day,
          defaultHour,
          defaultMinute
        );
        zoned = toZoned(withDefaultTime, getLocalTimeZone());
      }
    } else {
      zoned = toZoned(item, getLocalTimeZone());
    }

    // ✅ Store ISO string from local time (avoid UTC shift)
    setFieldValue(
      name,
      new Date(zoned.toDate().getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
    );
  };

  return (
    <div className="w-full flex flex-col gap-0.5">
      {label && (
        <p className="text-sm text-gray-700 font-medium">{label}</p>
      )}

      <DatePicker
        showMonthAndYearPickers
        // isDisabled={disabled}
        value={formikValue ?? undefined}
        // minValue={today(getLocalTimeZone())}
        granularity={withTime ? "minute" : "day"}
        hourCycle={12}
        classNames={{
          inputWrapper:
            "bg-white text-primary border border-gray-300 rounded-xl h-[45px]",
          input: " text-primary ",
        }}
        onChange={(date) => changeHandler(date)}
      />

      {isTouched && error && (
        <p className="text-xs text-red-600 font-medium ml-2">{error}</p>
      )}
    </div>
  );
}
