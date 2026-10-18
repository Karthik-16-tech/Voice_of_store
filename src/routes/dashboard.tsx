import { createFileRoute } from "@tanstack/react-router";
import { createElement, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Info,
  Layers,
  Lightbulb,
  MessageSquareText,
  Mic,
  RefreshCw,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { DashboardHeader } from "@/components/opsight/DashboardHeader";
import { MegaReportDialog } from "@/components/opsight/MegaReportDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const SPLINE_URL = "https://prod.spline.design/DYcvzT0J6BN9qZFI/scene.splinecode";

const GEMINI_API_KEY =
  (import.meta.env["VITE_GEMINI_API_KEY"] as string) || "";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Voice of Store — AI Assistant" },
      {
        name: "description",
        content:
          "Investigate store incidents, spot emerging issues and track department sector health with Voice of Store AI Assistant.",
      },
      { property: "og:title", content: "Voice of Store — AI Assistant" },
      {
        property: "og:description",
        content:
          "Your intelligent operations copilot for store incidents and emerging issues.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VoiceOfStoreDashboard,
});

interface IncidentItem {
  id: string;
  code: string;
  title: string;
  fullTitle: string;
  store: string;
  dept: string;
  sev: string;
  status: string;
  ago: string;
  reporter: string;
  summary: string;
  rootCause: string;
  impact: string;
  regulatoryRisk: string;
  containmentSteps: string[];
  timeline: { time: string; event: string }[];
  metrics: { label: string; value: string; tone?: "critical" | "warning" | "success" }[];
  icon: any;
  tone: "critical" | "high" | "primary";
}

const PRIMARY_ISSUES: IncidentItem[] = [
  {
    id: "issue-1",
    code: "INC-FS-042",
    title: "Allergen label mismatch",
    fullTitle: "Allergen label mismatch on prepared bakery SKU",
    store: "Store 042 - Westlake Metro",
    dept: "Food Safety & Compliance",
    sev: "Critical",
    status: "Escalated",
    ago: "2 hours ago",
    reporter: "Sarah Jenkins (Quality & Safety Auditor)",
    summary:
      "Customer report identified misprinted allergen declaration labels on in-store prepared bakery batch #B-882 (Almond Croissants & Scones). The front-facing warning tags lacked the mandatory bold tree-nut allergen disclosure.",
    rootCause:
      "Thermal label printer #B2 at bakery prep station received an outdated SKU label schema during morning sync, omitting the bold tree-nut warning declaration.",
    impact:
      "Immediate customer health hazard (severe tree-nut allergic reaction risk). 36 suspect pastry units were prepared and placed on floor display.",
    regulatoryRisk:
      "High FDA / State Department of Agriculture FSMA non-compliance exposure with a potential $18,500 citation if uncontained.",
    containmentSteps: [
      "36 suspect bakery batches immediately quarantined and pulled from sales floor display.",
      "Automated SKU barcode lock dispatched to all 8 POS register terminals to block customer scanning.",
      "Mandatory double-verification protocol activated for all packaged deli and bakery SKU batches.",
      "Printer #B2 firmware and master label compliance template updated and test-verified.",
    ],
    timeline: [
      { time: "11:24 AM", event: "Customer notice logged at customer service counter" },
      { time: "11:31 AM", event: "Bakery floor lead verified label omits almond allergen warning" },
      { time: "11:38 AM", event: "Voice of Store automated triage escalated priority to Critical (SEV-1)" },
      { time: "12:15 PM", event: "All 36 suspect units quarantined; barcode lock enforced at POS" },
      { time: "01:00 PM", event: "Double-verification protocol activated for all subsequent batches" },
    ],
    metrics: [
      { label: "Quarantined Units", value: "36 SKUs", tone: "critical" },
      { label: "POS Scan Lock", value: "100% Active", tone: "success" },
      { label: "Compliance Risk", value: "Mitigated", tone: "warning" },
    ],
    icon: AlertCircle,
    tone: "critical",
  },
  {
    id: "issue-2",
    code: "INC-CC-018",
    title: "Freezer temperature fluct...",
    fullTitle: "Freezer unit C4 temperature fluctuation",
    store: "Store 018 - Riverside Galleria",
    dept: "Store Operations / Cold Chain",
    sev: "High",
    status: "Investigating",
    ago: "4 hours ago",
    reporter: "IoT Cold-Chain Telemetry System",
    summary:
      "Walk-in freezer unit C4 telemetry sensor logged intermittent temperature spikes exceeding -10°C threshold during automatic defrost cycle.",
    rootCause:
      "Defrost heating element relay stuck in closed state for 18 minutes past scheduled cycle window, causing localized evaporator coil temperature spike.",
    impact:
      "Risk of premature thawing on frozen seafood and poultry inventory valued at $4,200.",
    regulatoryRisk:
      "HACCP compliance violation if internal product core temperature rises above -12°C for longer than 2 hours.",
    containmentSteps: [
      "Manual refrigeration override triggered from cloud console to force continuous cooling cycle.",
      "Product temperature probes placed into center-pallet ice packs to verify core temperature.",
      "Emergency HVAC technician service ticket dispatched for tonight's closing maintenance window.",
    ],
    timeline: [
      { time: "02:15 AM", event: "Telemetry sensor logged cycle latency spike to -8.2°C" },
      { time: "02:40 AM", event: "Automated alert notified night operations manager" },
      { time: "03:10 AM", event: "Emergency continuous chill cycle override activated" },
      { time: "04:30 AM", event: "Core temperature verified stable at -17.8°C" },
    ],
    metrics: [
      { label: "Current Temp", value: "-17.8°C", tone: "success" },
      { label: "Inventory at Risk", value: "$4,200", tone: "warning" },
      { label: "HACCP Status", value: "Compliant", tone: "success" },
    ],
    icon: AlertTriangle,
    tone: "high",
  },
  {
    id: "issue-3",
    code: "INC-POS-027",
    title: "Repeated billing discrepancy",
    fullTitle: "POS register lane barcode scanning latency & price mismatch",
    store: "Store 027 - Oakridge Plaza",
    dept: "Store Manager / Front End",
    sev: "Medium",
    status: "In Review",
    ago: "6 hours ago",
    reporter: "Marcus Vance (Front-End Floor Lead)",
    summary:
      "Multiple customer complaints regarding checkout price discrepancies on promotional dairy and produce items.",
    rootCause:
      "Weekly markdown promotion pricing failed to replicate to local store edge cache during morning network sync.",
    impact:
      "Customer checkout friction, 14-minute average line delay, $380 in manual cashier price overrides.",
    regulatoryRisk:
      "Weights & Measures scanner price accuracy audit exposure.",
    containmentSteps: [
      "Manual pricing table push dispatched from central inventory ERP to Store 027 edge cache.",
      "Cashiers notified of promotional discrepancy with temporary override clearance code.",
      "Auxiliary checkout lanes 5 & 6 opened to clear customer queue.",
    ],
    timeline: [
      { time: "08:15 AM", event: "First manual price override logged on Register 03" },
      { time: "09:00 AM", event: "Floor manager escalated pricing discrepancy pattern" },
      { time: "09:45 AM", event: "Central ERP cache sync pushed; prices aligned" },
    ],
    metrics: [
      { label: "Cashier Overrides", value: "28 tickets", tone: "warning" },
      { label: "Queue Clearance", value: "100% Normal", tone: "success" },
      { label: "Price Sync Status", value: "Synchronized", tone: "success" },
    ],
    icon: Info,
    tone: "primary",
  },
];

