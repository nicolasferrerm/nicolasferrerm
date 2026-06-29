"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/Navigation";
import { Card, Button, PageHeader, Input, StatCard } from "@/components/ui";
import { analyzeWeightTrend } from "@/lib/science";
import { generateId, today } from "@/lib/storage";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Plus, TrendingDown, TrendingUp, Minus } from "lucide-react";

export default function PesoPage() {
  const { state, update } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [notes, setNotes] = useState("");

  if (!state.profile) return null;

  const { weightEntries, profile } = state;
  const trend = analyzeWeightTrend(weightEntries);

  const chartData = [...weightEntries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e) => ({
      date: e.date.slice(5),
      peso: e.weightKg,
    }));

  function addEntry() {
    if (!weight) return;
    const entry = {
      id: generateId(),
      date: today(),
      weightKg: parseFloat(weight),
      bodyFatPercent: bodyFat ? parseFloat(bodyFat) : undefined,
      notes: notes || undefined,
    };
    update({ weightEntries: [...weightEntries, entry] });
    if (state.profile) {
      update({
        profile: { ...state.profile, weightKg: parseFloat(weight) },
      });
    }
    setWeight("");
    setBodyFat("");
    setNotes("");
    setShowForm(false);
  }

  const TrendIcon =
    trend.trend === "losing"
      ? TrendingDown
      : trend.trend === "gaining"
      ? TrendingUp
      : Minus;

  const trendLabel =
    trend.trend === "losing"
      ? "Perdiendo"
      : trend.trend === "gaining"
      ? "Ganando"
      : "Estable";

  const trendColor =
    profile.goal === "lose_fat"
      ? trend.trend === "losing"
        ? "emerald"
        : "red"
      : profile.goal === "gain_muscle"
      ? trend.trend === "gaining"
        ? "emerald"
        : "amber"
      : "blue";

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-4xl mx-auto animate-fade-in">
        <PageHeader
          title="Control de peso"
          subtitle="Registra tu peso diario para ajustes semanales precisos"
          action={
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus size={16} className="inline mr-1" /> Registrar
            </Button>
          }
        />

        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard
            label="Peso actual"
            value={trend.avgWeight || profile.weightKg}
            unit="kg"
            color="blue"
          />
          <StatCard
            label="Tendencia"
            value={trendLabel}
            icon={<TrendIcon size={24} />}
            color={trendColor as "emerald" | "red" | "amber" | "blue"}
          />
          <StatCard
            label="Cambio semanal"
            value={trend.weeklyChange > 0 ? `+${trend.weeklyChange}` : trend.weeklyChange}
            unit="kg"
            color={trendColor as "emerald" | "red" | "amber" | "blue"}
          />
        </div>

        {showForm && (
          <Card className="mb-6 border-blue-500/30">
            <h3 className="font-semibold text-white mb-4">Nuevo registro</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Peso (kg)"
                type="number"
                value={weight}
                onChange={setWeight}
                step={0.1}
                placeholder={String(profile.weightKg)}
              />
              <Input
                label="% Grasa corporal (opcional)"
                type="number"
                value={bodyFat}
                onChange={setBodyFat}
                step={0.1}
              />
              <div className="col-span-2">
                <Input
                  label="Notas (opcional)"
                  value={notes}
                  onChange={setNotes}
                  placeholder="Ej: Después de comer, en ayunas..."
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={addEntry}>Guardar</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {/* Gráfico */}
        {chartData.length >= 2 && (
          <Card className="mb-6">
            <h3 className="font-semibold text-white mb-4">Evolución del peso</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                <YAxis
                  stroke="#71717a"
                  fontSize={12}
                  domain={["dataMin - 1", "dataMax + 1"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="peso"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  name="Peso (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Historial */}
        <Card>
          <h3 className="font-semibold text-white mb-3">Historial</h3>
          {weightEntries.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Sin registros. Pésate a la misma hora cada día para datos consistentes.
            </p>
          ) : (
            <div className="space-y-2">
              {[...weightEntries]
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30"
                  >
                    <div>
                      <p className="text-sm text-white">{e.weightKg} kg</p>
                      <p className="text-xs text-zinc-500">{e.date}</p>
                    </div>
                    <div className="text-right">
                      {e.bodyFatPercent && (
                        <p className="text-xs text-zinc-400">
                          {e.bodyFatPercent}% grasa
                        </p>
                      )}
                      {e.notes && (
                        <p className="text-xs text-zinc-600">{e.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>

        <Card className="mt-6 border-zinc-700/50">
          <p className="text-xs text-zinc-500 leading-relaxed">
            <strong className="text-zinc-400">Tip científico:</strong> Pésate siempre
            a la misma hora (idealmente al despertar, en ayunas). Las fluctuaciones
            diarias de 0.5-1 kg son normales por agua y glucógeno. Usamos promedios
            semanales para ajustes, no valores individuales (Helms et al., 2014).
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
