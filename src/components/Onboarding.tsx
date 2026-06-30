"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { calculateTDEE, calculateMacros } from "@/lib/science";
import { createPresetPlan, syncRoutineFromPlan } from "@/lib/schedule";
import { generateId, today } from "@/lib/storage";
import type { Gender, Goal, ActivityLevel, ExperienceLevel, EquipmentType, InjuryArea } from "@/lib/types";
import { PARQ_QUESTIONS, INJURY_OPTIONS, EQUIPMENT_OPTIONS } from "@/lib/exercises";
import { Button, Input, Select, Card } from "@/components/ui";
import { ChevronRight, ChevronLeft, AlertTriangle } from "lucide-react";

const STEPS = ["Bienvenida", "Salud", "Datos", "Objetivo", "Setup", "Listo"];

export function Onboarding() {
  const { update } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

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
  const [parqAnswers, setParqAnswers] = useState<boolean[]>(
    Array(PARQ_QUESTIONS.length).fill(false)
  );
  const [parqAcknowledged, setParqAcknowledged] = useState(false);

  const goals: { value: Goal; label: string; desc: string }[] = [
    { value: "lose_fat", label: "Perder grasa", desc: "Déficit calórico controlado" },
    { value: "gain_muscle", label: "Ganar músculo", desc: "Superávit moderado + hipertrofia" },
    { value: "maintain", label: "Mantener", desc: "Equilibrio calórico" },
    { value: "recomp", label: "Recomposición", desc: "Perder grasa y ganar músculo" },
    { value: "performance", label: "Rendimiento", desc: "Fuerza y potencia atlética" },
  ];

  const parqPositive = parqAnswers.some(Boolean);

  function buildProfile() {
    return {
      name: name.trim(),
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
      parqCompleted: true,
      parqPositiveAnswers: parqPositive,
      createdAt: new Date().toISOString(),
    };
  }

  function validateStep(): boolean {
    setError("");
    if (step === 1) {
      if (parqPositive && !parqAcknowledged) {
        setError("Debes confirmar que consultarás a un médico antes de continuar.");
        return false;
      }
    }
    if (step === 2) {
      if (!name.trim()) {
        setError("Ingresa tu nombre.");
        return false;
      }
      if (parseInt(age) < 14 || parseInt(age) > 99) {
        setError("Edad debe estar entre 14 y 99.");
        return false;
      }
    }
    return true;
  }

  function nextStep() {
    if (!validateStep()) return;
    setStep(step + 1);
  }

  function toggleInjury(injury: InjuryArea) {
    setInjuries((prev) =>
      prev.includes(injury) ? prev.filter((i) => i !== injury) : [...prev, injury]
    );
  }

  function handleFinish() {
    if (!name.trim()) {
      setError("Ingresa tu nombre.");
      return;
    }

    const profile = buildProfile();
    const tdee = calculateTDEE(profile);
    const macroTargets = calculateMacros(profile, tdee);
    const weeklyPlan = createPresetPlan("bodybuilding", parseInt(trainingDays));
    const routine = syncRoutineFromPlan(weeklyPlan, profile);

    update({
      profile,
      macroTargets,
      weeklyPlan,
      activeRoutine: routine,
      weightEntries: [
        {
          id: generateId(),
          date: today(),
          weightKg: parseFloat(weightKg),
        },
      ],
      onboardingComplete: true,
    });

    router.push("/");
  }

  const previewProfile = buildProfile();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <div className="w-full max-w-lg">
        <div className="flex gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-emerald-500" : "bg-zinc-800"
              }`}
            />
          ))}
        </div>

        <Card className="animate-fade-in">
          {step === 0 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6">
                F
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Bienvenido a FitCoach</h1>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                Tu entrenador personal basado en ciencia. Rutinas, nutrición y ajustes
                semanales para cualquier objetivo.
              </p>
              <Button size="lg" onClick={() => setStep(1)} className="w-full">
                Comenzar <ChevronRight size={16} className="inline ml-1" />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Cuestionario PAR-Q</h2>
              <p className="text-sm text-zinc-500 mb-4">
                Evaluación de preparación para actividad física. Responde con honestidad.
              </p>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {PARQ_QUESTIONS.map((q, i) => (
                  <label
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={parqAnswers[i]}
                      onChange={(e) => {
                        const next = [...parqAnswers];
                        next[i] = e.target.checked;
                        setParqAnswers(next);
                      }}
                      className="mt-1 accent-emerald-500"
                    />
                    <span className="text-sm text-zinc-300">{q}</span>
                  </label>
                ))}
              </div>
              {parqPositive && (
                <div className="mt-4 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm text-amber-300 font-medium">
                        Consulta a un médico antes de comenzar
                      </p>
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={parqAcknowledged}
                          onChange={(e) => setParqAcknowledged(e.target.checked)}
                          className="accent-emerald-500"
                        />
                        <span className="text-xs text-zinc-400">
                          Entiendo y consultaré a un profesional de salud
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-1">Tus datos</h2>
              <Input label="Nombre" value={name} onChange={setName} placeholder="Tu nombre" required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Edad" type="number" value={age} onChange={setAge} min={14} max={99} />
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Altura (cm)" type="number" value={heightCm} onChange={setHeightCm} />
                <Input label="Peso (kg)" type="number" value={weightKg} onChange={setWeightKg} step={0.1} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Tu objetivo</h2>
              <div className="space-y-2">
                {goals.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      goal === g.value
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <p className="font-medium text-white text-sm">{g.label}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{g.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-1">Tu setup</h2>
              <Select
                label="Nivel de actividad"
                value={activityLevel}
                onChange={(v) => setActivityLevel(v as ActivityLevel)}
                options={[
                  { value: "sedentary", label: "Sedentario" },
                  { value: "light", label: "Ligero (1-3 días/sem)" },
                  { value: "moderate", label: "Moderado (3-5 días/sem)" },
                  { value: "active", label: "Activo (6-7 días/sem)" },
                  { value: "very_active", label: "Muy activo (atleta)" },
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
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Equipo disponible</label>
                <div className="space-y-2">
                  {EQUIPMENT_OPTIONS.map((eq) => (
                    <button
                      key={eq.value}
                      onClick={() => setEquipment(eq.value)}
                      className={`w-full text-left p-3 rounded-lg border text-sm ${
                        equipment === eq.value
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-zinc-700"
                      }`}
                    >
                      <span className="text-white">{eq.label}</span>
                      <span className="text-zinc-500 text-xs block">{eq.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Lesiones o limitaciones (opcional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {INJURY_OPTIONS.map((inj) => (
                    <button
                      key={inj.value}
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
          )}

          {step === 5 && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-xl font-bold text-white mb-2">
                ¡Listo, {name || "atleta"}!
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-6 text-left">
                <div className="p-3 rounded-lg bg-zinc-800/50">
                  <p className="text-xs text-zinc-500">TDEE</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {calculateTDEE(previewProfile)} kcal
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-800/50">
                  <p className="text-xs text-zinc-500">Rutina</p>
                  <p className="text-lg font-bold text-white">{trainingDays} días/sem</p>
                </div>
              </div>
              {injuries.length > 0 && (
                <p className="text-xs text-zinc-500 mb-4">
                  Rutina adaptada para evitar ejercicios que afecten:{" "}
                  {injuries.map((i) => INJURY_OPTIONS.find((o) => o.value === i)?.label).join(", ")}
                </p>
              )}
              <Button size="lg" onClick={handleFinish} className="w-full pulse-glow">
                Ir al dashboard
              </Button>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-400 mt-4 text-center">{error}</p>
          )}

          {step > 0 && step < 5 && (
            <div className="flex justify-between mt-6 pt-4 border-t border-zinc-800">
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ChevronLeft size={16} className="inline mr-1" /> Atrás
              </Button>
              <Button onClick={nextStep}>
                Siguiente <ChevronRight size={16} className="inline ml-1" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
