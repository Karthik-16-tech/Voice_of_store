import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
  Package,
  Clock,
  ShieldCheck,
  Building2,
  DollarSign,
  TrendingUp,
  Sparkles,
  ChevronDown,
  Layers,
  Wrench,
} from "lucide-react";

export type ReportTimeWindow = "Daily" | "Weekly" | "Monthly";
export type ReportRegion = "All Regions" | "North Region" | "South Region" | "West Region" | "East Region";

interface MegaReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTimeWindow?: ReportTimeWindow;
  defaultRegion?: ReportRegion;
}

export function MegaReportDialog({
  open,
  onOpenChange,
  defaultTimeWindow = "Weekly",
  defaultRegion = "All Regions",
}: MegaReportDialogProps) {
  const [timeWindow, setTimeWindow] = useState<ReportTimeWindow>(defaultTimeWindow);
  const [region, setRegion] = useState<ReportRegion>(defaultRegion);

  // Dynamic Metrics by selected Time Window
  const feedbackTotals: Record<
    ReportTimeWindow,
    { count: string; actionable: string; critical: string; expense: string; resolvedRate: string }
  > = {
    Daily: { count: "412", actionable: "9", critical: "1 Active", expense: "$3,965", resolvedRate: "98.2%" },
    Weekly: { count: "2,840", actionable: "48", critical: "3 Total", expense: "$18,450", resolvedRate: "97.6%" },
    Monthly: { count: "12,840", actionable: "194", critical: "7 Total", expense: "$64,200", resolvedRate: "96.8%" },
  };

  const handlePrintPDF = () => {
    const printContent = document.getElementById("vos-full-white-report-printable");
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
          <title>Voice of Store — Executive Intelligence & Operational Expense Report (${region} • ${timeWindow})</title>
          <style>
            @page { size: A4 portrait; margin: 10mm 12mm; }
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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
            .tag-success { background-color: #dcfce7 !important; color: #15803d !important; border: 1px solid #bbf7d0; }
            .tag-slate { background-color: #f1f5f9 !important; color: #475569 !important; border: 1px solid #e2e8f0; }
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
              .no-print { display: none !important; }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[94vh] p-0 border border-slate-200 bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col font-sans">
        {/* Full White Top Executive Action Toolbar */}
        <div className="z-30 flex flex-wrap items-center justify-between gap-3 bg-white text-slate-800 px-6 py-3.5 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/30">
              <FileText className="h-4.5 w-4.5" />
            </span>
            <div className="leading-tight">
              <DialogTitle className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Executive Operational & Expense Report</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-blue-200">
                  Full White Document
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                Voice of Store Retail Intelligence Platform • Official Operational Audit
              </DialogDescription>
            </div>
          </div>

          {/* User Controls: Cadence, Region & Instant Export */}
          <div className="flex items-center gap-2.5">
            {/* Cadence Selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
              {(["Daily", "Weekly", "Monthly"] as ReportTimeWindow[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTimeWindow(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    timeWindow === tab ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Region Selector */}
            <div className="relative">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as ReportRegion)}
                className="appearance-none bg-white text-slate-800 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold pr-7 outline-none hover:border-slate-300 cursor-pointer shadow-2xs"
              >
                <option>All Regions</option>
                <option>North Region</option>
                <option>South Region</option>
                <option>West Region</option>
                <option>East Region</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrintPDF}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Print</span>
            </button>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handlePrintPDF}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-blue-500/25 transition cursor-pointer"
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

        {/* Full White Document Body Container */}
        <div className="flex-1 bg-white overflow-y-auto p-6 sm:p-10 text-slate-900">
          <div id="vos-full-white-report-printable" className="max-w-4xl mx-auto space-y-6 bg-white">
            {/* Header Document Banner with Official VoS Logo */}
            <div className="border-b-2 border-blue-600 pb-5 flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                {/* Official Vector Logo */}
                <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M4 21V11a8 8 0 0 1 16 0v10M9 21v-9a3 3 0 0 1 6 0v9" />
                    <circle cx="12" cy="7" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black tracking-tight text-slate-900 uppercase">
                      VOICE OF STORE
                    </span>
                    <span className="text-[10px] font-bold tracking-widest text-blue-700 uppercase bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      ENTERPRISE RETAIL INTELLIGENCE
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 leading-snug">
                    Executive Store Operations, Customer Feedback & Repair Expense Report
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Coverage: <strong className="text-slate-800">{region} (42 Operating Stores)</strong> • Audit Cadence:{" "}
                    <strong className="text-blue-600 font-bold">{timeWindow} Comprehensive</strong> • Document Ref:{" "}
                    <code className="font-mono text-slate-700 font-bold">VOS-EXEC-{timeWindow.toUpperCase()}-2026-X84</code>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">
                  CONFIDENTIAL • BOARD AUDIT
                </span>
                <span className="text-xs text-slate-400 block mt-1.5 font-mono">
                  Generated: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Part I: High-Impact Operational KPIs */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Part I: High-Impact Operational Scorecard ({timeWindow})</span>
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Customer Feedbacks</span>
                  <strong className="text-2xl font-black text-slate-900 block mt-1">
                    {feedbackTotals[timeWindow].count}
                  </strong>
                  <span className="text-xs text-emerald-600 font-bold mt-0.5 block">↑ 12.4% vs prior {timeWindow.toLowerCase()}</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Actionable Issues</span>
                  <strong className="text-2xl font-black text-slate-900 block mt-1">
                    {feedbackTotals[timeWindow].actionable}
                  </strong>
                  <span className="text-xs text-purple-600 font-bold mt-0.5 block">100% Triage Resolution Rate</span>
                </div>
                <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
                  <span className="text-[11px] font-bold text-rose-700 uppercase block">Critical Incidents</span>
                  <strong className="text-2xl font-black text-rose-600 block mt-1">
                    {feedbackTotals[timeWindow].critical}
                  </strong>
                  <span className="text-xs text-rose-600 font-bold mt-0.5 block">100% Contained (Zero Recall)</span>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                  <span className="text-[11px] font-bold text-blue-700 uppercase block">Net Repair Expenses</span>
                  <strong className="text-2xl font-black text-blue-700 block mt-1">
                    {feedbackTotals[timeWindow].expense}
                  </strong>
                  <span className="text-xs text-blue-600 font-bold mt-0.5 block">5 High-Priority Assets Serviced</span>
                </div>
              </div>
            </div>

            {/* Part II: Direct Correlation Table: Customer Feedback ➔ Affected Sector ➔ Repairs Executed ➔ Expenses */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Wrench className="h-3.5 w-3.5 text-blue-600" />
                  <span>Part II: Customer Feedback ➔ Affected Sector ➔ Repairs Executed & Itemized Expenses</span>
                </h2>
                <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  Net Repair Spend: {feedbackTotals[timeWindow].expense}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left border-collapse text-xs bg-white">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3.5 w-[25%] bg-slate-100">Customer Feedback Trigger</th>
                      <th className="py-3 px-3 w-[15%] bg-slate-100">Affected Sector</th>
                      <th className="py-3 px-3 w-[15%] bg-slate-100">Store Location</th>
                      <th className="py-3 px-3.5 w-[25%] bg-slate-100">Repair Action Executed</th>
                      <th className="py-3 px-3 w-[10%] text-right bg-slate-100">Parts + Labor</th>
                      <th className="py-3 px-3.5 w-[10%] text-right font-black bg-slate-100">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    <tr className="hover:bg-slate-50/70 bg-white">
                      <td className="py-3 px-3.5 font-medium text-slate-900 bg-white">
                        "Customer noticed prepared almond croissants lacked mandatory bold nut allergy disclosure."
                      </td>
                      <td className="py-3 px-3 bg-white">
                        <span className="inline-block rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                          Food Safety
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-semibold bg-white">Store 042 (Bakery)</td>
                      <td className="py-3 px-3.5 text-slate-700 bg-white">
                        Replaced thermal printhead on Printer #B2, loaded FSMA bold schema, recalibrated sensor.
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-right font-mono bg-white">$180 + $200</td>
                      <td className="py-3 px-3.5 text-right font-black text-slate-900 font-mono text-sm bg-white">$380</td>
                    </tr>

                    <tr className="hover:bg-slate-50/70 bg-white">
                      <td className="py-3 px-3.5 font-medium text-slate-900 bg-white">
                        "Dairy lead logged walk-in freezer C4 defrost temperature climb spiking to -8.2°C."
                      </td>
                      <td className="py-3 px-3 bg-white">
                        <span className="inline-block rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          Cold Chain
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-semibold bg-white">Store 018 (Produce)</td>
                      <td className="py-3 px-3.5 text-slate-700 bg-white">
                        Replaced defrost solenoid relay, topped-up R448A refrigerant, continuous chill test to -17.8°C.
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-right font-mono bg-white">$480 + $440</td>
                      <td className="py-3 px-3.5 text-right font-black text-slate-900 font-mono text-sm bg-white">$920</td>
                    </tr>

                    <tr className="hover:bg-slate-50/70 bg-white">
                      <td className="py-3 px-3.5 font-medium text-slate-900 bg-white">
                        "Shoppers reported 20-min register delay; optical scanner duplicated carton barcodes."
                      </td>
                      <td className="py-3 px-3 bg-white">
                        <span className="inline-block rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                          Front-End
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-semibold bg-white">Store 027 (Checkout)</td>
                      <td className="py-3 px-3.5 text-slate-700 bg-white">
                        Re-routed Cat6 STP cabling, replaced damaged RJ45 patch cord, reconfigured switch port.
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-right font-mono bg-white">$290 + $350</td>
                      <td className="py-3 px-3.5 text-right font-black text-slate-900 font-mono text-sm bg-white">$640</td>
                    </tr>

                    <tr className="hover:bg-slate-50/70 bg-white">
                      <td className="py-3 px-3.5 font-medium text-slate-900 bg-white">
                        "Produce department customer remarked AC unit blowing warm air across fruit endcaps."
                      </td>
                      <td className="py-3 px-3 bg-white">
                        <span className="inline-block rounded-md bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                          Facilities
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-semibold bg-white">Store 018 (HVAC)</td>
                      <td className="py-3 px-3.5 text-slate-700 bg-white">
                        Replaced secondary condenser fan bearing assembly, flushed condensate drain line.
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-right font-mono bg-white">$980 + $870</td>
                      <td className="py-3 px-3.5 text-right font-black text-slate-900 font-mono text-sm bg-white">$1,850</td>
                    </tr>

                    <tr className="hover:bg-slate-50/70 bg-white">
                      <td className="py-3 px-3.5 font-medium text-slate-900 bg-white">
                        "Beacon notice: Accidental 1-gallon milk spill in Aisle 4 causing slip hazard."
                      </td>
                      <td className="py-3 px-3 bg-white">
                        <span className="inline-block rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Custodial
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-semibold bg-white">Store 009 (Aisle 4)</td>
                      <td className="py-3 px-3.5 text-slate-700 bg-white">
                        Dispatched commercial wet-vac and anti-slip absorbent compound; deployed safety cones.
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-right font-mono bg-white">$95 + $80</td>
                      <td className="py-3 px-3.5 text-right font-black text-slate-900 font-mono text-sm bg-white">$175</td>
                    </tr>
                  </tbody>

                  <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold text-slate-900">
                    <tr>
                      <td colSpan={4} className="py-3 px-3.5 text-right text-xs uppercase tracking-wider text-slate-600 bg-slate-50">
                        Itemized Direct Incident Repairs Total:
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700 bg-slate-50">$2,025 + $1,940</td>
                      <td className="py-3 px-3.5 text-right font-black text-blue-700 font-mono text-sm bg-slate-50">
                        $3,965
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Part III: Sector-by-Sector Operational Health & Breakdown */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-blue-600" />
                <span>Part III: Sector Operational Health & Expense Allocation ({timeWindow})</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Food Safety</span>
                  <strong className="text-base font-black text-slate-900 block">$380</strong>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Health</span>
                    <strong className="text-emerald-600 font-bold">91%</strong>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Cold Chain</span>
                  <strong className="text-base font-black text-slate-900 block">$920</strong>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Health</span>
                    <strong className="text-emerald-600 font-bold">88%</strong>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Front-End POS</span>
                  <strong className="text-base font-black text-slate-900 block">$640</strong>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Health</span>
                    <strong className="text-emerald-600 font-bold">84%</strong>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Facilities HVAC</span>
                  <strong className="text-base font-black text-slate-900 block">$1,850</strong>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Health</span>
                    <strong className="text-emerald-600 font-bold">86%</strong>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Custodial Safety</span>
                  <strong className="text-base font-black text-slate-900 block">$175</strong>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Health</span>
                    <strong className="text-emerald-600 font-bold">96%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Audit Certification & Executive Sign-off */}
            <div className="pt-4 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <span>
                  Regulatory Compliance: <strong>Passed FSMA Section 204 & OSHA 1910 Audit Protocol</strong>
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Executive Sign-Off</span>
                  <span className="font-serif italic text-slate-900 text-sm font-bold">Marcus Vance, VP Retail Operations</span>
                </div>
                <div className="border border-slate-300 rounded-md px-2.5 py-1 font-mono text-[10px] text-slate-700 bg-slate-50 font-bold shadow-2xs">
                  CERT-STAMP: VOS-2026-BOARD
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full White Sticky Modal Bottom Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <span>Click Download PDF to export full vector printable A4 report</span>
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
              <span>Download PDF Report</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
