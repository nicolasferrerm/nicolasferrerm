"use client";

import { useState, useCallback } from "react";
import type { DayOfWeek, WeeklyPlan, PlannedSession, SessionFocus } from "@/lib/types";
import {
  DAY_LABELS,
  DAY_SHORT,
  FOCUS_CONFIG,
  PALETTE_FOCUSES,
  createPlannedSession,
  createPresetPlan,
  syncRoutineFromPlan,
  countTrainingDays,
  type PlanPreset,
} from "@/lib/schedule";
import { useApp } from "@/context/AppContext";
import { Card, Button } from "@/components/ui";
import { GripVertical, X, Save, LayoutTemplate } from "lucide-react";
import clsx from "clsx";

const ORDERED_DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];

const COLOR_MAP: Record<string, string> = {
  zinc: "border-zinc-600 bg-zinc-800/80",
  red: "border-red-500/40 bg-red-500/10",
  blue: "border-blue-500/40 bg-blue-500/10",
  amber: "border-amber-500/40 bg-amber-500/10",
  emerald: "border-emerald-500/40 bg-emerald-500/10",
  purple: "border-purple-500/40 bg-purple-500/10",
};

interface DragData {
  type: "palette" | "card";
  focus?: SessionFocus;
  sessionId?: string;
  fromDay?: DayOfWeek;
}

