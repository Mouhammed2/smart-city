import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
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

function ModuleCard({ module }: { module: (typeof modules)[0] }) {
  const Icon = module.icon;

  return (
      <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-6 lg:px-16">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
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
              {module.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-300">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{feature}</span>
                  </li>
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
          </div>

          {/* Visual Card */}
          <div className="relative aspect-square max-w-md mx-auto">
            <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
                style={{ backgroundColor: module.bgColor }}
            />
            <div className="relative bg-[#0A1628]/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 h-full flex flex-col">
              <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center mb-6`}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{module.title}</h3>
              <p className="text-slate-400 text-sm">{module.subtitle}</p>
              <div className="mt-auto">
                <div className="grid grid-cols-3 gap-2 mt-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                      <div
                          key={i}
                          className="h-2 rounded-full opacity-60"
                          style={{
                            backgroundColor: module.bgColor,
                            width: `${40 + ((i * 37) % 60)}%`,
                          }}
                      />
                  ))}
                </div>
              </div>
            </div>

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
          </div>
        </div>
      </div>
  );
}

export function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // end = total horizontal distance to travel, so scroll feels 1:1
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,          // pins the section in place while we scroll
          scrub: 1,           // ties animation to scroll position
          anticipatePin: 1,
          invalidateOnRefresh: true, // recalc on window resize
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
      // No fixed height needed — GSAP pin adds the scroll space automatically
      <section ref={sectionRef} className="bg-[#050B18] overflow-hidden relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050B18] via-[#0A1628] to-[#050B18] pointer-events-none z-0" />

        {/* Progress bar */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <span className="text-xs text-slate-400 uppercase tracking-widest">
          Modules
        </span>
          <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
                id="scroll-progress"
                className="h-full bg-gradient-to-r from-[#00D4FF] to-[#6366F1] rounded-full origin-left scale-x-0"
            />
          </div>
        </div>

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

        {/* Horizontal track — GSAP translates this on scroll */}
        <div ref={trackRef} className="flex will-change-transform">
          {modules.map((module) => (
              <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>
  );
}