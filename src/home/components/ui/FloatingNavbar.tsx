import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";

export function FloatingNavbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 100;
      setIsVisible(show);
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-[#050B18]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl shadow-black/50">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#6366F1] flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Urban Flow</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                to="/busway"
                className="text-sm text-slate-300 hover:text-[#00D4FF] transition-colors"
              >
                BusWay
              </Link>
              <Link
                to="/fixmycity"
                className="text-sm text-slate-300 hover:text-[#00D4FF] transition-colors"
              >
                FixMyCity
              </Link>
              <Link
                to="/jobfinder"
                className="text-sm text-slate-300 hover:text-[#00D4FF] transition-colors"
              >
                JobFinder
              </Link>
              <Link
                to="/events"
                className="text-sm text-slate-300 hover:text-[#00D4FF] transition-colors"
              >
                Events
              </Link>
            </div>

            <Link
              to="/login"
              className="text-sm bg-gradient-to-r from-[#00D4FF] to-[#6366F1] text-white px-4 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-[#00D4FF]/30 transition-all"
            >
              Connexion
            </Link>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
