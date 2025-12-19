"use client";

import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import {
    Select,
    SelectItem,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@heroui/react";
import { useFormikContext, FormikValues, getIn } from "formik";

export default function ColorSelector() {
    const { values, setFieldValue } = useFormikContext<FormikValues>();
    const colors = getIn(values, "colors") || [];

    const [open, setOpen] = useState(false);
    const [pickedColor, setPickedColor] = useState("");
    const [customColor, setCustomColor] = useState({ label: "", value: "" });

    /** Predefined colors */
    const colorOptions = [
        { value: "#FFFFFF", label: "White" },
        { value: "#000000", label: "Black" },
        { value: "#FF0000", label: "Red" },
        { value: "#00FF00", label: "Green" },
        { value: "#0000FF", label: "Blue" },
        { value: "#FFFF00", label: "Yellow" },
        { value: "#FF00FF", label: "Magenta" },
        { value: "#00FFFF", label: "Cyan" },
        { value: "#C0C0C0", label: "Silver" },
        { value: "#808080", label: "Gray" },
    ];

    /** Add selected color */
    const handleSelect = (value: string) => {
        const option = colorOptions.find((c) => c.value === value);
        if (!option) return;

        const exists = colors.some((c: any) => c.color === option.value);
        if (exists) return;

        setFieldValue("colors", [...colors, { label: option.label, color: option.value }]);
        setPickedColor(""); // reset dropdown
    };

    /** Add custom color */
    const addCustomColor = () => {
        if (!customColor.label || !customColor.value) {
            alert("Please enter valid color name and hex code");
            return;
        }

        const exists = colors.some(
            (c: any) => c.label === customColor.label || c.color === customColor.value
        );

        if (exists) {
            alert("Color already exists");
            return;
        }

        setFieldValue("colors", [...colors, { label: customColor.label, color: customColor.value }]);
        setOpen(false);
        setCustomColor({ label: "", value: "" });
    };

    /** Remove a color */
    const removeColor = (label: string) => {
        const filtered = colors.filter((c: any) => c.label !== label);
        setFieldValue("color", filtered);
    };

    console.log(colors);
    

    return (
        <div className="flex flex-col gap-2 w-full">
            <p className="font-medium text-gray-700">Color</p>

            {/* Hero UI Select (Single) */}
            <Select
                label="Select a color"
                placeholder="Choose a color"
                selectedKeys={[pickedColor]}
                onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0] as string;
                    handleSelect(v);
                    setPickedColor(v);
                }}
                className="max-w-xs"
            >
                {colorOptions
                    .filter((c) => !colors.some((x: any) => x.color === c.value))
                    .map((c) => (
                        <SelectItem key={c.value} id={c.value} >
                            {c.label}
                        </SelectItem>
                    ))}
            </Select>
            {/* Selected Colors */}
            <div className="flex flex-wrap gap-2 mt-2">
                {colors.map((item: any) => (
                    <div
                        key={item.label}
                        className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-1"
                    >
                        <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <p className="text-sm">{item.label}</p>
                        <button
                            onClick={() => removeColor(item.label)}
                            className="text-gray-600 hover:text-black"
                        >
                            <IoIosClose size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add custom color */}
            <button
                onClick={() => setOpen(true)}
                className="text-blue-600 text-sm mt-1"
            >
                Add Custom Color
            </button>

            {/* Modal */}
            <Modal isOpen={open} onOpenChange={setOpen} size="sm">
                <ModalContent>
                    <ModalHeader className="font-semibold">
                        Add Custom Color
                    </ModalHeader>

                    <ModalBody>
                        <div className="flex flex-col gap-3 py-2">
                            <div>
                                <p className="text-sm font-medium mb-1">Color Name</p>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                                    value={customColor.label}
                                    onChange={(e) =>
                                        setCustomColor({
                                            ...customColor,
                                            label: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <p className="text-sm font-medium mb-1">Color Hex Code</p>
                                <input
                                    type="text"
                                    placeholder="#055696"
                                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                                    value={customColor.value}
                                    onChange={(e) =>
                                        setCustomColor({
                                            ...customColor,
                                            value: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <Button
                                color="primary"
                                className="rounded-full mt-2"
                                onClick={addCustomColor}
                            >
                                Add Color
                            </Button>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
