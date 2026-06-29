"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/Navigation";
import {
  Card,
  Button,
  Badge,
  PageHeader,
  Input,
  Select,
} from "@/components/ui";
import { calculateTDEE, calculateMacros, generateRoutine } from "@/lib/science";
import { getGoalLabel } from "@/lib/storage";
import type { Goal, ActivityLevel, ExperienceLevel } from "@/lib/types";
import { User, RefreshCw, Trash2 } from "lucide-react";

export default function PerfilPage() {
  const { state, update, reset } = useApp();
  const [editing, setEditing] = useState(false);

  if (!state.profile || !state.macroTargets) return null;

  const { profile, macroTargets } = state;
  const tdee = calculateTDEE(profile);

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(String(profile.age));
  const [heightCm, setHeightCm] = useState(String(profile.heightCm));
  const [weightKg, setWeightKg] = useState(String(profile.weightKg));
  const [goal, setGoal] = useState<Goal>(profile.goal);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(profile.experienceLevel);
  const [trainingDays, setTrainingDays] = useState(String(profile.trainingDaysPerWeek));

  function saveProfile() {
    const updated = {
      ...profile,
      name,
      age: parseInt(age),
      heightCm: parseFloat(heightCm),
      weightKg: parseFloat(weightKg),
      goal,
      activityLevel,
      experienceLevel,
      trainingDaysPerWeek: parseInt(trainingDays),
    };
    const newTdee = calculateTDEE(updated);
    const newMacros = calculateMacros(updated, newTdee);
    const newRoutine = generateRoutine(goal, experienceLevel, parseInt(trainingDays));

    update({
      profile: updated,
      macroTargets: newMacros,
      activeRoutine: newRoutine,
    });
    setEditing(false);
  }

  const stats = [
    { label: "Registros de peso", value: state.weightEntries.length },
    { label: "Comidas registradas", value: state.foodEntries.length },
    { label: "Entrenamientos", value: state.workoutSessions.filter((w) => w.completed).length },
    { label: "Revisiones semanales", value: state.weeklyReviews.length },
  ];

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-4xl mx-auto animate-fade-in">
        <PageHeader
          title="Perfil"
          subtitle="Tu información y configuración"
          action={
            editing ? (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={saveProfile}>Guardar</Button>
              </div>
            ) : (
              <Button variant="secondary" onClick={() => setEditing(true)}>
                <RefreshCw size={16} className="inline mr-1" /> Editar
              </Button>
            )
          }
        />

        {/* Profile card */}
        <Card className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <User className="text-emerald-400" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{profile.name}</h2>
              <Badge color="emerald">{getGoalLabel(profile.goal)}</Badge>
            </div>
          </div>

          {editing ? (
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nombre" value={name} onChange={setName} />
              <Input label="Edad" type="number" value={age} onChange={setAge} />
              <Input label="Altura (cm)" type="number" value={heightCm} onChange={setHeightCm} />
              <Input label="Peso (kg)" type="number" value={weightKg} onChange={setWeightKg} step={0.1} />
              <Select
                label="Objetivo"
                value={goal}
                onChange={(v) => setGoal(v as Goal)}
                options={[
                  { value: "lose_fat", label: "Perder grasa" },
                  { value: "gain_muscle", label: "Ganar músculo" },
                  { value: "maintain", label: "Mantener" },
                  { value: "recomp", label: "Recomposición" },
                  { value: "performance", label: "Rendimiento" },
                ]}
              />
              <Select
                label="Actividad"
                value={activityLevel}
                onChange={(v) => setActivityLevel(v as ActivityLevel)}
                options={[
                  { value: "sedentary", label: "Sedentario" },
                  { value: "light", label: "Ligero" },
                  { value: "moderate", label: "Moderado" },
                  { value: "active", label: "Activo" },
                  { value: "very_active", label: "Muy activo" },
                ]}
              />
              <Select
                label="Experiencia"
                value={experienceLevel}
                onChange={(v) => setExperienceLevel(v as ExperienceLevel)}
                options={[
                  { value: "beginner", label: "Principiante" },
                  { value: "intermediate", label: "Intermedio" },
                  { value: "advanced", label: "Avanzado" },
                ]}
              />
              <Select
                label="Días/semana"
                value={trainingDays}
                onChange={setTrainingDays}
                options={[
                  { value: "3", label: "3 días" },
                  { value: "4", label: "4 días" },
                  { value: "5", label: "5 días" },
                ]}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Edad", value: `${profile.age} años` },
                { label: "Altura", value: `${profile.heightCm} cm` },
                { label: "Peso", value: `${profile.weightKg} kg` },
                { label: "Entrenos/sem", value: `${profile.trainingDaysPerWeek} días` },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xs text-zinc-500">{s.label}</p>
                  <p className="text-sm font-medium text-white">{s.value}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Metabolismo */}
        <Card className="mb-6">
          <h3 className="font-semibold text-white mb-4">Metabolismo calculado</h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-zinc-500">TDEE</p>
              <p className="text-lg font-bold text-emerald-400">{tdee} kcal</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Objetivo calórico</p>
              <p className="text-lg font-bold text-white">{macroTargets.calories} kcal</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Proteína</p>
              <p className="text-lg font-bold text-blue-400">{macroTargets.protein}g</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Carbos</p>
              <p className="text-lg font-bold text-amber-400">{macroTargets.carbs}g</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Grasas</p>
              <p className="text-lg font-bold text-red-400">{macroTargets.fat}g</p>
            </div>
          </div>
          <p className="text-xs text-zinc-600 mt-4">
            Calculado con ecuación Mifflin-St Jeor (1990) y ajustado según objetivo
            basado en ISSN Position Stand (2017) y Morton et al. (2018).
          </p>
        </Card>

        {/* Stats */}
        <Card className="mb-6">
          <h3 className="font-semibold text-white mb-4">Tu actividad</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-3 rounded-lg bg-zinc-800/30">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Danger zone */}
        <Card className="border-red-500/20">
          <h3 className="font-semibold text-red-400 mb-2">Zona de peligro</h3>
          <p className="text-sm text-zinc-500 mb-4">
            Esto eliminará todos tus datos y reiniciará la aplicación.
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm("¿Estás seguro? Se perderán todos los datos.")) {
                reset();
              }
            }}
          >
            <Trash2 size={14} className="inline mr-1" /> Reiniciar aplicación
          </Button>
        </Card>
      </div>
    </AppShell>
  );
}
