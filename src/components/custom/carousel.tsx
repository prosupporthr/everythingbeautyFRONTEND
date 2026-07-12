"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { StaticImageData } from "next/image";
import CustomImage from "./customImage"; // adjust path to wherever CustomImage lives
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";

type CarouselImage = string | StaticImageData;

type ImageCarouselProps = {
  images: CarouselImage[];
  alt?: string | string[];
  /**
   * Controls size. Give it explicit sizing here, e.g. "w-full h-[400px]"
   * or "w-[320px] h-[320px]" — the carousel just fills whatever box you give it.
   */
  className?: string;
  /**
   * Alternative to a fixed height: pass width/height (e.g. 16/9) and the
   * carousel will reserve space responsively via a padding-top trick,
   * same approach CustomImage uses for aspectRatio.
   * Ignored if className already includes an explicit height.
   */
  aspectRatio?: number;
  rounded?: string; // tailwind rounded class, default rounded-2xl
  showArrows?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  interval?: number; // ms, only used if autoPlay
  loop?: boolean;
  onIndexChange?: (index: number) => void;
  nopopup?: boolean; // passed through to CustomImage (default true = no lightbox on click)
};

export default function ImageCarousel({
  images,
  alt = "carousel image",
  className = "",
  aspectRatio,
  rounded = "rounded-2xl",
  showArrows = true,
  showDots = true,
  autoPlay = false,
  interval = 4000,
  loop = true,
  onIndexChange,
  nopopup = true,
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const goTo = useCallback(
    (i: number) => {
      if (total === 0) return;
      const next = loop ? (i + total) % total : Math.min(Math.max(i, 0), total - 1);
      setIndex(next);
      onIndexChange?.(next);
    },
    [total, loop, onIndexChange]
  );

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  // autoplay
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, next, total]);

  // touch swipe
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }
  function handleTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }
  function handleTouchEnd() {
    const threshold = 50;
    if (touchDeltaX.current > threshold) prev();
    else if (touchDeltaX.current < -threshold) next();
    touchStartX.current = null;
    touchDeltaX.current = 0;
  }

  // keyboard nav
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  }

  if (total === 0) return null;

  const getAlt = (i: number) =>
    Array.isArray(alt) ? alt[i] ?? `image ${i + 1}` : `${alt} ${i + 1}`;

  // Only fall back to the aspect-ratio wrapper if no explicit height was given in className
  const hasExplicitHeight = /h-\[|h-full|h-screen|h-\d/.test(className);
  const usesAspectWrapper = Boolean(aspectRatio) && !hasExplicitHeight;
  const paddingTop = aspectRatio ? `${(1 / aspectRatio) * 100}%` : undefined;

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full overflow-hidden select-none outline-none ${rounded} ${className}`}
      style={usesAspectWrapper ? { paddingTop } : undefined}
    >
      {/* Track */}
      <div
        className={`flex h-full transition-transform duration-300 ease-out ${
          usesAspectWrapper ? "absolute inset-0" : ""
        }`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img, i) => (
          <div key={i} className="relative w-full h-full flex-shrink-0">
            <CustomImage
              post={true}
              src={img}
              alt={getAlt(i)}
              fillContainer
              className="w-full h-full"
              nopopup={nopopup}
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      {showArrows && total > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
          >
            <IoArrowBackOutline size={"16px"} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
          >
            <IoArrowForwardOutline size={"16px"} />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && total > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-4 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------
USAGE

// Fixed height, no aspect ratio needed:
<ImageCarousel
  images={["/img1.jpg", "/img2.jpg", "/img3.jpg"]}
  className="w-full h-[400px]"
/>

// Responsive via aspect ratio (e.g. 16:9), fluid width:
<ImageCarousel
  images={post.images}
  aspectRatio={16 / 9}
  className="max-w-2xl"
  autoPlay
  interval={5000}
/>

// Square thumbnail carousel, no arrows/dots:
<ImageCarousel
  images={images}
  className="w-24 h-24"
  showArrows={false}
  showDots={false}
/>
------------------------------------------------------------------------- */