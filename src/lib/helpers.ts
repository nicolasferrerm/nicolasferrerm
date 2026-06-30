import type { AppState } from "./types";

export function dismissRecommendation(
  state: AppState,
  recommendationId: string
): AppState["dismissedRecommendations"] {
  const exists = state.dismissedRecommendations.some((d) => d.id === recommendationId);
  if (exists) return state.dismissedRecommendations;
  return [
    ...state.dismissedRecommendations,
    { id: recommendationId, dismissedAt: new Date().toISOString() },
  ];
}

export function isRecommendationDismissed(
  dismissed: AppState["dismissedRecommendations"],
  id: string,
  days = 7
): boolean {
  const entry = dismissed.find((d) => d.id === id);
  if (!entry) return false;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return new Date(entry.dismissedAt).getTime() > cutoff;
}
