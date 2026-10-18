import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Download,
  Printer,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Building2,
  DollarSign,
  TrendingUp,
  Sparkles,
  ChevronDown,
  Wrench,
  Users,
  Shirt,
  Package,
  Layers,
  ShieldCheck,
  Calendar,
} from "lucide-react";

export type AdminSectorId = "all" | "management" | "food-safety" | "maintenance" | "merchandising";

interface SectorReportConfig {
  id: AdminSectorId;
  name: string;
  badge: string;
  icon: typeof Building2;
  iconTone: string;
  leadOwner: string;
  executiveSummary: string;
  totalFeedback: number;
  openIssues: number;
  resolvedIssues: number;
  criticalViolations: number;
  resolutionRate: number;
  totalExpense: string;
  feedbacks: {
    id: string;
    store: string;
    feedback: string;
    severity: "Critical" | "High" | "Medium";
    actionTaken: string;
    expense: string;
  }[];
  repairs: {
    id: string;
    asset: string;
    store: string;
    workCompleted: string;
    techHours: number;
    partsCost: number;
    laborCost: number;
    totalCost: number;
  }[];
  healthMetrics: { label: string; score: number; status: string }[];
}

export const SECTOR_REPORT_REGISTRY: Record<AdminSectorId, SectorReportConfig> = {
  management: {
    id: "management",
    name: "Store Management & Front-End Operations Sector",
    badge: "Operations & Service Lead",
    icon: Users,
    iconTone: "bg-blue-600 text-white",
    leadOwner: "Sarah Jenkins, District Operations Lead",
    executiveSummary:
      "Audits checkout queues, cashier scheduling, POS terminal uptime, front-line customer escalations, and store cleanliness standards across 42 operating stores.",
    totalFeedback: 420,
    openIssues: 112,
    resolvedIssues: 276,
    criticalViolations: 18,
    resolutionRate: 73,
    totalExpense: "$2,480",
    feedbacks: [
      {
        id: "FB-MGT-01",
        store: "Store #118 (Central Plaza)",
        feedback: "Customer waited 22 minutes at checkout counter 3 and 4 during peak 1-2 PM rush with unmanned registers.",
        severity: "High",
        actionTaken: "Rebalanced peak cashier shift schedules, added automated break rotation alerts, re-opened lanes.",
        expense: "$350",
      },
      {
        id: "FB-MGT-02",
        store: "Store #027 (Westlake)",
        feedback: "Register 2 automated optical scanner duplicated carton barcodes across multiple rapid transactions.",
        severity: "Critical",
        actionTaken: "Replaced damaged Cat6 STP patch cable, updated scanner firmware, re-routed switch port 04.",
        expense: "$640",
      },
      {
        id: "FB-MGT-03",
        store: "Store #301 (Riverside)",
        feedback: "Restroom sanitizer dispenser empty and standing liquid on tile flooring with no caution cone deployed.",
        severity: "Medium",
        actionTaken: "Replaced automated foam valve, refreshed soap canisters, enacted 30-min custodial patrol cycle.",
        expense: "$200",
      },
      {
        id: "FB-MGT-04",
        store: "Store #042 (Metro Center)",
        feedback: "Express self-checkout optical imager failed to scan mobile loyalty digital QR coupon codes.",
        severity: "Medium",
        actionTaken: "Re-calibrated wide-angle barcode camera lens, updated POS customer-display driver schema.",
        expense: "$400",
      },
    ],
    repairs: [
      {
        id: "REP-MGT-101",
        asset: "POS Register 04 Gigabit Switch & STP Cabling",
        store: "Store #027",
        workCompleted: "Re-routed shielded twisted pair line, replaced blown RJ45 connector, bounced Cisco switch port.",
        techHours: 3.5,
        partsCost: 290,
        laborCost: 350,
        totalCost: 640,
      },
      {
        id: "REP-MGT-102",
        asset: "Self-Checkout Bay #3 Optical Scanner & Glass",
        store: "Store #042",
        workCompleted: "Replaced scratched sapphire scan window, re-aligned high-speed 2D imager array.",
        techHours: 2.2,
        partsCost: 180,
        laborCost: 220,
        totalCost: 400,
      },
      {
        id: "REP-MGT-103",
        asset: "Customer Queue Retractable Stanchion Barriers (x8)",
        store: "Store #118",
        workCompleted: "Installed heavy-duty tensabarrier posts with non-slip bases to streamline queuing lines.",
        techHours: 2.0,
        partsCost: 340,
        laborCost: 180,
        totalCost: 520,
      },
      {
        id: "REP-MGT-104",
        asset: "Automated Restroom Foam & Sanitizer System",
        store: "Store #301",
        workCompleted: "Replaced solenoid pump assembly, installed tamper-proof bulk reservoir housing.",
        techHours: 1.5,
        partsCost: 80,
        laborCost: 120,
        totalCost: 200,
      },
    ],
    healthMetrics: [
      { label: "Front-End Throughput", score: 84, status: "Good" },
      { label: "Cashier Staffing Adherence", score: 88, status: "Optimal" },
      { label: "Cleanliness & Safety SLA", score: 92, status: "Certified" },
      { label: "Complaint Escalation Speed", score: 79, status: "Action Required" },
    ],
  },

  "food-safety": {
    id: "food-safety",
    name: "Food Safety & Regulatory Compliance Sector",
    badge: "FSMA & HACCP Lead",
    icon: ShieldCheck,
    iconTone: "bg-rose-600 text-white",
    leadOwner: "Dr. Aris Thorne, Director of Food Quality & Safety",
    executiveSummary:
      "Oversees bakery allergen disclosure protocols, deli case holding temperatures, cross-contamination prevention, product expiration tracking, and health board audit compliance.",
    totalFeedback: 310,
    openIssues: 42,
    resolvedIssues: 254,
    criticalViolations: 14,
    resolutionRate: 86,
    totalExpense: "$3,150",
    feedbacks: [
      {
        id: "FB-FS-01",
        store: "Store #042 (Westlake Bakery)",
        feedback: "Customer noticed prepared almond croissants batch #B-882 lacked mandatory bold tree nut allergy disclosure.",
        severity: "Critical",
        actionTaken: "Quarantined 36 units immediately, locked POS barcode scan, flashed bold allergen print schema to #B2.",
        expense: "$380",
      },
      {
        id: "FB-FS-02",
        store: "Store #018 (Riverside Deli)",
        feedback: "Prepared sliced roast beef display cold well sensor registered +7.2°C during morning opening inspection.",
        severity: "Critical",
        actionTaken: "Relocated meat inventory to walk-in cooler, replaced digital thermostat relay, verified core chill at +2.8°C.",
        expense: "$800",
      },
      {
        id: "FB-FS-03",
        store: "Store #102 (Downtown Market)",
        feedback: "Raw organic chicken tray packaging showed film puncture micro-leak near lower produce display.",
        severity: "High",
        actionTaken: "Sanitized produce deck with NSF food-safe chlorine mist, pulled batch #CK-19, alerted packing vendor.",
        expense: "$470",
      },
      {
        id: "FB-FS-04",
        store: "Store #076 (Metro North)",
        feedback: "Digital meat thermometer probe read 4°F drift against certified ice-point calibration standard.",
        severity: "Medium",
        actionTaken: "Replaced Cooper-Atkins probe sensors across meat and bakery lines, recalibrated central loggers.",
        expense: "$300",
      },
    ],
    repairs: [
      {
        id: "REP-FS-201",
        asset: "Bakery Thermal Barcode Printer #B2 Printhead",
        store: "Store #042",
        workCompleted: "Replaced 300dpi thermal printhead, loaded FSMA Title 21 CFR allergen schema, tested barcode readability.",
        techHours: 2.5,
        partsCost: 180,
        laborCost: 200,
        totalCost: 380,
      },
      {
        id: "REP-FS-202",
        asset: "Deli Sliced Cold-Well Thermostat & Solenoid",
        store: "Store #018",
        workCompleted: "Replaced stuck expansion valve, evacuated R448A loop, re-charged and logged stable 36°F chill curve.",
        techHours: 4.0,
        partsCost: 410,
        laborCost: 390,
        totalCost: 800,
      },
      {
        id: "REP-FS-203",
        asset: "Meat Prep Sanitation Chemical Dosing Valve",
        store: "Store #102",
        workCompleted: "Replaced chemical siphon manifold, checked quaternary ammonium parts-per-million concentration.",
        techHours: 2.8,
        partsCost: 220,
        laborCost: 250,
        totalCost: 470,
      },
      {
        id: "REP-FS-204",
        asset: "HACCP Bluetooth Core Probes Kit (x4)",
        store: "Store #076",
        workCompleted: "Recalibrated temperature sensors against NIST-traceable reference thermometer, synced to cloud hub.",
        techHours: 1.5,
        partsCost: 160,
        laborCost: 140,
        totalCost: 300,
      },
    ],
    healthMetrics: [
      { label: "FSMA Allergen Compliance", score: 98, status: "Zero Breach" },
      { label: "Cold Well Temperature SLA", score: 91, status: "Compliant" },
      { label: "HACCP Log Verification", score: 96, status: "Certified" },
      { label: "Packaging Integrity Index", score: 89, status: "Good" },
    ],
  },

  maintenance: {
    id: "maintenance",
    name: "Maintenance, Facilities & Cold Chain Sector",
    badge: "Facilities Engineering Lead",
    icon: Wrench,
    iconTone: "bg-emerald-600 text-white",
    leadOwner: "Marcus Vance, Director of Facilities & Equipment",
    executiveSummary:
      "Directs physical store infrastructure, walk-in chillers, reach-in refrigerated cases, HVAC rooftop systems, lighting, and mechanical reliability.",
    totalFeedback: 268,
    openIssues: 78,
    resolvedIssues: 160,
    criticalViolations: 12,
    resolutionRate: 60,
    totalExpense: "$4,840",
    feedbacks: [
      {
        id: "FB-MNT-01",
        store: "Store #018 (Riverside Produce)",
        feedback: "Walk-in freezer unit C4 defrost cycle timeout exceeded by 90 minutes; temp spiked to -8.2°C.",
        severity: "Critical",
        actionTaken: "Engaged manual chill override to -17.8°C, replaced defrost relay contactor, re-stabilized core load.",
        expense: "$920",
      },
      {
        id: "FB-MNT-02",
        store: "Store #102 (Produce Department)",
        feedback: "Rooftop RTU-3 air conditioning compressor blowing ambient 78°F air directly across berry produce deck.",
        severity: "Critical",
        actionTaken: "Replaced burnt blower fan bearing, flushed secondary condensate drainage line, restored 68°F zone.",
        expense: "$1,850",
      },
      {
        id: "FB-MNT-03",
        store: "Store #076 (Frozen Food Aisle)",
        feedback: "Upright reach-in freezer door heated gasket failed, causing heavy frost buildup and obscured packaging.",
        severity: "High",
        actionTaken: "Replaced perimeter magnetic door gasket and low-wattage resistance heating wire assembly.",
        expense: "$570",
      },
      {
        id: "FB-MNT-04",
        store: "Store #301 (Machine Room)",
        feedback: "Primary Copeland compressor rack #2 high-pressure vibration cutoff sensor tripped during afternoon cycle.",
        severity: "High",
        actionTaken: "Replaced vibration isolator springs, adjusted head pressure transducer, cleared safety trip log.",
        expense: "$1,100",
      },
    ],
    repairs: [
      {
        id: "REP-MNT-301",
        asset: "Walk-in Freezer C4 Defrost Solenoid Relay",
        store: "Store #018",
        workCompleted: "Replaced defective Eaton 40A defrost relay, checked coil resistance, charged 1.5kg R448A refrigerant.",
        techHours: 4.5,
        partsCost: 480,
        laborCost: 440,
        totalCost: 920,
      },
      {
        id: "REP-MNT-302",
        asset: "Carrier RTU-3 Rooftop Blower Motor & Bearings",
        store: "Store #102",
        workCompleted: "Pulled seized 5HP blower motor, pressed new SKF sealed bearings, replaced dual drive belts, aligned pulleys.",
        techHours: 8.5,
        partsCost: 980,
        laborCost: 870,
        totalCost: 1850,
      },
      {
        id: "REP-MNT-303",
        asset: "Zero Zone Reach-In Heated Gasket & Wire",
        store: "Store #076",
        workCompleted: "Fitted custom 30x78 perimeter magnetic frame gasket, spliced heated perimeter circuit into breaker panel.",
        techHours: 2.8,
        partsCost: 310,
        laborCost: 260,
        totalCost: 570,
      },
      {
        id: "REP-MNT-304",
        asset: "Copeland Compressor Rack #2 Vibration Transducer",
        store: "Store #301",
        workCompleted: "Installed Danfoss digital high-pressure transducer, replaced elastomer vibration dampening pads.",
        techHours: 4.8,
        partsCost: 620,
        laborCost: 480,
        totalCost: 1100,
      },
    ],
    healthMetrics: [
      { label: "Cold Chain Temperature SLA", score: 88, status: "Stabilized" },
      { label: "HVAC Climate Efficiency", score: 86, status: "Optimal" },
      { label: "Equipment Uptime Index", score: 91, status: "Good" },
      { label: "Preventative Maintenance SLA", score: 74, status: "At Risk" },
    ],
  },

  merchandising: {
    id: "merchandising",
    name: "Clothing, Merchandising & Inventory Sector",
    badge: "Merchandising & Inventory Lead",
    icon: Shirt,
    iconTone: "bg-purple-600 text-white",
    leadOwner: "Elena Rostova, Chief Merchandising Specialist",
    executiveSummary:
      "Tracks apparel defect rates, garment tagging accuracy, POS pricing parity, stock replenishment speeds, and electronic shelf label synchronization.",
    totalFeedback: 336,
    openIssues: 96,
    resolvedIssues: 212,
    criticalViolations: 14,
    resolutionRate: 63,
    totalExpense: "$1,920",
    feedbacks: [
      {
        id: "FB-MER-01",
        store: "Store #205 (Fashion District)",
        feedback: "Batch #FL-204 organic cotton cardigans labeled Size M on exterior hangtag but sewn neck label read Size XS.",
        severity: "Critical",
        actionTaken: "Quarantined 48 garments, re-audited factory manifest, printed verified barcode hangtags.",
        expense: "$320",
      },
      {
        id: "FB-MER-02",
        store: "Store #027 (Aisle 5)",
        feedback: "Shelf tag display for cold brew showed $4.29 promotion, but POS checkout scanner billed full $5.19 price.",
        severity: "High",
        actionTaken: "Issued customer refunds, resynced Electronic Shelf Label (ESL) database to central pricing engine.",
        expense: "$450",
      },
      {
        id: "FB-MER-03",
        store: "Store #118 (Produce & Grocery)",
        feedback: "1-Gallon whole milk front display was empty despite in-store app inventory displaying 48 units in stock.",
        severity: "High",
        actionTaken: "Stockroom team retrieved 4 crates from walk-in cold storage, updated automated replenishment threshold.",
        expense: "$250",
      },
      {
        id: "FB-MER-04",
        store: "Store #042 (Electronics Endcap)",
        feedback: "Handheld inventory RFID gun reader failed to connect to warehouse Wi-Fi, delaying intake by 3 hours.",
        severity: "Medium",
        actionTaken: "Replaced Zebra terminal internal antenna and re-enrolled MAC address on enterprise access point.",
        expense: "$520",
      },
    ],
    repairs: [
      {
        id: "REP-MER-401",
        asset: "Zebra TC52x Handheld RFID Scanner Terminal",
        store: "Store #042",
        workCompleted: "Replaced damaged internal Wi-Fi 6 antenna, calibrated SE4720 1D/2D scan engine, flashed firmware v11.4.",
        techHours: 2.5,
        partsCost: 340,
        laborCost: 180,
        totalCost: 520,
      },
      {
        id: "REP-MER-402",
        asset: "Pricer Electronic Shelf Label (ESL) Gateway AP",
        store: "Store #027",
        workCompleted: "Replaced faulty Power-over-Ethernet injector, resynced 1,200 digital shelf tags to ERP pricing table.",
        techHours: 2.5,
        partsCost: 210,
        laborCost: 240,
        totalCost: 450,
      },
      {
        id: "REP-MER-403",
        asset: "Customer Self-Service Price Check Terminal #1",
        store: "Store #118",
        workCompleted: "Replaced 10-inch touchscreen digitizer and omnidirectional barcode camera lens assembly.",
        techHours: 2.0,
        partsCost: 260,
        laborCost: 190,
        totalCost: 450,
      },
      {
        id: "REP-MER-404",
        asset: "Apparel Garment Re-tagging & Thermal Label System",
        store: "Store #205",
        workCompleted: "Supplied heavy-duty tagging guns, loaded high-clarity polyester hangtags, calibrated thermal cutter.",
        techHours: 2.0,
        partsCost: 180,
        laborCost: 140,
        totalCost: 320,
      },
    ],
    healthMetrics: [
      { label: "Pricing Display Parity", score: 94, status: "Good" },
      { label: "Apparel Tagging Accuracy", score: 82, status: "Remediated" },
      { label: "On-Shelf Availability (OSA)", score: 87, status: "Optimal" },
      { label: "Replenishment Cycle Time", score: 78, status: "Monitoring" },
    ],
  },

  all: {
    id: "all",
    name: "Executive Master Cross-Sector Operations Report",
    badge: "Enterprise Board Audit",
    icon: Building2,
    iconTone: "bg-slate-900 text-white",
    leadOwner: "OmniRetail Executive Leadership & Board of Operations",
    executiveSummary:
      "Comprehensive consolidated operational audit combining Store Management, Food Safety Compliance, Cold Chain Maintenance, and Merchandising across all 42 operating retail locations.",
    totalFeedback: 1248,
    openIssues: 328,
    resolvedIssues: 864,
    criticalViolations: 47,
    resolutionRate: 72,
    totalExpense: "$12,390",
    feedbacks: [
      {
        id: "FB-ALL-01",
        store: "Store #042 (Bakery)",
        feedback: "Allergen label mismatch: 36 units of almond croissants quarantined; zero compliance breach.",
        severity: "Critical",
        actionTaken: "POS lock active; printer #B2 printhead replaced; bold allergen schema loaded.",
        expense: "$380",
      },
      {
        id: "FB-ALL-02",
        store: "Store #018 (Produce)",
        feedback: "Walk-in freezer C4 defrost solenoid failure caused temp climb to -8.2°C; core load saved.",
        severity: "Critical",
        actionTaken: "Manual chill override engaged to -17.8°C; solenoid replaced and refrigerant top-up.",
        expense: "$920",
      },
      {
        id: "FB-ALL-03",
        store: "Store #027 (Checkout)",
        feedback: "Register 04 switch port flapping caused 20-min checkout delays during morning peak.",
        severity: "High",
        actionTaken: "Cat6 cabling re-routed, port bounced on Cisco switch, register restored to full speed.",
        expense: "$640",
      },
      {
        id: "FB-ALL-04",
        store: "Store #102 (HVAC)",
        feedback: "Produce department RTU-3 air conditioning motor bearing failed; fruit deck warm air.",
        severity: "Critical",
        actionTaken: "Motor bearings overhauled, condensate line cleared, temperature stabilized at 68°F.",
        expense: "$1,850",
      },
      {
        id: "FB-ALL-05",
        store: "Store #205 (Apparel)",
        feedback: "Batch #FL-204 sweaters marked with wrong size tags vs internal neck labels.",
        severity: "High",
        actionTaken: "Pulled 48 units, re-verified against factory shipment bill, re-tagged accurately.",
        expense: "$320",
      },
    ],
    repairs: [
      {
        id: "REP-ALL-01",
        asset: "Store 042 Bakery Thermal Printer #B2",
        store: "Store #042",
        workCompleted: "Printhead replacement and FSMA allergen bold font schema update.",
        techHours: 2.5,
        partsCost: 180,
        laborCost: 200,
        totalCost: 380,
      },
      {
        id: "REP-ALL-02",
        asset: "Store 018 Walk-in Freezer C4 Defrost Solenoid Relay",
        store: "Store #018",
        workCompleted: "Eaton defrost relay replacement and R448A gas charge.",
        techHours: 4.5,
        partsCost: 480,
        laborCost: 440,
        totalCost: 920,
      },
      {
        id: "REP-ALL-03",
        asset: "Store 027 POS Network Switch Port & STP Cat6",
        store: "Store #027",
        workCompleted: "Switch re-patching, line certification, firmware update.",
        techHours: 3.5,
        partsCost: 290,
        laborCost: 350,
        totalCost: 640,
      },
      {
        id: "REP-ALL-04",
        asset: "Store 102 Carrier RTU-3 Blower Bearings & Motor",
        store: "Store #102",
        workCompleted: "Seized blower motor overhaul and dual pulley alignment.",
        techHours: 8.5,
        partsCost: 980,
        laborCost: 870,
        totalCost: 1850,
      },
      {
        id: "REP-ALL-05",
        asset: "Store 042 Zebra TC52x RFID Mobile Scanner",
        store: "Store #042",
        workCompleted: "Antenna replacement and inventory Wi-Fi re-enrollment.",
        techHours: 2.5,
        partsCost: 340,
        laborCost: 180,
        totalCost: 520,
      },
    ],
    healthMetrics: [
      { label: "Overall Retail Health Index", score: 89, status: "Good" },
      { label: "Food Safety & Compliance", score: 98, status: "Certified" },
      { label: "Cold Chain Integrity", score: 88, status: "Stabilized" },
      { label: "Front-End Throughput SLA", score: 84, status: "Operational" },
    ],
  },
};

