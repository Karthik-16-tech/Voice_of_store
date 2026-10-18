import React, { useMemo } from "react";
import { STORE, DEPARTMENTS, INCIDENTS, type Incident, type Department, type Severity } from "@/lib/store-data";

interface StoreBottomDashboardProps {
  onSelectDept?: (deptId: string) => void;
  onSelectIncident?: (incident: Incident) => void;
  onScrollToTop?: () => void;
}

export function StoreBottomDashboard({
  onSelectDept,
  onSelectIncident,
  onScrollToTop,
}: StoreBottomDashboardProps) {
  // Compute real counts from data
  const totalOpen = INCIDENTS.length;
  const criticalCount = INCIDENTS.filter((i) => i.severity === "critical").length;
  const highCount = INCIDENTS.filter((i) => i.severity === "high").length;
  const mediumCount = INCIDENTS.filter((i) => i.severity === "medium").length;

  // Department counts
  const deptSummary = useMemo(() => {
    return [
      { id: "produce", name: "Produce", count: 2, color: "#2f7cf6", trend: "up" },
      { id: "frozen", name: "Freezer", count: 3, color: "#e5484d", isCritical: true, trend: "spike" },
      { id: "checkout", name: "Checkout", count: 4, color: "#e5484d", isCritical: true, trend: "up" },
      { id: "beverages", name: "Beverages", count: 2, color: "#f5a524", trend: "down" },
      { id: "dairy", name: "Dairy", count: 1, color: "#2f7cf6", trend: "stable" },
      { id: "meat", name: "Meat & Seafood", count: 1, color: "#2f7cf6", trend: "down" },
      { id: "bakery", name: "Bakery", count: 1, color: "#f5a524", trend: "stable" },
      { id: "stockroom", name: "Stock Room", count: 1, color: "#2f7cf6", trend: "stable" },
    ];
  }, []);

  const insightCategories = [
    { label: "Temperature Issues", count: 3 },
    { label: "Billing Discrepancies", count: 4 },
    { label: "Stock Availability", count: 4 },
    { label: "Product Quality", count: 2 },
  ];

  const liveActivity = [
    {
      time: "10:24 AM",
      dot: "#e5484d",
      title: "New incident detected",
      subtitle: "Freezer Section · Temperature",
      incId: "INC-4821",
    },
    {
      time: "09:51 AM",
      dot: "#2f7cf6",
      title: "Issue assigned",
      subtitle: "Checkout · Billing",
      incId: "INC-4815",
    },
    {
      time: "08:32 AM",
      dot: "#f5a524",
      title: "Status updated",
      subtitle: "Produce · Investigating",
      incId: "INC-4808",
    },
    {
      time: "07:18 AM",
      dot: "#2f7cf6",
      title: "New feedback received",
      subtitle: "Beverages · Out of stock",
      incId: "INC-4810",
    },
  ];

  const handleDeptClick = (id: string) => {
    if (onSelectDept) {
      onSelectDept(id);
    }
    if (onScrollToTop) {
      onScrollToTop();
    }
  };

  const handleActivityClick = (incId: string) => {
    const inc = INCIDENTS.find((i) => i.id === incId);
    if (inc && onSelectIncident) {
      onSelectIncident(inc);
      if (onScrollToTop) onScrollToTop();
    }
  };

  return (
    <section className="w-full bg-[#f8f9fa] border-t border-neutral-200/80 px-3 sm:px-5 lg:px-6 py-4 select-none">
      <div className="mx-auto max-w-[1720px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
        
        {/* Card 1: Store Summary with 3D Thumbnail */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[14px] font-bold tracking-tight text-neutral-900 leading-tight">
                Store {STORE.id}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                {STORE.name} · {STORE.region}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          {/* Isometric Supermarket Thumbnail / Blueprint Illustration */}
          <div className="my-2.5 relative flex items-center justify-center h-28 w-full bg-gradient-to-b from-neutral-50/70 to-neutral-100/40 rounded-xl border border-neutral-200/50 p-2 overflow-hidden">
            <svg
              viewBox="0 0 280 140"
              className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              fill="none"
              stroke="currentColor"
            >
              {/* Ground perimeter isometric */}
              <polygon
                points="140,10 260,65 140,125 20,65"
                fill="#f1f3f5"
                stroke="#d1d5db"
                strokeWidth="1.2"
              />
              <polygon
                points="140,16 250,65 140,118 30,65"
                fill="#ffffff"
                stroke="#e5e7eb"
                strokeWidth="0.8"
              />
              
              {/* Isometric Shelving blocks & aisles */}
              <polygon points="70,60 110,40 125,48 85,68" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
              <polygon points="95,72 135,52 150,60 110,80" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
              <polygon points="120,84 160,64 175,72 135,92" fill="#fed7aa" stroke="#fdba74" strokeWidth="0.8" />
              
              {/* Produce & perimeter refrigeration racks */}
              <polygon points="150,45 190,25 215,38 175,58" fill="#bbf7d0" stroke="#86efac" strokeWidth="0.8" />
              <polygon points="180,62 220,42 235,50 195,70" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="0.8" />
              <polygon points="155,75 195,55 210,63 170,83" fill="#fecaca" stroke="#fca5a5" strokeWidth="0.8" />
              
              {/* Checkout counters */}
              <polygon points="55,75 75,65 85,70 65,80" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
              <polygon points="75,85 95,75 105,80 85,90" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
              
              {/* Scaffold wires */}
              <line x1="20" y1="65" x2="20" y2="45" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="260" y1="65" x2="260" y2="45" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="140" y1="125" x2="140" y2="105" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="140" y1="10" x2="140" y2="-5" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2,2" />
              
              {/* Red glow pulse marker for active freezer incident */}
              <circle cx="165" cy="48" r="4.5" fill="#e5484d" />
              <circle cx="165" cy="48" r="8" stroke="#e5484d" strokeWidth="1" opacity="0.6" />
            </svg>

            {/* Expand / View 3D Button */}
            <button
              onClick={onScrollToTop}
              title="Expand view to 3D environment"
              aria-label="Expand 3D environment"
              className="absolute bottom-1.5 right-1.5 p-1 rounded-lg bg-white/90 hover:bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80 shadow-sm transition-transform active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-100">
            <span>Last sync</span>
            <span className="font-medium text-neutral-700">10:24 AM</span>
          </div>
        </div>

        {/* Card 2: Store Overview with Metrics & Trendline */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <h3 className="text-[13px] font-bold tracking-tight text-neutral-900">
              Store Overview
            </h3>

            {/* Metrics row */}
            <div className="grid grid-cols-4 gap-1 mt-2">
              <div className="bg-neutral-50/80 rounded-lg p-1 border border-neutral-100 text-center">
                <div className="text-[15px] font-bold text-neutral-900 leading-none">
                  {totalOpen}
                </div>
                <div className="text-[9px] text-neutral-500 mt-1 truncate">
                  Open Issues
                </div>
              </div>

              <div className="bg-neutral-50/80 rounded-lg p-1 border border-neutral-100 text-center">
                <div className="flex items-center justify-center gap-1 text-[15px] font-bold text-neutral-900 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e5484d]" />
                  {criticalCount}
                </div>
                <div className="text-[9px] text-neutral-500 mt-1 truncate">
                  Critical
                </div>
              </div>

              <div className="bg-neutral-50/80 rounded-lg p-1 border border-neutral-100 text-center">
                <div className="flex items-center justify-center gap-1 text-[15px] font-bold text-neutral-900 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f5a524]" />
                  {highCount}
                </div>
                <div className="text-[9px] text-neutral-500 mt-1 truncate">
                  High
                </div>
              </div>

              <div className="bg-neutral-50/80 rounded-lg p-1 border border-neutral-100 text-center">
                <div className="flex items-center justify-center gap-1 text-[15px] font-bold text-neutral-900 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2f7cf6]" />
                  {mediumCount}
                </div>
                <div className="text-[9px] text-neutral-500 mt-1 truncate">
                  Medium
                </div>
              </div>
            </div>
          </div>

          {/* Area chart */}
          <div className="mt-3">
            <div className="relative h-14 w-full">
              <svg viewBox="0 0 240 60" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f7cf6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2f7cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area Fill */}
                <path
                  d="M 0,48 Q 40,46 70,42 T 130,22 T 180,32 T 240,30 L 240,60 L 0,60 Z"
                  fill="url(#curveGradient)"
                />
                {/* Curved line */}
                <path
                  d="M 0,48 Q 40,46 70,42 T 130,22 T 180,32 T 240,30"
                  fill="none"
                  stroke="#2f7cf6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Highlight Point at peak */}
                <circle cx="130" cy="22" r="4.5" fill="#2f7cf6" />
                <circle cx="130" cy="22" r="2" fill="#ffffff" />
                {/* Small indicator dots */}
                <circle cx="70" cy="42" r="2" fill="#2f7cf6" opacity="0.6" />
                <circle cx="180" cy="32" r="2" fill="#2f7cf6" opacity="0.6" />
              </svg>
            </div>

            {/* Time labels */}
            <div className="flex justify-between text-[9px] font-medium text-neutral-400 mt-1 px-1">
              <span>6AM</span>
              <span>9AM</span>
              <span>12PM</span>
              <span className="font-semibold text-neutral-600">3PM</span>
              <span>6PM</span>
              <span>9PM</span>
            </div>
          </div>
        </div>

        {/* Card 3: Department Status (2-column list with sparklines) */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-[13px] font-bold tracking-tight text-neutral-900">
              Department Status
            </h3>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-1">
            {deptSummary.map((d) => (
              <button
                key={d.id}
                onClick={() => handleDeptClick(d.id)}
                className="group flex items-center justify-between py-1 px-1 rounded-lg hover:bg-neutral-50 transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-1 min-w-0">
                  <span
                    className="w-1.5 h-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-semibold text-neutral-800 truncate group-hover:text-blue-600 leading-tight">
                      {d.name}
                    </div>
                    <div
                      className={`text-[9px] leading-tight ${
                        d.isCritical ? "text-[#e5484d] font-semibold" : "text-neutral-500"
                      }`}
                    >
                      {d.count} {d.count === 1 ? "Issue" : "Issues"}
                    </div>
                  </div>
                </div>

                {/* Mini sparkline + chevron */}
                <div className="flex items-center gap-0.5 shrink-0 ml-1">
                  <svg viewBox="0 0 24 10" className="w-5 h-2.5 text-neutral-300 group-hover:text-blue-500" fill="none" stroke="currentColor">
                    <path
                      d={
                        d.trend === "spike"
                          ? "M1 8 L7 6 L13 1 L18 7 L23 4"
                          : d.trend === "up"
                          ? "M1 9 L7 7 L13 4 L18 6 L23 2"
                          : "M1 3 L7 7 L13 4 L18 8 L23 7"
                      }
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-[9px] text-neutral-300 group-hover:text-neutral-600">›</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Card 4: Incident Insights (3D heatmap graphic + category list) */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-[13px] font-bold tracking-tight text-neutral-900">
              Incident Insights
            </h3>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          <div className="grid grid-cols-[88px_1fr] gap-2.5 items-center mt-1">
            {/* 3D Topographic Mesh Heatmap SVG */}
            <div className="w-full h-24 rounded-xl bg-gradient-to-b from-neutral-50 to-neutral-100/60 border border-neutral-200/50 p-1 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 100 80" className="w-full h-full" fill="none">
                <defs>
                  <linearGradient id="topoA" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="topoS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {/* Base grid plane */}
                <polygon points="50,15 90,38 50,62 10,38" stroke="#e2e8f0" strokeWidth="0.8" fill="#f8fafc" />
                <line x1="30" y1="26" x2="70" y2="50" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="1,1" />
                <line x1="70" y1="26" x2="30" y2="50" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="1,1" />

                {/* 3D Wireframe Terrain Mesh */}
                <path
                  d="M 18,36 Q 30,18 45,26 T 65,14 T 84,34 L 84,46 Q 65,30 45,38 T 18,48 Z"
                  fill="url(#topoA)"
                  opacity="0.85"
                />
                <path
                  d="M 18,36 Q 30,18 45,26 T 65,14 T 84,34"
                  stroke="#fbbf24"
                  strokeWidth="1.2"
                />
                <path
                  d="M 22,42 Q 35,24 50,30 T 72,20 T 80,40"
                  stroke="#10b981"
                  strokeWidth="1"
                />
                <path
                  d="M 28,48 Q 42,32 55,36 T 76,28 T 76,46"
                  stroke="#3b82f6"
                  strokeWidth="1"
                />
                <path
                  d="M 18,48 L 18,36 Q 30,18 45,26 T 65,14 T 84,34 L 84,46 L 50,62 Z"
                  fill="url(#topoS)"
                />
              </svg>
            </div>

            {/* Category counts list */}
            <div className="space-y-1.5">
              {insightCategories.map((c) => (
                <div key={c.label} className="flex items-center justify-between text-[11px] leading-tight">
                  <span className="text-neutral-600 truncate">{c.label}</span>
                  <span className="font-bold text-neutral-800 ml-1.5">{c.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-1.5 mt-1 border-t border-neutral-100 flex justify-between items-center text-[10px] text-neutral-400">
            <span>Issue clusters</span>
            <span className="text-neutral-600 font-medium">Freezer & Checkout</span>
          </div>
        </div>

        {/* Card 5: Live Activity (Timeline) */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-[13px] font-bold tracking-tight text-neutral-900">
              Live Activity
            </h3>
            <button
              onClick={onScrollToTop}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="relative pl-3 space-y-2 mt-1">
            {/* Timeline vertical bar */}
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-neutral-200" />

            {liveActivity.map((act, i) => (
              <div
                key={i}
                onClick={() => handleActivityClick(act.incId)}
                className="relative flex items-start gap-2 cursor-pointer group"
              >
                {/* Timeline node */}
                <span
                  className="w-2 h-2 rounded-full shrink-0 mt-1 relative z-10 -ml-[7px] transition-transform group-hover:scale-125"
                  style={{ backgroundColor: act.dot }}
                />
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-neutral-400 font-mono">
                      {act.time}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-neutral-800 group-hover:text-blue-600 truncate leading-tight">
                    {act.title}
                  </div>
                  <div className="text-[9.5px] text-neutral-500 truncate leading-tight">
                    {act.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default StoreBottomDashboard;
