import { Link } from "@tanstack/react-router";

interface DashboardHeaderProps {
  active: "ai-assistant" | "spline" | "environment" | "app-dashboard" | "admin";
  showControls?: boolean;
}

const navLinks = [
  { id: "ai-assistant", label: "AI Assistant", href: "/dashboard" },
  { id: "environment", label: "3D Environment", href: "/environment" },
  { id: "app-dashboard", label: "App Dashboard", href: "/app-dashboard" },
  { id: "admin", label: "Admin", href: "/admin" },
] as const;

export function DashboardHeader({ active, showControls = true }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-3.5 lg:px-12">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
            title="Back to Home"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 text-neutral-900"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M4 21V11a8 8 0 0 1 16 0v10M9 21v-9a3 3 0 0 1 6 0v9" />
            </svg>
            <div className="leading-none text-left">
              <div className="text-[17px] font-bold tracking-tight text-neutral-900">VOICE OF STORE</div>
              <div className="mt-1 text-[9px] tracking-[0.32em] text-neutral-500 font-medium">STORE DIGITAL TWIN</div>
            </div>
          </Link>
        </div>

        {/* Global Navigation Pills */}
        <div className="flex items-center">
          <nav
            className="flex items-center gap-1 rounded-full p-1 bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
            aria-label="Dashboard pages"
          >
            {navLinks.map((item) => {
              const isActive = item.id === active;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`rounded-full px-3.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "text-neutral-600 hover:text-neutral-950 hover:bg-slate-100/70"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Dropdowns & Status (only shown when showControls is true) */}
        {showControls ? (
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm cursor-pointer hover:bg-slate-50 transition">
              <span>Store 042</span>
              <span className="text-[10px] text-neutral-400">▾</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm cursor-pointer hover:bg-slate-50 transition">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 text-neutral-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>North Region</span>
              <span className="text-[10px] text-neutral-400">▾</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Connected</span>
            </div>
          </div>
        ) : (
          <div className="w-10 sm:w-28" />
        )}
      </div>
    </header>
  );
}

export default DashboardHeader;
