import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/opsight/DashboardHeader";
import { MegaReportDialog } from "@/components/opsight/MegaReportDialog";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock,
  CreditCard,
  Download,
  FileText,
  Filter,
  Flame,
  Haze,
  HelpCircle,
  Layers,
  Lightbulb,
  MessageSquare,
  Package,
  Printer,
  Radio,
  Search,
  Send,
  Share2,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/app-dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Voice-of-Store Engine — Retail Intelligence Platform" },
      {
        name: "description",
        content:
          "Turn customer feedback into early warnings, clear operational ownership, and measurable store improvements.",
      },
      { property: "og:title", content: "Voice-of-Store Engine — Retail Intelligence Platform" },
      {
        property: "og:description",
        content:
          "Turn customer feedback and store reports into prioritized actions and emerging risk detection.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VoiceOfStoreEngineDashboard,
});

/* ─── Data Definitions ─── */
type TimeWindow = "Daily" | "Weekly" | "Monthly";
type Region = "All Regions" | "North Region" | "South Region" | "West Region" | "East Region";

interface FeedbackCategory {
  id: string;
  name: string;
  icon: typeof MessageSquare;
  count: Record<TimeWindow, number>;
  trend: Record<TimeWindow, string>;
  isUp: boolean;
  status: string;
  color: string;
  bgTone: string;
  borderTone: string;
  accentHex: string;
  connectedSectors: string[];
}

interface SectorItem {
  id: string;
  name: string;
  icon: typeof Store;
  count: Record<TimeWindow, number>;
  trend: Record<TimeWindow, string>;
  isUp: boolean;
  color: string;
  bgTone: string;
  health: number;
}

const FEEDBACK_CATEGORIES: FeedbackCategory[] = [
  {
    id: "prod-quality",
    name: "Product Quality Issues",
    icon: Flame,
    count: { Daily: 9, Weekly: 48, Monthly: 194 },
    trend: { Daily: "+12%", Weekly: "+32% vs. last week", Monthly: "+28% vs. last month" },
    isUp: true,
    status: "Escalated",
    color: "text-rose-600",
    bgTone: "bg-rose-50",
    borderTone: "border-rose-200",
    accentHex: "#f43f5e",
    connectedSectors: ["store-ops", "hygiene-safety"],
  },
  {
    id: "stock-avail",
    name: "Stock & Availability Issues",
    icon: Package,
    count: { Daily: 7, Weekly: 36, Monthly: 142 },
    trend: { Daily: "+8%", Weekly: "+18% vs. last week", Monthly: "+15% vs. last month" },
    isUp: true,
    status: "Monitoring",
    color: "text-amber-600",
    bgTone: "bg-amber-50",
    borderTone: "border-amber-200",
    accentHex: "#f59e0b",
    connectedSectors: ["inventory-supply", "clothing-merch"],
  },
  {
    id: "service-staff",
    name: "Service & Staff Feedback",
    icon: ShieldCheck,
    count: { Daily: 4, Weekly: 22, Monthly: 88 },
    trend: { Daily: "+3%", Weekly: "+9% vs. last week", Monthly: "+7% vs. last month" },
    isUp: true,
    status: "Normal",
    color: "text-emerald-600",
    bgTone: "bg-emerald-50",
    borderTone: "border-emerald-200",
    accentHex: "#10b981",
    connectedSectors: ["cx-hr", "billing-digital"],
  },
  {
    id: "cx-other",
    name: "Customer Experience & Other",
    icon: User,
    count: { Daily: 3, Weekly: 15, Monthly: 61 },
    trend: { Daily: "+1%", Weekly: "+6% vs. last week", Monthly: "+4% vs. last month" },
    isUp: true,
    status: "Stable",
    color: "text-purple-600",
    bgTone: "bg-purple-50",
    borderTone: "border-purple-200",
    accentHex: "#8b5cf6",
    connectedSectors: ["store-ops", "maint-equip"],
  },
];

