"use client";

import { Select, SelectItem } from "@heroui/react";
import { useFormikContext, getIn, FormikValues } from "formik";

interface CustomSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  height?: string;
  rounded?: string;
  bgColor?: string;
  color?: string;
  notform?: boolean;
  borderWidth?: string;
  borderColor?: string;
}

interface CustomSelectPropsTag {
  name: string;
  label?: string;
  value: string;
  onchange: (by: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  height?: string;
  rounded?: string;
  bgColor?: string;
  color?: string;
  notform?: boolean;
  borderWidth?: string;
  borderColor?: string;
}

export default function CustomSelect(props: CustomSelectProps | CustomSelectPropsTag) {
  if (props.notform) {
    return <SelectTag {...(props as CustomSelectPropsTag)} />;
  }

  return <FormSelect {...(props as CustomSelectProps)} />;
}

const FormSelect = ({
  name,
  label,
  placeholder,
  options,
  rounded,
  bgColor,
  color,
  height,
  borderColor,
  borderWidth
}: CustomSelectProps) => {
  const { values, setFieldValue, errors, touched } = useFormikContext<FormikValues>();
  const value = getIn(values, name);
  const error = getIn(errors, name);
  const isTouched = getIn(touched, name);

  const textColor = color ?? "#101828";

  return (
    <div className="w-full flex flex-col gap-0.5">
      {label && <p className="text-sm text-gray-900 font-medium">{label}</p>}
      <Select
        placeholder={placeholder}
        selectedKeys={value ? [value] : []}
        style={{
          height: height ?? "45px",
          backgroundColor: bgColor ?? "white",
          borderWidth: borderWidth ?? "1px",
          borderColor: borderColor ?? "#d1d5dc",
          borderRadius: rounded ?? "12px",
        }}
        classNames={{
          trigger: `text-[${textColor}]`, // affects the visible selected value
          popoverContent: `text-[${textColor}]`, // affects dropdown options
        }}
        onChange={(e) => setFieldValue(name, e.target.value)}
        isInvalid={Boolean(isTouched && error)}
        errorMessage={isTouched && error ? error : undefined}
      >
        {options.map((opt) => (
          <SelectItem key={opt.value} id={opt.value} className={`text-[${textColor}]`}>
            {opt.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

const SelectTag = ({
  name,
  label,
  placeholder,
  options,
  height,
  bgColor,
  color,
  onchange,
  rounded,
  value,
  borderWidth,
  borderColor
}: CustomSelectPropsTag) => {
  const textColor = color ?? "#101828";

  return (
    <div className="w-full flex flex-col gap-0.5 ">
      {label && <p className="text-sm text-gray-900 font-medium">{label}</p>}
      <Select
        name={name}
        placeholder={placeholder}
        selectedKeys={value ? [value] : []}
        style={{
          height: height ?? "45px",
          backgroundColor: bgColor ?? "white",
          borderWidth: borderWidth ?? "1px",
          borderColor: borderColor ?? "#d1d5dc",
          borderRadius: rounded ?? "12px",
          paddingLeft: borderWidth ? "0px" : "14px", 
          boxShadow: "none"
        }}
        classNames={{
          trigger: `text-[${textColor}]`,
          popoverContent: `text-[${textColor}]`,
        }}
        onChange={(e) => onchange(e.target.value + "")}
      >
        {options.map((opt) => (
          <SelectItem key={opt.value} id={opt.value} className={`text-[${textColor}]`}>
            {opt.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};
