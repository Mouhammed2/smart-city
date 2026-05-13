import { motion } from "framer-motion";

interface CinematicTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function CinematicText({
  text,
  className = "",
  delay = 0,
}: CinematicTextProps) {
  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 60,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ fontFamily: "'Clash Display', sans-serif" }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className="inline-block overflow-hidden"
          style={{
            marginRight: index < words.length - 1 ? "0.3em" : "0",
          }}
        >
          <motion.span className="inline-block">{word}</motion.span>
        </motion.span>
      ))}
    </motion.div>
  );
}
