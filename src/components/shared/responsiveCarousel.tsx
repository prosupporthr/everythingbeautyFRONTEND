"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface CarouselProps {
  items: React.ReactNode[];
  interval?: number;
}

export default function ResponsiveCarousel({
  items,
  interval = 3000,
}: CarouselProps) {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Duplicate items for seamless looping
  const slides = [...items, ...items];

  useEffect(() => {
    if (!containerRef.current) return;

    // if (items.length <= 3) return

    const firstItem =
      containerRef.current.querySelector<HTMLDivElement>(
        ".carousel-item"
      );

    if (!firstItem) return;

    const itemWidth = firstItem.offsetWidth;
    const totalWidth = itemWidth * items.length;

    let position = 0;

    const animate = async () => {
      while (true) {
        position -= itemWidth;

        await controls?.start({
          x: position,
          transition: { duration: 0.6 },
        });

        // Wait remaining time to make total 3s per slide
        await new Promise((res) =>
          setTimeout(res, interval - 600)
        );

        // If we've moved full original width → restart
        if (Math.abs(position) >= totalWidth) {
          position = 0;
          controls.set({ x: 0 });
        }
      }
    };

    animate();
  }, [controls, items.length, interval]);

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        ref={containerRef}
        animate={controls}
        className="flex"
      >
        {slides.map((item, index) => (
          <div
            key={index}
            className="carousel-item w-full lg:w-1/3 flex-shrink-0 p-4"
          >
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