const OPERATIONAL_SECTORS: SectorItem[] = [
  {
    id: "store-ops",
    name: "Store Operations",
    icon: Store,
    count: { Daily: 8, Weekly: 42, Monthly: 168 },
    trend: { Daily: "+5%", Weekly: "+12%", Monthly: "+10%" },
    isUp: true,
    color: "text-blue-600",
    bgTone: "bg-blue-50",
    health: 86,
  },
  {
    id: "clothing-merch",
    name: "Clothing & Merchandising",
    icon: Shirt,
    count: { Daily: 6, Weekly: 31, Monthly: 124 },
    trend: { Daily: "+4%", Weekly: "+9%", Monthly: "+8%" },
    isUp: true,
    color: "text-purple-600",
    bgTone: "bg-purple-50",
    health: 91,
  },
  {
    id: "maint-equip",
    name: "Maintenance & Equipment",
    icon: Wrench,
    count: { Daily: 11, Weekly: 56, Monthly: 218 },
    trend: { Daily: "+8%", Weekly: "+18%", Monthly: "+14%" },
    isUp: true,
    color: "text-amber-600",
    bgTone: "bg-amber-50",
    health: 79,
  },
  {
    id: "inventory-supply",
    name: "Inventory & Supply Chain",
    icon: Package,
    count: { Daily: 9, Weekly: 48, Monthly: 186 },
    trend: { Daily: "+2%", Weekly: "+6%", Monthly: "+5%" },
    isUp: true,
    color: "text-cyan-600",
    bgTone: "bg-cyan-50",
    health: 94,
  },
  {
    id: "hygiene-safety",
    name: "Hygiene & Safety",
    icon: ShieldAlert,
    count: { Daily: 4, Weekly: 19, Monthly: 76 },
    trend: { Daily: "+5%", Weekly: "+12%", Monthly: "+11%" },
    isUp: true,
    color: "text-rose-600",
    bgTone: "bg-rose-50",
    health: 84,
  },
  {
    id: "billing-digital",
    name: "Billing & Digital",
    icon: CreditCard,
    count: { Daily: 7, Weekly: 37, Monthly: 148 },
    trend: { Daily: "+3%", Weekly: "+8%", Monthly: "+7%" },
    isUp: true,
    color: "text-blue-600",
    bgTone: "bg-blue-50",
    health: 89,
  },
  {
    id: "cx-hr",
    name: "Customer Experience & HR",
    icon: Users,
    count: { Daily: 10, Weekly: 53, Monthly: 212 },
    trend: { Daily: "+4%", Weekly: "+11%", Monthly: "+9%" },
    isUp: true,
    color: "text-violet-600",
    bgTone: "bg-violet-50",
    health: 92,
  },
];

const QUICK_INSIGHTS = [
  {
    title: "Rising trend in equipment downtime",
    subtitle: "Maintenance • 3 stores",
    trend: "+18%",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
    icon: AlertTriangle,
    sparkColor: "#f43f5e",
    points: "0,16 10,14 20,18 30,12 40,15 50,9 60,13 70,7 80,11 90,5 100,2",
  },
  {
    title: "Low stock alerts increasing",
    subtitle: "Inventory • 5 stores",
    trend: "+12%",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    icon: Package,
    sparkColor: "#f59e0b",
    points: "0,18 10,16 20,17 30,14 40,15 50,11 60,13 70,9 80,10 90,6 100,4",
  },
  {
    title: "Customer service delays",
    subtitle: "Customer Experience • 4 stores",
    trend: "+9%",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    icon: Clock,
    sparkColor: "#10b981",
    points: "0,16 10,18 20,15 30,17 40,12 50,14 60,11 70,12 80,8 90,10 100,5",
  },
  {
    title: "Staff shortages - peak hours",
    subtitle: "HR • 3 stores",
    trend: "+7%",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    icon: Users,
    sparkColor: "#8b5cf6",
    points: "0,19 10,17 20,18 30,15 40,16 50,13 60,14 70,10 80,11 90,8 100,6",
  },
];

