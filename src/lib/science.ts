import type {
  ActivityLevel,
  Gender,
  Goal,
  ExperienceLevel,
  MacroTargets,
  UserProfile,
  WeightEntry,
  FoodEntry,
  WorkoutSession,
  WeeklyReview,
  CoachRecommendation,
  WeeklyAdjustment,
  MuscleGroup,
  Routine,
  DailyLog,
  EquipmentType,
  InjuryArea,
  DismissedRecommendation,
} from "./types";
import { getExercisesForMuscle } from "./exercises";
import { isRecommendationDismissed } from "./helpers";

// ─── Metabolismo (Mifflin-St Jeor, 1990) ───────────────────────────────────
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === "male") return base + 5;
  if (gender === "female") return base - 161;
  return Math.round((base + 5 + base - 161) / 2);
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(
    profile.weightKg,
    profile.heightCm,
    profile.age,
    profile.gender
  );
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel]);
}

// ─── Macros basados en evidencia ───────────────────────────────────────────
// Referencias: ISSN Position Stand (2017), Helms et al. (2014)
export function calculateMacros(profile: UserProfile, tdee: number): MacroTargets {
  const { goal, weightKg } = profile;

  let calories: number;
  let proteinPerKg: number;
  let fatPercent: number;

  switch (goal) {
    case "lose_fat":
      calories = tdee - 500; // ~0.5 kg/semana (Hall et al., 2011)
      proteinPerKg = 2.2; // Preservar masa muscular en déficit
      fatPercent = 0.25;
      break;
    case "gain_muscle":
      calories = tdee + 300; // Superávit moderado (Garthe et al., 2013)
      proteinPerKg = 1.8;
      fatPercent = 0.25;
      break;
    case "recomp":
      calories = tdee - 200;
      proteinPerKg = 2.4; // Alto en recomposición
      fatPercent = 0.28;
      break;
    case "performance":
      calories = tdee + 100;
      proteinPerKg = 1.6;
      fatPercent = 0.22;
      break;
    default: // maintain
      calories = tdee;
      proteinPerKg = 1.6;
      fatPercent = 0.28;
  }

  const protein = Math.round(weightKg * proteinPerKg);
  const fat = Math.round((calories * fatPercent) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  const fiber = Math.round(weightKg * 0.4);

  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
    calculatedAtWeightKg: weightKg,
  };
}

export function shouldRecalculateMacros(
  macroTargets: MacroTargets,
  currentWeightKg: number,
  thresholdKg = 1
): boolean {
  const base = macroTargets.calculatedAtWeightKg ?? currentWeightKg;
  return Math.abs(currentWeightKg - base) >= thresholdKg;
}

export function recalculateMacrosFromWeight(
  profile: UserProfile,
  newWeightKg: number
): { tdee: number; macros: MacroTargets } {
  const updatedProfile = { ...profile, weightKg: newWeightKg };
  const tdee = calculateTDEE(updatedProfile);
  const macros = calculateMacros(updatedProfile, tdee);
  return { tdee, macros };
}

export function movingAverageWeight(entries: WeightEntry[], window = 7): number {
  if (entries.length === 0) return 0;
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const recent = sorted.slice(-window);
  return Math.round((recent.reduce((s, e) => s + e.weightKg, 0) / recent.length) * 10) / 10;
}

