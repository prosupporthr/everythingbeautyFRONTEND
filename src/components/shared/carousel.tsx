"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface CarouselProps {
    items: React.ReactNode[];
    autoPlayInterval?: number;
}

export default function InfiniteCarousel({
    items,
    autoPlayInterval = 3000,
}: CarouselProps) {
    const controls = useAnimation();
    const containerRef = useRef<HTMLDivElement>(null);

    const [itemsPerView, setItemsPerView] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            setItemsPerView(window.innerWidth >= 1024 ? 3 : 1);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Group items
    const groupedItems = useMemo(() => {
        const groups = [];
        for (let i = 0; i < items.length; i += itemsPerView) {
            groups.push(items.slice(i, i + itemsPerView));
        }
        return groups;
    }, [items, itemsPerView]);

    // Clone first & last for seamless effect
    const slides = useMemo(() => {
        if (groupedItems.length === 0) return [];
        return [
            groupedItems[groupedItems.length - 1], // clone last
            ...groupedItems,
            groupedItems[0], // clone first
        ];
    }, [groupedItems]);

    // Move slide
    const goToSlide = async (index: number) => {
        await controls.start({
            x: `-${index * 100}%`,
            transition: { duration: 0.6 },
        });
    };

    // Autoplay
    useEffect(() => {
        if (isHovered || slides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [isHovered, autoPlayInterval, slides.length]);

    // Handle seamless reset
    useEffect(() => {
        goToSlide(currentIndex);

        const total = groupedItems.length;

        if (currentIndex === 0) {
            setTimeout(() => {
                controls.set({ x: `-${total * 100}%` });
                setCurrentIndex(total);
            }, 6000);
        }

        if (currentIndex === total + 1) {
            setTimeout(() => {
                controls.set({ x: `-100%` });
                setCurrentIndex(1);
            }, 600);
        }
    }, [currentIndex]);

    // Start from first real slide
    useEffect(() => {
        if (groupedItems.length > 0) {
            setCurrentIndex(1);
            controls.set({ x: `-100%` });
        }
    }, [groupedItems.length]);

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div animate={controls} className="flex w-full">
                {slides.map((group, index) => (
                    <div key={index} className="w-full flex gap-4 p-4">
                        {group.map((item, i) => (
                            <div key={i} className="flex-1">
                                {item}
                            </div>
                        ))}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
