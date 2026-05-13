import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CinematicPreloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate city grid particles
  useEffect(() => {
    const particleCount = 60;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.8,
    }));
    setParticles(newParticles);
  }, []);

  // Animate loading progress
  useEffect(() => {
    const duration = 2500;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(Math.floor(newProgress));

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsComplete(true);
        setTimeout(onComplete, 800);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Canvas particle assembly animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationId: number;
    const particleCount = 150;
    const particles: { x: number; y: number; targetX: number; targetY: number; vx: number; vy: number; alpha: number }[] = [];

    // Initialize scattered particles
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 300 + Math.random() * 400;
      const targetX = canvas.width / 2 + (Math.random() - 0.5) * 200;
      const targetY = canvas.height / 2 + (Math.random() - 0.5) * 100;

      particles.push({
        x: canvas.width / 2 + Math.cos(angle) * distance,
        y: canvas.height / 2 + Math.sin(angle) * distance,
        targetX,
        targetY,
        vx: 0,
        vy: 0,
        alpha: 0.3 + Math.random() * 0.4,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines
      ctx.strokeStyle = "rgba(0, 212, 255, 0.08)";
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.vx += dx * 0.002;
        p.vy += dy * 0.002;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[#050B18] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Particle assembly canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
          />

          {/* Morphing background blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, #00D4FF 0%, transparent 70%)",
                filter: "blur(100px)",
              }}
              animate={{
                x: ["-20%", "30%", "-10%"],
                y: ["-20%", "40%", "10%"],
                scale: [1, 1.3, 0.9],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full opacity-15"
              style={{
                background: "radial-gradient(circle, #6366F1 0%, transparent 70%)",
                filter: "blur(80px)",
                right: "10%",
                top: "20%",
              }}
              animate={{
                scale: [1, 1.2, 0.8],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Logo SVG with stroke animation */}
          <div className="relative z-10 mb-8">
            <motion.svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Outer circle */}
              <motion.circle
                cx="60"
                cy="60"
                r="55"
                stroke="url(#gradient1)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              {/* Inner hexagon - city network */}
              <motion.path
                d="M60 25L85 40V70L60 85L35 70V40L60 25Z"
                stroke="url(#gradient2)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
              />

              {/* Connection lines inside */}
              <motion.path
                d="M60 55V25M60 55L85 70M60 55L35 70"
                stroke="url(#gradient2)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
              />

              {/* Center dot */}
              <motion.circle
                cx="60"
                cy="55"
                r="6"
                fill="#00D4FF"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 1.2, ease: "easeOut" }}
              />

              <defs>
                <linearGradient id="gradient1" x1="0" y1="0" x2="120" y2="120">
                  <stop stopColor="#00D4FF" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0" y1="0" x2="120" y2="120">
                  <stop stopColor="#00D4FF" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </motion.svg>
          </div>

          {/* Brand name with fade in */}
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            URBAN FLOW
          </motion.h1>

          {/* Loading text */}
          <motion.p
            className="text-sm text-slate-400 mb-8 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            Initializing City Network
          </motion.p>

          {/* Progress bar container */}
          <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden relative">
            {/* Progress fill */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00D4FF] to-[#6366F1] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Progress percentage */}
          <motion.div
            className="mt-4 text-2xl font-mono font-bold text-[#00D4FF]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {progress}%
          </motion.div>

          {/* Particle dots around the edges */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#00D4FF]/40"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: particle.delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
