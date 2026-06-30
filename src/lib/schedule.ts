import type {
  DayOfWeek,
  SessionFocus,
  PlannedSession,
  WeeklyPlan,
  Routine,
  UserProfile,
  MuscleGroup,
  ExperienceLevel,
} from "./types";
import { getExercisesForMuscle } from "./exercises";
import { generateId } from "./storage";

export const DAY_LABELS: Record<DayOfWeek, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

export const DAY_SHORT: Record<DayOfWeek, string> = {
  0: "Dom",
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
};

export const FOCUS_CONFIG: Record<
  SessionFocus,
  { label: string; emoji: string; color: string; muscleGroups: MuscleGroup[] }
> = {
  rest: { label: "Descanso", emoji: "😴", color: "zinc", muscleGroups: [] },
  chest: { label: "Pecho", emoji: "💪", color: "red", muscleGroups: ["chest", "triceps"] },
  back: { label: "Espalda", emoji: "🦾", color: "blue", muscleGroups: ["back", "biceps"] },
  shoulders: { label: "Hombros", emoji: "🏋️", color: "amber", muscleGroups: ["shoulders"] },
  legs: { label: "Piernas", emoji: "🦵", color: "emerald", muscleGroups: ["legs", "core"] },
  arms: { label: "Brazos", emoji: "💪", color: "purple", muscleGroups: ["biceps", "triceps"] },
  push: { label: "Push", emoji: "⬆️", color: "red", muscleGroups: ["chest", "shoulders", "triceps"] },
  pull: { label: "Pull", emoji: "⬇️", color: "blue", muscleGroups: ["back", "biceps", "core"] },
  upper: { label: "Upper", emoji: "🔝", color: "amber", muscleGroups: ["chest", "back", "shoulders", "biceps", "triceps"] },
  lower: { label: "Lower", emoji: "🔻", color: "emerald", muscleGroups: ["legs", "core"] },
  full_body: { label: "Full Body", emoji: "🏃", color: "emerald", muscleGroups: ["chest", "back", "legs", "core"] },
  cardio: {
    label: "Cardio",
    emoji: "❤️",
    color: "red",
    muscleGroups: ["full_body"],
  },
};

export const PALETTE_FOCUSES: SessionFocus[] = [
  "chest",
  "back",
  "shoulders",
  "legs",
  "arms",
  "push",
  "pull",
  "upper",
  "lower",
  "full_body",
  "cardio",
  "rest",
];

export function emptyWeek(): Record<DayOfWeek, PlannedSession[]> {
  return { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
}

export function createPlannedSession(focus: SessionFocus, notes?: string): PlannedSession {
  const config = FOCUS_CONFIG[focus];
  return {
    id: generateId(),
    focus,
    label: config.label,
    notes,
  };
}

export function getTodayDayOfWeek(): DayOfWeek {
  return new Date().getDay() as DayOfWeek;
}

export function countTrainingDays(plan: WeeklyPlan): number {
  return Object.values(plan.days).filter((sessions) =>
    sessions.some((s) => s.focus !== "rest" && s.focus !== "cardio")
  ).length;
}

export function presetBodybuilding(): WeeklyPlan {
  const days = emptyWeek();
  days[0] = [createPlannedSession("legs")];
  days[1] = [createPlannedSession("chest")];
  days[2] = [createPlannedSession("back")];
  days[3] = [createPlannedSession("legs")];
  days[4] = [createPlannedSession("shoulders")];
  days[5] = [createPlannedSession("rest"), createPlannedSession("cardio", "LISS 30 min")];
  days[6] = [createPlannedSession("rest"), createPlannedSession("cardio", "LISS 30 min")];
  return {
    id: generateId(),
    name: "Musculación clásica",
    days,
    updatedAt: new Date().toISOString(),
  };
}

export function presetPushPullLegs(): WeeklyPlan {
  const days = emptyWeek();
  days[1] = [createPlannedSession("push")];
  days[2] = [createPlannedSession("pull")];
  days[3] = [createPlannedSession("legs")];
  days[4] = [createPlannedSession("push")];
  days[5] = [createPlannedSession("pull")];
  days[6] = [createPlannedSession("legs")];
  return {
    id: generateId(),
    name: "Push / Pull / Legs",
    days,
    updatedAt: new Date().toISOString(),
  };
}

export function presetUpperLower(): WeeklyPlan {
  const days = emptyWeek();
  days[1] = [createPlannedSession("upper")];
  days[2] = [createPlannedSession("lower")];
  days[3] = [createPlannedSession("upper")];
  days[4] = [createPlannedSession("lower")];
  days[5] = [createPlannedSession("cardio", "Opcional")];
  return {
    id: generateId(),
    name: "Upper / Lower",
    days,
    updatedAt: new Date().toISOString(),
  };
}

export function presetFullBody(daysPerWeek: number): WeeklyPlan {
  const days = emptyWeek();
  const trainingDays: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0].slice(0, daysPerWeek) as DayOfWeek[];
  trainingDays.forEach((d) => {
    days[d] = [createPlannedSession("full_body")];
  });
  return {
    id: generateId(),
    name: `Full Body ${daysPerWeek}x`,
    days,
    updatedAt: new Date().toISOString(),
  };
}

