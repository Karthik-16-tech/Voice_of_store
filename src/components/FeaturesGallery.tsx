import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";

import futureStateImage from "@/assets/feautures/future-state.jpg";
import karaAgentImage from "@/assets/feautures/kara-agent.jpg";
import neuralSystemsImage from "@/assets/feautures/neural-systems.jpg";
import newInterfacesImage from "@/assets/feautures/new-interfaces.jpg";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  {
    id: "01",
    eyebrow: "AI ASSISTANT",
    statusText: "Connected",
    title: "AI Operations Copilot",
    headline: "Voice of Store AI",
    statement: ["INTELLIGENT 3D COPILOT", "FOR INCIDENT TRIAGE", "AND SECTOR HEALTH."],
    description: "Voice-driven incident triage, real-time store monitoring, and interactive operational diagnosis.",
    image: karaAgentImage,
    imageAlt: "Voice of Store AI Assistant",
    link: "/dashboard",
  },
  {
    id: "02",
    eyebrow: "STORE TWIN",
    statusText: "Active",
    title: "3D Store Environment",
    headline: "Digital Twin 3D.",
    statement: ["INTERACTIVE SPATIAL", "STORE RECONSTRUCTION", "AND HOTSPOTS."],
    description: "Real-time 3D store visualization, telemetry overlays, and spatial incident locator.",
    image: neuralSystemsImage,
    imageAlt: "3D Digital Twin Environment",
    link: "/environment",
  },
  {
    id: "03",
    eyebrow: "INTELLIGENCE ENGINE",
    statusText: "Live Feed",
    title: "Voice-of-Store Engine",
    headline: "Solve the right problem.",
    statement: ["AUTOMATIC ROUTING", "FROM SIGNALS TO", "OPERATIONAL TEAMS."],
    description: "Customer feedback mapping, sector triage, critical alerts, and financial impact analytics.",
    image: newInterfacesImage,
    imageAlt: "Voice-of-Store Engine Dashboard",
    link: "/app-dashboard",
  },
  {
    id: "04",
    eyebrow: "EXECUTIVE ADMIN",
    statusText: "Synchronized",
    title: "Retail Operations Admin",
    headline: "See every signal.",
    statement: ["ENTERPRISE FEEDBACK", "SECTOR PERFORMANCE", "AND ACTION QUEUE."],
    description: "Cross-store executive reporting, resolution tracking, trend visualization, and task dispatching.",
    image: futureStateImage,
    imageAlt: "Retail Operations Overview Admin",
    link: "/admin",
  },
];

