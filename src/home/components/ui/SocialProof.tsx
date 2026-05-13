import { motion } from "framer-motion";

const pressLogos = [
  { name: "Le Monde", color: "#ffffff" },
  { name: "TechCrunch FR", color: "#00D4FF" },
  { name: "Smart City Expo", color: "#6366F1" },
  { name: "Les Echos", color: "#ffffff" },
  { name: "French Tech", color: "#00D4FF" },
  { name: "Wired", color: "#6366F1" },
  { name: "The Verge", color: "#ffffff" },
  { name: "Forbes France", color: "#00D4FF" },
];

function LogoItem({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex items-center justify-center px-8 py-4">
      <span
        className="text-lg font-bold tracking-wider opacity-60 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        style={{ color }}
      >
        {name}
      </span>
    </div>
  );
}

export function SocialProof() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
        <motion.p
          className="text-center text-slate-400 text-sm uppercase tracking-[0.2em]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Comme vu dans
        </motion.p>
      </div>

      {/* Marquee container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050B18] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050B18] to-transparent z-10 pointer-events-none" />

        {/* Scrolling content */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex shrink-0"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {/* First set */}
            {pressLogos.map((logo, index) => (
              <LogoItem key={`first-${index}`} {...logo} />
            ))}
            {/* Duplicate for seamless loop */}
            {pressLogos.map((logo, index) => (
              <LogoItem key={`second-${index}`} {...logo} />
            ))}
            {/* Third set for extra smoothness */}
            {pressLogos.map((logo, index) => (
              <LogoItem key={`third-${index}`} {...logo} />
            ))}
            {/* Fourth set */}
            {pressLogos.map((logo, index) => (
              <LogoItem key={`fourth-${index}`} {...logo} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      </div>
    </section>
  );
}
