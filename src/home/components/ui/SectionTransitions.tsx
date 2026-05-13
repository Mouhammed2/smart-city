import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  type?: "diagonal" | "circular" | "wipe" | "fade";
  direction?: "left" | "right" | "up" | "down";
}

export function SectionTransition({
  children,
  className = "",
  type = "diagonal",
  direction = "left",
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const progress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const clipPath = useTransform(
    progress,
    [0, 1],
    type === "diagonal"
      ? direction === "left"
        ? [
            "polygon(0 0, 0 0, 0 100%, 0 100%)",
            "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          ]
        : [
            "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
            "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          ]
      : type === "circular"
        ? ["circle(0% at 50% 50%)", "circle(150% at 50% 50%)"]
        : type === "wipe"
          ? direction === "up"
            ? ["inset(100% 0 0 0)", "inset(0 0 0 0)"]
            : ["inset(0 0 100% 0)", "inset(0 0 0 0)"]
          : ["inset(0 100% 0 0)", "inset(0 0 0 0)"],
  );

  return (
    <motion.div ref={ref} className={className} style={{ clipPath }}>
      {children}
    </motion.div>
  );
}

// Simpler fade transition wrapper
export function FadeTransition({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Staggered children animation
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Reveal on scroll - mask reveal effect
export function RevealOnScroll({
  children,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yUp = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const yDown = useTransform(scrollYProgress, [0, 0.5], [-100, 0]);
  const xLeft = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const xRight = useTransform(scrollYProgress, [0, 0.5], [-100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const x =
    direction === "left" ? xLeft : direction === "right" ? xRight : undefined;
  const y = direction === "up" ? yUp : direction === "down" ? yDown : undefined;

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div className={className} style={{ x, y, opacity }}>
        {children}
      </motion.div>
    </div>
  );
}

// Parallax wrapper for sections
export function ParallaxSection({
  children,
  className = "",
  speed = 0.5,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