const ATTENTION_ISSUES = [
  {
    id: "ISSUE-101",
    issue: "Long queue at checkout (peak hours)",
    severity: "High",
    store: "Phoenix Mall",
    owner: "Store Operations",
    action: "Investigate",
    sevTone: "bg-amber-50 text-amber-700 border-amber-200",
    category: "Customer Experience",
    feedback: "Customers reported waiting over 22 minutes at checkout counter 3 and 4 between 1 PM and 3 PM.",
    evidenceCount: 14,
  },
  {
    id: "ISSUE-102",
    issue: "Dairy section stockout (milk available)",
    severity: "Medium",
    store: "Bangalore Central",
    owner: "Inventory",
    action: "Replenish",
    sevTone: "bg-amber-50 text-amber-700 border-amber-200",
    category: "Inventory",
    feedback: "Toned milk cartons were unstocked on front shelves while stockroom inventory showed 48 cartons present.",
    evidenceCount: 8,
  },
  {
    id: "ISSUE-103",
    issue: "Restroom cleanliness issue",
    severity: "Medium",
    store: "Delhi NCR",
    owner: "Facilities",
    action: "Resolve",
    sevTone: "bg-amber-50 text-amber-700 border-amber-200",
    category: "Hygiene & Safety",
    feedback: "Repeated customer remarks about wet flooring and sanitization dispenser empty near aisle 4 restrooms.",
    evidenceCount: 6,
  },
  {
    id: "ISSUE-104",
    issue: "Customer complaint - billing error",
    severity: "High",
    store: "Mumbai West",
    owner: "IT / Digital",
    action: "Investigate",
    sevTone: "bg-rose-50 text-rose-700 border-rose-200",
    category: "Billing & Digital",
    feedback: "POS register 2 scanned promotional 2-for-1 beverage item as full price. Cashier required manual override.",
    evidenceCount: 11,
  },
  {
    id: "ISSUE-105",
    issue: "Equipment downtime (AC)",
    severity: "Medium",
    store: "Chennai Central",
    owner: "Maintenance",
    action: "Assign",
    sevTone: "bg-amber-50 text-amber-700 border-amber-200",
    category: "Maintenance",
    feedback: "HVAC cooling unit B2 in dairy produce aisle blowing warm air since 11:30 AM.",
    evidenceCount: 5,
  },
];

const EMERGENCY_INCIDENTS = [
  {
    id: "EMG-001",
    title: "Allergen label mismatch on prepared bakery SKU",
    store: "Store 042 (Bangalore Central)",
    category: "Food Safety & Compliance",
    severity: "Critical",
    timestamp: "18 mins ago",
    evidence: "Batch #B-883 almond cake labeled as nut-free on exterior packaging.",
    owner: "Quality Assurance Lead",
    status: "Escalated",
  },
  {
    id: "EMG-002",
    title: "Freezer cold-chain temperature spike to +4°C",
    store: "Store 018 (Phoenix Mall)",
    category: "Maintenance & Cold Chain",
    severity: "Critical",
    timestamp: "42 mins ago",
    evidence: "Deep freezer unit C4 compressor defrost cycle timeout exceeded by 90 minutes.",
    owner: "Facilities Director",
    status: "Investigating",
  },
  {
    id: "EMG-003",
    title: "Repeated double-charge POS scan discrepancy",
    store: "Store 027 (Mumbai West)",
    category: "Billing & Cashier",
    severity: "High",
    timestamp: "1 hr ago",
    evidence: "Register 2 automated optical scanner duplicated carton barcodes across 4 transactions.",
    owner: "Store General Manager",
    status: "Pending Review",
  },
];

