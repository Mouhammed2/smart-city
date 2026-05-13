import { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  AlertCircle,
  Bus,
  Calendar,
  Layers,
} from "lucide-react";

interface MapPoint {
  id: string;
  x: number;
  y: number;
  type: "bus" | "incident" | "event";
  label: string;
  status?: "active" | "warning" | "info";
}

interface BusRoute {
  id: string;
  path: { x: number; y: number }[];
  color: string;
  busPosition: number;
}

const mapPoints: MapPoint[] = [
  { id: "1", x: 20, y: 30, type: "bus", label: "Ligne 12", status: "active" },
  { id: "2", x: 45, y: 25, type: "bus", label: "Ligne 5", status: "active" },
  { id: "3", x: 70, y: 40, type: "bus", label: "Ligne 8", status: "warning" },
  {
    id: "4",
    x: 30,
    y: 60,
    type: "incident",
    label: "Retard",
    status: "warning",
  },
  { id: "5", x: 60, y: 55, type: "incident", label: "Travaux", status: "info" },
  { id: "6", x: 25, y: 75, type: "event", label: "Concert", status: "active" },
  { id: "7", x: 75, y: 70, type: "event", label: "Marché", status: "active" },
  { id: "8", x: 50, y: 45, type: "bus", label: "Ligne 3", status: "active" },
];

const busRoutes: BusRoute[] = [
  {
    id: "r1",
    path: [
      { x: 10, y: 30 },
      { x: 20, y: 30 },
      { x: 35, y: 35 },
      { x: 50, y: 45 },
      { x: 65, y: 40 },
      { x: 80, y: 35 },
    ],
    color: "#00D4FF",
    busPosition: 0,
  },
  {
    id: "r2",
    path: [
      { x: 15, y: 70 },
      { x: 25, y: 75 },
      { x: 40, y: 70 },
      { x: 60, y: 55 },
      { x: 75, y: 50 },
    ],
    color: "#6366F1",
    busPosition: 0,
  },
  {
    id: "r3",
    path: [
      { x: 30, y: 20 },
      { x: 45, y: 25 },
      { x: 55, y: 40 },
      { x: 70, y: 45 },
      { x: 85, y: 40 },
    ],
    color: "#10B981",
    busPosition: 0,
  },
];

function getPointColor(type: MapPoint["type"], status: MapPoint["status"]) {
  if (type === "bus") return status === "warning" ? "#F59E0B" : "#00D4FF";
  if (type === "incident") return status === "warning" ? "#EF4444" : "#F59E0B";
  return "#8B5CF6";
}

function getPointIcon(type: MapPoint["type"]) {
  if (type === "bus") return Bus;
  if (type === "incident") return AlertCircle;
  return Calendar;
}