const ADDITIONAL_ISSUES: IncidentItem[] = [
  {
    id: "issue-4",
    code: "INC-SF-009",
    title: "Spill hazard near dairy aisle",
    fullTitle: "Liquid spill hazard near Dairy Aisle 4 display endcap",
    store: "Store 009 - Downtown Promenade",
    dept: "Custodial & Safety",
    sev: "Medium",
    status: "Assigned",
    ago: "1 hour ago",
    reporter: "Customer Service App Beacon",
    summary:
      "Dropped 1-gallon milk container created 12 sq ft slip hazard in high-traffic dairy aisle.",
    rootCause:
      "Accidental customer drop near refrigerated endcap; slippery tile surface.",
    impact:
      "Immediate customer slip and fall hazard; temporary corridor obstruction.",
    regulatoryRisk:
      "Premises liability / OSHA slip-and-fall incident exposure.",
    containmentSteps: [
      "Automated safety cone deployment alert sounded on staff floor walkies.",
      "Caution barriers placed around perimeter within 2 minutes of report.",
      "Custodial team dispatched with wet-vac and anti-slip absorbent compound.",
    ],
    timeline: [
      { time: "12:45 PM", event: "Spill detected and logged via floor beacon" },
      { time: "12:47 PM", event: "Caution barriers placed by dairy associate" },
      { time: "12:55 PM", event: "Floor cleaned, dried, and reopened for pedestrian traffic" },
    ],
    metrics: [
      { label: "Response Time", value: "1.8 mins", tone: "success" },
      { label: "Corridor Status", value: "Reopened", tone: "success" },
      { label: "Hazard Clearance", value: "100%", tone: "success" },
    ],
    icon: AlertTriangle,
    tone: "high",
  },
  {
    id: "issue-5",
    code: "INC-IT-042",
    title: "POS terminal 04 offline",
    fullTitle: "POS terminal 04 network gateway drop",
    store: "Store 042 - Westlake Metro",
    dept: "Checkout & Front End",
    sev: "High",
    status: "Dispatched",
    ago: "3 hours ago",
    reporter: "IT Helpdesk Automated Ping",
    summary:
      "POS Register 04 lost connectivity to payment processing switchboard during peak volume.",
    rootCause:
      "Ethernet switch port flapping on Front-End Switch #2 VLAN 40.",
    impact:
      "One checkout lane disabled during lunchtime peak, extending remaining lane queues by ~4 minutes.",
    regulatoryRisk:
      "PCI-DSS network compliance monitoring.",
    containmentSteps: [
      "Customer queue diverted to Register 05 and Self-Checkout banks.",
      "Network switch port bounced via remote cloud network console.",
      "Store IT technician dispatched to replace Cat6 patch cord.",
    ],
    timeline: [
      { time: "10:15 AM", event: "Terminal 04 heartbeat missed 3 consecutive pings" },
      { time: "10:18 AM", event: "Automated failover diverted pending transactions" },
      { time: "10:45 AM", event: "Technician re-patched switch port; diagnostic passed" },
    ],
    metrics: [
      { label: "Lane Uptime", value: "98.4%", tone: "success" },
      { label: "Traffic Diverted", value: "48 shoppers", tone: "warning" },
      { label: "Switch Port", value: "Healthy", tone: "success" },
    ],
    icon: AlertCircle,
    tone: "critical",
  },
];