interface SectorReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSector?: AdminSectorId;
}

export function SectorReportDialog({
  open,
  onOpenChange,
  initialSector = "all",
}: SectorReportDialogProps) {
  const [selectedSector, setSelectedSector] = useState<AdminSectorId>(initialSector);
  const [reportCadence, setReportCadence] = useState<"Weekly" | "Monthly" | "Daily">("Weekly");

  const activeSectorData = SECTOR_REPORT_REGISTRY[selectedSector] || SECTOR_REPORT_REGISTRY.all;

  const handlePrintPDF = () => {
    const printContent = document.getElementById("admin-sector-report-sheet");
    if (!printContent) {
      window.print();
      return;
    }

    const printWindow = window.open("", "_blank", "width=960,height=850");
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activeSectorData.name} — Executive Audit & Expense Report (${reportCadence})</title>
          <style>
            @page { size: A4 portrait; margin: 10mm 12mm; }
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
              color: #0f172a;
              background-color: #ffffff !important;
              line-height: 1.45;
              font-size: 9.5pt;
              margin: 0;
              padding: 16px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .header-bar {
              border-bottom: 2.5px solid #2563eb;
              padding-bottom: 12px;
              margin-bottom: 14px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            h1 { font-size: 15pt; font-weight: 800; color: #0f172a; margin: 0 0 3px 0; }
            .meta-text { font-size: 8.5pt; color: #64748b; margin: 0; }
            .badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 7.5pt;
              font-weight: 700;
              text-transform: uppercase;
              background: #eff6ff;
              color: #1d4ed8;
              border: 1px solid #bfdbfe;
            }
            .kpi-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              margin-bottom: 16px;
            }
            .kpi-card {
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 8px 12px;
              background: #f8fafc;
            }
            .kpi-label { font-size: 7pt; color: #64748b; font-weight: 700; text-transform: uppercase; }
            .kpi-num { font-size: 14pt; font-weight: 800; color: #0f172a; margin-top: 2px; }
            h2 {
              font-size: 10.5pt;
              font-weight: 800;
              color: #0f172a;
              margin: 16px 0 8px 0;
              border-left: 3px solid #2563eb;
              padding-left: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 14px;
              font-size: 8.5pt;
              background: #ffffff !important;
            }
            th {
              background-color: #f1f5f9 !important;
              color: #334155 !important;
              text-align: left;
              padding: 6px 8px;
              font-weight: 700;
              border: 1px solid #cbd5e1;
              font-size: 7.5pt;
              text-transform: uppercase;
            }
            td {
              padding: 6px 8px;
              border: 1px solid #e2e8f0;
              color: #1e293b !important;
              background-color: #ffffff !important;
              vertical-align: top;
            }
            tr:nth-child(even) td { background-color: #f8fafc !important; }
            .tag {
              display: inline-block;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 7pt;
              font-weight: 700;
            }
            .tag-critical { background-color: #ffe4e6 !important; color: #be123c !important; border: 1px solid #fecdd3; }
            .tag-warning { background-color: #fef3c7 !important; color: #b45309 !important; border: 1px solid #fde68a; }
            .tag-blue { background-color: #eff6ff !important; color: #1d4ed8 !important; border: 1px solid #bfdbfe; }
            .footer-audit {
              margin-top: 18px;
              padding-top: 10px;
              border-top: 1.5px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              font-size: 8pt;
              color: #64748b;
            }
            @media print {
              body { padding: 0; background: #fff !important; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 350);
  };

  const Icon = activeSectorData.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[94vh] p-0 border border-slate-200 bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col font-sans">
        {/* Full White Top Executive Action Toolbar */}
        <div className="z-30 flex flex-wrap items-center justify-between gap-3 bg-white text-slate-800 px-6 py-3.5 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <span className={`grid h-9 w-9 place-items-center rounded-xl ${activeSectorData.iconTone} shadow-sm`}>
              <Icon className="h-4.5 w-4.5" />
            </span>
            <div className="leading-tight">
              <DialogTitle className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Sector-Specific Operational Report</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-blue-200">
                  Full White Document
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                Targeted departmental audits, feedback triage, and itemized repair outlays
              </DialogDescription>
            </div>
          </div>

          {/* User Controls: Sector Switcher, Cadence & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Sector Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value as AdminSectorId)}
                className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold pr-8 outline-none cursor-pointer shadow-2xs transition"
              >
                <option value="all">🌐 All Sectors Master Report</option>
                <option value="management">🏢 Store Management Sector</option>
                <option value="food-safety">🥗 Food Safety & Compliance</option>
                <option value="maintenance">❄️ Maintenance & Cold Chain</option>
                <option value="merchandising">🏷️ Merchandising & Inventory</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Cadence Selector */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
              {(["Daily", "Weekly", "Monthly"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setReportCadence(tab)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    reportCadence === tab ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrintPDF}
              className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Print</span>
            </button>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handlePrintPDF}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-blue-500/25 transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Full White Document Body */}
        <div className="flex-1 bg-white overflow-y-auto p-6 sm:p-10 text-slate-900">
          <div id="admin-sector-report-sheet" className="max-w-4xl mx-auto space-y-6 bg-white">
            {/* Header Document Banner */}
            <div className="border-b-2 border-blue-600 pb-5 flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`h-12 w-12 rounded-2xl ${activeSectorData.iconTone} flex items-center justify-center shadow-md shrink-0`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black tracking-tight text-slate-900 uppercase">
                      VOICE OF STORE
                    </span>
                    <span className="text-[10px] font-bold tracking-widest text-blue-700 uppercase bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      {activeSectorData.badge}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 leading-snug">
                    {activeSectorData.name}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Sector Lead: <strong className="text-slate-800">{activeSectorData.leadOwner}</strong> • Cadence:{" "}
                    <strong className="text-blue-600 font-bold">{reportCadence} Audit</strong> • Ref:{" "}
                    <code className="font-mono text-slate-700 font-bold">VOS-SEC-{selectedSector.toUpperCase()}-2026</code>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">
                  DEPARTMENT AUDIT • CONFIDENTIAL
                </span>
                <span className="text-xs text-slate-400 block mt-1.5 font-mono">
                  Generated: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Executive Summary Paragraph */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 text-xs text-slate-700 leading-relaxed">
              <strong className="text-blue-900 font-bold block mb-0.5">Departmental Scope & Overview:</strong>
              {activeSectorData.executiveSummary}
            </div>

            {/* Part I: Sector Scorecard KPIs */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Part I: Sector Operational KPIs ({reportCadence})</span>
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Total Feedbacks</span>
                  <strong className="text-2xl font-black text-slate-900 block mt-1">
                    {activeSectorData.totalFeedback}
                  </strong>
                  <span className="text-xs text-emerald-600 font-bold mt-0.5 block">Concentrated feedback volume</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Open vs Resolved</span>
                  <strong className="text-2xl font-black text-slate-900 block mt-1">
                    <span className="text-amber-600">{activeSectorData.openIssues}</span> /{" "}
                    <span className="text-emerald-600">{activeSectorData.resolvedIssues}</span>
                  </strong>
                  <span className="text-xs text-purple-600 font-bold mt-0.5 block">
                    {activeSectorData.resolutionRate}% Resolution Rate
                  </span>
                </div>
                <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
                  <span className="text-[11px] font-bold text-rose-700 uppercase block">Critical Alerts</span>
                  <strong className="text-2xl font-black text-rose-600 block mt-1">
                    {activeSectorData.criticalViolations} Active
                  </strong>
                  <span className="text-xs text-rose-600 font-bold mt-0.5 block">Immediate Containment</span>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                  <span className="text-[11px] font-bold text-blue-700 uppercase block">Sector Repair Spend</span>
                  <strong className="text-2xl font-black text-blue-700 block mt-1">
                    {activeSectorData.totalExpense}
                  </strong>
                  <span className="text-xs text-blue-600 font-bold mt-0.5 block">Direct equipment & labor</span>
                </div>
              </div>
            </div>

            {/* Part II: Sector Customer Feedback Signals & Containment Action */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  <span>Part II: Customer Grievances & Operational Containment Actions</span>
                </h2>
                <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  {activeSectorData.feedbacks.length} Primary Signals Audited
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left border-collapse text-xs bg-white">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3.5 w-[30%] bg-slate-100">Customer Feedback Quote</th>
                      <th className="py-3 px-3 w-[18%] bg-slate-100">Store Location</th>
                      <th className="py-3 px-3 w-[12%] bg-slate-100">Severity</th>
                      <th className="py-3 px-3.5 w-[30%] bg-slate-100">Containment Action Executed</th>
                      <th className="py-3 px-3 w-[10%] text-right font-black bg-slate-100">Expense</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {activeSectorData.feedbacks.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 bg-white">
                        <td className="py-3 px-3.5 font-medium text-slate-900 bg-white italic">
                          "{item.feedback}"
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-semibold bg-white">{item.store}</td>
                        <td className="py-3 px-3 bg-white">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                              item.severity === "Critical"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : item.severity === "High"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {item.severity}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-slate-700 bg-white">{item.actionTaken}</td>
                        <td className="py-3 px-3 text-right font-black text-slate-900 font-mono text-xs bg-white">
                          {item.expense}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Part III: Itemized Repairs & Equipment Maintenance Outlay */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Wrench className="h-3.5 w-3.5 text-blue-600" />
                  <span>Part III: Itemized Equipment Maintenance & Repair Outlay</span>
                </h2>
                <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  Total Sector Outlay: {activeSectorData.totalExpense}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left border-collapse text-xs bg-white">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 w-[12%] bg-slate-100">Repair Ref</th>
                      <th className="py-3 px-3.5 w-[25%] bg-slate-100">Asset / Equipment Name</th>
                      <th className="py-3 px-3 w-[15%] bg-slate-100">Store</th>
                      <th className="py-3 px-3.5 w-[28%] bg-slate-100">Work Completed</th>
                      <th className="py-3 px-2.5 w-[8%] text-center bg-slate-100">Tech Hrs</th>
                      <th className="py-3 px-3 w-[12%] text-right font-black bg-slate-100">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {activeSectorData.repairs.map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-50/70 bg-white">
                        <td className="py-3 px-3 font-mono font-bold text-slate-800 bg-white">{rep.id}</td>
                        <td className="py-3 px-3.5 font-bold text-slate-900 bg-white">{rep.asset}</td>
                        <td className="py-3 px-3 text-slate-600 bg-white">{rep.store}</td>
                        <td className="py-3 px-3.5 text-slate-700 bg-white">{rep.workCompleted}</td>
                        <td className="py-3 px-2.5 text-center font-mono font-semibold text-slate-700 bg-white">
                          {rep.techHours}h
                        </td>
                        <td className="py-3 px-3 text-right font-black text-slate-900 font-mono text-sm bg-white">
                          ${rep.totalCost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold text-slate-900">
                    <tr>
                      <td colSpan={4} className="py-3 px-3.5 text-right text-xs uppercase tracking-wider text-slate-600 bg-slate-50">
                        Total Direct Sector Repair & Equipment Cost:
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono bg-slate-50">
                        {activeSectorData.repairs.reduce((acc, r) => acc + r.techHours, 0).toFixed(1)}h
                      </td>
                      <td className="py-3 px-3 text-right font-black text-blue-700 font-mono text-sm bg-slate-50">
                        {activeSectorData.totalExpense}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Part IV: Sector Health & SLA Scorecard */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-blue-600" />
                <span>Part IV: Departmental SLA & Health Metrics</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeSectorData.healthMetrics.map((metric, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold truncate">
                      {metric.label}
                    </span>
                    <strong className="text-lg font-black text-slate-900 block">{metric.score}%</strong>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Status</span>
                      <strong className="text-emerald-600 font-bold">{metric.status}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Certification & Lead Sign-Off */}
            <div className="pt-4 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <span>
                  Sector Verification: <strong>Signed & Certified by Department Lead</strong>
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Authorized Sign-off</span>
                  <span className="font-serif italic text-slate-900 text-sm font-bold">{activeSectorData.leadOwner}</span>
                </div>
                <div className="border border-slate-300 rounded-md px-2.5 py-1 font-mono text-[10px] text-slate-700 bg-slate-50 font-bold shadow-2xs">
                  STAMP: SEC-{selectedSector.toUpperCase()}-VERIFIED
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full White Sticky Modal Bottom Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <span>Click Download PDF to export this sector report as vector printable A4 document</span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 font-bold text-slate-700 cursor-pointer shadow-2xs"
            >
              Close Preview
            </button>
            <button
              type="button"
              onClick={handlePrintPDF}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2 font-bold text-white shadow-sm shadow-blue-500/25 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download {activeSectorData.id === "all" ? "Master" : "Sector"} PDF Report</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
