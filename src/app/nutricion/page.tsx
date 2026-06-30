"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/Navigation";
import { RouteGuard } from "@/components/RouteGuard";
import {
  Card,
  Button,
  Badge,
  PageHeader,
  ProgressBar,
  Input,
  Select,
} from "@/components/ui";
import { generateMealPlan } from "@/lib/science";
import { generateId, today, getMealLabel } from "@/lib/storage";
import type { MealType } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

export default function NutricionPage() {
  return (
    <AppShell>
      <RouteGuard>
        <NutricionContent />
      </RouteGuard>
    </AppShell>
  );
}

function NutricionContent() {
  const { state, update } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  if (!state.profile || !state.macroTargets) return null;

  const { macroTargets, foodEntries } = state;
  const dateToday = today();
  const todayFood = foodEntries.filter((f) => f.date === dateToday);

  const totals = todayFood.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const mealPlan = generateMealPlan(macroTargets);

  function addFood() {
    if (!foodName || !calories) return;
    const entry = {
      id: generateId(),
      date: dateToday,
      mealType,
      name: foodName,
      calories: parseFloat(calories),
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
    };
    update({ foodEntries: [...foodEntries, entry] });
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setShowForm(false);
  }

  function removeFood(id: string) {
    update({ foodEntries: foodEntries.filter((f) => f.id !== id) });
  }

  function addSuggestedMeal(meal: typeof mealPlan[0]) {
    const entry = {
      id: generateId(),
      date: dateToday,
      mealType: meal.mealType,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
    };
    update({ foodEntries: [...foodEntries, entry] });
  }

  const meals: MealType[] = ["breakfast", "lunch", "snack", "dinner"];

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto animate-fade-in">
        <PageHeader
          title="Nutrición"
          subtitle={`Objetivo: ${macroTargets.calories} kcal · ${macroTargets.protein}g proteína`}
          action={
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus size={16} className="inline mr-1" /> Registrar
            </Button>
          }
        />

        {/* Macros del día */}
        <Card className="mb-6">
          <h3 className="font-semibold text-white mb-4">Resumen de hoy</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              { label: "Calorías", value: totals.calories, max: macroTargets.calories, color: "emerald" as const },
              { label: "Proteína", value: totals.protein, max: macroTargets.protein, color: "blue" as const },
              { label: "Carbos", value: totals.carbs, max: macroTargets.carbs, color: "amber" as const },
              { label: "Grasas", value: totals.fat, max: macroTargets.fat, color: "red" as const },
            ].map((m) => (
              <div key={m.label}>
                <ProgressBar label={m.label} value={m.value} max={m.max} color={m.color} />
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-500">
            Restante: {Math.max(0, macroTargets.calories - totals.calories)} kcal ·{" "}
            Fibra objetivo: {macroTargets.fiber}g
          </p>
        </Card>

        {/* Formulario */}
        {showForm && (
          <Card className="mb-6 border-emerald-500/30">
            <h3 className="font-semibold text-white mb-4">Nueva comida</h3>
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Comida"
                value={mealType}
                onChange={(v) => setMealType(v as MealType)}
                options={meals.map((m) => ({ value: m, label: getMealLabel(m) }))}
              />
              <Input label="Nombre" value={foodName} onChange={setFoodName} placeholder="Ej: Pollo con arroz" />
              <Input label="Calorías" type="number" value={calories} onChange={setCalories} />
              <Input label="Proteína (g)" type="number" value={protein} onChange={setProtein} />
              <Input label="Carbos (g)" type="number" value={carbs} onChange={setCarbs} />
              <Input label="Grasas (g)" type="number" value={fat} onChange={setFat} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={addFood}>Guardar</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {/* Comidas del día por tipo */}
        <div className="space-y-4 mb-8">
          {meals.map((meal) => {
            const items = todayFood.filter((f) => f.mealType === meal);
            const mealCals = items.reduce((s, f) => s + f.calories, 0);

            return (
              <Card key={meal}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{getMealLabel(meal)}</h3>
                  <span className="text-sm text-zinc-500">{mealCals} kcal</span>
                </div>
                {items.length === 0 ? (
                  <p className="text-sm text-zinc-600">Sin registros</p>
                ) : (
                  <div className="space-y-2">
                    {items.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/30"
                      >
                        <div>
                          <p className="text-sm text-white">{f.name}</p>
                          <p className="text-xs text-zinc-500">
                            P: {f.protein}g · C: {f.carbs}g · G: {f.fat}g
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-zinc-400">{f.calories} kcal</span>
                          <button
                            onClick={() => removeFood(f.id)}
                            className="text-zinc-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Plan sugerido */}
        <div>
          <h3 className="font-semibold text-white mb-3">Plan alimenticio sugerido</h3>
          <p className="text-sm text-zinc-500 mb-4">
            Basado en tus macros objetivo. Haz clic para añadir al día.
          </p>
          <div className="grid lg:grid-cols-2 gap-3">
            {mealPlan.map((meal) => (
              <Card
                key={meal.name}
                onClick={() => addSuggestedMeal(meal)}
                className="hover:border-emerald-500/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Badge color="emerald">{getMealLabel(meal.mealType)}</Badge>
                    <p className="font-medium text-white mt-2">{meal.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {meal.calories} kcal · P: {meal.protein}g · C: {meal.carbs}g · G: {meal.fat}g
                    </p>
                  </div>
                  <Plus size={16} className="text-zinc-600" />
                </div>
                <ul className="mt-2 space-y-0.5">
                  {meal.ingredients.map((ing) => (
                    <li key={ing} className="text-xs text-zinc-600">
                      · {ing}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
    </div>
  );
}
