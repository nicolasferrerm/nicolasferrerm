"use client";

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
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
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

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-50">
      <div className="flex justify-around items-center py-2 px-1">
        {NAV_ITEMS.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors min-w-0",
                active ? "text-emerald-400" : "text-zinc-500"
              )}
            >
              <Icon size={20} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pb-20 lg:pb-0 overflow-x-hidden">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