const OWNERSHIP_DATA = [
  { function: "Store Operations", issues: 18, status: "In Progress", tone: "bg-blue-50 text-blue-700 border-blue-200" },
  { function: "Supply Chain", issues: 12, status: "In Progress", tone: "bg-blue-50 text-blue-700 border-blue-200" },
  { function: "Maintenance", issues: 9, status: "At Risk", tone: "bg-amber-50 text-amber-700 border-amber-200" },
  { function: "HSE / Safety", issues: 7, status: "Open", tone: "bg-rose-50 text-rose-700 border-rose-200" },
  { function: "IT / Digital", issues: 5, status: "Resolved", tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { function: "Merchandising", issues: 4, status: "In Progress", tone: "bg-blue-50 text-blue-700 border-blue-200" },
  { function: "HR", issues: 3, status: "Open", tone: "bg-rose-50 text-rose-700 border-rose-200" },
];

interface RepairExpenseItem {
  id: string;
  asset: string;
  store: string;
  sector: string;
  issueCode: string;
  workDone: string;
  technicianHours: number;
  partsCost: number;
  laborCost: number;
  totalCost: number;
  severity: "Critical" | "High" | "Medium";
  status: "Completed" | "In Progress" | "Scheduled";
}

const REPAIR_EXPENSES: RepairExpenseItem[] = [
  {
    id: "REP-4201",
    asset: "Bakery Thermal Label Printer #B2",
    store: "Store 042 (Westlake Metro)",
    sector: "Food Safety & Compliance",
    issueCode: "INC-FS-042",
    workDone: "Replaced thermal printhead, loaded FSMA allergen bold schema, recalibrated optical sensor.",
    technicianHours: 2.5,
    partsCost: 180,
    laborCost: 200,
    totalCost: 380,
    severity: "Critical",
    status: "Completed",
  },
  {
    id: "REP-1802",
    asset: "Walk-in Freezer Unit C4 Defrost Solenoid Relay",
    store: "Store 018 (Riverside Galleria)",
    sector: "Store Operations & Cold Chain",
    issueCode: "INC-CC-018",
    workDone: "Installed replacement defrost relay assembly, topped up R448A refrigerant, continuous cycle test.",
    technicianHours: 5.5,
    partsCost: 480,
    laborCost: 440,
    totalCost: 920,
    severity: "High",
    status: "Scheduled",
  },
  {
    id: "REP-2703",
    asset: "POS Register 04 Switch Port & Optical Scanner",
    store: "Store 027 (Oakridge Plaza)",
    sector: "Front-End & Checkout",
    issueCode: "INC-IT-042",
    workDone: "Re-routed Cat6 STP cabling, replaced damaged RJ45 patch cord, reconfigured VLAN 40 switch port.",
    technicianHours: 3.5,
    partsCost: 290,
    laborCost: 350,
    totalCost: 640,
    severity: "High",
    status: "Completed",
  },
  {
    id: "REP-1804",
    asset: "Produce HVAC Chiller Unit B2 Ventilation Fan Assembly",
    store: "Store 018 (Riverside Galleria)",
    sector: "Facilities Maintenance",
    issueCode: "ISSUE-105",
    workDone: "Replaced worn bearing assembly on secondary condenser fan, flushed condensate drain line.",
    technicianHours: 7.0,
    partsCost: 980,
    laborCost: 870,
    totalCost: 1850,
    severity: "Medium",
    status: "In Progress",
  },
  {
    id: "REP-0905",
    asset: "Dairy Aisle 4 Floor Spill Rapid Containment & Wet-Vac",
    store: "Store 009 (Downtown Promenade)",
    sector: "Custodial & Safety",
    issueCode: "INC-SF-009",
    workDone: "Dispatched commercial wet-vac and anti-slip absorbent compound; deployed perimeter safety cones.",
    technicianHours: 1.0,
    partsCost: 95,
    laborCost: 80,
    totalCost: 175,
    severity: "Medium",
    status: "Completed",
  },
];

function VoiceOfStoreEngineDashboard() {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("Weekly");
  const [region, setRegion] = useState<Region>("All Regions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [energyFeedbackOpen, setEnergyFeedbackOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const activeCategory = FEEDBACK_CATEGORIES.find((c) => c.id === selectedCategory) || null;
  const activeSector = OPERATIONAL_SECTORS.find((s) => s.id === selectedSector) || null;

  const handleExport = () => {
    setReportDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900 pb-16 relative">
      {/* Subtle crisp ambient background glow matching AI assistant page */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[450px] bg-gradient-to-b from-blue-50/25 via-white/50 to-white -z-10" />

      {/* ── Same Dashboard Header as AI Assistant Page ── */}
      <DashboardHeader active="app-dashboard" showControls={false} />

      {/* ── Operational Sub-Navbar for Voice-of-Store Controls ── */}
      <div className="sticky top-[61px] z-30 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-2.5 lg:px-12">
          {/* Section Indicator */}
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold tracking-tight text-slate-900 uppercase">
              Voice-of-Store Engine
            </span>
          </div>

          {/* Global Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md items-center gap-2.5 rounded-full border border-slate-200/90 bg-slate-50/70 px-4 py-1.5 text-xs focus-within:border-blue-400 focus-within:bg-white transition">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stores, issues, feedback, reports..."
              className="w-full bg-transparent outline-none placeholder:text-slate-400 text-slate-800 text-xs"
            />
          </div>

          {/* Filter Controls & Action Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Region Selector */}
            <div className="relative">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                className="appearance-none rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs outline-none pr-7 cursor-pointer hover:border-slate-300"
              >
                <option>All Regions</option>
                <option>North Region</option>
                <option>South Region</option>
                <option>West Region</option>
                <option>East Region</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Time Window Granularity Toggle */}
            <div className="hidden sm:flex items-center rounded-xl border border-slate-200/90 bg-slate-100/80 p-0.5 text-xs font-semibold">
              {(["Daily", "Weekly", "Monthly"] as TimeWindow[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTimeWindow(tab)}
                  className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
                    timeWindow === tab ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Energy Feedback Button */}
            <button
              type="button"
              onClick={() => setEnergyFeedbackOpen((prev) => !prev)}
              className="hidden lg:flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50/80 px-3 py-1.5 text-xs font-semibold text-sky-700 shadow-xs transition hover:bg-sky-100/80 cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 text-sky-600" />
              <span>Energy Feedback</span>
            </button>

            {/* Emergency Alert Button with Notification Badge */}
            <button
              type="button"
              onClick={() => setEmergencyOpen(true)}
              className="relative flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/90 px-3 py-1.5 text-xs font-bold text-rose-700 shadow-xs transition hover:bg-rose-100 hover:shadow-sm cursor-pointer"
            >
              <Bell className="h-3.5 w-3.5 text-rose-600 animate-bounce" />
              <span>Emergency Alert</span>
              <span className="grid h-4 min-w-[1rem] place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-black text-white shadow-xs">
                3
              </span>
            </button>

            {/* Export Report Button */}
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-blue-500/25 transition hover:bg-blue-700 hover:shadow-md cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export notification toast */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl text-xs font-semibold text-slate-800 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* ── Main Container ── */}
      <main className="mx-auto max-w-[1600px] px-6 py-6 lg:px-12 space-y-6">
        {/* ── HERO & KEY METRICS SECTION ── */}
        <section className="grid gap-6 lg:grid-cols-[1.4fr_2.6fr] items-stretch">
          {/* Upper Left Headline */}
          <div className="flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 w-fit rounded-full bg-blue-100/70 border border-blue-200/80 px-3 py-0.5 text-xs font-bold text-blue-700 mb-3">
              <Sparkles className="h-3 w-3 text-blue-600" /> Retail Intelligence Platform
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              See every signal.
              <br />
              <span className="text-blue-600">Solve the right problem.</span>
            </h1>
            <p className="mt-3 text-sm text-slate-500 max-w-lg leading-relaxed">
              Turn customer feedback and store reports into prioritized actions, emerging-risk detection, and measurable
              operational improvements.
            </p>
          </div>

          {/* 4 Compact KPI Cards with Sparklines */}
          <div className="relative">
            <span className="absolute -top-3 right-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
              DEMO DATA
            </span>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 h-full">
              {/* 1. Feedback Analyzed */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
                    <MessageSquare className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> 12.4%
                  </span>
                </div>
                <div className="my-2">
                  <span className="text-xs font-semibold text-slate-500 block">Feedback Analyzed</span>
                  <strong className="text-2xl font-black text-slate-900 tracking-tight">12,840</strong>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>vs. last {timeWindow.toLowerCase()}</span>
                  <svg className="w-16 h-5 stroke-blue-500 fill-none stroke-2" viewBox="0 0 100 25">
                    <polyline points="0,20 15,18 30,22 45,14 60,16 75,9 90,12 100,4" />
                  </svg>
                </div>
              </div>

              {/* 2. Actionable Issues */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50 text-purple-600">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> 8.2%
                  </span>
                </div>
                <div className="my-2">
                  <span className="text-xs font-semibold text-slate-500 block">Actionable Issues</span>
                  <strong className="text-2xl font-black text-slate-900 tracking-tight">286</strong>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>vs. last {timeWindow.toLowerCase()}</span>
                  <svg className="w-16 h-5 stroke-purple-500 fill-none stroke-2" viewBox="0 0 100 25">
                    <polyline points="0,22 15,19 30,17 45,21 60,13 75,15 90,8 100,5" />
                  </svg>
                </div>
              </div>

              {/* 3. Critical Incidents */}
              <div className="rounded-2xl border border-rose-200/90 bg-rose-50/20 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-rose-100 text-rose-600">
                    <Bell className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-bold text-rose-600">⚠ needs review</span>
                </div>
                <div className="my-2">
                  <span className="text-xs font-semibold text-slate-500 block">Critical Incidents</span>
                  <strong className="text-2xl font-black text-rose-600 tracking-tight">7</strong>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>high priority</span>
                  <svg className="w-16 h-5 stroke-rose-500 fill-none stroke-2" viewBox="0 0 100 25">
                    <polyline points="0,15 15,19 30,12 45,18 60,11 75,17 90,9 100,5" />
                  </svg>
                </div>
              </div>

              {/* 4. Open Actions */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ClipboardCheck className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> 2.0%
                  </span>
                </div>
                <div className="my-2">
                  <span className="text-xs font-semibold text-slate-500 block">Open Actions</span>
                  <strong className="text-2xl font-black text-slate-900 tracking-tight">64</strong>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>assigned to teams</span>
                  <svg className="w-16 h-5 stroke-emerald-500 fill-none stroke-2" viewBox="0 0 100 25">
                    <polyline points="0,21 15,17 30,19 45,13 60,16 75,10 90,8 100,6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN FEATURE: FEEDBACK-TO-SECTOR CONNECTION MAP & QUICK INSIGHTS ── */}
        <section className="grid gap-6 xl:grid-cols-[2.8fr_1.1fr] items-start">
          {/* Connection Map Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm relative overflow-hidden">
            {/* Header titles */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <MessageSquare className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Customer Feedback & Issue Sources</h2>
                  <p className="text-[11px] text-slate-400">Real feedback from stores, customers and reports</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Activity className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Operational Sectors</h3>
                  <p className="text-[11px] text-slate-400">Issues mapped to responsible store teams</p>
                </div>
              </div>
            </div>

            {/* Visual Relationship Grid: Left Feedback Cards -> Center Hub -> Right Sectors */}
            <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] items-center relative">
              {/* ── Left Feedback Cards (4 items) ── */}
              <div className="space-y-3 z-10">
                {FEEDBACK_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                      className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 cursor-pointer shadow-xs flex items-center gap-3.5 ${
                        isSelected
                          ? `border-blue-500 bg-white ring-2 ring-blue-400/20 shadow-md`
                          : `border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs`
                      }`}
                    >
                      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${cat.bgTone} ${cat.color}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-extrabold text-slate-900 truncate">{cat.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <strong className="text-sm font-black text-slate-800">{cat.count[timeWindow]}</strong>
                          <span className="text-[11px] font-medium text-slate-400">feedbacks</span>
                          <span className="text-[10px] font-semibold text-emerald-600">{cat.trend[timeWindow]}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    </button>
                  );
                })}
              </div>

              {/* ── Center: Retail Intelligence Hub ── */}
              <div className="flex flex-col items-center justify-center p-4 my-auto relative z-10">
                {/* Connecting SVG Curves Overlay between Cards, Hub & Sectors (Visible on desktop) */}
                <div className="relative flex flex-col items-center justify-center">
                  {/* Decorative concentric rings */}
                  <div className="w-48 h-48 rounded-full border border-blue-200/70 border-dashed animate-[spin_120s_linear_infinite] absolute inset-0 m-auto pointer-events-none" />
                  <div className="w-40 h-40 rounded-full border border-blue-300/40 absolute inset-0 m-auto pointer-events-none" />
                  <div className="w-32 h-32 rounded-full bg-blue-500/10 blur-xl absolute inset-0 m-auto pointer-events-none" />

                  {/* Central Hub Core */}
                  <div className="w-28 h-28 rounded-full bg-white border border-blue-200 shadow-xl shadow-blue-500/15 flex flex-col items-center justify-center text-center p-2 relative z-10 transition hover:scale-105">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-500/30 mb-1">
                      <Store className="h-5 w-5" />
                    </span>
                    <strong className="text-xs font-black text-slate-900 leading-tight">Retail Intelligence</strong>
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 border border-blue-200">
                      Live • {timeWindow}
                    </span>
                  </div>
                </div>

                <span className="mt-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  Auto Routing & Triage
                </span>
              </div>

              {/* ── Right Operational Sectors (7 rows) ── */}
              <div className="space-y-2 z-10">
                {OPERATIONAL_SECTORS.map((sec) => {
                  const isSelected = selectedSector === sec.id;
                  const Icon = sec.icon;
                  const isMapped =
                    !selectedCategory ||
                    activeCategory?.connectedSectors.includes(sec.id);

                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setSelectedSector(isSelected ? null : sec.id)}
                      className={`w-full text-left rounded-xl border px-3.5 py-2.5 transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? `border-blue-500 bg-white ring-2 ring-blue-400/20 shadow-sm`
                          : isMapped
                          ? `border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs`
                          : `border-slate-100 bg-slate-50/40 opacity-40 hover:opacity-80`
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${sec.bgTone} ${sec.color}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">{sec.name}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-black text-slate-800">{sec.count[timeWindow]} issues</span>
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                          <ArrowUpRight className="h-3 w-3 mr-0.5" /> {sec.trend[timeWindow]}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Insights Right Panel */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-50 text-amber-600">
                  <Lightbulb className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-extrabold text-slate-900">Quick Insights</h3>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-3">
              {QUICK_INSIGHTS.map((ins, idx) => {
                const Icon = ins.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-100 p-3.5 hover:border-slate-200 hover:shadow-sm transition bg-slate-50/40"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${ins.bg} ${ins.color}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <strong className="block text-xs font-bold text-slate-900 leading-snug">{ins.title}</strong>
                        <span className="block text-[11px] text-slate-400 mt-0.5">{ins.subtitle}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]">
                      <span className="font-bold text-rose-600 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> {ins.trend}
                      </span>
                      <svg className="w-20 h-4 stroke-slate-400 fill-none stroke-2" viewBox="0 0 100 20">
                        <polyline points={ins.points} stroke={ins.sparkColor} />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── BOTTOM DASHBOARD: 3 CLEAN, WELL-PROPORTIONED PANELS ── */}
        <section className="grid gap-6 lg:grid-cols-3 items-start">
          {/* A. Needs Attention Now */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-rose-50 text-rose-600">
                    <AlertCircle className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Needs Attention Now</h3>
                    <p className="text-[10px] text-slate-400">Issues requiring immediate attention</p>
                  </div>
                </div>
                <button type="button" className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
                  View all →
                </button>
              </div>

              <div className="space-y-2.5">
                {ATTENTION_ISSUES.map((row) => (
                  <div
                    key={row.id}
                    onClick={() => setSelectedIssue(row)}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-white hover:border-slate-200 hover:shadow-xs transition cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <strong className="block font-bold text-slate-900 truncate">{row.issue}</strong>
                      <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                        {row.store} • {row.owner}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${row.sevTone}`}>
                        {row.severity}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIssue(row);
                        }}
                        className="rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-100 transition"
                      >
                        {row.action} &gt;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* B. Operational Impact */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-blue-600">
                    <BarChart3 className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Operational Impact</h3>
                    <p className="text-[10px] text-slate-400">Estimated cost impact (demo estimates)</p>
                  </div>
                </div>
                <button type="button" className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
                  View details →
                </button>
              </div>

              {/* Vertical Bar Chart */}
              <div className="h-48 flex items-end justify-between gap-3 px-2 pt-4">
                {[
                  { label: "Inventory Losses", val: "$12.4K", height: "85%", color: "bg-blue-600" },
                  { label: "Maintenance", val: "$8.7K", height: "60%", color: "bg-blue-500" },
                  { label: "Labor", val: "$5.2K", height: "38%", color: "bg-blue-400" },
                  { label: "Customer Refunds", val: "$3.1K", height: "24%", color: "bg-blue-300" },
                  { label: "Other", val: "$1.8K", height: "14%", color: "bg-blue-200" },
                ].map((col) => (
                  <div key={col.label} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[11px] font-black text-slate-800">{col.val}</span>
                    <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden h-32 flex items-end">
                      <div className={`w-full ${col.color} rounded-t-lg transition-all duration-500`} style={{ height: col.height }} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 text-center truncate w-full">
                      {col.label.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium text-slate-500 border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Actual Cost
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-300" /> Estimated / Potential
                </span>
              </div>
            </div>
          </div>

          {/* C. Ownership & Escalation */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Users className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Ownership & Escalation</h3>
                    <p className="text-[10px] text-slate-400">Assigned function and status</p>
                  </div>
                </div>
                <button type="button" className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
                  View all →
                </button>
              </div>

              <div className="space-y-2">
                {OWNERSHIP_DATA.map((row) => (
                  <div
                    key={row.function}
                    className="flex items-center justify-between rounded-xl p-2 hover:bg-slate-50 transition text-xs"
                  >
                    <span className="font-semibold text-slate-800">{row.function}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-600">{row.issues}</span>
                      <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${row.tone}`}>
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── EMERGENCY ALERT MODAL ── */}
      {emergencyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md animate-in fade-in"
          role="dialog"
          onClick={() => setEmergencyOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-rose-200 bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-100 text-rose-600">
                  <AlertCircle className="h-5 w-5 animate-pulse" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Active Emergency Incidents (3)</h3>
                  <p className="text-xs text-rose-600 font-semibold">Immediate operational intervention required</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmergencyOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {EMERGENCY_INCIDENTS.map((inc) => (
                <div key={inc.id} className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{inc.title}</span>
                    <span className="rounded-md border border-rose-300 bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-700">
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-rose-100">
                    {inc.evidence}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                    <span>
                      {inc.store} • <strong>{inc.owner}</strong> • {inc.timestamp}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => alert(`Acknowledged ${inc.id}`)}
                        className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-slate-700 font-semibold hover:bg-slate-50"
                      >
                        Acknowledge
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`Escalated ${inc.id} to Regional Leadership.`)}
                        className="rounded-lg bg-rose-600 px-2.5 py-1 text-white font-semibold hover:bg-rose-700 shadow-xs"
                      >
                        Escalate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEmergencyOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ISSUE INVESTIGATION SIDE DRAWER ── */}
      {selectedIssue && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/30 backdrop-blur-xs"
          role="dialog"
          onClick={() => setSelectedIssue(null)}
        >
          <div
            className="h-full w-full max-w-md bg-white border-l border-slate-200 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  {selectedIssue.id}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedIssue(null)}
                  className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h3 className="mt-4 text-xl font-extrabold text-slate-900">{selectedIssue.issue}</h3>
              <div className="mt-2 flex items-center gap-2">
                <span className={`rounded-md border px-2 py-0.5 text-xs font-bold ${selectedIssue.sevTone}`}>
                  {selectedIssue.severity}
                </span>
                <span className="text-xs text-slate-500">
                  {selectedIssue.store} • {selectedIssue.owner}
                </span>
              </div>

              <div className="mt-6 space-y-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Original Feedback</span>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-slate-700 leading-relaxed">
                    "{selectedIssue.feedback}"
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 p-3 space-y-2 bg-slate-50/50">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Classification Sector:</span>
                    <strong className="text-slate-800">{selectedIssue.category}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Evidence Count:</span>
                    <strong className="text-slate-800">{selectedIssue.evidenceCount} verified reports</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <strong className="text-blue-600">Pending Resolution</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  alert(`Action dispatched for ${selectedIssue.id}. Assigned to ${selectedIssue.owner}.`);
                  setSelectedIssue(null);
                }}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
              >
                Execute Action ({selectedIssue.action})
              </button>
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ENERGY FEEDBACK MODAL ── */}
      {energyFeedbackOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-md"
          role="dialog"
          onClick={() => setEnergyFeedbackOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-sky-200 bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-50 text-sky-600">
                  <Zap className="h-5 w-5" />
                </span>
                <h3 className="text-base font-extrabold text-slate-900">Energy & Cold Storage Feedback</h3>
              </div>
              <button
                type="button"
                onClick={() => setEnergyFeedbackOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Correlating customer store comfort remarks with real-time chiller and HVAC thermostat telemetry.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-slate-400 block">Avg Chiller Temp</span>
                <strong className="text-lg font-black text-slate-900">-18.4°C</strong>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">✓ Nominal</span>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-slate-400 block">HVAC Power Load</span>
                <strong className="text-lg font-black text-slate-900">142 kW/h</strong>
                <span className="text-[10px] text-amber-600 font-bold block mt-1">⚠ +4.2% vs budget</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEnergyFeedbackOpen(false)}
              className="w-full rounded-xl bg-sky-600 py-2.5 text-xs font-bold text-white hover:bg-sky-700"
            >
              Close Telemetry View
            </button>
          </div>
        </div>
      )}
      {/* ── MEGA EXECUTIVE INTELLIGENCE & OPERATIONAL EXPENSE REPORT DIALOG (PDF PREVIEW & DOWNLOAD) ── */}
      <MegaReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        defaultTimeWindow={timeWindow}
        defaultRegion={region}
      />
    </div>
  );
}
