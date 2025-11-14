"use client";

import { Input, Chip, Button } from "@heroui/react";
import { useFormikContext, getIn, FormikValues } from "formik";
import { useState, KeyboardEvent } from "react";

interface CustomStringArrayInputProps {
  name: string;
  label?: string;
  placeholder?: string;
}

export default function CustomStringArrayInput({
  name,
  label,
  placeholder = "Type and press Enter",
}: CustomStringArrayInputProps) {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<FormikValues>();

  const tags: string[] = getIn(values, name) || [];
  const error = getIn(errors, name);
  const isTouched = getIn(touched, name);

  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      setFieldValue(name, [...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (index: number) => {
    setFieldValue(
      name,
      tags.filter((_, i) => i !== index)
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <p className="text-sm text-gray-700 font-medium">{label}</p>}
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <Chip
            key={index}
            variant="flat"
            color="primary"
            size="sm"
            onClose={() => removeTag(index)}
            className="cursor-pointer"
          >
            {tag}
          </Chip>
        ))}
      </div>

      {/* Input field */}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        isInvalid={Boolean(isTouched && error)}
        errorMessage={isTouched && error ? String(error) : undefined}
        className="w-full"
        endContent={
          <Button
            size="sm"
            color="primary"
            isDisabled={!input.trim()}
            onPress={() => addTag(input)}
          >
            Add
          </Button>
        }
      />
    </div>
  );
}
