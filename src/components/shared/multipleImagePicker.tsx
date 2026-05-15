"use client";

import { convertAndCompressToJpg } from "@/helper/services/convertImage";
import { addToast, Spinner } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useField, useFormikContext } from "formik";
import { RiCloseLine, RiImage2Line, RiUploadCloudFill } from "react-icons/ri";
import { CustomImage } from "../custom";
import { LuUpload } from "react-icons/lu";

interface Props {
    name: string;
    preview?: string[];
}

export default function MultipleImagePicker({ name, preview = [] }: Props) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { setFieldValue } = useFormikContext<any>();
    const [field, meta] = useField<File[]>({ name });

    const imageFiles = field.value || [];

    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>(preview);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleMultipleImages = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const TYPES = ["image/png", "image/jpg", "image/jpeg"];

        try {
            const selectedFiles = Array.from(files);

            const invalidFile = selectedFiles.find(
                (file) => !TYPES.includes(file.type),
            );

            if (invalidFile) {
                addToast({
                    title: "Error",
                    description: "Unsupported file type. Use PNG or JPG.",
                    color: "danger",
                    timeout: 3000,
                });

                return;
            }

            const convertedFiles = await Promise.all(
                selectedFiles.map((file) =>
                    convertAndCompressToJpg(file, 800, 0.9, setIsLoading),
                ),
            );

            setFieldValue(name, [...imageFiles, ...convertedFiles]);
        } catch (error) {
            console.error("Error converting images:", error);

            addToast({
                title: "Upload Failed",
                description: "Could not process the images.",
                color: "danger",
                timeout: 3000,
            });
        } finally {
            setIsLoading(null);
        }
    };

    const removeImage = (index: number) => {
        const updatedFiles = imageFiles.filter(
            (_: File, i: number) => i !== index,
        );

        setFieldValue(name, updatedFiles);
    };

    useEffect(() => {
        if (imageFiles.length > 0) {
            const urls = imageFiles.map((file: File) =>
                URL.createObjectURL(file),
            );

            setPreviewUrls(urls);

            return () => {
                urls.forEach((url) => URL.revokeObjectURL(url));
            };
        } else {
            setPreviewUrls(preview);
        }
    }, [imageFiles, preview]);

    return (
        <div className="w-full flex h-full flex-col gap-4">
            {/* Upload Button */}
            <button
                type="button"
                onClick={handleButtonClick}
                className="bg-neonblue-50 w-full h-full border border-dashed border-[#CFC2D6] rounded-lg relative flex justify-center items-center flex-col gap-1"
            >
                {isLoading ? (
                    <Spinner size="lg" />
                ) : (
                    <>
                        {/* <RiImage2Line
                            size={64}
                            className="z-20 text-neonblue-600"
                        /> */}
                        <div className=" w-20 h-20 flex justify-center items-center bg-[#9C48EA1A] rounded-full " >
                            <RiUploadCloudFill size={33} />   
                        </div>

                        <p className="text-sm font-semibold">
                            Drag and drop media
                        </p>

                        <p className=" max-w-[300px] text-xs font-medium text-violet-300">
                            Share your latest beauty transformations, products,
                            or studio vibes. Supports JPG, PNG, and MP4.
                        </p>
                    </>
                )}
            </button>

            {/* Validation Error */}
            {meta.touched && meta.error && (
                <p className="text-sm text-red-500">{meta.error as string}</p>
            )}

            {/* Preview Grid */}
            {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {previewUrls.map((image, index) => (
                        <div
                            key={index}
                            className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200"
                        >
                            <CustomImage
                                src={image}
                                alt={`preview-${index}`}
                                fillContainer
                                style={{ borderRadius: "12px" }}
                            />

                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow"
                            >
                                <RiCloseLine size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Hidden Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleMultipleImages(e.target.files)}
                style={{ display: "none" }}
            />
        </div>
    );
}
