import { motion } from "framer-motion";

export function MorphingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Blob 1 - Large cyan */}
      <motion.div
        className="absolute w-[800px] h-[800px] opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, #00D4FF 0%, transparent 60%)",
          filter: "blur(100px)",
          left: "-20%",
          top: "-10%",
        }}
        animate={{
          x: [0, 100, 50, 150, 0],
          y: [0, 80, 150, 50, 0],
          scale: [1, 1.2, 0.9, 1.1, 1],
          borderRadius: [
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "30% 60% 70% 40% / 50% 60% 30% 60%",
            "40% 60% 60% 40% / 40% 40% 60% 60%",
            "50% 50% 40% 60% / 60% 40% 60% 40%",
            "60% 40% 30% 70% / 60% 30% 70% 40%",
          ],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Blob 2 - Indigo purple */}
      <motion.div
        className="absolute w-[600px] h-[600px] opacity-25"
        style={{
          background: "radial-gradient(ellipse at center, #6366F1 0%, transparent 60%)",
          filter: "blur(80px)",
          right: "-10%",
          top: "20%",
        }}
        animate={{
          x: [0, -80, -40, -120, 0],
          y: [0, 100, 50, 120, 0],
          scale: [1, 0.8, 1.2, 0.9, 1],
          borderRadius: [
            "40% 60% 60% 40% / 60% 40% 60% 40%",
            "60% 40% 40% 60% / 40% 60% 40% 60%",
            "30% 70% 50% 50% / 50% 50% 50% 50%",
            "50% 50% 40% 60% / 60% 40% 60% 40%",
            "40% 60% 60% 40% / 60% 40% 60% 40%",
          ],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Blob 3 - Small accent */}
      <motion.div
        className="absolute w-[400px] h-[400px] opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, #8B5CF6 0%, transparent 60%)",
          filter: "blur(60px)",
          left: "40%",
          bottom: "10%",
        }}
        animate={{
          x: [0, 60, -30, 90, 0],
          y: [0, -50, 80, -30, 0],
          scale: [1, 1.3, 0.7, 1.1, 1],
          borderRadius: [
            "50% 50% 50% 50% / 50% 50% 50% 50%",
            "40% 60% 40% 60% / 60% 40% 60% 40%",
            "60% 40% 60% 40% / 40% 60% 40% 60%",
            "50% 50% 40% 60% / 60% 40% 60% 40%",
            "50% 50% 50% 50% / 50% 50% 50% 50%",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* Blob 4 - Far right accent */}
      <motion.div
        className="absolute w-[500px] h-[500px] opacity-15"
        style={{
          background: "radial-gradient(ellipse at center, #10B981 0%, transparent 60%)",
          filter: "blur(90px)",
          right: "5%",
          bottom: "30%",
        }}
        animate={{
          x: [0, -100, 50, -80, 0],
          y: [0, 60, -40, 90, 0],
          scale: [0.8, 1.2, 1, 0.9, 0.8],
          borderRadius: [
            "30% 70% 70% 30% / 30% 30% 70% 70%",
            "50% 50% 40% 60% / 60% 40% 60% 40%",
            "40% 60% 50% 50% / 50% 50% 50% 50%",
            "60% 40% 60% 40% / 40% 60% 40% 60%",
            "30% 70% 70% 30% / 30% 30% 70% 70%",
          ],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8,
        }}
      />

      {/* Blob 5 - Top right */}
      <motion.div
        className="absolute w-[350px] h-[350px] opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, #EC4899 0%, transparent 60%)",
          filter: "blur(70px)",
          right: "25%",
          top: "5%",
        }}
        animate={{
          x: [0, 40, -60, 30, 0],
          y: [0, 80, 40, -50, 0],
          scale: [1, 0.7, 1.3, 1, 1],
          borderRadius: [
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "40% 60% 60% 40% / 60% 40% 60% 40%",
            "50% 50% 50% 50% / 50% 50% 50% 50%",
            "30% 70% 50% 50% / 50% 50% 50% 50%",
            "60% 40% 30% 70% / 60% 30% 70% 40%",
          ],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(0, 212, 255, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 70%)
          `,
        }}
      />
    </div>
  );
}
