"use client";

import { useApp } from "@/context/AppContext";
import { Onboarding } from "@/components/Onboarding";
import { AppShell } from "@/components/Navigation";
import { Card, StatCard, ProgressBar, Badge, PageHeader } from "@/components/ui";
import { analyzeWeightTrend } from "@/lib/science";
import { today, getGoalLabel } from "@/lib/storage";
import { getTodaySessions, FOCUS_CONFIG, DAY_LABELS, getTodayDayOfWeek } from "@/lib/schedule";
import {
  Flame,
  Beef,
  Dumbbell,
  TrendingDown,
  Brain,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { state, loaded } = useApp();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!state.onboardingComplete || !state.profile) {
    return <Onboarding />;
  }

  const { profile, macroTargets, foodEntries, weightEntries, workoutSessions, weeklyPlan } = state;
  const dateToday = today();

  const todayFood = foodEntries.filter((f) => f.date === dateToday);
  const todayCals = todayFood.reduce((s, f) => s + f.calories, 0);
  const todayProtein = todayFood.reduce((s, f) => s + f.protein, 0);
  const todayCarbs = todayFood.reduce((s, f) => s + f.carbs, 0);
  const todayFat = todayFood.reduce((s, f) => s + f.fat, 0);

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weekWorkouts = workoutSessions.filter(
    (w) => new Date(w.date) >= weekAgo && w.completed
  );

  const weightTrend = analyzeWeightTrend(weightEntries);
  const todayPlanned = getTodaySessions(weeklyPlan);
  const todayDay = getTodayDayOfWeek();

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-6xl mx-auto animate-fade-in">
        <PageHeader
          title={`Hola, ${profile.name}`}
          subtitle={`Objetivo: ${getGoalLabel(profile.goal)} · ${new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}`}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Calorías hoy"
            value={todayCals}
            unit="kcal"
            icon={<Flame size={24} />}
            color="amber"
          />
          <StatCard
            label="Proteína hoy"
            value={Math.round(todayProtein)}
            unit="g"
            icon={<Beef size={24} />}
            color="red"
          />
          <StatCard
            label="Peso actual"
            value={weightTrend.avgWeight || profile.weightKg}
            unit="kg"
            icon={<TrendingDown size={24} />}
            trend={
              weightTrend.weeklyChange !== 0
                ? { value: weightTrend.weeklyChange, label: "kg/sem" }
                : undefined
            }
            color="blue"
          />
          <StatCard
            label="Entrenos semana"
            value={`${weekWorkouts.length}/${profile.trainingDaysPerWeek}`}
            icon={<Dumbbell size={24} />}
            color="emerald"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          {/* Macros del día */}
          <Card className="lg:col-span-2">
            <h3 className="font-semibold text-white mb-4">Macros de hoy</h3>
            {macroTargets && (
              <div className="space-y-4">
                <ProgressBar
                  label="Calorías"
                  value={todayCals}
                  max={macroTargets.calories}
                  color={todayCals > macroTargets.calories ? "red" : "emerald"}
                />
                <ProgressBar
                  label="Proteína"
                  value={todayProtein}
                  max={macroTargets.protein}
                  color="blue"
                />
                <ProgressBar
                  label="Carbohidratos"
                  value={todayCarbs}
                  max={macroTargets.carbs}
                  color="amber"
                />
                <ProgressBar
                  label="Grasas"
                  value={todayFat}
                  max={macroTargets.fat}
                  color="red"
                />
              </div>
            )}
            <Link
              href="/nutricion"
              className="inline-block mt-4 text-sm text-emerald-400 hover:text-emerald-300"
            >
              + Registrar comida →
            </Link>
          </Card>

          {/* Entreno de hoy */}
          <Card>
            <h3 className="font-semibold text-white mb-3">
              Hoy — {DAY_LABELS[todayDay]}
            </h3>
            {todayPlanned.length === 0 ? (
              <p className="text-sm text-zinc-500">Sin entrenos planificados. <Link href="/rutinas" className="text-emerald-400">Editar plan</Link></p>
            ) : (
              <div className="space-y-2">
                {todayPlanned.map((s) => {
                  const config = FOCUS_CONFIG[s.focus];
                  return (
                    <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/30">
                      <span>{config.emoji}</span>
                      <div>
                        <p className="text-sm text-white font-medium">{s.label}</p>
                        {s.notes && <p className="text-xs text-zinc-500">{s.notes}</p>}
                      </div>
                      {s.focus !== "rest" && (
                        <Badge color="emerald">{s.focus === "cardio" ? "Cardio" : "Fuerza"}</Badge>
                      )}
                    </div>
                  );
                })}
                <Link href="/rutinas" className="inline-block mt-2 text-sm text-emerald-400 hover:text-emerald-300">
                  Ir a entrenar →
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { href: "/nutricion", icon: "🍽️", label: "Registrar comida", color: "hover:border-amber-500/50" },
            { href: "/peso", icon: "⚖️", label: "Registrar peso", color: "hover:border-blue-500/50" },
            { href: "/rutinas", icon: "🏋️", label: "Iniciar entreno", color: "hover:border-emerald-500/50" },
            { href: "/coach", icon: "🧠", label: "Ver coach", color: "hover:border-purple-500/50" },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className={`text-center py-4 transition-colors ${action.color}`}>
                <span className="text-2xl">{action.icon}</span>
                <p className="text-sm text-zinc-300 mt-2 font-medium">{action.label}</p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Coach tip */}
        <Card className="mt-6 border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-start gap-3">
            <Brain className="text-emerald-400 mt-0.5 shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-emerald-400">Tip del coach</p>
              <p className="text-sm text-zinc-400 mt-1">
                {todayProtein < (macroTargets?.protein ?? 0) * 0.5
                  ? "Llevas poca proteína hoy. Intenta incluir una fuente en tu próxima comida — idealmente 25-40g por toma."
                  : weekWorkouts.length < profile.trainingDaysPerWeek
                  ? `Te faltan ${profile.trainingDaysPerWeek - weekWorkouts.length} entrenamientos esta semana. La consistencia es más importante que la intensidad.`
                  : "¡Vas por buen camino! Mantén el registro de comidas y peso para ajustes semanales precisos."}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