export function LiveCityMap() {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "bus" | "incident" | "event"
  >("all");
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [animatedRoutes, setAnimatedRoutes] = useState(busRoutes);
  const mapRef = useRef<HTMLDivElement>(null);

  // Animate bus routes
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedRoutes((routes) =>
        routes.map((route) => ({
          ...route,
          busPosition: (route.busPosition + 0.5) % (route.path.length - 1),
        })),
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const filteredPoints = useMemo(() => {
    if (activeFilter === "all") return mapPoints;
    return mapPoints.filter((p) => p.type === activeFilter);
  }, [activeFilter]);

  // Generate SVG path from route points
  const getPathD = (path: { x: number; y: number }[]) => {
    if (path.length < 2) return "";
    return `M ${path[0].x} ${path[0].y} ${path
      .slice(1)
      .map((p) => `L ${p.x} ${p.y}`)
      .join(" ")}`;
  };

  // Interpolate bus position along route
  const getBusPosition = (route: BusRoute) => {
    const index = Math.floor(route.busPosition);
    const nextIndex = Math.min(index + 1, route.path.length - 1);
    const progress = route.busPosition - index;

    const current = route.path[index];
    const next = route.path[nextIndex];

    return {
      x: current.x + (next.x - current.x) * progress,
      y: current.y + (next.y - current.y) * progress,
    };
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#00D4FF] text-sm uppercase tracking-widest mb-3">
            Carte Interactive
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            La Ville en Direct
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Visualisez le trafic, les incidents et les événements en temps réel
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="flex justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {(
            [
              { id: "all", label: "Tout", icon: Layers },
              { id: "bus", label: "Bus", icon: Bus },
              { id: "incident", label: "Incidents", icon: AlertCircle },
              { id: "event", label: "Événements", icon: Calendar },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === id
                  ? "bg-gradient-to-r from-[#00D4FF] to-[#6366F1] text-white"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </motion.div>

        {/* Map container */}
        <motion.div
          ref={mapRef}
          className="relative aspect-[16/9] max-h-[600px] bg-[#0A1628] rounded-3xl border border-slate-800/50 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Dark map grid background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Street lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Major roads */}
            <line
              x1="0"
              y1="33"
              x2="100"
              y2="33"
              stroke="#1e293b"
              strokeWidth="0.5"
            />
            <line
              x1="0"
              y1="66"
              x2="100"
              y2="66"
              stroke="#1e293b"
              strokeWidth="0.5"
            />
            <line
              x1="33"
              y1="0"
              x2="33"
              y2="100"
              stroke="#1e293b"
              strokeWidth="0.5"
            />
            <line
              x1="66"
              y1="0"
              x2="66"
              y2="100"
              stroke="#1e293b"
              strokeWidth="0.5"
            />

            {/* Diagonal roads */}
            <line
              x1="0"
              y1="0"
              x2="100"
              y2="100"
              stroke="#1e293b"
              strokeWidth="0.3"
            />
            <line
              x1="100"
              y1="0"
              x2="0"
              y2="100"
              stroke="#1e293b"
              strokeWidth="0.3"
            />

            {/* Bus routes - animated flowing lines */}
            {animatedRoutes.map((route) => (
              <g key={route.id}>
                {/* Route path with glow */}
                <defs>
                  <linearGradient
                    id={`gradient-${route.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={route.color} stopOpacity="0" />
                    <stop
                      offset="50%"
                      stopColor={route.color}
                      stopOpacity="1"
                    />
                    <stop
                      offset="100%"
                      stopColor={route.color}
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <path
                  d={getPathD(route.path)}
                  stroke={`url(#gradient-${route.id})`}
                  strokeWidth="0.5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Animated bus */}
                {activeFilter === "all" || activeFilter === "bus" ? (
                  <motion.circle
                    cx={getBusPosition(route).x}
                    cy={getBusPosition(route).y}
                    r="1.5"
                    fill={route.color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                ) : null}
              </g>
            ))}

            {/* Connection lines between nearby points */}
            {mapPoints.map((p1, i) =>
              mapPoints.slice(i + 1).map((p2) => {
                const dist = Math.sqrt(
                  Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2),
                );
                if (dist > 30) return null;
                return (
                  <line
                    key={`${p1.id}-${p2.id}`}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="#334155"
                    strokeWidth="0.2"
                    opacity="0.5"
                  />
                );
              }),
            )}
          </svg>

          {/* Map points */}
          <AnimatePresence mode="popLayout">
            {filteredPoints.map((point) => {
              const Icon = getPointIcon(point.type);
              const color = getPointColor(point.type, point.status);

              return (
                <motion.div
                  key={point.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={() => setHoveredPoint(point.id)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Pulse animation */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{
                      scale: [1, 2, 2],
                      opacity: [0.5, 0, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />

                  {/* Point marker */}
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      hoveredPoint === point.id ? "scale-125" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>

                  {/* Label tooltip */}
                  <AnimatePresence>
                    {hoveredPoint === point.id && (
                      <motion.div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#0A1628] border border-slate-700 rounded-lg whitespace-nowrap z-10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <span className="text-sm text-white font-medium">
                          {point.label}
                        </span>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0A1628]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Map overlay info */}
          <div className="absolute bottom-4 left-4 bg-[#0A1628]/90 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {mapPoints.filter((p) => p.type === "bus").length} bus en
              circulation
            </p>
          </div>

          <div className="absolute bottom-4 right-4 bg-[#0A1628]/90 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
            <div className="text-right">
              <p className="text-sm text-slate-300">Zone couverte</p>
              <p className="text-xl font-bold text-white">125 km²</p>
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00D4FF]" />
            <span className="text-sm text-slate-400">Bus en service</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span className="text-sm text-slate-400">Incident signalé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
            <span className="text-sm text-slate-400">Événement en cours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <span className="text-sm text-slate-400">Urgent</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
