import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  onComplete?: () => void;
}

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export function TextScramble({
  text,
  className = "",
  duration = 2000,
  delay = 0,
  onComplete,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState("");
  const [isScrambling, setIsScrambling] = useState(true);

  const scramble = useCallback(() => {
    const chars = text.split("");
    const totalChars = chars.length;
    const interval = duration / totalChars;

    let currentIndex = 0;
    let iteration = 0;

    const timer = setInterval(() => {
      const newText = chars
        .map((char, index) => {
          // Space stays as space
          if (char === " ") return " ";

          // If we've reached this character, show the correct one
          if (index < currentIndex) {
            return char;
          }

          // Otherwise show a random glyph
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");

      setDisplayText(newText);

      iteration++;

      // Every few iterations, reveal the next character
      if (iteration % 3 === 0) {
        currentIndex++;
      }

      // Stop when all characters are revealed
      if (currentIndex > totalChars) {
        clearInterval(timer);
        setDisplayText(text);
        setIsScrambling(false);
        onComplete?.();
      }
    }, interval / 3);

    return () => clearInterval(timer);
  }, [text, duration, onComplete]);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      const cleanup = scramble();
      return cleanup;
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [scramble, delay]);

  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-block"
      >
        {displayText || "\u00A0"}
      </motion.span>
      {isScrambling && (
        <motion.span
          className="absolute -right-1 top-0 w-0.5 h-full bg-[#00D4FF]"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  );
}

// Hook version for more control
export function useTextScramble(text: string, duration: number = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const start = useCallback(() => {
    const chars = text.split("");
    const totalChars = chars.length;
    const interval = duration / totalChars;

    let currentIndex = 0;
    let iteration = 0;

    const timer = setInterval(() => {
      const newText = chars
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < currentIndex) return char;
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");

      setDisplayText(newText);
      iteration++;

      if (iteration % 3 === 0) {
        currentIndex++;
      }

      if (currentIndex > totalChars) {
        clearInterval(timer);
        setDisplayText(text);
        setIsComplete(true);
      }
    }, interval / 3);

    return () => clearInterval(timer);
  }, [text, duration]);

  return { displayText, isComplete, start };
}