export type PlanPreset = "bodybuilding" | "ppl" | "upper_lower" | "full_body" | "blank";

export function createPresetPlan(preset: PlanPreset, daysPerWeek = 4): WeeklyPlan {
  switch (preset) {
    case "bodybuilding":
      return presetBodybuilding();
    case "ppl":
      return presetPushPullLegs();
    case "upper_lower":
      return presetUpperLower();
    case "full_body":
      return presetFullBody(daysPerWeek);
    default:
      return {
        id: generateId(),
        name: "Mi plan personalizado",
        days: emptyWeek(),
        updatedAt: new Date().toISOString(),
      };
  }
}

function buildExercisesForFocus(
  focus: SessionFocus,
  experience: ExperienceLevel,
  equipment: UserProfile["equipment"],
  injuries: UserProfile["injuries"]
) {
  if (focus === "rest") return [];

  const config = FOCUS_CONFIG[focus];
  const sets = experience === "beginner" ? 3 : experience === "intermediate" ? 4 : 5;
  const reps = experience === "beginner" ? "10-12" : experience === "intermediate" ? "8-12" : "6-10";

  if (focus === "cardio") {
    return [
      {
        id: generateId(),
        name: "Caminata inclinada / trote",
        muscleGroup: "full_body" as MuscleGroup,
        sets: 1,
        reps: "20-30 min",
        restSeconds: 0,
        notes: "Zona 2 — puedes respirar con normalidad",
      },
      {
        id: generateId(),
        name: "Bicicleta estática",
        muscleGroup: "full_body" as MuscleGroup,
        sets: 1,
        reps: "15-20 min",
        restSeconds: 0,
        notes: "Alternativa de bajo impacto",
      },
    ];
  }

  const uniqueGroups = [...new Set(config.muscleGroups)];
  return uniqueGroups.flatMap((group) => {
    const available = getExercisesForMuscle(group, equipment, injuries);
    const count = group === "core" ? 1 : 2;
    return available.slice(0, count).map((ex) => ({
      id: generateId(),
      name: ex.name,
      muscleGroup: group,
      sets,
      reps,
      restSeconds: group === "legs" ? 120 : 90,
      notes: ex.instructions,
    }));
  });
}

export function syncRoutineFromPlan(plan: WeeklyPlan, profile: UserProfile): Routine {
  const orderedDays: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];
  const sessions: Routine["sessions"] = [];

  for (const day of orderedDays) {
    const daySessions = plan.days[day];
    for (const planned of daySessions) {
      if (planned.focus === "rest") continue;

      const exercises = buildExercisesForFocus(
        planned.focus,
        profile.experienceLevel,
        profile.equipment,
        profile.injuries
      );

      if (exercises.length === 0) continue;

      const dayName = DAY_SHORT[day];
      sessions.push({
        name: `${dayName} — ${planned.label}`,
        exercises,
        notes: planned.notes ?? `Planificado para ${DAY_LABELS[day]}`,
      });
    }
  }

  const trainingDays = countTrainingDays(plan);

  return {
    id: `routine-${Date.now()}`,
    name: plan.name,
    description: `Plan semanal personalizado · ${trainingDays} días de entrenamiento`,
    daysPerWeek: trainingDays,
    goal: profile.goal,
    experienceLevel: profile.experienceLevel,
    sessions,
  };
}

export function getTodaySessions(plan: WeeklyPlan | null): PlannedSession[] {
  if (!plan) return [];
  return plan.days[getTodayDayOfWeek()] ?? [];
}

export function findRoutineSessionIndex(
  routine: Routine | null,
  planned: PlannedSession,
  day: DayOfWeek
): number {
  if (!routine) return -1;
  const prefix = `${DAY_SHORT[day]} — ${planned.label}`;
  return routine.sessions.findIndex((s) => s.name === prefix);
}
