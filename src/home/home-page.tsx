import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import LoginContent from "../auth/components/loginContent";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Bus,
  MapPin,
  Calendar,
  ArrowRight,
  Shield,
  Clock,
  Zap,
  TrendingUp,
  Users,
  Building2,
  Globe,
  Briefcase,
} from "lucide-react";
import { HeroScene } from "./components/3d/HeroScene";
import { CustomCursor } from "./components/ui/CustomCursor";
import { FloatingNavbar } from "./components/ui/FloatingNavbar";
import { AnimatedStat } from "./components/ui/AnimatedStat";
import { TiltCard } from "./components/ui/TiltCard";
import { GrainTexture } from "./components/ui/GrainTexture";
import { MagneticButton } from "./components/ui/MagneticButton";
import { CinematicPreloader } from "./components/ui/CinematicPreloader";
import { TextScramble } from "./components/ui/TextScramble";
import { MorphingBackground } from "./components/ui/MorphingBackground";
import { HorizontalScroll } from "./components/ui/HorizontalScroll";
import { LiveCityMap } from "./components/ui/LiveCityMap";
import { DataVisualization } from "./components/ui/DataVisualization";
import { SocialProof } from "./components/ui/SocialProof";
import { MobileBottomNav } from "./components/ui/MobileBottomNav";
import {
  FadeTransition,
  StaggerContainer,
  StaggerItem,
} from "./components/ui/SectionTransitions";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { scrollYProgress } = useScroll();
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  const services = [
    {
      title: "BusWay",
      description:
        "Suivi intelligent des routes, arrêts, bus et horaires en temps réel",
      icon: <Bus className="w-6 h-6" />,
      to: "/busway",
      gradient: "from-[#00D4FF] to-[#6366F1]",
    },
    {
      title: "FixMyCity",
      description: "Signalez et suivez les incidents urbains en quelques clics",
      icon: <MapPin className="w-6 h-6" />,
      to: "/fixmycity",
      gradient: "from-[#10B981] to-[#06B6D4]",
    },
    {
      title: "JobFinder",
      description: "Trouvez les opportunités d'emploi dans votre ville",
      icon: <Briefcase className="w-6 h-6" />,
      to: "/jobfinder",
      gradient: "from-[#F59E0B] to-[#EF4444]",
    },
    {
      title: "EventHandler",
      description: "Découvrez et gérez tous les événements de la ville",
      icon: <Calendar className="w-6 h-6" />,
      to: "/events",
      gradient: "from-[#8B5CF6] to-[#EC4899]",
    },
  ];

  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Temps Réel",
      description: "Mises à jour instantanées pour une mobilité optimale",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Sécurisé",
      description: "Protection avancée des données et conformité RGPD",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Rapide",
      description: "Performance optimisée pour une expérience fluide",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Scalable",
      description: "Architecture évolutive pour les grandes villes",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Collaboratif",
      description: "Plateforme connectée pour tous les citoyens",
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Entreprise",
      description: "Solution professionnelle pour les collectivités",
    },
  ];

  const stats = [
    { value: "500K+", label: "Utilisateurs actifs" },
    { value: "150+", label: "Villes connectées" },
    { value: "99.9%", label: "Disponibilité" },
    { value: "24/7", label: "Support technique" },
  ];

  return (
    <div className="min-h-screen bg-[#050B18] relative overflow-hidden font-sans">
      <CinematicPreloader onComplete={handlePreloaderComplete} />
      <MorphingBackground />
      <GrainTexture />
      <CustomCursor />
      <FloatingNavbar />
      <MobileBottomNav />
      <HeroScene scrollProgress={scrollProgress.get()} />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center px-6 lg:px-12 pt-24 pb-32 relative">
          <motion.div
            className="max-w-7xl mx-auto w-full"
            style={{ opacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-[clamp(2.5rem,5vw,4.5rem)] font-bold text-white leading-tight mb-6">
                  <TextScramble text="La Ville Intelligente" delay={800} />
                  <br />
                  <span className="text-[#00D4FF]">à portée de main</span>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-10 max-w-xl"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  Une plateforme moderne pour gérer les transports, signaler les
                  incidents et découvrir les événements de votre ville.
                </motion.p>

                {!isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="bg-[#050B18]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                  >
                    <LoginContent />
                  </motion.div>
                )}
              </motion.div>

              {/* Right Content - Service Cards */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              >
                <div className="grid gap-6">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.15 }}
                    >
                      <Link to={service.to}>
                        <motion.div
                          className="bg-[#050B18]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group relative overflow-hidden"
                          whileHover={{
                            scale: 1.02,
                            borderColor: "rgba(0, 212, 255, 0.3)",
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                          />

                          <div className="relative flex items-center gap-6">
                            <motion.div
                              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                              whileHover={{ rotate: 5, scale: 1.1 }}
                            >
                              {service.icon}
                            </motion.div>

                            <div className="flex-1">
                              <h3
                                className="text-xl font-bold text-white mb-1 group-hover:text-[#00D4FF] transition-colors"
                                style={{
                                  fontFamily: "'Clash Display', sans-serif",
                                }}
                              >
                                {service.title}
                              </h3>
                              <p
                                className="text-slate-400 text-sm leading-relaxed"
                                style={{ fontFamily: "'Satoshi', sans-serif" }}
                              >
                                {service.description}
                              </p>
                            </div>

                            <motion.div
                              className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-[#00D4FF] group-hover:bg-[#00D4FF] group-hover:text-white transition-all duration-300"
                              whileHover={{ x: 5 }}
                            >
                              <ArrowRight className="w-5 h-5" />
                            </motion.div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 lg:px-12 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {stats.map((stat, index) => (
                <AnimatedStat
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  delay={index * 0.1}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Horizontal Scroll Section - Modules */}
        <HorizontalScroll />

        {/* Live City Map Section */}
        <LiveCityMap />

        {/* Data Visualization Section */}
        <DataVisualization />

        {/* Social Proof / Press Section */}
        <SocialProof />

        {/* Features Section */}
        <section className="py-24 px-6 lg:px-12 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="text-5xl md:text-6xl font-bold text-white mb-4"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Pourquoi nous choisir ?
              </h2>
              <p
                className="text-slate-400 text-lg max-w-2xl mx-auto"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                Une plateforme conçue pour simplifier votre vie urbaine
              </p>
            </motion.div>

            <StaggerContainer
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              staggerDelay={0.1}
            >
              {features.map((feature) => (
                <StaggerItem key={feature.title}>
                  <TiltCard className="h-full">
                    <div className="bg-[#050B18]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full group hover:border-[#00D4FF]/30 transition-all duration-300">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D4FF]/20 to-[#6366F1]/20 flex items-center justify-center mb-6 text-[#00D4FF] group-hover:scale-110 transition-transform duration-300 group-hover:from-[#00D4FF]/30 group-hover:to-[#6366F1]/30">
                        {feature.icon}
                      </div>

                      <h3
                        className="text-2xl font-bold text-white mb-3"
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                      >
                        {feature.title}
                      </h3>

                      <p
                        className="text-slate-400 leading-relaxed"
                        style={{ fontFamily: "'Satoshi', sans-serif" }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 lg:px-12 relative">
          <div className="max-w-4xl mx-auto">
            <FadeTransition className="h-full">
              <div className="bg-[#050B18]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12 md:p-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/10 via-[#6366F1]/10 to-[#8B5CF6]/10" />

                <div className="relative">
                  <motion.div
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#00D4FF] to-[#6366F1] flex items-center justify-center mx-auto mb-8 text-white shadow-2xl shadow-[#00D4FF]/30"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Globe className="w-10 h-10" />
                  </motion.div>

                  <h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-6"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    Transformez votre expérience urbaine
                  </h2>

                  <p
                    className="text-slate-300 text-lg text-center mb-10 max-w-2xl mx-auto leading-relaxed"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    Rejoignez Urban Flow et découvrez une nouvelle façon de
                    vivre en ville. Une plateforme intelligente pour une
                    mobilité moderne.
                  </p>

                  {!isAuthenticated && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <MagneticButton>
                        <Link
                          to="/login"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00D4FF] to-[#6366F1] hover:from-[#00D4FF]/80 hover:to-[#6366F1]/80 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-[#00D4FF]/30 hover:shadow-xl hover:shadow-[#00D4FF]/40"
                          style={{ fontFamily: "'Satoshi', sans-serif" }}
                        >
                          Commencer
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </MagneticButton>

                      <MagneticButton>
                        <Link
                          to="/busway"
                          className="inline-flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 border border-white/10 hover:border-[#00D4FF]/30"
                          style={{ fontFamily: "'Satoshi', sans-serif" }}
                        >
                          En savoir plus
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </MagneticButton>
                    </div>
                  )}

                  <div className="mt-12 pt-8 border-t border-white/10">
                    <div
                      className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm"
                      style={{ fontFamily: "'Satoshi', sans-serif" }}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#00D4FF]" />
                        <span>Sécurisé</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#00D4FF]" />
                        <span>Temps réel</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#00D4FF]" />
                        <span>Rapide</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeTransition>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 lg:px-12 border-t border-white/10 bg-[#050B18]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#6366F1] flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div
                    className="font-bold text-white"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    Urban Flow
                  </div>
                  <div
                    className="text-xs text-slate-400"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    Smart City Platform
                  </div>
                </div>
              </div>

              <p
                className="text-slate-400 text-sm"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                © 2024 Urban Flow. Construit avec passion pour une meilleure vie
                urbaine
              </p>

              <div
                className="flex gap-6 text-sm text-slate-400"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                <Link to="#" className="hover:text-[#00D4FF] transition-colors">
                  Confidentialité
                </Link>
                <Link to="#" className="hover:text-[#00D4FF] transition-colors">
                  Conditions
                </Link>
                <Link to="#" className="hover:text-[#00D4FF] transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
