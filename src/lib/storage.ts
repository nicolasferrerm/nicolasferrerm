"use client";

import { useReducer, useEffect, useCallback, useState } from "react";
import type { AppState } from "./types";
import { DEFAULT_APP_STATE } from "./types";
import { appReducer } from "./reducer";
import { migrateState } from "./migrations";

const STORAGE_KEY = "fitcoach-app-state";

function loadState(): AppState {
  if (typeof window === "undefined") return DEFAULT_APP_STATE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return migrateState(JSON.parse(stored));
  } catch {
    // ignore parse errors
  }
  return DEFAULT_APP_STATE;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function useAppState() {
  const [state, dispatch] = useReducer(appReducer, DEFAULT_APP_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: loadState() });
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveState(state);
  }, [state, loaded]);

  const update = useCallback((partial: Partial<AppState>) => {
    dispatch({ type: "UPDATE", payload: partial });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "RESET" });
  }, []);

  return { state, update, reset, loaded };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function getGoalLabel(goal: string): string {
  const labels: Record<string, string> = {
    lose_fat: "Perder grasa",
    gain_muscle: "Ganar músculo",
    maintain: "Mantener",
    recomp: "Recomposición",
    performance: "Rendimiento",
  };
  return labels[goal] || goal;
}

export function getMuscleLabel(muscle: string): string {
  const labels: Record<string, string> = {
    chest: "Pecho",
    back: "Espalda",
    shoulders: "Hombros",
    biceps: "Bíceps",
    triceps: "Tríceps",
    legs: "Piernas",
    core: "Core",
    full_body: "Cuerpo completo",
  };
  return labels[muscle] || muscle;
}

export function getMealLabel(meal: string): string {
  const labels: Record<string, string> = {
    breakfast: "Desayuno",
    lunch: "Almuerzo",
    dinner: "Cena",
    snack: "Snack",
  };
  return labels[meal] || meal;
}

export function getEquipmentLabel(equipment: string): string {
  const labels: Record<string, string> = {
    full_gym: "Gimnasio completo",
    barbell_rack: "Barra + rack",
    dumbbells_only: "Solo mancuernas",
    bands: "Bandas elásticas",
    home_no_equipment: "Sin equipo",
  };
  return labels[equipment] || equipment;
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "text-red-400 bg-red-500/10 border-red-500/30";
    case "medium":
      return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    default:
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  }
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    training: "🏋️",
    nutrition: "🥗",
    recovery: "😴",
    weight: "⚖️",
    general: "💡",
  };
  return icons[category] || "💡";
}