export function FeaturesGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const cardDomsRef = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // Setup GSAP ScrollTrigger pinning and card animations
  useEffect(() => {
    const section = sectionRef.current;
    const pinTarget = pinTargetRef.current;
    if (!section || !pinTarget) return;

    // Direct manual application helper to avoid react reconciliation conflicts
    const applyTransform = (idx: number, progressVirtual: number) => {
      const dom = cardDomsRef.current[idx];
      if (!dom) return;

      const offset = progressVirtual - idx;
      let x = 0;
      let opacity = 0;
      let scale = 1;

      if (offset < 0) {
        // Upcoming card (slides in from right)
        const off = Math.min(1, Math.abs(offset));
        x = off * 75;
        opacity = Math.max(0, 1 - off * 1.5);
        scale = 1 - off * 0.05;
      } else if (offset > 0) {
        // Passed card (slides out to left)
        const off = Math.min(1, offset);
        x = -off * 55;
        opacity = Math.max(0, 1 - off * 1.5);
        scale = 1 - off * 0.05;
      } else {
        x = 0;
        opacity = 1;
        scale = 1;
      }

      dom.style.transform = `translate3d(${x}%, 0, 0) scale(${scale})`;
      dom.style.opacity = `${opacity}`;
      dom.style.visibility = opacity < 0.01 ? "hidden" : "visible";
      dom.style.pointerEvents = Math.abs(offset) < 0.4 ? "auto" : "none";
    };

    // Initialize initial cards
    projects.forEach((_, i) => applyTransform(i, 0));

    // GSAP ScrollTrigger pinning
    const totalSteps = projects.length - 1; // 3 transitions
    const scrollDistance = Math.max(1200, Math.round(window.innerHeight * 1.6));

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${scrollDistance}`,
      pin: pinTarget,
      pinSpacing: true,
      anticipatePin: 1,
      fastScrollEnd: true,
      onUpdate: (self) => {
        const rawProgress = self.progress;
        const virtual = rawProgress * totalSteps;
        const nearestIdx = Math.min(projects.length - 1, Math.max(0, Math.round(virtual)));
        setActiveIndex(nearestIdx);

        projects.forEach((_, i) => applyTransform(i, virtual));
      },
    });

    triggerRef.current = st;

    return () => {
      st.kill();
      triggerRef.current = null;
    };
  }, []);

  // Jump to specific card when clicking tabs or arrows
  const goToCard = (index: number) => {
    const st = triggerRef.current;
    if (!st) {
      setActiveIndex(index);
      return;
    }

    const targetProgress = index / (projects.length - 1);
    const targetScroll = st.start + targetProgress * (st.end - st.start);
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative w-full bg-[#fbfcff] text-slate-900 border-t border-slate-100"
      aria-label="Selected work and explorations"
    >
      {/* Pinned presentation viewport */}
      <div
        ref={pinTargetRef}
        className="w-full min-h-[580px] max-h-screen py-10 sm:py-14 lg:py-16 flex items-center justify-center overflow-hidden"
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* ── LEFT COLUMN: Section Title, Navigation & Dashboard Link ── */}
            <div className="lg:col-span-5 flex flex-col justify-center text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600 mb-2 block">
                Platform Engines
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] leading-[1.08] text-slate-950">
                Selected work
                <br />
                &amp; explorations
              </h2>

              {/* Interactive engine selector pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {projects.map((proj, idx) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => goToCard(idx)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider font-semibold transition-all ${
                      activeIndex === idx
                        ? "bg-slate-950 text-white shadow-sm"
                        : "bg-slate-100/90 text-slate-600 hover:bg-slate-200/80"
                    }`}
                  >
                    0{idx + 1} {proj.eyebrow}
                  </button>
                ))}
              </div>

              {/* View Dashboard Link + Counter + Step Arrows */}
              <div className="mt-8 flex items-center justify-between sm:justify-start sm:gap-8 pt-4 border-t border-slate-200/70">
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center gap-2.5 text-xs sm:text-[13px] uppercase font-mono tracking-[0.16em] text-slate-950 border-b-2 border-slate-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-colors"
                >
                  <span className="font-bold">VIEW DASHBOARD</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>

                {/* Counter & navigation arrows */}
                <div className="flex items-center gap-3">
                  <div className="text-xs font-mono text-slate-500 font-medium">
                    <span className="text-slate-950 font-bold">0{activeIndex + 1}</span> / 0{projects.length}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => goToCard(Math.max(0, activeIndex - 1))}
                      disabled={activeIndex === 0}
                      className="p-1 rounded-md text-slate-600 hover:text-slate-950 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
                      aria-label="Previous engine"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToCard(Math.min(projects.length - 1, activeIndex + 1))}
                      disabled={activeIndex === projects.length - 1}
                      className="p-1 rounded-md text-slate-600 hover:text-slate-950 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
                      aria-label="Next engine"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Animated Pinned Engine Card ── */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end">
              <div
                id="project-cards"
                className="relative w-full max-w-[480px] sm:max-w-[530px] lg:max-w-[560px] h-[360px] sm:h-[390px]"
              >
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    ref={(el) => {
                      cardDomsRef.current[index] = el;
                    }}
                    className="absolute inset-0 w-full h-full flex flex-col justify-between will-change-transform"
                    style={{
                      transform: index === 0 ? "translate3d(0, 0, 0)" : "translate3d(75%, 0, 0)",
                      opacity: index === 0 ? 1 : 0,
                    }}
                    aria-hidden={activeIndex !== index}
                  >
                    {/* Media Card */}
                    <div className="relative w-full h-[270px] sm:h-[295px] rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 group">
                      <img
                        src={project.image}
                        alt={project.imageAlt}
                        className="w-full h-full object-cover object-center filter brightness-[0.96] contrast-[1.05] transition-transform duration-700 group-hover:scale-[1.03]"
                        loading={index === 0 ? "eager" : "lazy"}
                      />

                      {/* Vignette / Gradient overlays */}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-slate-950/50 pointer-events-none"
                        aria-hidden="true"
                      />

                      {/* Top Overlay: Status Badge + Statement */}
                      <div className="absolute top-4 left-4 sm:top-5 sm:left-5 right-4 sm:right-5 flex flex-col items-start z-10 pointer-events-none">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/90 backdrop-blur-md px-3 py-1 mb-2.5 shadow-sm">
                          <span
                            className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"
                            aria-hidden="true"
                          />
                          <div className="flex flex-col text-left leading-none">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-900">
                              {project.eyebrow}
                            </span>
                            <span className="text-[8.5px] text-emerald-600 font-semibold mt-0.5">
                              {project.statusText}
                            </span>
                          </div>
                        </div>

                        {/* Statement */}
                        <div className="text-[9px] sm:text-[9.5px] font-mono tracking-[0.14em] uppercase text-slate-200 leading-tight space-y-0.5 text-left max-w-xs drop-shadow-md">
                          {project.statement.map((line) => (
                            <div key={line}>{line}</div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Headline inside image */}
                      <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 z-10 pointer-events-none">
                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white inline-block border-b-2 border-white/30 pb-0.5 drop-shadow-lg">
                          {project.headline}
                        </h3>
                      </div>
                    </div>

                    {/* Footer Row below the Media Card */}
                    <div className="flex items-start justify-between gap-3 pt-3 px-1 text-left">
                      <div className="max-w-[360px]">
                        <h4 className="text-base sm:text-[17px] font-bold text-slate-900 mb-0.5 tracking-tight">
                          {project.title}
                        </h4>
                        <p className="text-[11.5px] sm:text-[12px] text-slate-500 font-normal leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <Link
                        to={project.link}
                        className="group flex-shrink-0 inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] text-blue-600 border-b border-blue-300 pb-0.5 hover:text-blue-700 hover:border-blue-600 transition-colors font-bold"
                      >
                        <span>OPEN ENGINE</span>
                        <ArrowRight
                          size={12}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesGallery;
