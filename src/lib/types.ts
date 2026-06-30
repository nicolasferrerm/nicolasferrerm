export const SCHEMA_VERSION = 3;

export type Gender = "male" | "female" | "other";
export type Goal = "lose_fat" | "gain_muscle" | "maintain" | "recomp" | "performance";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type MuscleGroup = "chest" | "back" | "shoulders" | "biceps" | "triceps" | "legs" | "core" | "full_body";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type EquipmentType = "full_gym" | "dumbbells_only" | "home_no_equipment" | "bands" | "barbell_rack";
export type InjuryArea = "knee" | "shoulder" | "lower_back" | "hip" | "wrist" | "ankle";
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type SessionFocus =
  | "rest"
  | "chest"
  | "back"
  | "shoulders"
  | "legs"
  | "arms"
  | "push"
  | "pull"
  | "upper"
  | "lower"
  | "full_body"
  | "cardio";

export interface PlannedSession {
  id: string;
  focus: SessionFocus;
  label: string;
  notes?: string;
}

export interface WeeklyPlan {
  id: string;
  name: string;
  days: Record<DayOfWeek, PlannedSession[]>;
  updatedAt: string;
}

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
  equipment: EquipmentType;
  injuries: InjuryArea[];
  parqCompleted: boolean;
  parqPositiveAnswers: boolean;
  createdAt: string;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  calculatedAtWeightKg?: number;
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

export interface DismissedRecommendation {
  id: string;
  dismissedAt: string;
}

export interface AppState {
  schemaVersion: number;
  profile: UserProfile | null;
  macroTargets: MacroTargets | null;
  weightEntries: WeightEntry[];
  foodEntries: FoodEntry[];
  workoutSessions: WorkoutSession[];
  activeRoutine: Routine | null;
  weeklyPlan: WeeklyPlan | null;
  dailyLogs: DailyLog[];
  weeklyReviews: WeeklyReview[];
  dismissedRecommendations: DismissedRecommendation[];
  onboardingComplete: boolean;
}

export const DEFAULT_APP_STATE: AppState = {
  schemaVersion: SCHEMA_VERSION,
  profile: null,
  macroTargets: null,
  weightEntries: [],
  foodEntries: [],
  workoutSessions: [],
  activeRoutine: null,
  weeklyPlan: null,
  dailyLogs: [],
  weeklyReviews: [],
  dismissedRecommendations: [],
  onboardingComplete: false,
};