const MANAGEMENT_FEEDBACK = [
  {
    role: "Front-End Floor Lead",
    store: "Store 027",
    status: "Resolved Action",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    time: "35m ago",
    highlight: "POS lane throughput up 14%",
    comment:
      "Auxiliary register lane opened during the 1 PM – 3 PM checkout peak. Repeated barcode scanning latency eliminated after firmware patch.",
  },
  {
    role: "Facilities & Cold-Chain Lead",
    store: "Store 018",
    status: "Maintenance Scheduled",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    time: "2h ago",
    highlight: "Defrost sensor recalibration needed",
    comment:
      "Thermostat sensor relay in unit C4 experienced cycle latency at 02:15 AM. Preventative technician visit assigned for tonight's closing window.",
  },
  {
    role: "Quality & Safety Auditor",
    store: "Store 042",
    status: "Protocol Enforced",
    statusColor: "bg-red-50 text-red-700 border-red-200",
    time: "3h ago",
    highlight: "Batch re-tagging complete",
    comment:
      "Bakery allergen labeling issue corrected. Mandatory double-verification protocol activated for all packaged deli and bakery SKU batches.",
  },
];

const SECTORS = [
  {
    name: "Food Safety & Compliance",
    score: 91,
    status: "1 Active Escalation",
    statusType: "critical",
    metric: "99.2% Temp Adherence",
    trend: "+2.4%",
    barColor: "bg-red-500",
  },
  {
    name: "Store Operations & Cold Chain",
    score: 84,
    status: "Monitoring Active",
    statusType: "warning",
    metric: "4 Units Monitored",
    trend: "-1.1%",
    barColor: "bg-amber-500",
  },
  {
    name: "Front End & Checkout",
    score: 89,
    status: "Normal Load",
    statusType: "normal",
    metric: "3.2m Avg Wait Time",
    trend: "+4.8%",
    barColor: "bg-blue-600",
  },
  {
    name: "Stockroom & Fulfillment",
    score: 96,
    status: "Restock on Track",
    statusType: "success",
    metric: "98.1% Shelf Fill Rate",
    trend: "+0.9%",
    barColor: "bg-emerald-500",
  },
];

function getExecutiveGreeting(): string {
  if (typeof window === "undefined") return "Good morning, Sir.";
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning, Sir.";
  if (hour < 17) return "Good afternoon, Sir.";
  return "Good evening, Sir.";
}

function getDefaultCopilotBriefing(): string {
  const greeting = getExecutiveGreeting();
  return `${greeting} Operations are running smooth across all 42 stores. Our sole critical focus is Store 042, where the bakery allergen mismatch is 100% quarantined with POS locks active.

Standing by for your instructions, Sir.`;
}

