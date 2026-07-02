"use client";

import { convertAndCompressToJpg } from "@/helper/services/convertImage";
import { addToast, Spinner } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { RiCloseLine, RiUploadCloudFill } from "react-icons/ri";
import { CustomImage } from "../custom";

interface Props {
    imageFiles: File[];
    setImageFiles: (files: File[]) => void;

    // existing images from backend
    previews: string[];
    setPreviews: (preview: string[]) => void;
}

export default function MultipleImagePicker({
    imageFiles,
    setImageFiles,
    previews,
    setPreviews,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [isLoading, setIsLoading] = useState<string | null>(null);

    // local previews for newly uploaded files
    const [localPreviewUrls, setLocalPreviewUrls] = useState<string[]>([]);

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

            // update image files
            setImageFiles([...imageFiles, ...convertedFiles]);

            // generate preview urls
            const newPreviewUrls = convertedFiles.map((file) =>
                URL.createObjectURL(file),
            );

            setLocalPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
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

    // remove existing backend image
    const removePreviewImage = (index: number) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);

        setPreviews(updatedPreviews);
    };

    // remove newly uploaded image
    const removeUploadedImage = (index: number) => {
        const updatedFiles = imageFiles.filter((_, i) => i !== index);

        const removedPreview = localPreviewUrls[index];

        const updatedPreviewUrls = localPreviewUrls.filter(
            (_, i) => i !== index,
        );

        if (removedPreview) {
            URL.revokeObjectURL(removedPreview);
        }

        setImageFiles(updatedFiles);
        setLocalPreviewUrls(updatedPreviewUrls);
    };

    // cleanup object urls
    useEffect(() => {
        return () => {
            localPreviewUrls.forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, [localPreviewUrls]);

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Upload Button */}
            <button
                type="button"
                onClick={handleButtonClick}
                className="bg-neonblue-50 min-h-[200px] w-full border border-dashed border-[#CFC2D6] rounded-lg relative flex justify-center items-center flex-col gap-2 p-4"
            >
                {isLoading ? (
                    <Spinner size="lg" />
                ) : (
                    <>
                        <div className="w-20 h-20 flex justify-center items-center bg-[#9C48EA1A] rounded-full">
                            <RiUploadCloudFill size={33} />
                        </div>

                        <p className="text-sm font-semibold">
                            Drag and drop media
                        </p>

                        <p className="max-w-[300px] text-xs font-medium text-violet-300 text-center">
                            Share your latest beauty transformations, products,
                            or studio vibes. Supports JPG and PNG.
                        </p>
                    </>
                )}
            </button>
            <div className="flex gap-3">
                {previews?.length > 0 && (
                    <div className="flex gap-3">
                        {previews?.map((image, index) => (
                            <div
                                key={`preview-${index}`}
                                className="relative w-[100px] h-[100px] aspect-square rounded-xl overflow-hidden border border-gray-200"
                            >
                                <CustomImage
                                    src={image}
                                    alt={`preview-${index}`}
                                    fillContainer
                                    style={{
                                        borderRadius: "12px",
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() => removePreviewImage(index)}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow"
                                >
                                    <RiCloseLine size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Newly Uploaded Images */}
                {localPreviewUrls.length > 0 && (
                    <div className="flex gap-3">
                        {localPreviewUrls.map((image, index) => (
                            <div
                                key={`upload-${index}`}
                                className="relative w-[100px] h-[100px] aspect-square rounded-xl overflow-hidden border border-gray-200"
                            >
                                <CustomImage
                                    src={image}
                                    alt={`upload-${index}`}
                                    fillContainer
                                    style={{
                                        borderRadius: "12px",
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() => removeUploadedImage(index)}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow"
                                >
                                    <RiCloseLine size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hidden Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleMultipleImages(e.target.files)}
                className="hidden"
            />
        </div>
    );
}
