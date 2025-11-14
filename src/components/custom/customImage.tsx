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
  aspectRatio?: number; // optional aspect ratio (width/height)
  overlayer?: boolean;
  nopopup?: boolean
};

export default function CustomImage({
  src,
  alt,
  className = "",
  fallbackSrc = "/images/fallback.png",
  fillContainer = false,
  aspectRatio,
  overlayer,
  nopopup = true,
  ...rest
}: Props) {
  const [imgSrc, setImgSrc] = React.useState<string | StaticImageData>(src);

  const [isOpen, setIsOpen] = useState<string | StaticImageData>("")

  function handleError() {
    if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
  }

  const FullImageModal = () => {
    return (
      <ModalLayout size="lg" title="Preview Image" isOpen={isOpen ? true : false} onClose={() => setIsOpen("")} >
        <div className=" w-full relative h-[400px] mb-4 rounded-2xl bg-gray-300 " >
          <div className=" w-full max-w-[400px] h-full flex p-4 rounded-2xl justify-center items-center  " >
            <Image
              src={isOpen}
              alt={alt}
              fill
              {...rest}                // ✅ makes the image fill its parent container
              className="w-full h-auto object-contain rounded-2xl " // ✅ tailwind classes
              sizes="100vw"             // ✅ responsive loading
              priority
              {...rest}
            />
          </div>
        </div>
      </ModalLayout>
    )
  }

  if (fillContainer) {
    return (
      <div onClick={() => setIsOpen(nopopup ? "" : imgSrc)} className={`relative w-full py-2 h-full ${className}`}>
        <Image
          src={imgSrc as string}    // ✅ your image URL (string)
          alt={alt}
          fill
          {...rest}                // ✅ makes the image fill its parent container
          className="w-full h-full object-cover " // ✅ tailwind classes
          sizes="100vw"             // ✅ responsive loading
          priority                   // (optional) load immediately if above the fold
        />
        {overlayer && (
          <div className=" absolute inset-0 bg-black opacity-40 rounded-lg " />
        )}
        <FullImageModal />
        {/* <img alt={alt} src={imgSrc+""} className=" w-full h-full object-cover " /> */}
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
    <div onClick={() => setIsOpen(nopopup ? "" : imgSrc)} className=" w-fit relative " >
      <Image
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className={className}
        {...rest}
      />
      {overlayer && (
        <div className=" absolute inset-0 bg-black opacity-40 rounded-lg " />
      )}
        <FullImageModal />
    </div>
  );
}
