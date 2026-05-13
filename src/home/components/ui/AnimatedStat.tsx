import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedStatProps {
  value: string;
  label: string;
  delay?: number;
}

export function AnimatedStat({ value, label, delay = 0 }: AnimatedStatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const targetValue = parseInt(value.replace(/[^0-9]/g, ""));
      const duration = 2000;
      const steps = 60;
      const stepValue = targetValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= targetValue) {
          current = targetValue;
          clearInterval(timer);
        }
        setCount(Math.floor(current));
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF] to-[#6366F1] rounded-2xl blur-xl opacity-20 animate-pulse" />
        <div className="relative bg-[#050B18]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00D4FF] to-[#6366F1] bg-clip-text text-transparent mb-2">
            {count.toLocaleString()}
            {value.includes("K") && "K+"}
            {value.includes("%") && "%"}
            {value.includes("/") && "/7"}
          </div>
          <div className="text-slate-400 text-sm font-medium">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}
