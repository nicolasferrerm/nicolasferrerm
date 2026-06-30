import { describe, it, expect } from "vitest";
import {
  calculateBMR,
  calculateTDEE,
  calculateMacros,
  analyzeWeightTrend,
  suggestProgression,
  generateRoutine,
  shouldRecalculateMacros,
  movingAverageWeight,
} from "./science";
import type { UserProfile, WeightEntry } from "./types";

const baseProfile: UserProfile = {
  name: "Test",
  age: 30,
  gender: "male",
  heightCm: 180,
  weightKg: 80,
  goal: "gain_muscle",
  activityLevel: "moderate",
  experienceLevel: "intermediate",
  trainingDaysPerWeek: 4,
  equipment: "full_gym",
  injuries: [],
  parqCompleted: true,
  parqPositiveAnswers: false,
  createdAt: new Date().toISOString(),
};

describe("calculateBMR", () => {
  it("calcula BMR masculino", () => {
    expect(calculateBMR(80, 180, 30, "male")).toBe(1780);
  });

  it("calcula BMR femenino", () => {
    expect(calculateBMR(60, 165, 25, "female")).toBe(1345.25);
  });

  it("calcula BMR otro género como promedio", () => {
    const male = calculateBMR(70, 170, 28, "male");
    const female = calculateBMR(70, 170, 28, "female");
    const other = calculateBMR(70, 170, 28, "other");
    expect(other).toBe(Math.round((male + female) / 2));
  });
});

describe("calculateTDEE", () => {
  it("aplica multiplicador de actividad", () => {
    const tdee = calculateTDEE(baseProfile);
    expect(tdee).toBe(Math.round(1780 * 1.55));
  });
});

describe("calculateMacros", () => {
  it("genera macros con calculatedAtWeightKg", () => {
    const macros = calculateMacros(baseProfile, 2500);
    expect(macros.calories).toBeGreaterThan(2500);
    expect(macros.protein).toBe(Math.round(80 * 1.8));
    expect(macros.calculatedAtWeightKg).toBe(80);
  });

  it("déficit para lose_fat", () => {
    const profile = { ...baseProfile, goal: "lose_fat" as const };
    const macros = calculateMacros(profile, 2500);
    expect(macros.calories).toBe(2000);
  });
});

describe("analyzeWeightTrend", () => {
  it("detecta pérdida de peso", () => {
    const entries: WeightEntry[] = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      date: `2026-01-${String(i + 1).padStart(2, "0")}`,
      weightKg: 80 - i * 0.2,
    }));
    const result = analyzeWeightTrend(entries);
    expect(result.trend).toBe("losing");
  });

  it("retorna stable con pocos datos", () => {
    const result = analyzeWeightTrend([{ id: "1", date: "2026-01-01", weightKg: 80 }]);
    expect(result.trend).toBe("stable");
  });
});

describe("suggestProgression", () => {
  it("sugiere aumentar peso", () => {
    const result = suggestProgression(50, 12, 10);
    expect(result.action).toBe("increase_weight");
    expect(result.newWeight).toBe(55);
  });

  it("mantiene peso si reps bajas", () => {
    const result = suggestProgression(50, 5, 10);
    expect(result.action).toBe("maintain");
  });
});

describe("generateRoutine", () => {
  it("genera rutina con equipo y lesiones", () => {
    const routine = generateRoutine("gain_muscle", "beginner", 3, "home_no_equipment", ["knee"]);
    expect(routine.sessions).toHaveLength(3);
    const allExercises = routine.sessions.flatMap((s) => s.exercises);
    expect(allExercises.every((e) => !e.name.toLowerCase().includes("sentadilla con barra"))).toBe(true);
  });
});

describe("shouldRecalculateMacros", () => {
  it("detecta cambio significativo de peso", () => {
    expect(shouldRecalculateMacros({ calories: 2500, protein: 150, carbs: 250, fat: 80, fiber: 30, calculatedAtWeightKg: 80 }, 82)).toBe(true);
    expect(shouldRecalculateMacros({ calories: 2500, protein: 150, carbs: 250, fat: 80, fiber: 30, calculatedAtWeightKg: 80 }, 80.5)).toBe(false);
  });
});

describe("movingAverageWeight", () => {
  it("calcula promedio de últimos 7 días", () => {
    const entries: WeightEntry[] = [
      { id: "1", date: "2026-01-01", weightKg: 80 },
      { id: "2", date: "2026-01-02", weightKg: 82 },
    ];
    expect(movingAverageWeight(entries)).toBe(81);
  });
});
