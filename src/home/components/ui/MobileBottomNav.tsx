import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Bus, MapPin, Calendar, User, Home, Briefcase } from "lucide-react";

const navItems = [
  { icon: Home, label: "Accueil", to: "/home" },
  { icon: Bus, label: "BusWay", to: "/busway" },
  { icon: MapPin, label: "Incidents", to: "/fixmycity" },
  { icon: Briefcase, label: "JobFinder", to: "/jobfinder" },
  { icon: Calendar, label: "Events", to: "/events" },
  { icon: User, label: "Profil", to: "/login" },
];

export function MobileBottomNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Show after scrolling past hero
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Update active index based on current route
    const currentPath = location.pathname;
    const index = navItems.findIndex((item) =>
      currentPath.startsWith(item.to.replace("/*", "")),
    );
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [location]);

  // Only show on mobile
  if (typeof window !== "undefined" && window.innerWidth >= 768) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-[#0A1628]/95 backdrop-blur-xl border-t border-slate-800/50 px-4 pb-safe pt-2">
            <div className="flex items-center justify-around">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = index === activeIndex;

                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="relative flex flex-col items-center py-2 px-3"
                    onClick={() => setActiveIndex(index)}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-t from-[#00D4FF]/20 to-transparent rounded-lg"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        y: isActive ? -2 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      <Icon
                        className={`w-5 h-5 transition-colors duration-300 ${
                          isActive ? "text-[#00D4FF]" : "text-slate-400"
                        }`}
                      />
                    </motion.div>
                    <motion.span
                      className={`text-[10px] mt-1 transition-colors duration-300 ${
                        isActive
                          ? "text-[#00D4FF] font-medium"
                          : "text-slate-500"
                      }`}
                      animate={{ opacity: isActive ? 1 : 0.7 }}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

// Swipeable card carousel for mobile
export function SwipeableCarousel<T>({
  items,
  renderItem,
  className = "",
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragX, setDragX] = useState(0);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    const threshold = 50;
    const velocity = info.velocity.x;

    if (info.offset.x > threshold || velocity > 500) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } else if (info.offset.x < -threshold || velocity < -500) {
      setCurrentIndex((prev) => Math.min(items.length - 1, prev + 1));
    }
    setDragX(0);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex"
        animate={{
          x: `-${currentIndex * 100}%`,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={(_, info) => setDragX(info.offset.x)}
        onDragEnd={handleDragEnd}
      >
        {items.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0 px-4">
            {renderItem(item, index)}
          </div>
        ))}
      </motion.div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-6 bg-[#00D4FF]"
                : "bg-slate-600 hover:bg-slate-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