// ─── Análisis de tendencia de peso ───────────────────────────────────────────
export function analyzeWeightTrend(entries: WeightEntry[], days = 14): {
  trend: "losing" | "gaining" | "stable";
  weeklyChange: number;
  avgWeight: number;
} {
  if (entries.length < 2) {
    const w = entries[0]?.weightKg ?? 0;
    return { trend: "stable", weeklyChange: 0, avgWeight: w };
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const recent = sorted.slice(-days);
  const avgWeight =
    recent.reduce((s, e) => s + e.weightKg, 0) / recent.length;

  const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
  const secondHalf = recent.slice(Math.floor(recent.length / 2));
  const avgFirst =
    firstHalf.reduce((s, e) => s + e.weightKg, 0) / firstHalf.length;
  const avgSecond =
    secondHalf.reduce((s, e) => s + e.weightKg, 0) / secondHalf.length;

  const totalDays =
    (new Date(recent[recent.length - 1].date).getTime() -
      new Date(recent[0].date).getTime()) /
    (1000 * 60 * 60 * 24);
  const weeklyChange =
    totalDays > 0 ? ((avgSecond - avgFirst) / totalDays) * 7 : 0;

  let trend: "losing" | "gaining" | "stable" = "stable";
  if (weeklyChange < -0.15) trend = "losing";
  else if (weeklyChange > 0.15) trend = "gaining";

  return {
    trend,
    weeklyChange: Math.round(weeklyChange * 100) / 100,
    avgWeight: Math.round(avgWeight * 10) / 10,
  };
}

// ─── Progresión de entrenamiento (Schoenfeld, 2010) ──────────────────────────
export function suggestProgression(
  currentWeight: number,
  repsCompleted: number,
  targetReps: number
): { action: string; newWeight: number; reason: string } {
  if (repsCompleted >= targetReps + 2) {
    const increment = currentWeight < 20 ? 2.5 : 5;
    return {
      action: "increase_weight",
      newWeight: currentWeight + increment,
      reason: `Completaste ${repsCompleted} reps (objetivo: ${targetReps}). Progresión por sobrecarga progresiva.`,
    };
  }
  if (repsCompleted < targetReps - 2) {
    return {
      action: "maintain",
      newWeight: currentWeight,
      reason: `Solo ${repsCompleted}/${targetReps} reps. Mantén el peso y enfócate en técnica.`,
    };
  }
  return {
    action: "maintain",
    newWeight: currentWeight,
    reason: "Rango de reps adecuado. Sigue acumulando volumen antes de subir peso.",
  };
}

// ─── Coach: recomendaciones basadas en datos ───────────────────────────────
export function generateCoachRecommendations(
  profile: UserProfile,
  macroTargets: MacroTargets,
  weightEntries: WeightEntry[],
  foodEntries: FoodEntry[],
  workoutSessions: WorkoutSession[],
  days = 7,
  dailyLogs: DailyLog[] = [],
  dismissed: DismissedRecommendation[] = []
): CoachRecommendation[] {
  const recs: CoachRecommendation[] = [];
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const recentFood = foodEntries.filter((f) => new Date(f.date) >= cutoff);
  const recentWorkouts = workoutSessions.filter(
    (w) => new Date(w.date) >= cutoff && w.completed
  );
  const weightTrend = analyzeWeightTrend(weightEntries);
  const avgSleep =
    dailyLogs.filter((d) => d.sleepHours).length > 0
      ? dailyLogs
          .filter((d) => d.sleepHours)
          .reduce((s, d) => s + (d.sleepHours ?? 0), 0) /
        dailyLogs.filter((d) => d.sleepHours).length
      : 0;

  const daysWithData = new Set([
    ...recentFood.map((f) => f.date),
    ...weightEntries.filter((w) => new Date(w.date) >= cutoff).map((w) => w.date),
    ...recentWorkouts.map((w) => w.date),
  ]).size;
  const dataCompleteness = days > 0 ? (daysWithData / days) * 100 : 0;

  const avgCalories =
    recentFood.length > 0
      ? recentFood.reduce((s, f) => s + f.calories, 0) /
        new Set(recentFood.map((f) => f.date)).size
      : 0;

  const avgProtein =
    recentFood.length > 0
      ? recentFood.reduce((s, f) => s + f.protein, 0) /
        new Set(recentFood.map((f) => f.date)).size
      : 0;

  const plannedPerWeek = profile.trainingDaysPerWeek;
  const actualPerWeek = recentWorkouts.length / (days / 7);

  // Completitud de datos
  if (dataCompleteness < 50 && !isRecommendationDismissed(dismissed, "data-completeness")) {
    recs.push({
      id: "data-completeness",
      category: "general",
      priority: "high",
      title: "Mejora tu registro de datos",
      message: `Solo ${Math.round(dataCompleteness)}% de días con datos esta semana. Más datos = mejores ajustes.`,
      scienceBasis:
        "El auto-monitoreo consistente predice éxito a largo plazo (Burke et al., 2011).",
      actionItems: [
        "Registra al menos peso y una comida al día",
        "Completa tu entreno cuando lo hagas",
        "Toma 2 minutos cada noche para registrar",
      ],
    });
  }

  // Nutrición
  if (recentFood.length === 0) {
    recs.push({
      id: "nutrition-log",
      category: "nutrition",
      priority: "high",
      title: "Registra tus comidas",
      message:
        "No hay registros de alimentación recientes. El tracking es clave para ajustar tu plan.",
      scienceBasis:
        "Estudios muestran que el auto-monitoreo dietético mejora la adherencia un 30% (Burke et al., 2011).",
      actionItems: [
        "Registra al menos 3 comidas hoy",
        "Pesa tus porciones con báscula de cocina",
      ],
    });
  } else if (avgProtein < macroTargets.protein * 0.85) {
    recs.push({
      id: "protein-low",
      category: "nutrition",
      priority: "high",
      title: "Proteína insuficiente",
      message: `Promedio: ${Math.round(avgProtein)}g/día. Objetivo: ${macroTargets.protein}g.`,
      scienceBasis:
        "1.6-2.2g/kg optimiza síntesis proteica muscular (Morton et al., 2018 meta-análisis).",
      actionItems: [
        "Añade 30g de proteína en el desayuno",
        "Considera un batido post-entreno (20-40g whey)",
        "Incluye fuente proteica en cada comida",
      ],
    });
  }

  if (
    avgCalories > 0 &&
    Math.abs(avgCalories - macroTargets.calories) > macroTargets.calories * 0.15
  ) {
    const diff = avgCalories - macroTargets.calories;
    recs.push({
      id: "calorie-deviation",
      category: "nutrition",
      priority: "medium",
      title: diff > 0 ? "Exceso calórico" : "Déficit excesivo",
      message: `Promedio: ${Math.round(avgCalories)} kcal vs objetivo ${macroTargets.calories} kcal.`,
      scienceBasis:
        "Desviaciones >15% del objetivo calórico reducen la efectividad del plan (Hall et al., 2012).",
      actionItems:
        diff > 0
          ? ["Reduce snacks calóricos", "Aumenta volumen de vegetales"]
          : ["Añade un snack saludable de 200 kcal", "No saltes comidas"],
    });
  }

  // Peso — lógica por objetivo
  if (weightEntries.length >= 3) {
    const { trend, weeklyChange } = weightTrend;

    if (profile.goal === "lose_fat" && trend !== "losing") {
      recs.push({
        id: "weight-plateau-fat",
        category: "weight",
        priority: "high",
        title: "Peso estancado en pérdida de grasa",
        message: `Cambio semanal: ${weeklyChange > 0 ? "+" : ""}${weeklyChange} kg/semana.`,
        scienceBasis:
          "Adaptación metabólica tras 4-6 semanas de déficit. Diet breaks de 1-2 semanas pueden ayudar (Peos et al., 2021).",
        actionItems: [
          "Reduce 100-150 kcal adicionales",
          "Añade 2 sesiones de cardio LISS (30 min)",
          "Considera una semana en mantenimiento",
        ],
      });
    } else if (profile.goal === "gain_muscle" && trend !== "gaining") {
      recs.push({
        id: "weight-plateau-muscle",
        category: "weight",
        priority: "medium",
        title: "Ganancia de peso lenta",
        message: `Cambio semanal: ${weeklyChange} kg. Objetivo: +0.25-0.5 kg/semana.`,
        scienceBasis:
          "Ganancia muscular óptima: 0.25-0.5% peso corporal/semana (Garthe et al., 2013).",
        actionItems: [
          "Aumenta 200 kcal diarias",
          "Prioriza carbohidratos post-entreno",
          "Duerme mínimo 7-8 horas",
        ],
      });
    } else if (profile.goal === "recomp") {
      if (weeklyChange < -0.5) {
        recs.push({
          id: "recomp-losing-fast",
          category: "weight",
          priority: "high",
          title: "Pérdida rápida en recomposición",
          message: `Bajando ${Math.abs(weeklyChange)} kg/sem — riesgo de perder músculo.`,
          scienceBasis: "En recomposición el déficit debe ser leve para preservar masa muscular (Helms et al., 2014).",
          actionItems: ["Aumenta 150 kcal", "Prioriza proteína en cada comida"],
        });
      } else if (weeklyChange > 0.3) {
        recs.push({
          id: "recomp-gaining",
          category: "weight",
          priority: "medium",
          title: "Ganancia de peso en recomposición",
          message: "Estás ganando peso. En recomp buscamos estabilidad con cambio de composición.",
          scienceBasis: "La recomposición funciona mejor con peso estable y alto volumen de entrenamiento.",
          actionItems: ["Reduce 100-150 kcal", "Mantén proteína alta"],
        });
      }
    } else if (profile.goal === "maintain" && Math.abs(weeklyChange) > 0.5) {
      recs.push({
        id: "maintain-drift",
        category: "weight",
        priority: "medium",
        title: "Peso fuera de rango de mantenimiento",
        message: `Cambio de ${weeklyChange} kg/sem. Objetivo: ±0.25 kg/sem.`,
        scienceBasis: "Fluctuaciones >0.5 kg/sem en mantenimiento sugieren desajuste calórico.",
        actionItems: [
          weeklyChange > 0 ? "Reduce 100 kcal" : "Aumenta 100 kcal",
          "Revisa porciones y snacks",
        ],
      });
    } else if (profile.goal === "performance" && actualPerWeek < plannedPerWeek * 0.8) {
      recs.push({
        id: "performance-adherence",
        category: "training",
        priority: "high",
        title: "Consistencia clave para rendimiento",
        message: "El rendimiento requiere adherencia al plan de entrenamiento.",
        scienceBasis: "La consistencia del estímulo es el predictor #1 de adaptación (Fisher et al., 2017).",
        actionItems: ["Prioriza sesiones programadas", "Carbohidratos pre/post entreno"],
      });
    }
  }

  // Entrenamiento
  if (actualPerWeek < plannedPerWeek * 0.7) {
    recs.push({
      id: "training-adherence",
      category: "training",
      priority: "high",
      title: "Baja adherencia al entrenamiento",
      message: `${Math.round(actualPerWeek)}/${plannedPerWeek} sesiones por semana.`,
      scienceBasis:
        "Volumen de entrenamiento es el principal driver de hipertrofia (Schoenfeld et al., 2017). Mínimo 10-20 series/grupo muscular/semana.",
      actionItems: [
        "Programa entrenamientos en tu calendario",
        "Prepara ropa la noche anterior",
        "Reduce a 3 días si 5 es irreal",
      ],
    });
  } else if (actualPerWeek >= plannedPerWeek) {
    recs.push({
      id: "training-good",
      category: "training",
      priority: "low",
      title: "¡Excelente consistencia!",
      message: `Completaste ${recentWorkouts.length} entrenamientos en ${days} días.`,
      scienceBasis:
        "La consistencia supera la intensidad a largo plazo (Fisher et al., 2017).",
      actionItems: ["Mantén el ritmo", "Considera aumentar volumen gradualmente"],
    });
  }

  // Recuperación — solo si sueño insuficiente o sin datos
  if (
    (avgSleep === 0 || avgSleep < 7) &&
    !isRecommendationDismissed(dismissed, "recovery-sleep")
  ) {
    recs.push({
      id: "recovery-sleep",
      category: "recovery",
      priority: avgSleep > 0 && avgSleep < 6 ? "high" : "medium",
      title: "Prioriza el sueño",
      message:
        avgSleep > 0
          ? `Promedio: ${avgSleep.toFixed(1)}h. Objetivo: 7-9 horas.`
          : "El sueño es cuando ocurre la mayor parte de la recuperación muscular.",
      scienceBasis:
        "Dormir <7h reduce síntesis proteica un 18% y aumenta cortisol (Dattilo et al., 2011).",
      actionItems: [
        "Objetivo: 7-9 horas por noche",
        "Evita pantallas 1h antes de dormir",
        "Mantén horario consistente",
      ],
    });
  }

  return recs
    .filter((r) => !isRecommendationDismissed(dismissed, r.id))
    .sort((a, b) => {
      const priority = { high: 0, medium: 1, low: 2 };
      return priority[a.priority] - priority[b.priority];
    });
}

// ─── Ajustes semanales automáticos ───────────────────────────────────────────
export function generateWeeklyAdjustments(
  profile: UserProfile,
  macroTargets: MacroTargets,
  weightEntries: WeightEntry[],
  foodEntries: FoodEntry[],
  workoutSessions: WorkoutSession[]
): WeeklyAdjustment[] {
  const adjustments: WeeklyAdjustment[] = [];
  const weightTrend = analyzeWeightTrend(weightEntries, 7);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentFood = foodEntries.filter((f) => new Date(f.date) >= weekAgo);
  const avgCalories =
    recentFood.length > 0
      ? recentFood.reduce((s, f) => s + f.calories, 0) /
        Math.max(new Set(recentFood.map((f) => f.date)).size, 1)
      : macroTargets.calories;

  const recentWorkouts = workoutSessions.filter(
    (w) => new Date(w.date) >= weekAgo && w.completed
  );

  switch (profile.goal) {
    case "lose_fat":
      if (weightTrend.weeklyChange > -0.1 && weightTrend.weeklyChange < 0.3) {
        const newCal = macroTargets.calories - 150;
        adjustments.push({
          type: "calories",
          previous: macroTargets.calories,
          new: newCal,
          reason:
            "Pérdida de peso <0.1 kg/semana. Reducción moderada de 150 kcal basada en adaptación metabólica.",
        });
      } else if (weightTrend.weeklyChange < -1.0) {
        const newCal = macroTargets.calories + 200;
        adjustments.push({
          type: "calories",
          previous: macroTargets.calories,
          new: newCal,
          reason:
            "Pérdida >1 kg/semana es excesiva. Riesgo de pérdida muscular. Aumento de 200 kcal.",
        });
      }
      break;

    case "gain_muscle":
      if (weightTrend.weeklyChange < 0.1) {
        const newCal = macroTargets.calories + 200;
        adjustments.push({
          type: "calories",
          previous: macroTargets.calories,
          new: newCal,
          reason:
            "Ganancia <0.1 kg/semana. Superávit adicional de 200 kcal para optimizar hipertrofia.",
        });
      } else if (weightTrend.weeklyChange > 0.7) {
        const newCal = macroTargets.calories - 150;
        adjustments.push({
          type: "calories",
          previous: macroTargets.calories,
          new: newCal,
          reason:
            "Ganancia >0.7 kg/semana sugiere exceso de grasa. Reducción moderada del superávit.",
        });
      }
      break;

    case "recomp":
      if (weightTrend.weeklyChange < -0.4) {
        adjustments.push({
          type: "calories",
          previous: macroTargets.calories,
          new: macroTargets.calories + 150,
          reason: "Pérdida rápida en recomposición. Aumento leve para preservar músculo.",
        });
      } else if (weightTrend.weeklyChange > 0.3) {
        adjustments.push({
          type: "calories",
          previous: macroTargets.calories,
          new: macroTargets.calories - 100,
          reason: "Ganancia de peso en recomp. Reducción leve para estabilizar.",
        });
      }
      if (avgCalories > 0 && avgCalories < macroTargets.protein * 4 + 200) {
        adjustments.push({
          type: "protein",
          previous: macroTargets.protein,
          new: macroTargets.protein + 10,
          reason: "Priorizar proteína en recomposición corporal.",
        });
      }
      break;

    case "maintain":
      if (Math.abs(weightTrend.weeklyChange) > 0.4) {
        const delta = weightTrend.weeklyChange > 0 ? -100 : 100;
        adjustments.push({
          type: "calories",
          previous: macroTargets.calories,
          new: macroTargets.calories + delta,
          reason: "Peso fuera del rango de mantenimiento. Ajuste calórico moderado.",
        });
      }
      break;

    case "performance":
      if (recentWorkouts.length < profile.trainingDaysPerWeek) {
        adjustments.push({
          type: "training_volume",
          previous: `${profile.trainingDaysPerWeek} días`,
          new: `${profile.trainingDaysPerWeek} días (priorizar consistencia)`,
          reason: "Rendimiento requiere adherencia al plan de entrenamiento.",
        });
      }
      if (avgCalories > 0 && avgCalories < macroTargets.calories * 0.9) {
        adjustments.push({
          type: "calories",
          previous: macroTargets.calories,
          new: macroTargets.calories + 150,
          reason: "Energía insuficiente para rendimiento óptimo.",
        });
      }
      break;
  }

  if (recentWorkouts.length < profile.trainingDaysPerWeek * 0.6) {
    adjustments.push({
      type: "training_volume",
      previous: `${profile.trainingDaysPerWeek} días`,
      new: `${Math.max(3, profile.trainingDaysPerWeek - 1)} días`,
      reason:
        "Baja adherencia detectada. Reducir frecuencia mejora consistencia a largo plazo.",
    });
  }

  if (recentWorkouts.length >= profile.trainingDaysPerWeek && profile.experienceLevel !== "beginner") {
    adjustments.push({
      type: "training_intensity",
      previous: "Volumen actual",
      new: "+1 serie por ejercicio principal",
      reason:
        "Alta adherencia y experiencia suficiente. Progresión de volumen según principio de sobrecarga progresiva.",
    });
  }

  return adjustments;
}

// ─── Generador de rutinas ────────────────────────────────────────────────────
function createExercises(
  groups: MuscleGroup[],
  experience: ExperienceLevel,
  equipment: EquipmentType,
  injuries: InjuryArea[]
): import("./types").Exercise[] {
  const sets = experience === "beginner" ? 3 : experience === "intermediate" ? 4 : 5;
  const reps =
    experience === "beginner" ? "10-12" : experience === "intermediate" ? "8-12" : "6-10";

  return groups.flatMap((group) => {
    const available = getExercisesForMuscle(group, equipment, injuries);
    const selected = available.slice(0, 2);
    if (selected.length === 0) {
      const fallback = getExercisesForMuscle(group, "home_no_equipment", injuries);
      return fallback.slice(0, 1).map((ex, i) => ({
        id: `${group}-${i}-${Date.now()}`,
        name: ex.name,
        muscleGroup: group,
        sets,
        reps,
        restSeconds: group === "legs" ? 120 : 90,
        notes: ex.instructions,
      }));
    }
    return selected.map((ex, i) => ({
      id: `${group}-${i}-${Date.now()}`,
      name: ex.name,
      muscleGroup: group,
      sets,
      reps,
      restSeconds: group === "legs" ? 120 : 90,
      notes: ex.instructions,
    }));
  });
}

export function generateRoutine(
  goal: Goal,
  experience: ExperienceLevel,
  daysPerWeek: number,
  equipment: EquipmentType = "full_gym",
  injuries: InjuryArea[] = []
): Routine {
  const templates: Record<number, { name: string; groups: MuscleGroup[] }[]> = {
    3: [
      { name: "Full Body A", groups: ["chest", "back", "legs", "core"] },
      { name: "Full Body B", groups: ["shoulders", "back", "legs", "core"] },
      { name: "Full Body C", groups: ["chest", "back", "legs", "core"] },
    ],
    4: [
      { name: "Upper A", groups: ["chest", "back", "shoulders", "biceps", "triceps"] },
      { name: "Lower A", groups: ["legs", "core"] },
      { name: "Upper B", groups: ["chest", "back", "shoulders", "biceps", "triceps"] },
      { name: "Lower B", groups: ["legs", "core"] },
    ],
    5: [
      { name: "Push", groups: ["chest", "shoulders", "triceps"] },
      { name: "Pull", groups: ["back", "biceps", "core"] },
      { name: "Legs", groups: ["legs", "core"] },
      { name: "Upper", groups: ["chest", "back", "shoulders", "biceps", "triceps"] },
      { name: "Full Body", groups: ["legs", "core", "back"] },
    ],
  };

  const days = Math.min(Math.max(daysPerWeek, 3), 5);
  const template = templates[days] || templates[3];

  const goalDescriptions: Record<Goal, string> = {
    lose_fat: "Rutina con énfasis en compuestos multiarticulares para máximo gasto calórico",
    gain_muscle: "Rutina de hipertrofia con volumen optimizado por grupo muscular",
    maintain: "Rutina de mantenimiento con balance de fuerza y resistencia",
    recomp: "Rutina mixta fuerza-hipertrofia para recomposición corporal",
    performance: "Rutina orientada a fuerza y potencia atlética",
  };

  return {
    id: `routine-${Date.now()}`,
    name: `Plan ${days} días - ${goal}`,
    description: goalDescriptions[goal],
    daysPerWeek: days,
    goal,
    experienceLevel: experience,
    sessions: template.map((t) => ({
      name: t.name,
      exercises: createExercises(t.groups, experience, equipment, injuries),
      notes: `Sesión ${t.name}`,
    })),
  };
}

// ─── Plan alimenticio sugerido ───────────────────────────────────────────────
export interface MealSuggestion {
  mealType: import("./types").MealType;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
}

export function generateMealPlan(macroTargets: MacroTargets): MealSuggestion[] {
  const calPerMeal = Math.round(macroTargets.calories / 4);
  const protPerMeal = Math.round(macroTargets.protein / 4);

  return [
    {
      mealType: "breakfast",
      name: "Avena con proteína y frutas",
      calories: calPerMeal,
      protein: protPerMeal,
      carbs: Math.round(macroTargets.carbs * 0.3),
      fat: Math.round(macroTargets.fat * 0.2),
      ingredients: [
        "80g avena",
        "30g proteína whey",
        "1 plátano",
        "15g mantequilla de maní",
        "Arándanos al gusto",
      ],
    },
    {
      mealType: "lunch",
      name: "Pollo con arroz y vegetales",
      calories: calPerMeal + 100,
      protein: protPerMeal + 10,
      carbs: Math.round(macroTargets.carbs * 0.35),
      fat: Math.round(macroTargets.fat * 0.3),
      ingredients: [
        "200g pechuga de pollo",
        "150g arroz integral cocido",
        "200g brócoli",
        "1 cda aceite de oliva",
        "Especias al gusto",
      ],
    },
    {
      mealType: "snack",
      name: "Yogur griego con frutos secos",
      calories: calPerMeal - 200,
      protein: protPerMeal - 10,
      carbs: Math.round(macroTargets.carbs * 0.1),
      fat: Math.round(macroTargets.fat * 0.25),
      ingredients: [
        "200g yogur griego 0%",
        "30g almendras",
        "1 cda miel",
      ],
    },
    {
      mealType: "dinner",
      name: "Salmón con patata y ensalada",
      calories: calPerMeal,
      protein: protPerMeal,
      carbs: Math.round(macroTargets.carbs * 0.25),
      fat: Math.round(macroTargets.fat * 0.25),
      ingredients: [
        "180g salmón",
        "200g patata",
        "Ensalada mixta",
        "1 cda aceite de oliva",
        "Limón",
      ],
    },
  ];
}

export function createWeeklyReview(
  profile: UserProfile,
  macroTargets: MacroTargets,
  weightEntries: WeightEntry[],
  foodEntries: FoodEntry[],
  workoutSessions: WorkoutSession[],
  dailyLogs: DailyLog[] = [],
  dismissed: DismissedRecommendation[] = []
): WeeklyReview {
  const now = new Date();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekFood = foodEntries.filter((f) => new Date(f.date) >= weekStart);
  const weekWorkouts = workoutSessions.filter(
    (w) => new Date(w.date) >= weekStart && w.completed
  );
  const weightTrend = analyzeWeightTrend(weightEntries, 7);

  const avgCalories =
    weekFood.length > 0
      ? weekFood.reduce((s, f) => s + f.calories, 0) /
        Math.max(new Set(weekFood.map((f) => f.date)).size, 1)
      : 0;

  const recommendations = generateCoachRecommendations(
    profile,
    macroTargets,
    weightEntries,
    foodEntries,
    workoutSessions,
    7,
    dailyLogs,
    dismissed
  );
  const adjustments = generateWeeklyAdjustments(
    profile,
    macroTargets,
    weightEntries,
    foodEntries,
    workoutSessions
  );

  return {
    id: `review-${Date.now()}`,
    weekStart: weekStart.toISOString().split("T")[0],
    weekEnd: now.toISOString().split("T")[0],
    avgWeight: weightTrend.avgWeight,
    weightChange: weightTrend.weeklyChange,
    avgCalories: Math.round(avgCalories),
    workoutsCompleted: weekWorkouts.length,
    workoutsPlanned: profile.trainingDaysPerWeek,
    adherencePercent: Math.round(
      (weekWorkouts.length / profile.trainingDaysPerWeek) * 100
    ),
    recommendations,
    adjustments,
    createdAt: now.toISOString(),
  };
}
