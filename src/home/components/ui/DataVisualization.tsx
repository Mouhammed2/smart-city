import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Activity,
  Clock,
  Bus,
  AlertTriangle,
  Users,
} from "lucide-react";

const realtimeData = [
  { time: "00:00", trips: 120, incidents: 3, activeBuses: 45 },
  { time: "04:00", trips: 80, incidents: 1, activeBuses: 28 },
  { time: "08:00", trips: 450, incidents: 8, activeBuses: 156 },
  { time: "12:00", trips: 380, incidents: 5, activeBuses: 142 },
  { time: "16:00", trips: 520, incidents: 12, activeBuses: 178 },
  { time: "20:00", trips: 280, incidents: 4, activeBuses: 98 },
];

const heatmapData = [
  { zone: "Centre", activity: 95 },
  { zone: "Nord", activity: 72 },
  { zone: "Sud", activity: 88 },
  { zone: "Est", activity: 65 },
  { zone: "Ouest", activity: 78 },
  { zone: "Périphérie", activity: 45 },
];

function LiveCounter({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      countRef.current = Math.floor(easeProgress * end);
      setCount(countRef.current);

      if (progress >= 1) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  trend,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  trend?: string;
  color: string;
}) {
  return (
    <motion.div
      className="bg-[#0A1628]/80 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 relative overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{
          background: `linear-gradient(135deg, ${color}20, transparent)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          {trend && (
            <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          <LiveCounter end={value} suffix={suffix} />
        </div>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </motion.div>
  );
}

export function DataVisualization() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#00D4FF] text-sm uppercase tracking-widest mb-4">
            En Temps Réel
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            La Ville en Mouvement
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Données actualisées en direct depuis notre réseau de capteurs
            intelligents
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard
            icon={Bus}
            label="Trajets aujourd'hui"
            value={2847}
            suffix=""
            trend="+12%"
            color="#00D4FF"
          />
          <StatCard
            icon={Activity}
            label="Bus actifs"
            value={156}
            suffix=""
            trend="98%"
            color="#6366F1"
          />
          <StatCard
            icon={AlertTriangle}
            label="Incidents signalés"
            value={23}
            suffix=""
            trend="-5%"
            color="#F59E0B"
          />
          <StatCard
            icon={Users}
            label="Utilisateurs connectés"
            value={45283}
            suffix=""
            trend="+8%"
            color="#10B981"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart - Trajets */}
          <motion.div
            className="lg:col-span-2 bg-[#0A1628]/80 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Trajets en Temps Réel
                </h3>
                <p className="text-sm text-slate-400">
                  Activité du réseau sur les 24 dernières heures
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
                <span className="text-xs text-slate-400">Live</span>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={realtimeData}>
                  <defs>
                    <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBuses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0A1628",
                      border: "1px solid #1e293b",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="trips"
                    stroke="#00D4FF"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTrips)"
                    name="Trajets"
                  />
                  <Area
                    type="monotone"
                    dataKey="activeBuses"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBuses)"
                    name="Bus Actifs"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Heatmap Chart */}
          <motion.div
            className="bg-[#0A1628]/80 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-1">
                Activité par Zone
              </h3>
              <p className="text-sm text-slate-400">
                Intensité du trafic en temps réel
              </p>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={heatmapData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    stroke="#64748b"
                    fontSize={12}
                    domain={[0, 100]}
                    hide
                  />
                  <YAxis
                    type="category"
                    dataKey="zone"
                    stroke="#94a3b8"
                    fontSize={12}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0A1628",
                      border: "1px solid #1e293b",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Bar
                    dataKey="activity"
                    radius={[0, 4, 4, 0]}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {heatmapData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          activeIndex === index
                            ? "#00D4FF"
                            : `rgba(0, 212, 255, ${0.3 + (entry.activity / 100) * 0.7})`
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Live indicator */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 bg-[#0A1628]/60 border border-slate-800/50 rounded-full px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-sm text-slate-400">
              Connecté au réseau urbain
            </span>
            <span className="text-sm text-emerald-400 font-mono">
              <LiveCounter end={1247} suffix=" ms" duration={5000} />
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
