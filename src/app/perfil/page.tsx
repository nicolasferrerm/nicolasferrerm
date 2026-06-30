"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/Navigation";
import { RouteGuard } from "@/components/RouteGuard";
import { Card, Button, Badge, PageHeader, Input, Select } from "@/components/ui";
import { calculateTDEE, calculateMacros, generateRoutine } from "@/lib/science";
import { getGoalLabel, getEquipmentLabel } from "@/lib/storage";
import { EQUIPMENT_OPTIONS, INJURY_OPTIONS } from "@/lib/exercises";
import type { Goal, ActivityLevel, ExperienceLevel, EquipmentType, InjuryArea, Gender } from "@/lib/types";
import { User, RefreshCw, Trash2, Download } from "lucide-react";

export default function PerfilPage() {
  return (
    <AppShell>
      <RouteGuard>
        <PerfilContent />
      </RouteGuard>
    </AppShell>
  );
}

function PerfilContent() {
  const { state, update, reset } = useApp();
  const { profile, macroTargets } = state;
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState<Gender>("male");
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("75");
  const [goal, setGoal] = useState<Goal>("gain_muscle");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("intermediate");
  const [trainingDays, setTrainingDays] = useState("4");
  const [equipment, setEquipment] = useState<EquipmentType>("full_gym");
  const [injuries, setInjuries] = useState<InjuryArea[]>([]);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setAge(String(profile.age));
      setGender(profile.gender);
      setHeightCm(String(profile.heightCm));
      setWeightKg(String(profile.weightKg));
      setGoal(profile.goal);
      setActivityLevel(profile.activityLevel);
      setExperienceLevel(profile.experienceLevel);
      setTrainingDays(String(profile.trainingDaysPerWeek));
      setEquipment(profile.equipment ?? "full_gym");
      setInjuries(profile.injuries ?? []);
    }
  }, [profile, editing]);

  if (!profile || !macroTargets) return null;

  const tdee = calculateTDEE(profile);

  function saveProfile() {
    if (!profile) return;
    const updated = {
      ...profile,
      name,
      age: parseInt(age),
      gender,
      heightCm: parseFloat(heightCm),
      weightKg: parseFloat(weightKg),
      goal,
      activityLevel,
      experienceLevel,
      trainingDaysPerWeek: parseInt(trainingDays),
      equipment,
      injuries,
      parqCompleted: profile.parqCompleted,
      parqPositiveAnswers: profile.parqPositiveAnswers,
    };
    const newTdee = calculateTDEE(updated);
    const newMacros = calculateMacros(updated, newTdee);
    const newRoutine = generateRoutine(
      goal,
      experienceLevel,
      parseInt(trainingDays),
      equipment,
      injuries
    );

    update({
      profile: updated,
      macroTargets: newMacros,
      activeRoutine: newRoutine,
    });
    setEditing(false);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fitcoach-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleInjury(injury: InjuryArea) {
    setInjuries((prev) =>
      prev.includes(injury) ? prev.filter((i) => i !== injury) : [...prev, injury]
    );
  }

  const stats = [
    { label: "Registros de peso", value: state.weightEntries.length },
    { label: "Comidas registradas", value: state.foodEntries.length },
    { label: "Entrenamientos", value: state.workoutSessions.filter((w) => w.completed).length },
    { label: "Revisiones semanales", value: state.weeklyReviews.length },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      <PageHeader
        title="Perfil"
        subtitle="Tu información y configuración"
        action={
          editing ? (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancelar</Button>
              <Button onClick={saveProfile}>Guardar</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={exportData}>
                <Download size={16} className="inline mr-1" /> Exportar
              </Button>
              <Button variant="secondary" onClick={() => setEditing(true)}>
                <RefreshCw size={16} className="inline mr-1" /> Editar
              </Button>
            </div>
          )
        }
      />

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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nombre" value={name} onChange={setName} />
              <Input label="Edad" type="number" value={age} onChange={setAge} />
              <Select
                label="Género"
                value={gender}
                onChange={(v) => setGender(v as Gender)}
                options={[
                  { value: "male", label: "Masculino" },
                  { value: "female", label: "Femenino" },
                  { value: "other", label: "Otro" },
                ]}
              />
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
            <Select
              label="Equipo"
              value={equipment}
              onChange={(v) => setEquipment(v as EquipmentType)}
              options={EQUIPMENT_OPTIONS.map((e) => ({ value: e.value, label: e.label }))}
            />
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Lesiones</label>
              <div className="flex flex-wrap gap-2">
                {INJURY_OPTIONS.map((inj) => (
                  <button
                    key={inj.value}
                    type="button"
                    onClick={() => toggleInjury(inj.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs border ${
                      injuries.includes(inj.value)
                        ? "border-red-500/50 bg-red-500/10 text-red-300"
                        : "border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {inj.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Edad", value: `${profile.age} años` },
              { label: "Altura", value: `${profile.heightCm} cm` },
              { label: "Peso", value: `${profile.weightKg} kg` },
              { label: "Entrenos/sem", value: `${profile.trainingDaysPerWeek} días` },
              { label: "Equipo", value: getEquipmentLabel(profile.equipment ?? "full_gym") },
              {
                label: "Lesiones",
                value:
                  profile.injuries?.length > 0
                    ? profile.injuries
                        .map((i) => INJURY_OPTIONS.find((o) => o.value === i)?.label)
                        .join(", ")
                    : "Ninguna",
              },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xs text-zinc-500">{s.label}</p>
                <p className="text-sm font-medium text-white">{s.value}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

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
      </Card>

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
  );
}
