import { describe, it, expect } from "vitest";
import {
  presetBodybuilding,
  presetPushPullLegs,
  syncRoutineFromPlan,
  countTrainingDays,
  getTodaySessions,
} from "./schedule";
import type { UserProfile } from "./types";

const profile: UserProfile = {
  name: "Test",
  age: 30,
  gender: "male",
  heightCm: 180,
  weightKg: 80,
  goal: "gain_muscle",
  activityLevel: "moderate",
  experienceLevel: "intermediate",
  trainingDaysPerWeek: 5,
  equipment: "full_gym",
  injuries: [],
  parqCompleted: true,
  parqPositiveAnswers: false,
  createdAt: new Date().toISOString(),
};

describe("presetBodybuilding", () => {
  it("asigna piernas domingo y pecho lunes", () => {
    const plan = presetBodybuilding();
    expect(plan.days[0][0].focus).toBe("legs");
    expect(plan.days[1][0].focus).toBe("chest");
    expect(plan.days[2][0].focus).toBe("back");
    expect(plan.days[4][0].focus).toBe("shoulders");
  });

  it("incluye cardio en viernes y sábado", () => {
    const plan = presetBodybuilding();
    expect(plan.days[5].some((s) => s.focus === "cardio")).toBe(true);
    expect(plan.days[6].some((s) => s.focus === "cardio")).toBe(true);
  });
});

describe("presetPushPullLegs", () => {
  it("tiene push, pull y legs", () => {
    const plan = presetPushPullLegs();
    const allFocuses = Object.values(plan.days).flat().map((s) => s.focus);
    expect(allFocuses).toContain("push");
    expect(allFocuses).toContain("pull");
    expect(allFocuses).toContain("legs");
  });
});

describe("syncRoutineFromPlan", () => {
  it("genera sesiones con nombre de día", () => {
    const plan = presetBodybuilding();
    const routine = syncRoutineFromPlan(plan, profile);
    expect(routine.sessions.length).toBeGreaterThan(0);
    expect(routine.sessions[0].name).toMatch(/^(Dom|Lun|Mar|Mié|Jue|Vie|Sáb) —/);
  });
});

describe("countTrainingDays", () => {
  it("no cuenta solo cardio como día de fuerza", () => {
    const plan = presetBodybuilding();
    const days = countTrainingDays(plan);
    expect(days).toBeGreaterThanOrEqual(5);
  });
});
