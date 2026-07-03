"use client";
import Image, { ImageProps, StaticImageData } from "next/image";
import React, { useState } from "react";
import { ModalLayout } from "../shared";

type Props = Omit<ImageProps, "src"> & {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  fallbackSrc?: string; // fallback image (public path)
  fillContainer?: boolean; // use image fill (position absolute)
  post?: boolean;
  aspectRatio?: number; // optional aspect ratio (width/height)
  overlayer?: boolean;
  nopopup?: boolean;
  priority?: boolean; // opt-in eager loading, default false — only use for above-the-fold images
};

export default function CustomImage({
  src,
  alt,
  className = "",
  fallbackSrc = "/images/fallback.png",
  fillContainer = false,
  objectPosition,
  aspectRatio,
  overlayer,
  post,
  nopopup = true,
  priority = false,
  ...rest
}: Props) {
  const [imgSrc, setImgSrc] = React.useState<string | StaticImageData>(src);
  const [isOpen, setIsOpen] = useState<string | StaticImageData>("");

  // Keep imgSrc in sync whenever the parent passes a new src
  React.useEffect(() => {
    setImgSrc(src);
  }, []);

  function handleError() {
    if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
  }

  const FullImageModal = () => {
    // Don't mount the modal's <Image> at all when there's nothing to show —
    // avoids passing an invalid empty src on every render of every instance.
    if (!isOpen) return null;

    return (
      <ModalLayout
        size="lg"
        title="Preview Image"
        isOpen={true}
        onClose={() => setIsOpen("")}
      >
        <div className=" w-full relative h-[400px] mb-4 rounded-2xl bg-gray-300 ">
          <div className=" w-full max-w-[400px] h-full flex p-4 rounded-2xl justify-center items-center  ">
            <Image
              src={isOpen}
              alt={alt}
              fill
              className="w-full h-auto object-contain rounded-2xl " // ✅ tailwind classes
              sizes="100vw" // ✅ responsive loading
              priority // modal preview is user-initiated and above-the-fold — fine to keep eager
              {...rest}
            />
          </div>
        </div>
      </ModalLayout>
    );
  };

  if (fillContainer) {
    return (
      <div
        onClick={() => setIsOpen(nopopup ? "" : imgSrc)}
        className={`relative w-full py-2 h-full ${className}`}
      >
        <Image
          src={imgSrc as string} // ✅ your image URL (string)
          alt={alt}
          fill
          className={` ${className} w-full h-full object-cover rounded-2xl `} // ✅ tailwind classes
          sizes="100vw" // ✅ responsive loading
          priority={priority} // ✅ only eager-load when explicitly requested
          {...rest}
        />
        {overlayer && (
          <div className=" absolute inset-0 bg-black opacity-40 rounded-lg " />
        )}
        <FullImageModal />
      </div>
    );
  }

  if (post) {
    return (
      <div
        onClick={() => setIsOpen(nopopup ? "" : imgSrc)}
        className={`relative bg-gray-200 flex justify-center items-center w-full py-2 h-full ${className}`}
      >
        <Image
          src={imgSrc as string} // ✅ your image URL (string)
          alt={alt}
          fill
          className="w-auto h-full object-contain " // ✅ tailwind classes
          sizes="100vw" // ✅ responsive loading
          priority={priority} // ✅ only eager-load when explicitly requested
          {...rest}
        />
        {overlayer && (
          <div className=" absolute inset-0 bg-black opacity-40 rounded-lg " />
        )}
        <FullImageModal />
      </div>
    );
  }

  // If an aspectRatio is provided, use a wrapper to preserve space.
  if (aspectRatio) {
    const paddingTop = (1 / aspectRatio) * 100; // percent
    return (
      <div
        className={`relative w-full ${className}`}
        style={{ paddingTop: `${paddingTop}%` }}
      >
        <Image
          src={imgSrc}
          alt={alt}
          onError={handleError}
          fill
          priority={priority} // ✅ only eager-load when explicitly requested
          style={{ objectFit: rest.style?.objectFit ?? "cover" }}
          {...rest}
        />
        {overlayer && (
          <div className=" absolute inset-0 bg-black opacity-40 rounded-lg " />
        )}
        <FullImageModal />
      </div>
    );
  }

  // Default: normal inline sized Image with width/height props
  return (
    <div onClick={() => setIsOpen(nopopup ? "" : imgSrc)} className=" w-fit relative ">
      <Image
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className={className}
        priority={priority} // ✅ only eager-load when explicitly requested
        {...rest}
      />
      {overlayer && (
        <div className=" absolute inset-0 bg-black opacity-40 rounded-lg " />
      )}
      <FullImageModal />
    </div>
  );
}