export function WeeklyPlanner() {
  const { state, update } = useApp();
  const profile = state.profile!;

  const [plan, setPlan] = useState<WeeklyPlan>(
    state.weeklyPlan ?? createPresetPlan("bodybuilding")
  );
  const [dragOverDay, setDragOverDay] = useState<DayOfWeek | null>(null);
  const [saved, setSaved] = useState(false);

  const applyPreset = (preset: PlanPreset) => {
    const newPlan = createPresetPlan(preset, profile.trainingDaysPerWeek);
    setPlan(newPlan);
    setSaved(false);
  };

  const savePlan = useCallback(() => {
    const updatedPlan = { ...plan, updatedAt: new Date().toISOString() };
    const routine = syncRoutineFromPlan(updatedPlan, profile);
    update({
      weeklyPlan: updatedPlan,
      activeRoutine: routine,
      profile: { ...profile, trainingDaysPerWeek: countTrainingDays(updatedPlan) },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [plan, profile, update]);

  const addToDay = (day: DayOfWeek, focus: SessionFocus) => {
    setPlan((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: [...prev.days[day], createPlannedSession(focus)],
      },
    }));
    setSaved(false);
  };

  const removeFromDay = (day: DayOfWeek, sessionId: string) => {
    setPlan((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: prev.days[day].filter((s) => s.id !== sessionId),
      },
    }));
    setSaved(false);
  };

  const moveSession = (sessionId: string, fromDay: DayOfWeek, toDay: DayOfWeek) => {
    if (fromDay === toDay) return;
    setPlan((prev) => {
      const session = prev.days[fromDay].find((s) => s.id === sessionId);
      if (!session) return prev;
      return {
        ...prev,
        days: {
          ...prev.days,
          [fromDay]: prev.days[fromDay].filter((s) => s.id !== sessionId),
          [toDay]: [...prev.days[toDay], session],
        },
      };
    });
    setSaved(false);
  };

  const handleDrop = (day: DayOfWeek, data: DragData) => {
    if (data.type === "palette" && data.focus) {
      addToDay(day, data.focus);
    } else if (data.type === "card" && data.sessionId && data.fromDay !== undefined) {
      moveSession(data.sessionId, data.fromDay, day);
    }
    setDragOverDay(null);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500 flex items-center gap-1">
          <LayoutTemplate size={14} /> Plantillas:
        </span>
        {(
          [
            ["bodybuilding", "Musculación"],
            ["ppl", "Push/Pull/Legs"],
            ["upper_lower", "Upper/Lower"],
            ["blank", "En blanco"],
          ] as [PlanPreset, string][]
        ).map(([key, label]) => (
          <Button key={key} variant="ghost" size="sm" onClick={() => applyPreset(key)}>
            {label}
          </Button>
        ))}
        <div className="flex-1" />
        <Button onClick={savePlan} className={saved ? "bg-emerald-500" : ""}>
          <Save size={16} className="inline mr-1" />
          {saved ? "¡Guardado!" : "Guardar plan"}
        </Button>
      </div>

      {/* Kanban board */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-3 min-w-max lg:min-w-0 lg:grid lg:grid-cols-7">
          {ORDERED_DAYS.map((day) => {
            const isToday = new Date().getDay() === day;
            const sessions = plan.days[day];

            return (
              <div
                key={day}
                className={clsx(
                  "w-36 lg:w-auto flex-shrink-0 rounded-xl border transition-colors",
                  dragOverDay === day
                    ? "border-emerald-500 bg-emerald-500/5"
                    : "border-zinc-800 bg-zinc-900/50",
                  isToday && "ring-1 ring-emerald-500/30"
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverDay(day);
                }}
                onDragLeave={() => setDragOverDay(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  try {
                    const data = JSON.parse(e.dataTransfer.getData("application/json")) as DragData;
                    handleDrop(day, data);
                  } catch {
                    // ignore
                  }
                }}
              >
                <div className="p-2 border-b border-zinc-800">
                  <p className={clsx("text-xs font-semibold", isToday ? "text-emerald-400" : "text-zinc-400")}>
                    {DAY_SHORT[day]}
                  </p>
                  <p className="text-[10px] text-zinc-600">{DAY_LABELS[day]}</p>
                </div>

                <div className="p-2 min-h-[120px] space-y-2">
                  {sessions.length === 0 ? (
                    <p className="text-[10px] text-zinc-600 text-center py-6">
                      Arrastra aquí
                    </p>
                  ) : (
                    sessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        day={day}
                        onRemove={() => removeFromDay(day, session.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Palette */}
      <Card>
        <p className="text-sm font-medium text-white mb-3">
          Arrastra al día que quieras
        </p>
        <div className="flex flex-wrap gap-2">
          {PALETTE_FOCUSES.map((focus) => {
            const config = FOCUS_CONFIG[focus];
            return (
              <div
                key={focus}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "application/json",
                    JSON.stringify({ type: "palette", focus } satisfies DragData)
                  );
                }}
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border cursor-grab active:cursor-grabbing text-sm select-none",
                  COLOR_MAP[config.color]
                )}
              >
                <GripVertical size={14} className="text-zinc-500" />
                <span>{config.emoji}</span>
                <span className="text-zinc-200">{config.label}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-zinc-600 mt-3">
          Tip: puedes poner varios entrenos el mismo día (ej. piernas + cardio). Los cambios se guardan en tu perfil al pulsar Guardar plan.
        </p>
      </Card>
    </div>
  );
}

function SessionCard({
  session,
  day,
  onRemove,
}: {
  session: PlannedSession;
  day: DayOfWeek;
  onRemove: () => void;
}) {
  const config = FOCUS_CONFIG[session.focus];

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "application/json",
          JSON.stringify({
            type: "card",
            sessionId: session.id,
            fromDay: day,
          } satisfies DragData)
        );
      }}
      className={clsx(
        "group relative p-2 rounded-lg border text-xs cursor-grab active:cursor-grabbing",
        COLOR_MAP[config.color]
      )}
    >
      <div className="flex items-center gap-1.5">
        <GripVertical size={12} className="text-zinc-600 shrink-0" />
        <span>{config.emoji}</span>
        <span className="font-medium text-zinc-200 truncate">{session.label}</span>
      </div>
      {session.notes && (
        <p className="text-[10px] text-zinc-500 mt-1 pl-5 truncate">{session.notes}</p>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 text-zinc-500 hover:text-red-400 transition-opacity"
      >
        <X size={12} />
      </button>
    </div>
  );
}
