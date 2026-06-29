"use client";

import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/Navigation";
import { Card, Badge, PageHeader } from "@/components/ui";
import { generateCoachRecommendations } from "@/lib/science";
import { getPriorityColor, getCategoryIcon } from "@/lib/storage";
import { Brain, BookOpen, ListChecks } from "lucide-react";

export default function CoachPage() {
  const { state } = useApp();

  if (!state.profile || !state.macroTargets) return null;

  const recommendations = generateCoachRecommendations(
    state.profile,
    state.macroTargets,
    state.weightEntries,
    state.foodEntries,
    state.workoutSessions
  );

  const highPriority = recommendations.filter((r) => r.priority === "high");
  const others = recommendations.filter((r) => r.priority !== "high");

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-4xl mx-auto animate-fade-in">
        <PageHeader
          title="Coach inteligente"
          subtitle="Recomendaciones basadas en tus datos y evidencia científica"
        />

        {/* Coach intro */}
        <Card className="mb-6 border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-transparent">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Brain className="text-emerald-400" size={24} />
            </div>
            <div>
              <h2 className="font-semibold text-white">
                Análisis de {state.profile.name}
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                He analizado tu nutrición, entrenamiento y peso de los últimos 7 días.
                Aquí están mis recomendaciones priorizadas según tu objetivo de{" "}
                <span className="text-emerald-400">
                  {state.profile.goal === "lose_fat"
                    ? "pérdida de grasa"
                    : state.profile.goal === "gain_muscle"
                    ? "ganancia muscular"
                    : state.profile.goal === "recomp"
                    ? "recomposición"
                    : state.profile.goal === "performance"
                    ? "rendimiento"
                    : "mantenimiento"}
                </span>
                .
              </p>
            </div>
          </div>
        </Card>

        {/* High priority */}
        {highPriority.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">
              Prioridad alta
            </h3>
            <div className="space-y-3">
              {highPriority.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          </div>
        )}

        {/* Other recommendations */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Recomendaciones
          </h3>
          <div className="space-y-3">
            {others.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
          </div>
        </div>

        {recommendations.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-zinc-500">
              Registra más datos para recibir recomendaciones personalizadas.
            </p>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

function RecommendationCard({
  rec,
}: {
  rec: ReturnType<typeof generateCoachRecommendations>[0];
}) {
  return (
    <Card className={`border ${getPriorityColor(rec.priority)}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{getCategoryIcon(rec.category)}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-white text-sm">{rec.title}</h4>
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
          <p className="text-sm text-zinc-400">{rec.message}</p>

          <div className="mt-3 p-3 rounded-lg bg-zinc-800/50">
            <div className="flex items-center gap-1.5 mb-1.5">
              <BookOpen size={12} className="text-zinc-500" />
              <span className="text-xs text-zinc-500 font-medium">
                Base científica
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {rec.scienceBasis}
            </p>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <ListChecks size={12} className="text-emerald-500" />
              <span className="text-xs text-emerald-400 font-medium">
                Acciones
              </span>
            </div>
            <ul className="space-y-1">
              {rec.actionItems.map((item, i) => (
                <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
