"use client";

import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/Navigation";
import { RouteGuard } from "@/components/RouteGuard";
import { Card, Button, Badge, PageHeader, StatCard } from "@/components/ui";
import { createWeeklyReview } from "@/lib/science";
import { formatDate } from "@/lib/storage";
import { CalendarCheck, ArrowRight, CheckCircle } from "lucide-react";

function SemanalContent() {
  const { state, update } = useApp();
  const { weeklyReviews, profile, macroTargets } = state;
  const latestReview = weeklyReviews[weeklyReviews.length - 1];

  function runWeeklyReview() {
    const review = createWeeklyReview(
      profile!,
      macroTargets!,
      state.weightEntries,
      state.foodEntries,
      state.workoutSessions,
      state.dailyLogs,
      state.dismissedRecommendations
    );
    update({ weeklyReviews: [...weeklyReviews, review] });
  }

  function applyAdjustments() {
    if (!latestReview || !macroTargets) return;

    let newMacros = { ...macroTargets };
    let newProfile = profile ? { ...profile } : null;

    for (const adj of latestReview.adjustments) {
      if (adj.type === "calories" && typeof adj.new === "number") {
        const ratio = adj.new / (adj.previous as number);
        newMacros = {
          ...newMacros,
          calories: adj.new,
          carbs: Math.round(newMacros.carbs * ratio),
          fat: Math.round(newMacros.fat * ratio),
          calculatedAtWeightKg: profile?.weightKg,
        };
      }
      if (adj.type === "protein" && typeof adj.new === "number") {
        newMacros = { ...newMacros, protein: adj.new };
      }
      if (adj.type === "training_volume" && newProfile) {
        const match = String(adj.new).match(/(\d+)/);
        if (match) {
          newProfile = { ...newProfile, trainingDaysPerWeek: parseInt(match[1]) };
        }
      }
    }

    update({
      macroTargets: newMacros,
      ...(newProfile ? { profile: newProfile } : {}),
    });
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto animate-fade-in">
        <PageHeader
          title="Ajustes semanales"
          subtitle="Revisión automática basada en tu progreso real"
          action={
            <Button onClick={runWeeklyReview}>
              <CalendarCheck size={16} className="inline mr-1" /> Nueva revisión
            </Button>
          }
        />

        {!latestReview ? (
          <Card className="text-center py-16">
            <CalendarCheck size={48} className="text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Primera revisión semanal
            </h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
              Cada semana analizamos tu peso, nutrición y entrenamiento para
              sugerir ajustes basados en evidencia. Necesitas al menos unos días
              de datos registrados.
            </p>
            <Button onClick={runWeeklyReview}>Generar revisión</Button>
          </Card>
        ) : (
          <>
            {/* Resumen semanal */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <StatCard
                label="Peso promedio"
                value={latestReview.avgWeight}
                unit="kg"
                color="blue"
              />
              <StatCard
                label="Cambio semanal"
                value={
                  latestReview.weightChange > 0
                    ? `+${latestReview.weightChange}`
                    : latestReview.weightChange
                }
                unit="kg"
                color="emerald"
              />
              <StatCard
                label="Calorías prom."
                value={latestReview.avgCalories}
                unit="kcal"
                color="amber"
              />
              <StatCard
                label="Adherencia"
                value={`${latestReview.adherencePercent}%`}
                color={
                  latestReview.adherencePercent >= 80
                    ? "emerald"
                    : latestReview.adherencePercent >= 50
                    ? "amber"
                    : "red"
                }
              />
            </div>

            <p className="text-xs text-zinc-500 mb-6">
              Período: {formatDate(latestReview.weekStart)} —{" "}
              {formatDate(latestReview.weekEnd)} ·{" "}
              {latestReview.workoutsCompleted}/{latestReview.workoutsPlanned}{" "}
              entrenamientos completados
            </p>

            {/* Ajustes sugeridos */}
            {latestReview.adjustments.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-3">
                  Ajustes sugeridos
                </h3>
                <div className="space-y-3">
                  {latestReview.adjustments.map((adj, i) => (
                    <Card key={i} className="border-amber-500/20">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-zinc-400">{String(adj.previous)}</span>
                          <ArrowRight size={14} className="text-amber-400" />
                          <span className="text-amber-400 font-semibold">
                            {String(adj.new)}
                          </span>
                        </div>
                        <Badge color="amber">
                          {adj.type === "calories"
                            ? "Calorías"
                            : adj.type === "protein"
                            ? "Proteína"
                            : adj.type === "training_volume"
                            ? "Volumen"
                            : adj.type === "training_intensity"
                            ? "Intensidad"
                            : adj.type === "rest"
                            ? "Descanso"
                            : "Cardio"}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 mt-2">{adj.reason}</p>
                    </Card>
                  ))}
                </div>
                <Button onClick={applyAdjustments} className="mt-4">
                  <CheckCircle size={16} className="inline mr-1" /> Aplicar ajustes
                </Button>
              </div>
            )}

            {/* Recomendaciones del coach */}
            <div>
              <h3 className="font-semibold text-white mb-3">
                Recomendaciones del coach
              </h3>
              <div className="space-y-2">
                {latestReview.recommendations.slice(0, 5).map((rec) => (
                  <Card key={rec.id} className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {rec.category === "training"
                          ? "🏋️"
                          : rec.category === "nutrition"
                          ? "🥗"
                          : rec.category === "recovery"
                          ? "😴"
                          : rec.category === "weight"
                          ? "⚖️"
                          : "💡"}
                      </span>
                      <p className="text-sm text-white font-medium">{rec.title}</p>
                      <Badge
                        color={
                          rec.priority === "high"
                            ? "red"
                            : rec.priority === "medium"
                            ? "amber"
                            : "emerald"
                        }
                      >
                        {rec.priority === "high"
                          ? "Alta"
                          : rec.priority === "medium"
                          ? "Media"
                          : "Baja"}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 ml-7">{rec.message}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Historial de revisiones */}
            {weeklyReviews.length > 1 && (
              <div className="mt-8">
                <h3 className="font-semibold text-white mb-3">
                  Revisiones anteriores
                </h3>
                <div className="space-y-2">
                  {weeklyReviews
                    .slice(0, -1)
                    .reverse()
                    .map((review) => (
                      <div
                        key={review.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30"
                      >
                        <div>
                          <p className="text-sm text-white">
                            {formatDate(review.weekStart)} —{" "}
                            {formatDate(review.weekEnd)}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {review.avgWeight} kg · {review.adherencePercent}%
                            adherencia
                          </p>
                        </div>
                        <Badge color="zinc">
                          {review.adjustments.length} ajustes
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
    </div>
  );
}

export default function SemanalPage() {
  return (
    <AppShell>
      <RouteGuard>
        <SemanalContent />
      </RouteGuard>
    </AppShell>
  );
}
