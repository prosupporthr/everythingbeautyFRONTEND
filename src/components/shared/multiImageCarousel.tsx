"use client";

import { useEffect, useRef, useState } from "react";
import { CustomImage } from "../custom";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

interface Props {
    item: {
        images: string[];
    };
    isProfile?: boolean;
}

export default function MediaCarousel({ item, isProfile }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const height = isProfile ? "lg:h-[250px]" : "lg:h-[478px]";

    const handleScroll = () => {
        const el = containerRef.current;
        if (!el) return;

        const index = Math.round(el.scrollLeft / el.clientWidth);
        setActiveIndex(index);
    };

    const scrollTo = (index: number) => {
        const el = containerRef.current;
        if (!el) return;

        el.scrollTo({
            left: index * el.clientWidth,
            behavior: "smooth",
        });
    };

    // 🎥 autoplay only active video
    useEffect(() => {
        videoRefs.current.forEach((video, i) => {
            if (!video) return;

            if (i === activeIndex) {
                video.play().catch(() => {});
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }, [activeIndex]);

    // 🔍 lazy rule: render only nearby slides
    const shouldRender = (index: number) => {
        return Math.abs(index - activeIndex) <= 1;
    };

    return (
        <div className={`w-full h-[200px] ${height} relative group `}>
            {/* Prev */}
            {activeIndex > 0 && (
                <button
                    onClick={() => scrollTo(activeIndex - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                    <RiArrowLeftSLine size={20} />
                </button>
            )}

            {/* Next */}
            {activeIndex < item?.images?.length - 1 && (
                <button
                    onClick={() => scrollTo(activeIndex + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                    <RiArrowRightSLine size={20} />
                </button>
            )}

            {/* Slider */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex w-full h-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
            >
                {item?.images?.map((media, index) => {
                    const isVideo =
                        media.endsWith(".mp4") ||
                        media.endsWith(".webm") ||
                        media.endsWith(".mov");

                    return (
                        <div
                            key={index}
                            className="min-w-full h-full snap-center flex-shrink-0 "
                        >
                            {/* 🔥 Lazy mount only nearby slides */}
                            {shouldRender(index) ? (
                                isVideo ? (
                                    <video
                                        ref={(el) => {
                                            videoRefs.current[index] = el;
                                        }}
                                        src={media}
                                        className="w-full h-full object-cover"
                                        muted
                                        playsInline
                                        loop
                                        preload="metadata"
                                    />
                                ) : (
                                    <CustomImage
                                        post
                                        nopopup={false}
                                        src={media}
                                        alt={`media-${index}`}
                                        loading="lazy"
                                    />
                                )
                            ) : (
                                // placeholder to preserve layout
                                <div className="w-full h-full bg-gray-100 animate-pulse" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
                {item?.images?.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                            i === activeIndex
                                ? "w-4 bg-white"
                                : "w-1.5 bg-white/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}