"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { calculateTDEE, calculateMacros, generateRoutine } from "@/lib/science";
import { generateId, today } from "@/lib/storage";
import type { Gender, Goal, ActivityLevel, ExperienceLevel } from "@/lib/types";
import { Button, Input, Select, Card } from "@/components/ui";
import { ChevronRight, ChevronLeft } from "lucide-react";

const STEPS = ["Bienvenida", "Datos", "Objetivo", "Actividad", "Listo"];

export function Onboarding() {
  const { update } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState<Gender>("male");
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("75");
  const [goal, setGoal] = useState<Goal>("gain_muscle");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("intermediate");
  const [trainingDays, setTrainingDays] = useState("4");

  const goals: { value: Goal; label: string; desc: string }[] = [
    { value: "lose_fat", label: "Perder grasa", desc: "Déficit calórico controlado" },
    { value: "gain_muscle", label: "Ganar músculo", desc: "Superávit moderado + hipertrofia" },
    { value: "maintain", label: "Mantener", desc: "Equilibrio calórico" },
    { value: "recomp", label: "Recomposición", desc: "Perder grasa y ganar músculo" },
    { value: "performance", label: "Rendimiento", desc: "Fuerza y potencia atlética" },
  ];

  function handleFinish() {
    const profile = {
      name,
      age: parseInt(age),
      gender,
      heightCm: parseFloat(heightCm),
      weightKg: parseFloat(weightKg),
      goal,
      activityLevel,
      experienceLevel,
      trainingDaysPerWeek: parseInt(trainingDays),
      createdAt: new Date().toISOString(),
    };

    const tdee = calculateTDEE(profile);
    const macroTargets = calculateMacros(profile, tdee);
    const routine = generateRoutine(goal, experienceLevel, parseInt(trainingDays));

    update({
      profile,
      macroTargets,
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <div className="w-full max-w-lg">
        {/* Progress */}
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
              <h1 className="text-2xl font-bold text-white mb-2">
                Bienvenido a FitCoach
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                Tu entrenador personal basado en ciencia. Te ayudamos a planear
                rutinas, nutrición y ajustes semanales para alcanzar cualquier
                objetivo de entrenamiento.
              </p>
              <div className="grid grid-cols-2 gap-3 text-left mb-8">
                {[
                  { icon: "🏋️", text: "Rutinas personalizadas" },
                  { icon: "🥗", text: "Planes alimenticios" },
                  { icon: "⚖️", text: "Control de peso" },
                  { icon: "🧠", text: "Coach inteligente" },
                ].map((f) => (
                  <div
                    key={f.text}
                    className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50"
                  >
                    <span className="text-lg">{f.icon}</span>
                    <span className="text-xs text-zinc-300">{f.text}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" onClick={() => setStep(1)} className="w-full">
                Comenzar <ChevronRight size={16} className="inline ml-1" />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-1">Tus datos</h2>
              <p className="text-sm text-zinc-500 mb-4">
                Necesarios para calcular tu metabolismo (ecuación Mifflin-St Jeor).
              </p>
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
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Altura (cm)" type="number" value={heightCm} onChange={setHeightCm} />
                <Input label="Peso (kg)" type="number" value={weightKg} onChange={setWeightKg} step={0.1} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Tu objetivo</h2>
              <p className="text-sm text-zinc-500 mb-4">
                Define tu meta principal. Ajustaremos calorías y entrenamiento.
              </p>
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

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-1">Actividad y experiencia</h2>
              <p className="text-sm text-zinc-500 mb-4">
                Para calcular tu gasto calórico total (TDEE).
              </p>
              <Select
                label="Nivel de actividad"
                value={activityLevel}
                onChange={(v) => setActivityLevel(v as ActivityLevel)}
                options={[
                  { value: "sedentary", label: "Sedentario (poco ejercicio)" },
                  { value: "light", label: "Ligero (1-3 días/semana)" },
                  { value: "moderate", label: "Moderado (3-5 días/semana)" },
                  { value: "active", label: "Activo (6-7 días/semana)" },
                  { value: "very_active", label: "Muy activo (atleta)" },
                ]}
              />
              <Select
                label="Experiencia en gym"
                value={experienceLevel}
                onChange={(v) => setExperienceLevel(v as ExperienceLevel)}
                options={[
                  { value: "beginner", label: "Principiante (<1 año)" },
                  { value: "intermediate", label: "Intermedio (1-3 años)" },
                  { value: "advanced", label: "Avanzado (3+ años)" },
                ]}
              />
              <Select
                label="Días de entrenamiento/semana"
                value={trainingDays}
                onChange={setTrainingDays}
                options={[
                  { value: "3", label: "3 días" },
                  { value: "4", label: "4 días" },
                  { value: "5", label: "5 días" },
                ]}
              />
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-xl font-bold text-white mb-2">¡Todo listo, {name || "atleta"}!</h2>
              <p className="text-sm text-zinc-400 mb-6">
                Hemos calculado tu plan personalizado basado en tu perfil y objetivo.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6 text-left">
                <div className="p-3 rounded-lg bg-zinc-800/50">
                  <p className="text-xs text-zinc-500">TDEE estimado</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {calculateTDEE({
                      name, age: parseInt(age), gender,
                      heightCm: parseFloat(heightCm), weightKg: parseFloat(weightKg),
                      goal, activityLevel, experienceLevel,
                      trainingDaysPerWeek: parseInt(trainingDays), createdAt: "",
                    })}{" "}
                    <span className="text-xs font-normal">kcal</span>
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-800/50">
                  <p className="text-xs text-zinc-500">Rutina</p>
                  <p className="text-lg font-bold text-white">
                    {trainingDays} <span className="text-xs font-normal">días/sem</span>
                  </p>
                </div>
              </div>
              <Button size="lg" onClick={handleFinish} className="w-full pulse-glow">
                Ir al dashboard
              </Button>
            </div>
          )}

          {step > 0 && step < 4 && (
            <div className="flex justify-between mt-6 pt-4 border-t border-zinc-800">
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ChevronLeft size={16} className="inline mr-1" /> Atrás
              </Button>
              <Button onClick={() => setStep(step + 1)}>
                Siguiente <ChevronRight size={16} className="inline ml-1" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
