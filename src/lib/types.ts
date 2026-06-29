export type Gender = "male" | "female";
export type Goal = "lose_fat" | "gain_muscle" | "maintain" | "recomp" | "performance";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type MuscleGroup = "chest" | "back" | "shoulders" | "biceps" | "triceps" | "legs" | "core" | "full_body";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  experienceLevel: ExperienceLevel;
  trainingDaysPerWeek: number;
  createdAt: string;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercent?: number;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: string;
  weightKg?: number;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  name: string;
  date: string;
  exercises: Exercise[];
  durationMinutes?: number;
  completed: boolean;
  notes?: string;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  daysPerWeek: number;
  sessions: Omit<WorkoutSession, "id" | "date" | "completed">[];
  goal: Goal;
  experienceLevel: ExperienceLevel;
}

export interface FoodEntry {
  id: string;
  date: string;
  mealType: MealType;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: string;
}

export interface WeeklyReview {
  id: string;
  weekStart: string;
  weekEnd: string;
  avgWeight: number;
  weightChange: number;
  avgCalories: number;
  workoutsCompleted: number;
  workoutsPlanned: number;
  adherencePercent: number;
  recommendations: CoachRecommendation[];
  adjustments: WeeklyAdjustment[];
  createdAt: string;
}

export interface CoachRecommendation {
  id: string;
  category: "training" | "nutrition" | "recovery" | "weight" | "general";
  priority: "high" | "medium" | "low";
  title: string;
  message: string;
  scienceBasis: string;
  actionItems: string[];
}

export interface WeeklyAdjustment {
  type: "calories" | "protein" | "training_volume" | "training_intensity" | "rest" | "cardio";
  previous: number | string;
  new: number | string;
  reason: string;
}

export interface DailyLog {
  date: string;
  waterMl: number;
  sleepHours?: number;
  steps?: number;
  mood?: 1 | 2 | 3 | 4 | 5;
  energy?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface AppState {
  profile: UserProfile | null;
  macroTargets: MacroTargets | null;
  weightEntries: WeightEntry[];
  foodEntries: FoodEntry[];
  workoutSessions: WorkoutSession[];
  activeRoutine: Routine | null;
  dailyLogs: DailyLog[];
  weeklyReviews: WeeklyReview[];
  onboardingComplete: boolean;
}

export const DEFAULT_APP_STATE: AppState = {
  profile: null,
  macroTargets: null,
  weightEntries: [],
  foodEntries: [],
  workoutSessions: [],
  activeRoutine: null,
  dailyLogs: [],
  weeklyReviews: [],
  onboardingComplete: false,
};
