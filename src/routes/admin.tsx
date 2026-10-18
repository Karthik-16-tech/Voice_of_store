import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/opsight/DashboardHeader";
import { SectorReportDialog, type AdminSectorId } from "@/components/opsight/SectorReportDialog";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Hourglass,
  Layers,
  MessageSquare,
  Package,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Shirt,
  Sparkles,
  Store,
  Tag,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Retail Operations Overview — Voice of Store Admin" },
      {
        name: "description",
        content:
          "Real-time feedback insights, sector performance, emerging operational signals, and action queue across all retail stores.",
      },
    ],
  }),
  component: AdminDashboardPage,
});

/* ─── Interfaces ─── */
interface SectorCardData {
  id: string;
  name: string;
  rank: string;
  subtitle: string;
  icon: typeof Store;
  iconBg: string;
  iconColor: string;
  totalFeedback: number;
  trend: string;
  open: number;
  resolved: number;
  critical: number;
  resolutionRate: number;
  storesAffected: number;
  owner: string;
  ownerColor: string;
}

interface SignalItem {
  id: string;
  title: string;
  store: string;
  sector: string;
  timeAgo: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  evidence: string;
  owner: string;
}

interface ActionQueueItem {
  id: string;
  issue: string;
  store: string;
  sector: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  status: "In Progress" | "Assigned" | "Pending" | "Resolved";
  owner: string;
}

/* ─── Initial Demo Datasets matching Screenshot ─── */
const SECTOR_DATA: SectorCardData[] = [
  {
    id: "sec-1",
    name: "Store Management",
    rank: "#1",
    subtitle: "Staff conduct, billing queues, service complaints, cleanliness, shift operations.",
    icon: Users,
    iconBg: "bg-blue-100/70 text-blue-600",
    iconColor: "text-blue-600",
    totalFeedback: 420,
    trend: "+12%",
    open: 112,
    resolved: 276,
    critical: 18,
    resolutionRate: 73,
    storesAffected: 42,
    owner: "Store Ops",
    ownerColor: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    id: "sec-food",
    name: "Food Safety & Compliance",
    rank: "#2",
    subtitle: "Bakery allergens, expired batches, cold well holding temps, FSMA audit clearance.",
    icon: ShieldCheck,
    iconBg: "bg-rose-100/70 text-rose-600",
    iconColor: "text-rose-600",
    totalFeedback: 310,
    trend: "+14%",
    open: 42,
    resolved: 254,
    critical: 14,
    resolutionRate: 86,
    storesAffected: 42,
    owner: "QA & Safety",
    ownerColor: "text-rose-600 bg-rose-50 border-rose-200",
  },
  {
    id: "sec-2",
    name: "Clothing & Merchandising",
    rank: "#3",
    subtitle: "Damaged clothing, product defects, wrong labels, returns, product quality, display issues.",
    icon: Shirt,
    iconBg: "bg-purple-100/70 text-purple-600",
    iconColor: "text-purple-600",
    totalFeedback: 336,
    trend: "+8%",
    open: 96,
    resolved: 212,
    critical: 14,
    resolutionRate: 63,
    storesAffected: 38,
    owner: "Merchandising",
    ownerColor: "text-purple-600 bg-purple-50 border-purple-200",
  },
  {
    id: "sec-3",
    name: "Maintenance & Equipment",
    rank: "#4",
    subtitle: "Broken freezers, refrigeration problems, equipment downtime, repair delays.",
    icon: Wrench,
    iconBg: "bg-emerald-100/70 text-emerald-600",
    iconColor: "text-emerald-600",
    totalFeedback: 268,
    trend: "+21%",
    open: 78,
    resolved: 160,
    critical: 12,
    resolutionRate: 60,
    storesAffected: 38,
    owner: "Facilities",
    ownerColor: "text-sky-600 bg-sky-50 border-sky-200",
  },
  {
    id: "sec-4",
    name: "Inventory & Supply Chain",
    rank: "#4",
    subtitle: "Stock discrepancies, missing items, delayed replenishment, damaged deliveries.",
    icon: Package,
    iconBg: "bg-amber-100/70 text-amber-600",
    iconColor: "text-amber-600",
    totalFeedback: 224,
    trend: "+5%",
    open: 42,
    resolved: 168,
    critical: 9,
    resolutionRate: 75,
    storesAffected: 33,
    owner: "Supply Chain",
    ownerColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
  },
];

