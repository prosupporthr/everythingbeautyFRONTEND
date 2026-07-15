"use client";

import { useRef } from "react";
import { DateValue, DatePicker } from "@heroui/react";
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

// Keys that are still allowed through to the input even though typing is
// disabled. This keeps keyboard accessibility (Tab navigation, opening the
// calendar with Enter/Space/ArrowDown, closing it with Escape) intact while
// blocking digit/letter/punctuation keys that would otherwise let someone
// manually type a date into the segments.
const ALLOWED_KEYS = new Set([
  "Tab",
  "Shift",
  "Enter",
  " ",
  "Escape",
  "ArrowDown",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
]);

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

  // HeroUI's DatePicker doesn't reliably support a controlled isOpen prop,
  // so instead of trying to drive the popover via state, we grab a ref to
  // the wrapper and programmatically click the picker's own trigger button
  // whenever the user clicks anywhere else in the field.
  const wrapperRef = useRef<HTMLDivElement>(null);

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
  let dateValue: DateValue | null | undefined = null;

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

  const jsToday = new Date();
  jsToday.setFullYear(jsToday.getFullYear() - 18);

  const yyyy = jsToday.getFullYear();
  const mm = String(jsToday.getMonth() + 1).padStart(2, "0");
  const dd = String(jsToday.getDate()).padStart(2, "0");

  const maxDOB = parseDate(`${yyyy}-${mm}-${dd}`);
  const minDOB = parseDate("1900-01-01");

  /** ---------- NORMAL MODE RESTRICTIONS ---------- */
  const minNormal = todayDate;

  // Blocks manual keystrokes from editing the date segments while still
  // letting Tab/Enter/Space/Escape/Arrow keys through for accessibility.
  const handleKeyDownCapture = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!ALLOWED_KEYS.has(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Clicking anywhere in the field (a segment, the padding, whatever)
  // finds the picker's real <button> (the calendar-icon trigger) and
  // clicks it for the user. If the click already landed on that button,
  // we do nothing and let it handle its own open/close toggle — clicking
  // it again here would just immediately close what it just opened.
  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const target = e.target as HTMLElement;
    const trigger = wrapperRef.current?.querySelector<HTMLButtonElement>("button");

    if (trigger && !trigger.contains(target)) {
      trigger.click();
    }
  };

  return (
    <div className="w-full flex flex-col gap-0.5">
      {label && <p className="text-sm text-gray-700 font-medium">{label}</p>}

      {/* Wrapping div: clicking anywhere in the field clicks the picker's
          own trigger button to open the calendar, and captures keydown
          before it reaches the date segments. */}
      <div
        ref={wrapperRef}
        onClick={handleWrapperClick}
        onKeyDownCapture={handleKeyDownCapture}
        className="cursor-pointer [&_[role='spinbutton']]:pointer-events-none"
      >
        <DatePicker
          isDisabled={disabled}
          // @ts-expect-error — HeroUI + internationalized date type mismatch is safe here
          value={dateValue}
          granularity={withTime && !isDOB ? "minute" : "day"}
          minValue={isDOB ? minDOB : minNormal}
          maxValue={isDOB ? maxDOB : undefined}
          hourCycle={12}
          style={{
            borderWidth: borderWidth ?? "1px",
            caretColor: "transparent",
          }}
          startView="year"
          onChange={handleChange}
          classNames={{
            inputWrapper: "bg-white border border-gray-300 rounded-xl h-[45px] cursor-pointer",
            input: "text-gray-900 cursor-pointer select-none",
          }}
        />
      </div>

      {useFormik && formikTouched && formikError && (
        <p className="text-xs text-red-600 font-medium ml-2">{formikError}</p>
      )}
    </div>
  );
}