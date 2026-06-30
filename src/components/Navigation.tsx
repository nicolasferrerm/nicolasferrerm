"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  Scale,
  Brain,
  CalendarCheck,
  User,
  Menu,
  X,
} from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/rutinas", label: "Rutinas", icon: Dumbbell },
  { href: "/nutricion", label: "Nutrición", icon: UtensilsCrossed },
  { href: "/peso", label: "Peso", icon: Scale },
  { href: "/coach", label: "Coach", icon: Brain },
  { href: "/semanal", label: "Semanal", icon: CalendarCheck },
  { href: "/perfil", label: "Perfil", icon: User },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
  compact,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  active: boolean;
  onClick?: () => void;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 rounded-lg font-medium transition-colors",
        compact
          ? "flex-col gap-0.5 px-2 py-1 text-[10px] min-w-0"
          : "px-3 py-2.5 text-sm",
        active
          ? compact
            ? "text-emerald-400"
            : "bg-emerald-500/15 text-emerald-400"
          : compact
            ? "text-zinc-500"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
      )}
    >
      <Icon size={compact ? 20 : 20} />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen p-4">
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-xl font-bold text-white">
          F
        </div>
        <div>
          <h1 className="font-bold text-lg text-white">FitCoach</h1>
          <p className="text-xs text-zinc-500">Entrena con ciencia</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <div className="mt-auto p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
        <p className="text-xs text-zinc-500 leading-relaxed">
          Decisiones basadas en evidencia científica para optimizar tu progreso.
        </p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const primaryItems = NAV_ITEMS.slice(0, 4);
  const moreActive = NAV_ITEMS.slice(4).some((item) => pathname === item.href);

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-50 safe-area-pb">
        <div className="flex justify-around items-center py-2 px-1">
          {primaryItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={pathname === item.href}
              compact
            />
          ))}
          <button
            onClick={() => setDrawerOpen(true)}
            className={clsx(
              "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium min-w-0",
              moreActive || drawerOpen ? "text-emerald-400" : "text-zinc-500"
            )}
          >
            <Menu size={20} />
            <span>Más</span>
          </button>
        </div>
      </nav>

      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 rounded-t-2xl p-4 pb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Menú</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  active={pathname === item.href}
                  onClick={() => setDrawerOpen(false)}
                  compact
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pb-24 lg:pb-0 overflow-x-hidden">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