const EMERGING_SIGNALS: SignalItem[] = [
  {
    id: "SIG-101",
    title: "Freezer not working at Store #102",
    store: "Store #102",
    sector: "Maintenance & Equipment",
    timeAgo: "2 hours ago",
    severity: "Critical",
    evidence: "Chiller compressor failure logged by store supervisor. 3 customer complaints regarding warm milk cartons.",
    owner: "Facilities Director",
  },
  {
    id: "SIG-102",
    title: "Incorrect product labels in new stock",
    store: "Store #205",
    sector: "Merchandising",
    timeAgo: "4 hours ago",
    severity: "High",
    evidence: "Batch #FL-204 apparel items marked with wrong size tags. Mismatch between POS barcode and physical tag.",
    owner: "Merchandising Specialist",
  },
  {
    id: "SIG-103",
    title: "Long billing queues during peak hours",
    store: "Store #118",
    sector: "Store Management",
    timeAgo: "6 hours ago",
    severity: "High",
    evidence: "Checkout wait times exceeded 14 minutes between 5:30 PM and 7:00 PM. 2 cashier terminals were unmanned.",
    owner: "District Operations Lead",
  },
];

const STORE_PERFORMANCE = [
  { store: "Store #102", volume: 86, percentage: 86 },
  { store: "Store #205", volume: 64, percentage: 64 },
  { store: "Store #118", volume: 52, percentage: 52 },
  { store: "Store #076", volume: 48, percentage: 48 },
  { store: "Store #301", volume: 40, percentage: 40 },
];

const ACTION_QUEUE: ActionQueueItem[] = [
  {
    id: "ACT-01",
    issue: "Repair freezer unit",
    store: "#102",
    sector: "Maintenance",
    priority: "High",
    dueDate: "Oct 18",
    status: "In Progress",
    owner: "Technician Team A",
  },
  {
    id: "ACT-02",
    issue: "Fix product labels",
    store: "#205",
    sector: "Merchandising",
    priority: "High",
    dueDate: "Oct 19",
    status: "Assigned",
    owner: "Floor Supervisor",
  },
  {
    id: "ACT-03",
    issue: "Resolve billing queues",
    store: "#118",
    sector: "Store Mgmt",
    priority: "Medium",
    dueDate: "Oct 20",
    status: "In Progress",
    owner: "Store Manager",
  },
  {
    id: "ACT-04",
    issue: "Stock replenishment",
    store: "#076",
    sector: "Inventory",
    priority: "Medium",
    dueDate: "Oct 21",
    status: "Pending",
    owner: "Logistics Lead",
  },
  {
    id: "ACT-05",
    issue: "Cleanliness complaint",
    store: "#301",
    sector: "Store Mgmt",
    priority: "Low",
    dueDate: "Oct 22",
    status: "Assigned",
    owner: "Facility Services",
  },
];

const TREND_BARS = [
  { label: "Oct 1", total: 110, resolved: 85, open: 25, critical: 8 },
  { label: "Oct 5", total: 160, resolved: 120, open: 40, critical: 12 },
  { label: "Oct 10", total: 145, resolved: 110, open: 35, critical: 9 },
  { label: "Oct 15", total: 175, resolved: 135, open: 40, critical: 14 },
  { label: "Oct 18", total: 195, resolved: 155, open: 40, critical: 10 },
];

