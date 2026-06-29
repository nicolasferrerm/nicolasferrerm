"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/Navigation";
import {
  Card,
  Button,
  Badge,
  PageHeader,
  EmptyState,
  Input,
} from "@/components/ui";
import { generateRoutine, suggestProgression } from "@/lib/science";
import { generateId, today, getMuscleLabel } from "@/lib/storage";
import type { WorkoutSession } from "@/lib/types";
import { Check, Play, RefreshCw } from "lucide-react";

export default function RutinasPage() {
  const { state, update } = useApp();
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});

  if (!state.profile) return null;

  const { activeRoutine, workoutSessions } = state;

  function regenerateRoutine() {
    if (!state.profile) return;
    const routine = generateRoutine(
      state.profile.goal,
      state.profile.experienceLevel,
      state.profile.trainingDaysPerWeek
    );
    update({ activeRoutine: routine });
  }

  function startWorkout(sessionIndex: number) {
    setActiveSession(sessionIndex);
    setCompletedSets({});
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
    update({
      workoutSessions: [...workoutSessions, session],
    });
    setActiveSession(null);
    setCompletedSets({});
  }

  function toggleSet(exerciseId: string, totalSets: number) {
    setCompletedSets((prev) => {
      const current = prev[exerciseId] || 0;
      return {
        ...prev,
        [exerciseId]: current >= totalSets ? 0 : current + 1,
      };
    });
  }

  if (!activeRoutine) {
    return (
      <AppShell>
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
          <EmptyState
            icon="🏋️"
            title="Sin rutina activa"
            description="Genera una rutina personalizada basada en tu objetivo y experiencia."
            action={<Button onClick={regenerateRoutine}>Generar rutina</Button>}
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-4xl mx-auto animate-fade-in">
        <PageHeader
          title="Rutinas"
          subtitle={activeRoutine.description}
          action={
            <Button variant="secondary" onClick={regenerateRoutine}>
              <RefreshCw size={16} className="inline mr-1" /> Regenerar
            </Button>
          }
        />

        <div className="flex items-center gap-3 mb-6">
          <Badge color="emerald">{activeRoutine.daysPerWeek} días/semana</Badge>
          <Badge color="blue">{activeRoutine.sessions.length} sesiones</Badge>
        </div>

        {activeSession !== null ? (
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
                  <div
                    key={ex.id}
                    className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-white">{ex.name}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {getMuscleLabel(ex.muscleGroup)} · {ex.sets}x{ex.reps} ·{" "}
                          {ex.restSeconds}s descanso
                        </p>
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
                          className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                            i < done
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                              : "border-zinc-600 text-zinc-500 hover:border-zinc-500"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    {progression && done >= ex.sets && (
                      <p className="text-xs text-emerald-400 mt-2">
                        💡 {progression.reason}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeRoutine.sessions.map((session, i) => {
              const lastDone = workoutSessions
                .filter((w) => w.name === session.name && w.completed)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

              return (
                <Card key={i} className="hover:border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{session.name}</h3>
                      <p className="text-sm text-zinc-500 mt-1">
                        {session.exercises.length} ejercicios ·{" "}
                        {session.exercises.reduce((s, e) => s + e.sets, 0)} series totales
                      </p>
                      {lastDone && (
                        <p className="text-xs text-zinc-600 mt-1">
                          Último: {lastDone.date}
                        </p>
                      )}
                    </div>
                    <Button onClick={() => startWorkout(i)}>
                      <Play size={16} className="inline mr-1" /> Iniciar
                    </Button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {session.exercises.map((ex) => (
                      <span
                        key={ex.id}
                        className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400"
                      >
                        {ex.name}
                      </span>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Historial reciente */}
        {workoutSessions.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-white mb-3">Historial reciente</h3>
            <div className="space-y-2">
              {workoutSessions
                .filter((w) => w.completed)
                .slice(-5)
                .reverse()
                .map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30"
                  >
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
      </div>
    </AppShell>
  );
}
