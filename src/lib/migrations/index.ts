import type { AppState } from "../types";
import { DEFAULT_APP_STATE, SCHEMA_VERSION } from "../types";

type LegacyState = Partial<AppState> & {
  schemaVersion?: number;
  profile?: Partial<AppState["profile"]> & Record<string, unknown>;
};

export function migrateState(raw: unknown): AppState {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_APP_STATE };
  }

  const state = raw as LegacyState;
  let current: AppState = {
    ...DEFAULT_APP_STATE,
    ...state,
    dismissedRecommendations: state.dismissedRecommendations ?? [],
  } as AppState;

  if (!current.schemaVersion || current.schemaVersion < 2) {
    current = migrateV1ToV2(current);
  }

  if (current.schemaVersion < 3) {
    current = migrateV2ToV3(current);
  }

  current.schemaVersion = SCHEMA_VERSION;
  return current;
}

function migrateV1ToV2(state: AppState): AppState {
  const profile = state.profile
    ? {
        ...state.profile,
        equipment: state.profile.equipment ?? "full_gym",
        injuries: state.profile.injuries ?? [],
        parqCompleted: state.profile.parqCompleted ?? true,
        parqPositiveAnswers: state.profile.parqPositiveAnswers ?? false,
      }
    : null;

  return {
    ...state,
    profile,
    dismissedRecommendations: state.dismissedRecommendations ?? [],
    macroTargets: state.macroTargets
      ? {
          ...state.macroTargets,
          calculatedAtWeightKg:
            state.macroTargets.calculatedAtWeightKg ?? profile?.weightKg,
        }
      : null,
    schemaVersion: 2,
  };
}

function migrateV2ToV3(state: AppState): AppState {
  return {
    ...state,
    weeklyPlan: state.weeklyPlan ?? null,
    schemaVersion: 3,
  };
}
