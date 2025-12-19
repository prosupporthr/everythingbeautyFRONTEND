"use client";

import { Select, SelectItem } from "@heroui/react";
import { useFormikContext, getIn, FormikValues } from "formik";
import { useMemo, useState } from "react";

interface DOBPickerProps {
    name: string;
    label?: string;
}

export default function DOBPicker({ name, label }: DOBPickerProps) {
    const formik = useFormikContext<FormikValues>();
    const error = getIn(formik.errors, name);
    const touched = getIn(formik.touched, name);
    const value = getIn(formik.values, name);

    // ---------- AGE LIMIT ----------
    const today = new Date();
    const maxYear = today.getFullYear() - 18;
    const minYear = 1900;

    const years = useMemo(
        () => Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i),
        [maxYear, minYear]
    );

    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ];

    const daysInMonth = (year: number, month: number) =>
        new Date(year, month, 0).getDate();

    // ---------- Convert saved value → selects ----------
    const selectedDate = value ? new Date(value) : null;
    const selectedYear = selectedDate ? selectedDate.getFullYear() : "";
    const selectedMonth = selectedDate ? selectedDate.getMonth() + 1 : "";
    const selectedDay = selectedDate ? selectedDate.getDate() : "";

    const [yearData, setYear] = useState("")
    const [monthData, setMonth] = useState("")
    const [dayData, setDay] = useState("")

    // ---------- Update Formik ----------
    const handleChange = (
        year?: string | number,
        month?: string | number,
        day?: string | number
    ) => {



        if (year) {
            setYear(year as string)

            if (year && monthData && dayData) {
                formik.setFieldValue(name, "");


                const iso = new Date(
                    Date.UTC(Number(year), Number(monthData) - 1, Number(dayData))
                ).toISOString();

                formik.setFieldValue(name, iso);

            }

        } else if (month) {
            setMonth(month as string)

            if (yearData && month && dayData) {
                formik.setFieldValue(name, "");


                const iso = new Date(
                    Date.UTC(Number(yearData), Number(month) - 1, Number(dayData))
                ).toISOString();

                formik.setFieldValue(name, iso);

            }

        } else if (day) {
            setDay(day as string)

            if (yearData && monthData && day) {
                formik.setFieldValue(name, "");

                const iso = new Date(
                    Date.UTC(Number(yearData), Number(monthData) - 1, Number(day))
                ).toISOString();

                formik.setFieldValue(name, iso);

            }

        }

    };

    return (
        <div className="w-full flex flex-col gap-1">
            {label && (
                <p className="text-sm text-gray-900 font-medium">
                    {label} (YYYY-MM-DD)
                </p>
            )}

            <div className="flex gap-2 w-full">

                {/* ---------- YEAR ---------- */}
                <Select
                    selectedKeys={yearData ? [yearData] : [String(selectedYear)] }
                    placeholder="Year"
                    className="w-1/3"
                    onChange={(e) =>
                        handleChange(e.target.value, "", "")
                    }
                    label="Year"
                >
                    {years.map((y) => (
                        <SelectItem
                            key={y}
                            id={String(y)}
                            textValue={String(y)}
                        >
                            {y}
                        </SelectItem>
                    ))}
                </Select>

                {/* ---------- MONTH ---------- */}
                <Select
                    selectedKeys={monthData ? [monthData] : [String(selectedMonth)]}
                    placeholder="Month"
                    className="w-1/3"
                    onChange={(e) =>
                        handleChange("", e.target.value, "")
                    }
                    label="Month"
                >
                    {months.map((m) => (
                        <SelectItem
                            key={m.value}
                            id={String(m.value)}
                            textValue={m.label}
                        >
                            {m.label}
                        </SelectItem>
                    ))}
                </Select>

                {/* ---------- DAY ---------- */}
                <Select
                    selectedKeys={dayData ? [dayData] : [String(selectedDay)] }
                    placeholder="Day"
                    className="w-1/3"
                    onChange={(e) =>
                        handleChange("", "", e.target.value)
                    }
                    label="Day"
                >
                    {(selectedYear && selectedMonth) || (yearData && monthData)
                        ? Array.from(
                            {
                                length: daysInMonth(
                                    Number(selectedYear ? selectedYear : yearData),
                                    Number(selectedMonth ? selectedMonth : monthData)
                                ),
                            },
                            (_, i) => i + 1
                        ).map((d) => (
                            <SelectItem key={d} id={String(d)} textValue={String(d)}>
                                {d}
                            </SelectItem>
                        ))
                        : null}
                </Select>
            </div>

            {/* ---------- ERROR ---------- */}
            {touched && error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
}
