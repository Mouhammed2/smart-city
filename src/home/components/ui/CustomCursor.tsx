import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const previousPosition = useRef({ x: 0, y: 0 });

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;

      // Calculate velocity
      const vx = newX - previousPosition.current.x;
      const vy = newY - previousPosition.current.y;
      setVelocity({ x: vx, y: vy });

      previousPosition.current = { x: newX, y: newY };

      cursorX.set(newX);
      cursorY.set(newY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  const velocityMagnitude = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
  const stretchFactor = Math.min(velocityMagnitude * 0.05, 1.5);
  const rotationAngle = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 2 : 1,
          background: "radial-gradient(circle, #00D4FF 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#00D4FF] pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 1.5 : 1 + stretchFactor * 0.3,
          opacity: isHovering ? 0.8 : 0.5,
          rotate: rotationAngle,
          scaleX: 1 + stretchFactor * 0.5,
          scaleY: 1 - stretchFactor * 0.2,
        }}
      />
    </>
  );
}
