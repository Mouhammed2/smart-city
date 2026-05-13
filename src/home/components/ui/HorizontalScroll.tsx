import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bus, MapPin, Calendar, ArrowRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const modules = [
  {
    id: "busway",
    title: "BusWay",
    subtitle: "Intelligence des Transports",
    description:
      "Suivi en temps réel des bus, itinéraires optimisés, et notifications instantanées.",
    icon: Bus,
    gradient: "from-[#00D4FF] to-[#6366F1]",
    bgColor: "#00D4FF",
    features: [
      "Géolocalisation temps réel",
      "Prédictions d'arrivée",
      "Itinéraires optimisés",
    ],
  },
  {
    id: "fixmycity",
    title: "FixMyCity",
    subtitle: "Gestion des Incidents",
    description:
      "Signalez et suivez les problèmes urbains. Des routes aux éclairages, agissons ensemble.",
    icon: MapPin,
    gradient: "from-[#10B981] to-[#06B6D4]",
    bgColor: "#10B981",
    features: [
      "Signalement rapide",
      "Suivi en temps réel",
      "Alertes communautaires",
    ],
  },
  {
    id: "events",
    title: "EventHandler",
    subtitle: "Agenda Urbain",
    description:
      "Découvrez tous les événements de votre ville. Du festival au marché local.",
    icon: Calendar,
    gradient: "from-[#8B5CF6] to-[#EC4899]",
    bgColor: "#8B5CF6",
    features: [
      "Calendrier personnalisé",
      "Recommandations IA",
      "Billeterie intégrée",
    ],
  },
];

function ModuleCard({
  module,
  index,
  progress,
}: {
  module: (typeof modules)[0];
  index: number;
  progress: ReturnType<typeof useTransform<number, number>>;
}) {
  const Icon = module.icon;
  const x = useTransform(progress, [0, 1], [100 * (index - 1), 0]);

  return (
    <motion.div
      className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-6 lg:px-16 relative"
      style={{ x: index === 0 ? undefined : x }}
    >
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${module.gradient} bg-opacity-20 mb-4`}
          >
            <Icon className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              {module.subtitle}
            </span>
          </div>

          <h2 className="text-5xl lg:text-7xl font-bold text-white mb-6">
            {module.title}
          </h2>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            {module.description}
          </p>

          <ul className="space-y-3 mb-8">
            {module.features.map((feature, i) => (
              <motion.li
                key={feature}
                className="flex items-center gap-3 text-slate-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>

          <motion.button
            className={`group flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r ${module.gradient} text-white font-semibold overflow-hidden relative`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Découvrir</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>
        </motion.div>

        {/* Visual */}
        <motion.div
          className="relative aspect-square max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Glowing background */}
          <div
            className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
            style={{ backgroundColor: module.bgColor }}
          />

          {/* Card */}
          <div className="relative bg-[#0A1628]/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 h-full flex flex-col">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center mb-6`}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">
              {module.title}
            </h3>
            <p className="text-slate-400 text-sm">{module.subtitle}</p>

            <div className="mt-auto">
              {/* Mini visualization */}
              <div className="grid grid-cols-3 gap-2 mt-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: module.bgColor }}
                    initial={{ width: "20%" }}
                    whileInView={{ width: `${40 + Math.random() * 60}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-slate-800/50 backdrop-blur border border-slate-700/50 flex items-center justify-center"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon className="w-8 h-8 text-slate-400" />
          </motion.div>

          <motion.div
            className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full"
            style={{ backgroundColor: `${module.bgColor}30` }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#050B18]">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050B18] via-[#0A1628] to-[#050B18]" />

        {/* Progress indicator */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
          <span className="text-xs text-slate-400 uppercase tracking-widest">
            Modules
          </span>
          <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00D4FF] to-[#6366F1] rounded-full"
              style={{ scaleX: progress, transformOrigin: "left" }}
            />
          </div>
        </div>

        {/* Horizontal scroll container */}
        <motion.div className="flex h-full" style={{ x }}>
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              progress={progress}
            />
          ))}
        </motion.div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            className="flex flex-col items-center gap-2 text-slate-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs uppercase tracking-widest">Défiler</span>
            <div className="w-6 h-10 border border-slate-600 rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-1 h-2 bg-slate-400 rounded-full"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
