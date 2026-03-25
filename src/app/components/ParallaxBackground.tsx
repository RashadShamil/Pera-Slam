"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

interface ParallaxBackgroundProps {
  image: string;
  children: React.ReactNode;
  speed?: number;
}

export function ParallaxBackground({ image, children, speed = 0.5 }: ParallaxBackgroundProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <div ref={ref} className="relative overflow-hidden min-h-screen">
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${image})`,
            filter: "brightness(0.4) blur(1px)",
            transform: "scale(1.15)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </motion.div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}