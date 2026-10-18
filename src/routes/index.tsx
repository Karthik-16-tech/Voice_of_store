import { createFileRoute, Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowRight,
  Menu,
  Play,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import storeHeroVideo from "@/assets/gemini_generated_video_6d31b3fd.mp4";
import AboutSection from "@/components/AboutSection";
import Experience from "@/components/Experience";
import { FeaturesGallery } from "@/components/FeaturesGallery";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Voice of Store AI — Retail Operations Intelligence" },
      {
        name: "description",
        content:
          "Turn customer and staff feedback into clear insights, faster resolutions, and better store operations with the power of AI.",
      },
      { property: "og:title", content: "Voice of Store AI — Retail Operations Intelligence" },
      {
        property: "og:description",
        content: "Every store has a story. Now you can act on it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = [
  { name: "Platform", href: "/app-dashboard" },
  { name: "Solutions", href: "/environment" },
  { name: "Store Intelligence", href: "/dashboard" },
  { name: "Resources", href: "#features" },
  { name: "Pricing", href: "/admin" },
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize GSAP + Lenis kinetic smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.55,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.45,
      touchMultiplier: 2.2,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Ensure hero video autoplays smoothly and trigger refresh
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Video autoplay prevented:", err);
      });
    }
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfcff] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 relative overflow-x-clip">
      {/* Subtle warm/ice-blue background ambient lighting */}
      <div className="pointer-events-none absolute -top-32 right-1/4 w-[700px] h-[700px] bg-blue-100/35 rounded-full blur-[140px] -z-10" />
      <div className="pointer-events-none absolute top-40 -left-20 w-[600px] h-[600px] bg-purple-100/25 rounded-full blur-[150px] -z-10" />

      {/* ── Minimal Top Navigation matching screenshot ── */}
      <header className="w-full border-b border-slate-100/80 bg-white/75 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-[1520px] items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
          {/* Left: Waveform Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer" title="Voice of Store AI">
            <div className="flex items-center gap-[3px] h-7">
              <span className="w-[3.5px] h-3 bg-blue-600 rounded-full" />
              <span className="w-[3.5px] h-5 bg-blue-600 rounded-full" />
              <span className="w-[3.5px] h-7 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
              <span className="w-[3.5px] h-4 bg-blue-600 rounded-full" />
              <span className="w-[3.5px] h-6 bg-blue-600 rounded-full" />
            </div>
            <div className="leading-tight text-left">
              <span className="text-base font-extrabold tracking-tight text-slate-950 block">
                VOICE OF STORE <span className="text-blue-600 font-black">AI</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">
                Retail Operations Intelligence
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-[13.5px] font-medium text-slate-600 hover:text-slate-950 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-[#0c0d12] hover:bg-black text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition hover:scale-105 active:scale-95"
            >
              <span>Open Dashboard</span>
              <ArrowRight size={13} />
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-700"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-semibold text-slate-700 hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ── Hero Section (Full 4K Video Background) ── */}
      <section className="relative isolate w-full min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
        {/* Full 4K Video Background with enhanced contrast & vibrancy */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            src={storeHeroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center filter contrast-[1.12] saturate-[1.16] brightness-[1.01] scale-[1.01] transition-all duration-700"
            aria-label="Interactive Smart Store AI Operations Animation"
          >
            <source src={storeHeroVideo} type="video/mp4" />
            <source src="/gemini_generated_video_6d31b3fd.mp4" type="video/mp4" />
          </video>
          {/* Subtle directional gradient preserving full 4K clarity */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fbfcff]/85 via-[#fbfcff]/35 via-45% to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#fbfcff]/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fbfcff] to-transparent pointer-events-none" />
        </div>

        {/* Foreground Content - Pure Text directly aligned to left border without any enclosing box */}
        <div className="relative w-full max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-12 py-12 lg:py-20 z-10">
          <div className="max-w-xl text-left">
            {/* Eyebrow */}
            <span className="text-[11px] font-mono font-bold tracking-[0.28em] uppercase text-blue-600 mb-4 block">
              LISTEN · ANALYZE · ACT
            </span>

            {/* Editorial Serif Headline */}
            <h1 className="font-serif text-[40px] sm:text-[48px] lg:text-[56px] font-normal leading-[1.08] tracking-tight text-slate-950">
              Every store<br />
              has a story.<br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium">
                Now you can
              </span><br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium">
                act on it.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 text-sm sm:text-base text-slate-700 max-w-md leading-relaxed font-normal">
              Turn customer and staff feedback into clear insights, faster resolutions, and better store operations with the power of AI.
            </p>

            {/* CTA Button: Open Dashboard only */}
            <div className="mt-7 flex items-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#0c0d12] hover:bg-blue-600 text-white px-7 py-3.5 text-sm font-semibold shadow-md shadow-slate-900/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Open Dashboard</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features page below hero section */}
      <FeaturesGallery />

      {/* Experience section */}
      <Experience />

      {/* About section */}
      <AboutSection />
    </div>
  );
}

export default Index;
