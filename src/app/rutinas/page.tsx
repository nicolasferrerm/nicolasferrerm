"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/Navigation";
import { RouteGuard } from "@/components/RouteGuard";
import { WeeklyPlanner } from "@/components/WeeklyPlanner";
import {
  Card,
  Button,
  Badge,
  PageHeader,
  EmptyState,
} from "@/components/ui";
import { suggestProgression } from "@/lib/science";
import { generateId, today, getMuscleLabel } from "@/lib/storage";
import {
  getTodayDayOfWeek,
  getTodaySessions,
  findRoutineSessionIndex,
  FOCUS_CONFIG,
  DAY_LABELS,
  createPresetPlan,
  syncRoutineFromPlan,
} from "@/lib/schedule";
import type { WorkoutSession } from "@/lib/types";
import { Check, Play, Calendar, Dumbbell } from "lucide-react";
import clsx from "clsx";

type Tab = "plan" | "train";

export default function RutinasPage() {
  return (
    <AppShell>
      <RouteGuard>
        <RutinasContent />
      </RouteGuard>
    </AppShell>
  );
}

function RutinasContent() {
  const { state, update } = useApp();
  const [tab, setTab] = useState<Tab>("plan");
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});

  if (!state.profile) return null;

  const { activeRoutine, workoutSessions, profile, weeklyPlan } = state;
  const todaySessions = getTodaySessions(weeklyPlan);
  const todayDay = getTodayDayOfWeek();

  function initPlan() {
    const plan = createPresetPlan("bodybuilding", profile!.trainingDaysPerWeek);
    const routine = syncRoutineFromPlan(plan, profile!);
    update({ weeklyPlan: plan, activeRoutine: routine });
  }

  function startWorkout(sessionIndex: number) {
    setActiveSession(sessionIndex);
    setCompletedSets({});
    setTab("train");
  }

  function startTodaySession(plannedIndex: number) {
    if (!weeklyPlan || !activeRoutine) return;
    const planned = todaySessions[plannedIndex];
    const idx = findRoutineSessionIndex(activeRoutine, planned, todayDay);
    if (idx >= 0) startWorkout(idx);
  }

  function completeWorkout(sessionIndex: number) {
    if (!activeRoutine) return;
    const template = activeRoutine.sessions[sessionIndex];
    const session: WorkoutSession = {
      id: generateId(),
      name: template.name,
      date: today(),
      exercises: template.exercises,
      completed: true,
      durationMinutes: 60,
    };
    update({ workoutSessions: [...workoutSessions, session] });
    setActiveSession(null);
    setCompletedSets({});
  }

  function toggleSet(exerciseId: string, totalSets: number) {
    setCompletedSets((prev) => {
      const current = prev[exerciseId] || 0;
      return { ...prev, [exerciseId]: current >= totalSets ? 0 : current + 1 };
    });
  }

  if (!weeklyPlan) {
    return (
      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        <EmptyState
          icon="📅"
          title="Crea tu plan semanal"
          description="Organiza qué entrenar cada día: pecho, espalda, piernas, push, pull, cardio o descanso."
          action={<Button onClick={initPlan}>Crear plan musculación</Button>}
        />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto animate-fade-in">
      <PageHeader
        title="Rutinas"
        subtitle={weeklyPlan.name}
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800 mb-6 w-fit">
        <button
          onClick={() => setTab("plan")}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
            tab === "plan" ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Calendar size={16} /> Planificador
        </button>
        <button
          onClick={() => setTab("train")}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
            tab === "train" ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Dumbbell size={16} /> Entrenar
        </button>
      </div>

      {tab === "plan" ? (
        <WeeklyPlanner />
      ) : (
        <>
          {/* Hoy */}
          <Card className="mb-6 border-emerald-500/20">
            <h3 className="font-semibold text-white mb-2">
              Hoy — {DAY_LABELS[todayDay]}
            </h3>
            {todaySessions.length === 0 ? (
              <p className="text-sm text-zinc-500">Día libre. Descansa o revisa tu plan.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {todaySessions.map((s, i) => {
                  const config = FOCUS_CONFIG[s.focus];
                  const canTrain = s.focus !== "rest" && activeRoutine;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                    >
                      <span>{config.emoji}</span>
                      <div>
                        <p className="text-sm text-white font-medium">{s.label}</p>
                        {s.notes && <p className="text-xs text-zinc-500">{s.notes}</p>}
                      </div>
                      {canTrain && (
                        <Button size="sm" onClick={() => startTodaySession(i)}>
                          <Play size={14} className="inline mr-1" /> Iniciar
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {activeSession !== null && activeRoutine ? (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {activeRoutine.sessions[activeSession].name}
                </h2>
                <Button onClick={() => completeWorkout(activeSession)}>
                  <Check size={16} className="inline mr-1" /> Finalizar
                </Button>
              </div>
              <div className="space-y-4">
                {activeRoutine.sessions[activeSession].exercises.map((ex) => {
                  const done = completedSets[ex.id] || 0;
                  const progression = ex.weightKg
                    ? suggestProgression(ex.weightKg, done * 3, parseInt(ex.reps))
                    : null;
                  return (
                    <div key={ex.id} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-white">{ex.name}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {getMuscleLabel(ex.muscleGroup)} · {ex.sets}x{ex.reps}
                          </p>
                          {ex.notes && <p className="text-xs text-zinc-600 mt-1">{ex.notes}</p>}
                        </div>
                        <Badge color={done >= ex.sets ? "emerald" : "zinc"}>
                          {done}/{ex.sets}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {Array.from({ length: ex.sets }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => toggleSet(ex.id, ex.sets)}
                            className={`w-10 h-10 rounded-lg border text-sm font-medium ${
                              i < done
                                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                                : "border-zinc-600 text-zinc-500"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      {progression && done >= ex.sets && (
                        <p className="text-xs text-emerald-400 mt-2">💡 {progression.reason}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeRoutine?.sessions.map((session, i) => (
                <Card key={i} className="hover:border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{session.name}</h3>
                      <p className="text-sm text-zinc-500 mt-1">
                        {session.exercises.length} ejercicios ·{" "}
                        {session.exercises.reduce((s, e) => s + e.sets, 0)} series
                      </p>
                    </div>
                    <Button onClick={() => startWorkout(i)}>
                      <Play size={16} className="inline mr-1" /> Iniciar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {workoutSessions.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold text-white mb-3">Historial reciente</h3>
              <div className="space-y-2">
                {workoutSessions
                  .filter((w) => w.completed)
                  .slice(-5)
                  .reverse()
                  .map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
                      <div>
                        <p className="text-sm text-white">{w.name}</p>
                        <p className="text-xs text-zinc-500">{w.date}</p>
                      </div>
                      <Badge color="emerald">Completado</Badge>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
