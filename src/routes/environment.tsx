import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { StoreScene, type RenderMode, type SceneHandle } from "@/components/store/StoreScene";
import { DEPARTMENTS, INCIDENTS, SEVERITY_LABEL, STORE, type Incident, type Severity } from "@/lib/store-data";
import { StoreBottomDashboard } from "@/components/store/StoreBottomDashboard";

export const Route = createFileRoute("/environment")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Voice of Store — 3D Retail Digital Twin" },
      {
        name: "description",
        content:
          "Explore store operations in 3D. Inspect incidents, review evidence, and trace every issue to its source.",
      },
      { property: "og:title", content: "Voice of Store — 3D Retail Digital Twin" },
      {
        property: "og:description",
        content: "An interactive 3D supermarket digital twin for retail incident investigation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DigitalTwinEnvironment,
});

const SEV_HEX: Record<Severity, string> = {
  critical: "#e5484d",
  high: "#f5a524",
  medium: "#2f7cf6",
  low: "#9fb6cc",
};

const navLinks = [
  { id: "ai-assistant", label: "AI Assistant", href: "/dashboard" },
  { id: "environment", label: "3D Environment", href: "/environment" },
  { id: "app-dashboard", label: "App Dashboard", href: "/app-dashboard" },
] as const;

function DigitalTwinEnvironment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scene = useRef<SceneHandle>(null);
  const [mode, setMode] = useState<RenderMode>("hybrid");
  const [dept, setDept] = useState<string | null>(null);
  const [incidentId, setIncidentId] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>(INCIDENTS);
  const [note, setNote] = useState<string | null>(null);

  const incident = incidents.find((i) => i.id === incidentId) ?? null;
  const deptObj = DEPARTMENTS.find((d) => d.id === dept) ?? null;
  const deptIncidents = useMemo(() => incidents.filter((i) => i.departmentId === dept), [incidents, dept]);
  const open = incidents.length;
  const critical = incidents.filter((i) => i.severity === "critical").length;
  const unlocated = incidents.filter((i) => !i.departmentId).length;

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectDept = (id: string | null) => {
    setDept(id);
    setIncidentId(null);
    setNote(null);
    if (id) scene.current?.focus(id);
  };

  const selectIncident = (inc: Incident) => {
    setDept(inc.departmentId);
    setIncidentId(inc.id);
    setNote(null);
    if (inc.departmentId) scene.current?.focus(inc.departmentId);
  };

  const reset = () => {
    setDept(null);
    setIncidentId(null);
    scene.current?.reset();
    scrollToTop();
  };

  const update = (patch: Partial<Incident>, msg: string) => {
    if (!incident) return;
    setIncidents((l) => l.map((i) => (i.id === incident.id ? { ...i, ...patch } : i)));
    setNote(msg);
  };

  return (
    <div
      ref={containerRef}
      className="dot-grid min-h-screen w-full overflow-y-auto overflow-x-hidden text-neutral-900 select-none bg-[#fbf9f5] scroll-smooth"
    >
      {/* ---------------- 3D Environment Section (Full Viewport) ---------------- */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        {/* 3D Scene Layer */}
        <div className="absolute inset-0">
          <StoreScene
            ref={scene}
            mode={mode}
            selectedDept={dept}
            selectedIncident={incidentId}
            onSelectDept={selectDept}
            onSelectIncident={selectIncident}
          />
        </div>

        {/* Top Header */}
        <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between p-4 sm:p-6 md:px-9">
          {/* Brand */}
          <div className="pointer-events-auto flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity" title="Back to Home">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-neutral-900" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M4 21V11a8 8 0 0 1 16 0v10M9 21v-9a3 3 0 0 1 6 0v9" />
              </svg>
              <div className="leading-none text-left">
                <div className="text-[17px] font-bold tracking-tight text-neutral-900">VOICE OF STORE</div>
                <div className="mt-1 text-[9px] tracking-[0.32em] text-neutral-500 font-medium">STORE DIGITAL TWIN</div>
              </div>
            </Link>
          </div>

          {/* Global Navigation Pills */}
          <div className="pointer-events-auto hidden md:flex items-center">
            <nav
              className="flex items-center gap-1 rounded-full p-1 bg-white/75 backdrop-blur-md border border-neutral-200/80 shadow-sm"
              aria-label="Dashboard pages"
            >
              {navLinks.map((item) => {
                const isActive = item.id === "environment";
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={`rounded-full px-3.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-neutral-900 text-white shadow-sm"
                        : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Dropdowns & Reset View */}
          <div className="pointer-events-auto flex items-center gap-2">
            <div className="glass flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-neutral-800 shadow-sm cursor-pointer hover:bg-white transition">
              <span>Store {STORE.id}</span>
              <span className="text-[10px] text-neutral-400">▾</span>
            </div>
            <div className="glass hidden sm:flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-neutral-800 shadow-sm cursor-pointer hover:bg-white transition">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{STORE.region}</span>
              <span className="text-[10px] text-neutral-400">▾</span>
            </div>
            <button
              onClick={reset}
              className="glass flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-neutral-800 transition hover:bg-white active:scale-95 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M21 21v-5h-5" />
              </svg>
              <span>Reset View</span>
            </button>
          </div>
        </header>

        {/* Right Floating Toolbar */}
        <div className="glass absolute right-6 top-28 z-30 flex flex-col items-center gap-1 rounded-2xl p-1.5 md:right-9 shadow-lg">
          <ToolBtn label="Zoom in" onClick={() => scene.current?.zoom(0.75)}>+</ToolBtn>
          <ToolBtn label="Zoom out" onClick={() => scene.current?.zoom(1.3)}>−</ToolBtn>
          <div className="my-1 h-px w-6 bg-neutral-200" />
          {(["hybrid", "solid", "wire"] as RenderMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`w-16 rounded-lg py-1.5 text-[11px] font-medium capitalize transition ${
                mode === m
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              {m === "wire" ? "Wireframe" : m}
            </button>
          ))}
        </div>

        {/* Left Inspection Drawer: incident / department */}
        {(incident || deptObj) && (
          <aside className="glass animate-in-soft absolute left-6 top-24 z-30 w-[340px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-12rem)] overflow-y-auto rounded-2xl p-4 md:left-9 shadow-xl border border-neutral-200/90 bg-white/90">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-neutral-900">
                {incident && (
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: SEV_HEX[incident.severity] }}
                  />
                )}
                {deptObj?.name ?? "Unlocated"}
              </div>
              <button
                onClick={() => {
                  setDept(null);
                  setIncidentId(null);
                }}
                aria-label="Close"
                className="text-neutral-400 hover:text-neutral-800 font-medium px-1 rounded hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            {incident ? (
              <div className="mt-3">
                <span
                  className="inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm"
                  style={{ backgroundColor: SEV_HEX[incident.severity] }}
                >
                  {SEVERITY_LABEL[incident.severity]}
                </span>
                <h2 className="mt-2 text-lg font-semibold leading-tight tracking-tight text-neutral-900">{incident.title}</h2>
                <blockquote className="mt-3 rounded-xl bg-neutral-100/90 border border-neutral-200/60 px-3 py-2 text-[13px] text-neutral-700">
                  “{incident.feedback}” <span className="block pt-1 text-[11px] font-medium text-neutral-500">— {incident.source}</span>
                </blockquote>
                <dl className="mt-3 grid grid-cols-[96px_1fr] gap-y-1.5 text-[12.5px]">
                  <Row k="Detected" v={incident.detectedAt} />
                  <Row k="Store" v={`${STORE.id} · ${STORE.name}`} />
                  <Row k="Category" v={incident.category} />
                  <Row k="Assigned" v={incident.owner ?? "Unassigned"} />
                  <Row k="Status" v={incident.status} />
                  <Row k="AI confidence" v={`${Math.round(incident.aiConfidence * 100)}%`} />
                </dl>
                <button
                  disabled
                  title="Full incident view needs a connected incident system"
                  className="mt-4 w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60 cursor-not-allowed"
                >
                  View Full Incident →
                </button>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => update({ owner: "You" }, "Assigned to you (demo, not saved)")}
                    className="rounded-xl border border-neutral-200 bg-white py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 active:scale-95 transition"
                  >
                    Assign Owner
                  </button>
                  <button
                    onClick={() => update({ status: "Escalated" }, "Escalated (demo, not saved)")}
                    className="rounded-xl border border-neutral-200 bg-white py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 active:scale-95 transition"
                  >
                    Escalate
                  </button>
                </div>
                {note && <p className="mt-2 text-center text-[11px] font-medium text-neutral-600 bg-neutral-100 py-1 rounded">{note}</p>}
                {deptIncidents.length > 1 && (
                  <IncidentList list={deptIncidents} current={incident.id} onPick={selectIncident} />
                )}
              </div>
            ) : deptIncidents.length ? (
              <IncidentList list={deptIncidents} current={null} onPick={selectIncident} />
            ) : (
              <p className="mt-3 text-sm text-neutral-500">No open incidents in this department.</p>
            )}
          </aside>
        )}

        {/* Lower-left Callout when nothing selected */}
        {!incident && !deptObj && (
          <div className="absolute bottom-8 left-6 z-20 max-w-sm md:left-9">
            <p className="text-[15px] leading-snug text-neutral-600">
              Explore store operations in 3D. Inspect incidents, review evidence, and trace every issue to its source.
            </p>
            <button
              onClick={() => {
                const f = incidents.find((i) => i.severity === "critical") ?? incidents[0];
                if (f) selectIncident(f);
              }}
              className="mt-5 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-800 active:scale-95"
            >
              Explore Store →
            </button>
          </div>
        )}

        {/* Bottom Center Severity Legend */}
        <div className="glass absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 gap-5 rounded-full px-5 py-2 text-xs font-semibold text-neutral-700 lg:flex shadow-md">
          {(Object.keys(SEVERITY_LABEL) as Severity[]).map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SEV_HEX[s] }} />
              {SEVERITY_LABEL[s]}
            </span>
          ))}
        </div>

        {/* Bottom Right Store Context Card (Matching Reference Design) */}
        <aside className="glass absolute bottom-8 right-6 z-20 hidden w-[310px] rounded-2xl p-4 md:right-9 md:block shadow-xl border border-neutral-200/80 bg-white/85">
          <div className="flex items-start gap-3">
            {/* Store Thumbnail Preview */}
            <div className="w-12 h-10 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200/80 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 40 30" className="w-full h-full object-cover text-neutral-400" fill="none">
                <rect x="2" y="6" width="36" height="20" rx="3" fill="#e2e8f0" stroke="#cbd5e1" />
                <path d="M2 13 H38" stroke="#94a3b8" strokeWidth="0.8" />
                <path d="M14 13 V26" stroke="#94a3b8" strokeWidth="0.8" />
                <path d="M26 13 V26" stroke="#94a3b8" strokeWidth="0.8" />
                <rect x="17" y="18" width="6" height="8" fill="#3b82f6" opacity="0.6" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="text-[15px] font-bold tracking-tight text-neutral-900 leading-none">
                  Store {STORE.id}
                </div>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 truncate mt-1">
                {STORE.name} · {STORE.region}
              </div>
            </div>
          </div>

          <dl className="mt-3.5 space-y-2 text-[12.5px]">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-neutral-500">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                <span>Open incidents</span>
              </dt>
              <dd className="font-bold text-neutral-900">{open}</dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-neutral-500">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#e5484d]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Critical incidents</span>
              </dt>
              <dd className="font-bold text-[#e5484d]">{critical}</dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-neutral-500">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                </svg>
                <span>Unlocated</span>
              </dt>
              <dd>
                <button
                  className="font-bold text-neutral-900 underline-offset-2 hover:underline cursor-pointer"
                  onClick={() => {
                    const u = incidents.find((i) => !i.departmentId);
                    if (u) selectIncident(u);
                  }}
                >
                  {unlocated}
                </button>
              </dd>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-200/80 pt-2 text-[11.5px]">
              <dt className="flex items-center gap-2 text-neutral-500">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Last updated</span>
              </dt>
              <dd className="text-neutral-700 font-medium">{STORE.lastUpdated}</dd>
            </div>
          </dl>
        </aside>

        {/* Scroll Down Indicator */}
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium animate-bounce z-10">
          <span>Scroll for dashboard</span>
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* ---------------- Bottom Dashboard Section (Directly Beneath) ---------------- */}
      <StoreBottomDashboard
        onSelectDept={selectDept}
        onSelectIncident={selectIncident}
        onScrollToTop={scrollToTop}
      />
    </div>
  );
}

function ToolBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-lg text-lg text-neutral-700 font-semibold hover:bg-neutral-100 active:scale-95 transition"
    >
      {children}
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-neutral-500 font-medium">{k}</dt>
      <dd className="text-neutral-800">{v}</dd>
    </>
  );
}

function IncidentList({ list, current, onPick }: { list: Incident[]; current: string | null; onPick: (i: Incident) => void }) {
  return (
    <ul className="mt-3 space-y-1 border-t border-neutral-200 pt-3">
      {list.map((i) => (
        <li key={i.id}>
          <button
            onClick={() => onPick(i)}
            className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] hover:bg-neutral-100 transition ${
              current === i.id ? "bg-neutral-100 font-medium" : "text-neutral-700"
            }`}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: SEV_HEX[i.severity] }}
            />
            <span className="flex-1 truncate">{i.title}</span>
            <span className="text-[11px] text-neutral-400 font-mono">{i.id}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default DigitalTwinEnvironment;