function Wave({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-[3px] ${className}`}>
      {[10, 18, 12, 20, 9].map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-current animate-pulse"
          style={{ height: h, animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

function SplineOrb() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!document.querySelector('script[data-spline="1"]')) {
      const s = document.createElement("script");
      s.type = "module";
      s.src = "https://cdn.spline.design/@splinetool/viewer@2.0.93/build/spline-viewer.js";
      s.dataset["spline"] = "1";
      document.head.appendChild(s);
    }
    setReady(true);

    const hideWatermark = () => {
      const viewer = document.querySelector("spline-viewer");
      const root = viewer?.shadowRoot;
      if (!root) return;
      root
        .querySelectorAll("#logo, .watermark, [data-watermark], a[href*='spline.design']")
        .forEach((el) => el.remove());
      if (!root.querySelector("style[data-no-watermark]")) {
        const st = document.createElement("style");
        st.dataset["noWatermark"] = "1";
        st.textContent =
          "#logo, .watermark, [data-watermark], a[href*='spline.design'] { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }";
        root.appendChild(st);
      }
    };

    const iv = setInterval(hideWatermark, 400);
    const stop = setTimeout(() => clearInterval(iv), 20000);
    return () => {
      clearInterval(iv);
      clearTimeout(stop);
    };
  }, []);

  if (ready) {
    return createElement("spline-viewer", {
      url: SPLINE_URL,
      style: { width: "100%", height: "100%" },
    });
  }
  return (
    <div className="h-[68%] w-[68%] rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 blur-sm animate-pulse" />
  );
}

// Direct Gemini API Caller using user's API Key
async function callGeminiAssistant(query: string): Promise<string> {
  const greeting = getExecutiveGreeting();
  const models = [
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
  ];
  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text: `You are Voice of Store AI, an exceptionally smart, friendly, and helpful AI assistant (like ChatGPT) for retail store operations.

MANDATORY GUIDELINES:
1. TALK LIKE CHATGPT: Be simple, natural, conversational, and highly effective. Get straight to the answer without fluff.
2. BREVITY: Answer in ONLY 2 TO 3 SHORT SENTENCES (under 45 words).
3. GREETING: Begin with "${greeting}" and address the user respectfully as "Sir".
4. SPOKEN CLARITY: Do NOT use markdown symbols, asterisks, bullet points, or lists. Output pure, clean conversational English that sounds warm and natural when spoken aloud.
5. CORE STORE FACTS (use only if relevant to the query):
- Store 042: Bakery allergen label mismatch is 100% contained, 36 units quarantined, barcode locked, zero compliance breach.
- Store 018: Walk-in freezer C4 is stable at -17.8°C with technician coming tonight.
- Store 027: POS switch port fixed; checkout queues cleared and running 14% faster.
- Store 009: Dairy aisle spill cleared in under 2 minutes.

Give a simple, clear, effective ChatGPT-style response now.`,
                },
              ],
            },
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: query,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return text
            .replace(/^(\*\*Voice of Store AI Copilot.*?\*\*[:\s]*)/i, "")
            .replace(/[*_#`•]/g, "")
            .trim();
        }
      }
    } catch (e) {
      console.warn(`Gemini call to ${model} failed, trying next:`, e);
    }
  }

  // Natural short human executive fallback if offline
  const qLower = query.toLowerCase();
  if (qLower.includes("feedback") || qLower.includes("last week") || qLower.includes("recent")) {
    return `${greeting} Front-end feedback is up 14% at Store 027 with latency resolved, Sir. Store 042's audit also confirmed zero customer exposure. Which store shall we look at?`;
  }
  if (qLower.includes("allergen") || qLower.includes("label") || qLower.includes("042")) {
    return `${greeting} Store 042 is completely under control, Sir. 36 suspect croissant units were quarantined and checkout barcode locks are enforced. Zero compliance risk remains.`;
  }
  if (qLower.includes("freezer") || qLower.includes("temperature") || qLower.includes("018")) {
    return `${greeting} Walk-in freezer C4 at Store 018 is steady at -17.8°C, Sir. Automated chill override engaged immediately, and maintenance arrives tonight.`;
  }
  return `${greeting} Store network operations are steady, Sir. Store 042 allergen containment is locked down with zero customer risk. What would you like to inspect?`;
}

