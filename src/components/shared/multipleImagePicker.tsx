"use client";

import { convertAndCompressToJpg } from "@/helper/services/convertImage";
import { addToast, Spinner } from "@heroui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { RiCloseLine, RiUploadCloudFill } from "react-icons/ri";
import { CustomImage } from "../custom";
import { TbPhoto } from "react-icons/tb";

interface Props {
    imageFiles: File[];
    setImageFiles: (files: File[]) => void;
    type?: "message" | "default";
    // existing images from backend
    previews: string[];
    setPreviews: (preview: string[]) => void;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg"];

const PREVIEW_ITEM_CLASS =
    "relative w-[100px] h-[100px] aspect-square rounded-xl overflow-hidden border border-gray-200";
const REMOVE_BUTTON_CLASS =
    "absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow";

interface PreviewGridProps {
    images: string[];
    keyPrefix: string;
    onRemove: (index: number) => void;
}

function PreviewGrid({ images, keyPrefix, onRemove }: PreviewGridProps) {
    if (images.length === 0) return null;

    return (
        <div className="flex gap-3">
            {images.map((image, index) => (
                <div key={`${keyPrefix}-${index}`} className={PREVIEW_ITEM_CLASS}>
                    <CustomImage
                        src={image}
                        alt={`${keyPrefix}-${index}`}
                        fillContainer
                        style={{ borderRadius: "12px" }}
                    />

                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className={REMOVE_BUTTON_CLASS}
                    >
                        <RiCloseLine size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}

export default function MultipleImagePicker({
    imageFiles,
    setImageFiles,
    type = "default",
    previews,
    setPreviews,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [isLoading, setIsLoading] = useState<string | null>(null);

    // local previews for newly uploaded files
    const [localPreviewUrls, setLocalPreviewUrls] = useState<string[]>([]);

    // always holds the latest preview urls so the unmount-only cleanup
    // effect below revokes whatever is *currently* on screen, not a
    // stale snapshot from whenever the effect last ran
    const localPreviewUrlsRef = useRef<string[]>([]);

    useEffect(() => {
        localPreviewUrlsRef.current = localPreviewUrls;
    }, [localPreviewUrls]);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleMultipleImages = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        try {
            const selectedFiles = Array.from(files);

            const invalidFile = selectedFiles.find(
                (file) => !ACCEPTED_TYPES.includes(file.type),
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

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleMultipleImages(e.target.files);
        // allow re-selecting the same file(s) again later
        e.target.value = "";
    };

    // remove existing backend image
    const removePreviewImage = (index: number) => {
        setPreviews(previews.filter((_, i) => i !== index));
    };

    // remove newly uploaded image
    const removeUploadedImage = (index: number) => {
        const removedPreview = localPreviewUrls[index];

        if (removedPreview) {
            URL.revokeObjectURL(removedPreview);
        }

        setImageFiles(imageFiles.filter((_, i) => i !== index));
        setLocalPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    // cleanup object urls on unmount only — do NOT depend on
    // localPreviewUrls here, otherwise every update revokes the urls
    // that are still being displayed
    useEffect(() => {
        return () => {
            localPreviewUrlsRef.current.forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, []);

    const fileInput = (
        <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
        />
    );

    if (type === "message") {
        return (
            <div className="w-fit flex flex-col gap-4 relative">
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="w-6 h-6 flex justify-center items-center"
                >
                    {isLoading ? <Spinner size="sm" /> : <TbPhoto size={"24px"} />}
                </button>

                <div className="absolute max-w-[95vw] bottom-10 overflow-x-auto bg-white flex gap-3">
                    <PreviewGrid
                        images={previews}
                        keyPrefix="preview"
                        onRemove={removePreviewImage}
                    />
                    <PreviewGrid
                        images={localPreviewUrls}
                        keyPrefix="upload"
                        onRemove={removeUploadedImage}
                    />
                </div>

                {fileInput}
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4">
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

                        <p className="text-sm font-semibold">Drag and drop media</p>

                        <p className="max-w-[300px] text-xs font-medium text-violet-300 text-center">
                            Share your latest beauty transformations, products, or
                            studio vibes. Supports JPG and PNG.
                        </p>
                    </>
                )}
            </button>

            <div className="flex gap-3">
                <PreviewGrid
                    images={previews}
                    keyPrefix="preview"
                    onRemove={removePreviewImage}
                />
                <PreviewGrid
                    images={localPreviewUrls}
                    keyPrefix="upload"
                    onRemove={removeUploadedImage}
                />
            </div>

            {fileInput}
        </div>
    );
}