export function AdminDashboardPage() {
  const [selectedRange, setSelectedRange] = useState("Oct 1, 2026 - Oct 18, 2026");
  const [trendPeriod, setTrendPeriod] = useState<"Monthly" | "Weekly" | "Daily">("Monthly");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [activeSignal, setActiveSignal] = useState<SignalItem | null>(null);
  const [activeAction, setActiveAction] = useState<ActionQueueItem | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [sectorReportOpen, setSectorReportOpen] = useState(false);
  const [activeReportSector, setActiveReportSector] = useState<AdminSectorId>("all");

  const handleExport = (sectorId: AdminSectorId = "all") => {
    setActiveReportSector(sectorId);
    setSectorReportOpen(true);
  };

  const filteredQueue = useMemo(() => {
    if (!searchFilter.trim()) return ACTION_QUEUE;
    const q = searchFilter.toLowerCase();
    return ACTION_QUEUE.filter(
      (item) =>
        item.issue.toLowerCase().includes(q) ||
        item.store.toLowerCase().includes(q) ||
        item.sector.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#ede9fe]/30 to-[#e0f2fe]/40 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900 pb-16 relative">
      {/* ── Soft Ambient Pastel Glows ── */}
      <div className="pointer-events-none absolute top-12 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-200/25 blur-[120px] -z-10" />
      <div className="pointer-events-none absolute top-36 right-1/4 h-[450px] w-[450px] rounded-full bg-sky-200/30 blur-[130px] -z-10" />
      <div className="pointer-events-none absolute bottom-24 left-1/3 h-[400px] w-[400px] rounded-full bg-rose-100/25 blur-[140px] -z-10" />

      {/* ── Primary Top Navigation Bar ── */}
      <DashboardHeader active="admin" showControls={false} />

      {/* Export notification toast */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-blue-200 bg-white/95 backdrop-blur-xl p-4 shadow-xl text-xs font-semibold text-slate-800 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* ── Main Dashboard Layout ── */}
      <main className="mx-auto max-w-[1600px] px-6 py-6 lg:px-12 space-y-6">
        {/* ── Dashboard Heading and Reporting Controls ── */}
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Retail Operations Overview
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
              Real-time feedback insights across all your retail stores
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sector Quick Selector Dropdown */}
            <div className="relative">
              <select
                value={activeReportSector}
                onChange={(e) => {
                  const s = e.target.value as AdminSectorId;
                  handleExport(s);
                }}
                className="appearance-none bg-white text-slate-800 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs font-bold pr-8 shadow-2xs outline-none cursor-pointer hover:border-slate-300"
              >
                <option value="all">📑 Sector Reports (All)</option>
                <option value="management">🏢 Store Management Report</option>
                <option value="food-safety">🥗 Food Safety Report</option>
                <option value="maintenance">❄️ Maintenance Report</option>
                <option value="merchandising">🏷️ Merchandising Report</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Date Range Picker */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/80 bg-white/80 backdrop-blur-xl px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.03)] cursor-pointer hover:bg-white hover:border-slate-300 transition">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{selectedRange}</span>
            </div>

            {/* Export Sector Report Button */}
            <button
              type="button"
              onClick={() => handleExport("all")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-700 hover:shadow-lg cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Sector Report (PDF)</span>
            </button>
          </div>
        </section>

        {/* ── 4 Compact KPI Cards in One Horizontal Row ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Feedback */}
          <div className="rounded-2xl border border-white/80 bg-white/75 backdrop-blur-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-100/70 text-blue-600 shadow-xs">
                <MessageSquare className="h-5 w-5" />
              </span>
              <svg className="w-20 h-6 stroke-blue-500 fill-none stroke-2" viewBox="0 0 100 25">
                <polyline points="0,20 20,18 40,21 60,14 80,16 100,5" />
              </svg>
            </div>
            <div className="mt-3">
              <span className="text-xs font-semibold text-slate-500 block">Total Feedback</span>
              <strong className="text-3xl font-black tracking-tight text-slate-900 block mt-0.5">1,248</strong>
            </div>
            <div className="mt-2 flex items-center text-xs font-medium text-slate-400">
              <span className="text-emerald-600 font-bold flex items-center mr-1.5">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> 12%
              </span>
              <span>vs last month (1,115)</span>
            </div>
          </div>

          {/* 2. Open Issues */}
          <div className="rounded-2xl border border-white/80 bg-white/75 backdrop-blur-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-100/70 text-amber-600 shadow-xs">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <svg className="w-20 h-6 stroke-rose-500 fill-none stroke-2" viewBox="0 0 100 25">
                <polyline points="0,22 25,19 50,17 75,13 100,6" />
              </svg>
            </div>
            <div className="mt-3">
              <span className="text-xs font-semibold text-slate-500 block">Open Issues</span>
              <strong className="text-3xl font-black tracking-tight text-slate-900 block mt-0.5">328</strong>
            </div>
            <div className="mt-2 flex items-center text-xs font-medium text-slate-400">
              <span className="text-rose-600 font-bold flex items-center mr-1.5">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> 8%
              </span>
              <span>vs last month (304)</span>
            </div>
          </div>

          {/* 3. Resolved Issues */}
          <div className="rounded-2xl border border-white/80 bg-white/75 backdrop-blur-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100/70 text-emerald-600 shadow-xs">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <svg className="w-20 h-6 stroke-emerald-500 fill-none stroke-2" viewBox="0 0 100 25">
                <polyline points="0,21 25,18 50,19 75,12 100,5" />
              </svg>
            </div>
            <div className="mt-3">
              <span className="text-xs font-semibold text-slate-500 block">Resolved Issues</span>
              <strong className="text-3xl font-black tracking-tight text-slate-900 block mt-0.5">864</strong>
            </div>
            <div className="mt-2 flex items-center text-xs font-medium text-slate-400">
              <span className="text-emerald-600 font-bold flex items-center mr-1.5">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> 16%
              </span>
              <span>vs last month (746)</span>
            </div>
          </div>

          {/* 4. Critical Alerts */}
          <div className="rounded-2xl border border-white/80 bg-white/75 backdrop-blur-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-rose-100/70 text-rose-600 shadow-xs">
                <AlertCircle className="h-5 w-5" />
              </span>
              <svg className="w-20 h-6 stroke-rose-500 fill-none stroke-2" viewBox="0 0 100 25">
                <polyline points="0,23 25,21 50,16 75,18 100,4" />
              </svg>
            </div>
            <div className="mt-3">
              <span className="text-xs font-semibold text-slate-500 block">Critical Alerts</span>
              <strong className="text-3xl font-black tracking-tight text-rose-600 block mt-0.5">47</strong>
            </div>
            <div className="mt-2 flex items-center text-xs font-medium text-slate-400">
              <span className="text-rose-600 font-bold flex items-center mr-1.5">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> 34%
              </span>
              <span>vs last month (35)</span>
            </div>
          </div>
        </section>

        {/* ── Main Dashboard Composition: 70% Left / 30% Right ── */}
        <section className="grid gap-6 lg:grid-cols-[7fr_3fr] items-start">
          {/* Left Column: Sector Performance */}
          <div className="rounded-3xl border border-white/80 bg-white/75 backdrop-blur-2xl p-6 shadow-[0_8px_32px_rgba(31,38,135,0.04)]">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900">Sector Performance</h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Where feedback is concentrated, what remains unresolved, and which teams need to act.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSector("all")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Sectors</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* 4 Compact Sector Cards in One Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
              {SECTOR_DATA.map((sector) => {
                const Icon = sector.icon;
                const isSelected = selectedSector === sector.id;
                return (
                  <div
                    key={sector.id}
                    onClick={() => setSelectedSector(isSelected ? null : sector.id)}
                    className={`rounded-2xl border p-4 transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-blue-400 bg-white/95 shadow-lg shadow-blue-500/10 ring-2 ring-blue-400/20"
                        : "border-slate-200/70 bg-white/70 hover:bg-white hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <div>
                      {/* Top icon & rank badge */}
                      <div className="flex items-center justify-between">
                        <span className={`grid h-9 w-9 place-items-center rounded-xl ${sector.iconBg} shadow-xs`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          {sector.rank}
                        </span>
                      </div>

                      {/* Title & subtitle */}
                      <h3 className="mt-3 text-xs font-black text-slate-900 leading-snug">{sector.name}</h3>
                      <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {sector.subtitle}
                      </p>

                      {/* Total feedback */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-baseline justify-between">
                        <span className="text-[11px] font-medium text-slate-400">Total Feedback</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-sm font-black text-slate-900">{sector.totalFeedback}</strong>
                          <span className="text-[10px] font-bold text-emerald-600">{sector.trend}</span>
                        </div>
                      </div>

                      {/* Open / Resolved / Critical columns */}
                      <div className="mt-2.5 grid grid-cols-3 gap-1 text-center py-2 rounded-xl bg-slate-50/70 border border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Open</span>
                          <strong className="text-xs font-black text-amber-600">{sector.open}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Resolved</span>
                          <strong className="text-xs font-black text-emerald-600">{sector.resolved}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Critical</span>
                          <strong className="text-xs font-black text-rose-600">{sector.critical}</strong>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${sector.resolutionRate}%` }}
                          />
                        </div>
                        <span className="mt-1 text-[10px] font-semibold text-slate-400 block text-right">
                          {sector.resolutionRate}% resolved
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Store className="h-3 w-3" />
                        {sector.storesAffected} stores
                      </span>
                      <span className={`rounded-md px-1.5 py-0.5 border text-[9px] font-bold ${sector.ownerColor}`}>
                        {sector.owner}
                      </span>
                    </div>

                    {/* Sector Report Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const mappedId: AdminSectorId =
                          sector.id === "sec-food"
                            ? "food-safety"
                            : sector.id === "sec-1"
                            ? "management"
                            : sector.id === "sec-2"
                            ? "merchandising"
                            : sector.id === "sec-3"
                            ? "maintenance"
                            : "management";
                        handleExport(mappedId);
                      }}
                      className="mt-2.5 w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 py-1.5 text-[10px] font-bold text-slate-700 transition cursor-pointer shadow-2xs"
                    >
                      <Download className="h-3 w-3 text-blue-600" />
                      <span>Export Sector Report (PDF)</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Emerging Signals + Feedback Resolution Tracker */}
          <div className="space-y-6">
            {/* 1. Emerging Signals & Immediate Attention */}
            <div className="rounded-3xl border border-white/80 bg-white/75 backdrop-blur-2xl p-5 shadow-[0_8px_32px_rgba(31,38,135,0.04)]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <h2 className="text-xs font-black tracking-tight text-slate-900 uppercase">
                  Emerging Signals & Immediate Attention
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveSignal(EMERGING_SIGNALS[0])}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-2.5">
                {EMERGING_SIGNALS.map((sig) => (
                  <div
                    key={sig.id}
                    onClick={() => setActiveSignal(sig)}
                    className="flex items-center justify-between gap-2.5 rounded-2xl border border-slate-200/70 bg-white/80 p-3 shadow-xs hover:shadow-md hover:bg-white transition cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                          sig.severity === "Critical"
                            ? "bg-rose-100/70 text-rose-600"
                            : "bg-amber-100/70 text-amber-600"
                        }`}
                      >
                        {sig.severity === "Critical" ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <Package className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-slate-900 truncate">{sig.title}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                          {sig.store} • {sig.sector} • {sig.timeAgo}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                          sig.severity === "Critical"
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {sig.severity}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Feedback Resolution Tracker */}
            <div className="rounded-3xl border border-white/80 bg-white/75 backdrop-blur-2xl p-5 shadow-[0_8px_32px_rgba(31,38,135,0.04)]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <h2 className="text-xs font-black tracking-tight text-slate-900">
                  Feedback Resolution Tracker
                </h2>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 cursor-pointer">
                  <span>This month</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </div>
              </div>

              {/* Horizontal segmented progress bar */}
              <div className="h-6 w-full rounded-full overflow-hidden flex shadow-inner text-[10px] font-black text-white text-center leading-6">
                <div className="bg-emerald-500 h-full" style={{ width: "52%" }} title="Resolved: 52%">
                  52%
                </div>
                <div className="bg-blue-500 h-full" style={{ width: "18%" }} title="In Progress: 18%">
                  18%
                </div>
                <div className="bg-amber-400 h-full" style={{ width: "12%" }} title="Awaiting: 12%">
                  12%
                </div>
                <div className="bg-orange-500 h-full" style={{ width: "10%" }} title="Under Review: 10%">
                  10%
                </div>
                <div className="bg-rose-500 h-full" style={{ width: "6%" }} title="Overdue: 6%">
                  6%
                </div>
                <div className="bg-purple-600 h-full" style={{ width: "2%" }} title="Escalated: 2%">
                  2%
                </div>
              </div>

              {/* Status Pills with Counts */}
              <div className="mt-3.5 grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="rounded-lg bg-emerald-50/80 border border-emerald-100 p-1.5">
                  <span className="text-emerald-700 block font-semibold">• Resolved</span>
                  <strong className="text-xs font-black text-emerald-900">864</strong>
                </div>
                <div className="rounded-lg bg-blue-50/80 border border-blue-100 p-1.5">
                  <span className="text-blue-700 block font-semibold">• In Progress</span>
                  <strong className="text-xs font-black text-blue-900">298</strong>
                </div>
                <div className="rounded-lg bg-amber-50/80 border border-amber-100 p-1.5">
                  <span className="text-amber-700 block font-semibold">• Awaiting</span>
                  <strong className="text-xs font-black text-amber-900">199</strong>
                </div>
                <div className="rounded-lg bg-orange-50/80 border border-orange-100 p-1.5">
                  <span className="text-orange-700 block font-semibold">• Review</span>
                  <strong className="text-xs font-black text-orange-900">166</strong>
                </div>
                <div className="rounded-lg bg-rose-50/80 border border-rose-100 p-1.5">
                  <span className="text-rose-700 block font-semibold">• Overdue</span>
                  <strong className="text-xs font-black text-rose-900">98</strong>
                </div>
                <div className="rounded-lg bg-purple-50/80 border border-purple-100 p-1.5">
                  <span className="text-purple-700 block font-semibold">• Escalated</span>
                  <strong className="text-xs font-black text-purple-900">31</strong>
                </div>
              </div>

              {/* Averages at bottom */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-500">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium leading-none">
                      Avg. Resolution Time
                    </span>
                    <strong className="text-xs font-black text-slate-900 block mt-0.5">
                      2.8 days <span className="text-emerald-600 font-bold text-[10px]">↑ 18%</span>
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-500">
                    <Hourglass className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium leading-none">
                      Avg. Unresolved Age
                    </span>
                    <strong className="text-xs font-black text-slate-900 block mt-0.5">
                      4.6 days <span className="text-rose-600 font-bold text-[10px]">↑ 22%</span>
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom Row: Three Aligned Glass Panels ── */}
        <section className="grid gap-6 lg:grid-cols-3 items-stretch">
          {/* Panel 1: Store Performance */}
          <div className="rounded-3xl border border-white/80 bg-white/75 backdrop-blur-2xl p-6 shadow-[0_8px_32px_rgba(31,38,135,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Store Performance</h2>
                  <p className="text-[11px] text-slate-400">Top 5 Stores by Feedback Volume</p>
                </div>
                <button
                  type="button"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View All Stores</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Horizontal Bar rows */}
              <div className="space-y-3.5">
                {STORE_PERFORMANCE.map((item) => (
                  <div key={item.store} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>{item.store}</span>
                      <strong className="text-slate-900 font-black">{item.volume}</strong>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium">
              Volume reflects active reporting channels, not store failure rates.
            </p>
          </div>

          {/* Panel 2: Feedback Trend (Grouped Bar Chart) */}
          <div className="rounded-3xl border border-white/80 bg-white/75 backdrop-blur-2xl p-6 shadow-[0_8px_32px_rgba(31,38,135,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-extrabold text-slate-900">Feedback Trend</h2>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                  <span>{trendPeriod}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 mb-3">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-500" /> Total
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Resolved
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Open
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> Critical
                </span>
              </div>

              {/* Grouped Bar Visualizer */}
              <div className="h-44 w-full flex items-end justify-between gap-3 pt-4 border-b border-slate-100">
                {TREND_BARS.map((col) => (
                  <div key={col.label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div className="flex items-end gap-1 h-full w-full justify-center">
                      {/* Total Bar */}
                      <div
                        className="w-2 sm:w-2.5 rounded-t-sm bg-blue-500 transition-all group-hover:brightness-110"
                        style={{ height: `${(col.total / 200) * 100}%` }}
                        title={`Total: ${col.total}`}
                      />
                      {/* Resolved Bar */}
                      <div
                        className="w-2 sm:w-2.5 rounded-t-sm bg-emerald-500 transition-all group-hover:brightness-110"
                        style={{ height: `${(col.resolved / 200) * 100}%` }}
                        title={`Resolved: ${col.resolved}`}
                      />
                      {/* Open Bar */}
                      <div
                        className="w-2 sm:w-2.5 rounded-t-sm bg-amber-400 transition-all group-hover:brightness-110"
                        style={{ height: `${(col.open / 200) * 100}%` }}
                        title={`Open: ${col.open}`}
                      />
                      {/* Critical Bar */}
                      <div
                        className="w-2 sm:w-2.5 rounded-t-sm bg-rose-500 transition-all group-hover:brightness-110"
                        style={{ height: `${(col.critical / 200) * 100}%` }}
                        title={`Critical: ${col.critical}`}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-1">{col.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Baseline: 200 Max</span>
              <span className="text-emerald-600 font-bold">Resolution Ratio: 78.4%</span>
            </div>
          </div>

          {/* Panel 3: Action Queue */}
          <div className="rounded-3xl border border-white/80 bg-white/75 backdrop-blur-2xl p-6 shadow-[0_8px_32px_rgba(31,38,135,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <h2 className="text-sm font-extrabold text-slate-900">Action Queue</h2>
                <button
                  type="button"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View All Actions</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Search filter within queue */}
              <div className="relative mb-3">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter actions or store..."
                  className="w-full rounded-xl border border-slate-200/80 bg-white/80 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-blue-400"
                />
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="pb-2">Issue</th>
                      <th className="pb-2">Store</th>
                      <th className="pb-2">Priority</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredQueue.map((act) => (
                      <tr
                        key={act.id}
                        onClick={() => setActiveAction(act)}
                        className="group hover:bg-white/80 transition-colors cursor-pointer"
                      >
                        <td className="py-2 pr-2">
                          <span className="font-bold text-slate-800 block truncate max-w-[130px] group-hover:text-blue-600">
                            {act.issue}
                          </span>
                          <span className="text-[10px] text-slate-400">{act.sector}</span>
                        </td>
                        <td className="py-2 text-slate-600 font-semibold">{act.store}</td>
                        <td className="py-2">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                              act.priority === "High"
                                ? "text-rose-600"
                                : act.priority === "Medium"
                                ? "text-amber-600"
                                : "text-blue-600"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                act.priority === "High"
                                  ? "bg-rose-500"
                                  : act.priority === "Medium"
                                  ? "bg-amber-500"
                                  : "bg-blue-500"
                              }`}
                            />
                            {act.priority}
                          </span>
                        </td>
                        <td className="py-2 text-right">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              act.status === "In Progress"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : act.status === "Assigned"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {act.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between font-medium">
              <span>{filteredQueue.length} items in current queue</span>
              <span>Due window: 48h</span>
            </div>
          </div>
        </section>
      </main>

      {/* ── Slide-over Drawer for Issue Details ── */}
      {(activeSignal || activeAction) && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-xs"
          onClick={() => {
            setActiveSignal(null);
            setActiveAction(null);
          }}
        >
          <div
            className="h-full w-full max-w-md bg-white/95 backdrop-blur-2xl p-6 shadow-2xl border-l border-white/80 overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                  Issue Investigation
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  {activeSignal?.title || activeAction?.issue}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveSignal(null);
                  setActiveAction(null);
                }}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="text-slate-400 block font-medium">Store</span>
                  <strong className="text-sm font-bold text-slate-800">
                    {activeSignal?.store || activeAction?.store}
                  </strong>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="text-slate-400 block font-medium">Sector</span>
                  <strong className="text-sm font-bold text-slate-800">
                    {activeSignal?.sector || activeAction?.sector}
                  </strong>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-slate-400 block font-medium">Assigned Owner</span>
                <strong className="text-sm font-bold text-slate-800">
                  {activeSignal?.owner || activeAction?.owner}
                </strong>
              </div>

              {activeSignal?.evidence && (
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Recorded Incident Evidence
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{activeSignal.evidence}</p>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setExportNotice("Action assigned to store lead.");
                    setActiveSignal(null);
                    setActiveAction(null);
                  }}
                  className="w-full rounded-xl bg-blue-600 py-2.5 font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  Confirm & Assign Store Lead
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExportNotice("Issue escalated to district manager.");
                    setActiveSignal(null);
                    setActiveAction(null);
                  }}
                  className="w-full rounded-xl border border-rose-200 bg-rose-50 py-2.5 font-bold text-rose-700 hover:bg-rose-100"
                >
                  Escalate Incident
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTOR-WISE EXECUTIVE AUDIT & EXPENSE REPORT DIALOG (PDF PREVIEW & DOWNLOAD) ── */}
      <SectorReportDialog
        open={sectorReportOpen}
        onOpenChange={setSectorReportOpen}
        initialSector={activeReportSector}
      />
    </div>
  );
}

export default AdminDashboardPage;