function VoiceOfStoreDashboard() {
  const [voice, setVoice] = useState("");
  const [listening, setListening] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string>("issue-1");
  const [showAll, setShowAll] = useState(false);

  // Dialog State for "Needs Your Attention" detailed modal
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDetailIssue, setSelectedDetailIssue] = useState<IncidentItem | null>(null);

  // Voice Assistant Interactive AI State
  const [isThinking, setIsThinking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [lastAskedQuery, setLastAskedQuery] = useState<string>("");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const defaultBriefing = getDefaultCopilotBriefing();

  const recognitionRef = useRef<any>(null);

  // Speech synthesis helper with natural phrasing and premium voice selection
  const speakText = (text: string) => {
    if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Clean up markdown asterisks, bullet points, and formatting so it speaks fluently
      const cleanText = text
        .replace(/[*#_`]/g, "")
        .replace(/•/g, "")
        .replace(/\n+/g, ". ")
        .replace(/\s+/g, " ")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 600));
      utterance.rate = 1.02;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const executiveVoice =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Daniel") ||
              v.name.includes("Arthur"))
        ) ||
        voices.find((v) => v.lang.startsWith("en-US")) ||
        voices.find((v) => v.lang.startsWith("en"));

      if (executiveVoice) {
        utterance.voice = executiveVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Main voice assistant query dispatcher
  const askVoiceAssistant = async (queryText: string) => {
    const textToAsk = queryText.trim();
    if (!textToAsk || isThinking) return;

    setIsThinking(true);
    setLastAskedQuery(textToAsk);

    try {
      const reply = await callGeminiAssistant(textToAsk);
      setAiResponse(reply);
      speakText(reply);
    } catch (err) {
      console.error("AI Assistant error:", err);
      const fallbackReply = `Voice of Store AI has dispatched diagnostics for "${textToAsk}". Subsystem status nominal.`;
      setAiResponse(fallbackReply);
      speakText(fallbackReply);
    } finally {
      setIsThinking(false);
    }
  };

  const refreshIntelligence = async () => {
    if (isRefreshing || isThinking) return;
    setIsRefreshing(true);
    try {
      const freshQuery = "Give me a fresh 2-sentence executive operational status update for our stores.";
      const freshReply = await callGeminiAssistant(freshQuery);
      setAiResponse(freshReply);
      speakText(freshReply);
    } catch {
      const fallback = `${getExecutiveGreeting()} Intelligence telemetry refreshed. All 42 stores are nominal with Store 042 quarantined, Sir.`;
      setAiResponse(fallback);
      speakText(fallback);
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleListening = () => {
    if (listening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.onstart = () => setListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setVoice(transcript);
          setListening(false);
          askVoiceAssistant(transcript);
        };
        recognition.onerror = () => setListening(false);
        recognition.onend = () => setListening(false);
        recognition.start();
        return;
      } catch (err) {
        console.warn("Speech recognition error:", err);
      }
    }

    // Fallback if browser doesn't permit microphone API
    setListening(true);
    setTimeout(() => {
      setListening(false);
      const fallbackQuery = "Investigate Store 042 allergen labeling incident";
      setVoice(fallbackQuery);
      askVoiceAssistant(fallbackQuery);
    }, 2400);
  };

  const openIncidentDetails = (item: IncidentItem) => {
    setSelectedIssueId(item.id);
    setSelectedDetailIssue(item);
    setDetailDialogOpen(true);
  };

  const issuesToDisplay = showAll
    ? [...PRIMARY_ISSUES, ...ADDITIONAL_ISSUES]
    : PRIMARY_ISSUES;

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900 relative">
      {/* Subtle crisp white ambient glow behind layout */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[450px] bg-gradient-to-b from-blue-50/25 via-white/50 to-white -z-10" />

      {/* Top Header Navbar */}
      <DashboardHeader active="ai-assistant" showControls={false} />

      {/* Main 2-Column Operations Dashboard */}
      <main className="mx-auto grid max-w-[1600px] gap-8 px-6 py-8 lg:grid-cols-[56fr_44fr] lg:px-12">
        {/* Left Column: Title, Spline Orb, Feature Cards, Search Bar & Live AI Response */}
        <section className="flex flex-col">
          <div className="mb-4 h-1 w-7 rounded-full bg-blue-600 shadow-sm shadow-blue-500/30" />
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-[40px]">
            VOICE OF STORE AI
          </h1>
          <p className="mt-1 text-xl text-slate-500 lg:text-2xl">
            Your intelligent operations copilot.
          </p>

          {/* 3D Spline Centerpiece with Orbit Ring */}
          <div className="relative mx-auto my-4 aspect-square w-full max-w-[480px]">
            {/* Orbit decoration */}
            <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[spin_60s_linear_infinite]">
              <span className="absolute left-[14%] top-[12%] h-2.5 w-2.5 rounded-full bg-blue-600" />
              <span className="absolute bottom-[16%] left-[6%] h-3.5 w-3.5 rounded-full bg-blue-600" />
              <span className="absolute right-[2%] top-[42%] h-4 w-4 rounded-full bg-blue-600 shadow-lg shadow-blue-500/40" />
              <span className="absolute left-[-1%] top-[48%] h-2.5 w-2.5 rounded-full bg-blue-400/40" />
              <span className="absolute right-[3%] bottom-[24%] h-3 w-3 rounded-full border-2 border-blue-500/40 bg-white" />
              <span className="absolute right-[30%] top-[-1%] h-3 w-3 rounded-full border-2 border-blue-500/40 bg-white" />
            </div>

            {/* Glowing Backdrop */}
            <div className="absolute inset-[10%] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            {/* Spline 3D Scene */}
            <div className="absolute inset-0 grid place-items-center">
              <SplineOrb />
            </div>

            {/* Floating Glass Pill Overlay on Orbit */}
            <div className="absolute right-[-2%] top-[22%] flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-sm font-medium text-blue-600 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl ring-1 ring-slate-100">
              <Wave /> <span>{listening ? "Listening to mic..." : isThinking ? "Analyzing with Gemini..." : "Online & Ready"}</span>
            </div>
          </div>

          {/* ── Voice of Store AI Copilot (Powered by Gemini 2.0 Flash) Response Panel in place of 3 cards ── */}
          <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/25 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300">
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/30">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div className="text-left">
                  <span className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-slate-900 block leading-tight">
                    Voice of Store AI Copilot
                  </span>
                  <span className="text-[10px] font-mono font-medium text-blue-600 flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Powered by Gemini 2.0 Flash
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const textToRead = aiResponse || defaultBriefing;
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speakText(textToRead);
                    }
                  }}
                  title={isSpeaking ? "Pause speech" : "Read aloud"}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    isSpeaking
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/30 animate-pulse"
                      : "bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 border-slate-200/90 hover:border-blue-300 shadow-2xs"
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5 text-white animate-pulse" />
                      <span>Speaking Briefing...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5 text-blue-600" />
                      <span>🔊 Listen to Voice AI</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={refreshIntelligence}
                  disabled={isRefreshing}
                  title="Refresh live AI store intelligence"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition cursor-pointer shadow-2xs"
                >
                  <RefreshCw className={`h-3.5 w-3.5 text-blue-600 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReportDialogOpen(true)}
                  title="Preview & Export Executive Intelligence Report as PDF"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 transition cursor-pointer shadow-2xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>Export PDF</span>
                </button>
                {aiResponse && (
                  <button
                    type="button"
                    onClick={() => {
                      stopSpeaking();
                      setAiResponse(null);
                      setLastAskedQuery("");
                    }}
                    title="Reset to default briefing"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white border border-slate-200/60 bg-white/80 transition cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* User Query Preview (if active) */}
            {lastAskedQuery && (
              <div className="text-[11px] font-medium text-slate-500 mb-2.5 flex items-center gap-1.5 bg-blue-50/60 px-3 py-1.5 rounded-lg border border-blue-100/80">
                <span className="font-bold text-blue-700">Query:</span>
                <span className="italic truncate text-slate-800">"{lastAskedQuery}"</span>
              </div>
            )}

            {/* Response Body */}
            {isThinking ? (
              <div className="flex items-center gap-3 py-4 text-slate-700 text-xs sm:text-sm font-medium">
                <Wave className="text-blue-600" />
                <span>Querying Gemini 2.0 Flash & synthesizing operational telemetry...</span>
              </div>
            ) : (
              <div className="text-xs sm:text-[13px] text-slate-700 leading-relaxed space-y-2 whitespace-pre-line text-left font-normal">
                {aiResponse || defaultBriefing}
              </div>
            )}

            {/* Quick Action Chips to Ask Gemini */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  askVoiceAssistant(
                    "Good day. Greet me, Sir, and present the highest-impact operational telemetry across our stores."
                  )
                }
                className="text-[11px] font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-1.5 rounded-full transition cursor-pointer shadow-sm shadow-blue-500/25 flex items-center gap-1.5"
              >
                <span>👋</span>
                <span>Greet & High-Impact Briefing</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  askVoiceAssistant(
                    "Investigate Store 042 allergen labeling incident and current containment status"
                  )
                }
                className="text-[11px] font-medium bg-white hover:bg-blue-50 text-blue-700 border border-blue-200/80 px-3 py-1.5 rounded-full transition cursor-pointer shadow-2xs hover:border-blue-300"
              >
                🔍 Investigate Store 042 Allergen
              </button>
              <button
                type="button"
                onClick={() =>
                  askVoiceAssistant(
                    "Summarize cold-chain compliance and freezer unit C4 status at Store 018"
                  )
                }
                className="text-[11px] font-medium bg-white hover:bg-amber-50 text-amber-700 border border-amber-200/80 px-3 py-1.5 rounded-full transition cursor-pointer shadow-2xs hover:border-amber-300"
              >
                ❄️ Cold-Chain Unit C4
              </button>
              <button
                type="button"
                onClick={() =>
                  askVoiceAssistant(
                    "Analyze sector health across food safety, checkout, and inventory fulfillment"
                  )
                }
                className="text-[11px] font-medium bg-white hover:bg-purple-50 text-purple-700 border border-purple-200/80 px-3 py-1.5 rounded-full transition cursor-pointer shadow-2xs hover:border-purple-300"
              >
                📊 Sector Health Scorecard
              </button>
              <button
                type="button"
                onClick={() =>
                  askVoiceAssistant(
                    "Recommend actions to clear front-end checkout latency at Store 027"
                  )
                }
                className="text-[11px] font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 px-3 py-1.5 rounded-full transition cursor-pointer shadow-2xs hover:border-slate-300"
              >
                ⚡ Front-End Throughput
              </button>
              <button
                type="button"
                onClick={() => setReportDialogOpen(true)}
                className="text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/90 px-3 py-1.5 rounded-full transition cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>📑</span>
                <span>Export Mega Report (PDF)</span>
              </button>
            </div>
          </div>

          {/* Voice / Query Input Bar - White Glassmorphism */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (voice.trim()) {
                askVoiceAssistant(voice.trim());
              }
            }}
            className="mt-5 flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/90 p-2 shadow-[0_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl transition hover:border-slate-300 hover:bg-white"
          >
            <button
              type="button"
              onClick={toggleListening}
              aria-label="Toggle Microphone"
              title={listening ? "Stop Listening" : "Start Voice Input"}
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-full transition cursor-pointer ${
                listening
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/40 animate-pulse"
                  : "bg-slate-100 text-blue-600 hover:bg-slate-200"
              }`}
            >
              <Mic className="h-5 w-5" />
            </button>
            <span className="h-7 w-px bg-slate-200" />
            <input
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              placeholder="Ask about incidents, stores, or emerging issues..."
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-slate-400 text-slate-800"
            />
            <span
              className={`hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:flex ${
                listening
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : isThinking
                  ? "bg-purple-50 text-purple-600 border border-purple-200"
                  : "bg-emerald-50 text-emerald-600 border border-emerald-200"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  listening
                    ? "bg-blue-600 animate-ping"
                    : isThinking
                    ? "bg-purple-600 animate-pulse"
                    : "bg-emerald-500"
                }`}
              />
              {listening ? "Listening" : isThinking ? "Thinking" : "Ready"}
            </span>
            <button
              type="submit"
              disabled={isThinking || !voice.trim()}
              aria-label="Send voice query"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none text-white shadow-md shadow-blue-500/30 transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Wave />
            </button>
          </form>
        </section>

        {/* Right Column: White Glassmorphism Container with Needs Your Attention, Feedback & Sectors */}
        <aside className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] backdrop-blur-2xl ring-1 ring-slate-100 lg:sticky lg:top-20 max-h-[calc(100vh-100px)] overflow-y-auto">
          {/* 1. Needs Your Attention Section - Clickable with Dialog Modal */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  Needs Your Attention
                </h2>
                <p className="text-[11px] text-slate-500">
                  Click any incident to open full details & runbooks
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAll((s) => !s)}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition cursor-pointer"
              >
                {showAll ? "Show less" : "View All"}
              </button>
            </div>

            {/* Incident Alert Cards Frame */}
            <div className="space-y-2.5 rounded-2xl border border-slate-100/90 bg-white/70 p-2.5 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
              {issuesToDisplay.map((it) => {
                const isSelected = selectedIssueId === it.id;

                const badgeColor =
                  it.tone === "critical"
                    ? "bg-red-50 text-red-600 border-red-200"
                    : it.tone === "high"
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-blue-50 text-blue-600 border-blue-200";

                const iconBg =
                  it.tone === "critical"
                    ? "bg-red-100 text-red-600"
                    : it.tone === "high"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-blue-100 text-blue-600";

                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => openIncidentDetails(it)}
                    className={`flex w-full items-center gap-3.5 rounded-xl border p-3.5 text-left transition duration-150 cursor-pointer backdrop-blur-md group ${
                      isSelected
                        ? "border-blue-400 bg-white shadow-[0_4px_16px_rgba(59,130,246,0.12)] ring-2 ring-blue-400/25"
                        : "border-slate-200/80 bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    {/* Circular Icon */}
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${iconBg}`}
                    >
                      <it.icon className="h-5 w-5" />
                    </span>

                    {/* Incident Meta */}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-900 text-[15px] leading-snug truncate group-hover:text-blue-600 transition-colors">
                        <span>{it.title}</span>
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500 truncate">
                        {it.store} <span className="mx-1 font-light text-slate-300">|</span>{" "}
                        {it.dept}
                      </span>
                    </span>

                    {/* Severity Pill & Status Line */}
                    <span className="shrink-0 text-right">
                      <span
                        className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-semibold ${badgeColor}`}
                      >
                        {it.sev}
                      </span>
                      <span className="mt-1 flex items-center justify-end gap-1.5 text-xs text-slate-500">
                        <span
                          className={
                            it.tone === "critical"
                              ? "text-red-600 font-semibold"
                              : "text-slate-600 font-medium"
                          }
                        >
                          {it.status}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span>{it.ago}</span>
                      </span>
                    </span>

                    {/* Chevron Indicator */}
                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all ml-1" />
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. Top Feedback on Management Section - White Glassmorphism */}
          <section className="pt-2 border-t border-slate-100">
            <div className="mb-3.5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  <MessageSquareText className="h-4 w-4 text-blue-600" />
                  Top Feedback on Management
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recent store leadership assessments & operational reviews
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200/80 shadow-xs">
                <Sparkles className="h-3 w-3 text-blue-500" /> Live Audit
              </span>
            </div>

            <div className="space-y-3">
              {MANAGEMENT_FEEDBACK.map((fb, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-md transition hover:border-blue-200 hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50/80 text-blue-700 font-semibold text-xs border border-blue-100">
                        <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">
                          {fb.role}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {fb.store}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${fb.statusColor}`}
                    >
                      {fb.status}
                    </span>
                  </div>

                  <p className="mt-2.5 text-xs font-medium text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    "{fb.comment}"
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      {fb.highlight}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 className="h-3 w-3" />
                      {fb.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Sectors & Department Health Section - White Glassmorphism */}
          <section className="pt-2 border-t border-slate-100">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  Sectors & Operational Health
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time department scorecards and compliance health
                </p>
              </div>
              <span className="text-xs font-medium text-slate-400">
                4 Sectors
              </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {SECTORS.map((sec) => (
                <div
                  key={sec.name}
                  className="rounded-xl border border-slate-100 bg-white/90 p-3.5 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition hover:bg-white hover:border-slate-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold text-slate-900 block max-w-[130px] leading-snug truncate">
                      {sec.name}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {sec.score}%
                    </span>
                  </div>

                  {/* Score Progress Bar */}
                  <div className="my-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${sec.barColor}`}
                      style={{ width: `${sec.score}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 truncate">{sec.metric}</span>
                    <span className="font-semibold text-emerald-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      {sec.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </main>

      {/* ── EXPANDED INCIDENT DETAIL DIALOG MODAL ── */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border border-slate-200/90 bg-white shadow-2xl rounded-3xl">
          {selectedDetailIssue && (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-start gap-4">
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                      selectedDetailIssue.tone === "critical"
                        ? "bg-red-100 text-red-600"
                        : selectedDetailIssue.tone === "high"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <selectedDetailIssue.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        {selectedDetailIssue.code}
                      </span>
                      <span
                        className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
                          selectedDetailIssue.tone === "critical"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : selectedDetailIssue.tone === "high"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {selectedDetailIssue.sev} Priority
                      </span>
                    </div>
                    <DialogTitle className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                      {selectedDetailIssue.fullTitle}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-800">{selectedDetailIssue.store}</span>
                      <span>•</span>
                      <span>{selectedDetailIssue.dept}</span>
                      <span>•</span>
                      <span>Reported {selectedDetailIssue.ago}</span>
                    </DialogDescription>
                  </div>
                </div>
              </div>

              {/* Key Incident Metrics Row */}
              <div className="grid grid-cols-3 gap-3">
                {selectedDetailIssue.metrics.map((m, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-center">
                    <span className="text-[11px] font-medium text-slate-500 block mb-1">{m.label}</span>
                    <span
                      className={`text-base font-extrabold ${
                        m.tone === "critical"
                          ? "text-red-600"
                          : m.tone === "warning"
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Detailed Incident Overview & Root Cause */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                    Incident Summary
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                    {selectedDetailIssue.summary}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                    Attributed Root Cause
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                    {selectedDetailIssue.rootCause}
                  </p>
                </div>

                {/* Risk Analysis */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-red-100 bg-red-50/50 p-3.5">
                    <span className="text-xs font-bold text-red-900 block mb-1">Operational & Health Impact</span>
                    <p className="text-xs text-red-800/90 leading-relaxed">{selectedDetailIssue.impact}</p>
                  </div>
                  <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3.5">
                    <span className="text-xs font-bold text-amber-900 block mb-1">Compliance & Legal Exposure</span>
                    <p className="text-xs text-amber-800/90 leading-relaxed">{selectedDetailIssue.regulatoryRisk}</p>
                  </div>
                </div>

                {/* Containment Protocol Steps */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                    Containment & Corrective Protocol
                  </h3>
                  <ul className="space-y-2">
                    {selectedDetailIssue.containmentSteps.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Incident Log Timeline */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                    Incident Audit Timeline
                  </h3>
                  <div className="space-y-1.5 border-l-2 border-slate-200 pl-3">
                    {selectedDetailIssue.timeline.map((t, tIdx) => (
                      <div key={tIdx} className="text-xs flex items-center gap-2">
                        <span className="font-mono text-slate-400 font-semibold">{t.time}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-700">{t.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const query = `Investigate ${selectedDetailIssue.fullTitle} at ${selectedDetailIssue.store} and provide immediate containment guidance`;
                    setDetailDialogOpen(false);
                    setVoice(query);
                    askVoiceAssistant(query);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-semibold shadow-md shadow-blue-500/25 transition cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Ask Voice Assistant to Investigate</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Protocol acknowledged for ${selectedDetailIssue.title}`);
                      setDetailDialogOpen(false);
                    }}
                    className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-xs font-semibold transition cursor-pointer"
                  >
                    Acknowledge
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailDialogOpen(false)}
                    className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 text-xs font-semibold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── MEGA EXECUTIVE INTELLIGENCE & OPERATIONAL EXPENSE REPORT (PDF PREVIEW & DOWNLOAD) ── */}
      <MegaReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        defaultTimeWindow="Weekly"
        defaultRegion="All Regions"
      />
    </div>
  );
}

export default VoiceOfStoreDashboard;
