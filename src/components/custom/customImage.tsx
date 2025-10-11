"use client";
import Image, { ImageProps, StaticImageData } from "next/image";
import React from "react";

type Props = Omit<ImageProps, "src"> & {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  fallbackSrc?: string; // fallback image (public path)
  fillContainer?: boolean; // use image fill (position absolute)
  aspectRatio?: number; // optional aspect ratio (width/height)
};

export default function CustomImage({
  src,
  alt,
  className = "",
  fallbackSrc = "/images/fallback.png",
  fillContainer = false,
  aspectRatio,
  ...rest
}: Props) {
  const [imgSrc, setImgSrc] = React.useState<string | StaticImageData>(src);

  function handleError() {
    if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
  }

  if (fillContainer) {
    return (
      <div className={`relative w-full py-2 h-full ${className}`}>
        <Image
          src={imgSrc as string}    // ✅ your image URL (string)
          alt={alt}
          fill      
          {...rest}                // ✅ makes the image fill its parent container
          className="w-full h-full object-cover " // ✅ tailwind classes
          sizes="100vw"             // ✅ responsive loading
          priority                   // (optional) load immediately if above the fold
        />
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
      </div>
    );
  }

  // Default: normal inline sized Image with width/height props
  return (
    <Image
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...rest}
    />
  );
}
