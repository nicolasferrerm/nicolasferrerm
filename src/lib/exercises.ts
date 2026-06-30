import type { EquipmentType, InjuryArea, MuscleGroup } from "./types";

export interface ExerciseDefinition {
  name: string;
  muscleGroup: MuscleGroup;
  equipment: EquipmentType[];
  contraindications: InjuryArea[];
  instructions: string;
}

export const EXERCISE_CATALOG: ExerciseDefinition[] = [
  // Pecho
  { name: "Press banca", muscleGroup: "chest", equipment: ["full_gym", "barbell_rack"], contraindications: ["shoulder"], instructions: "Baja la barra al pecho con control, empuja sin rebotar." },
  { name: "Press mancuernas plano", muscleGroup: "chest", equipment: ["full_gym", "dumbbells_only"], contraindications: ["shoulder"], instructions: "Mancuernas a la altura del pecho, empuje vertical." },
  { name: "Press inclinado mancuernas", muscleGroup: "chest", equipment: ["full_gym", "dumbbells_only"], contraindications: ["shoulder"], instructions: "Banco 30-45°, empuje hacia arriba y adentro." },
  { name: "Flexiones", muscleGroup: "chest", equipment: ["home_no_equipment", "full_gym", "dumbbells_only", "bands", "barbell_rack"], contraindications: ["wrist", "shoulder"], instructions: "Cuerpo en línea, baja hasta 90° en codos." },
  { name: "Aperturas mancuernas", muscleGroup: "chest", equipment: ["full_gym", "dumbbells_only"], contraindications: ["shoulder"], instructions: "Apertura controlada, ligera flexión en codos." },
  { name: "Fondos en banco", muscleGroup: "chest", equipment: ["home_no_equipment", "full_gym"], contraindications: ["shoulder"], instructions: "Manos en banco, baja con control." },
  // Espalda
  { name: "Dominadas asistidas", muscleGroup: "back", equipment: ["full_gym", "barbell_rack"], contraindications: ["shoulder"], instructions: "Agarre prono, lleva pecho a la barra." },
  { name: "Remo mancuerna", muscleGroup: "back", equipment: ["full_gym", "dumbbells_only"], contraindications: ["lower_back"], instructions: "Espalda neutra, tira codo hacia atrás." },
  { name: "Jalón al pecho", muscleGroup: "back", equipment: ["full_gym"], contraindications: [], instructions: "Tira barra al pecho superior, aprieta escápulas." },
  { name: "Remo con banda", muscleGroup: "back", equipment: ["bands", "home_no_equipment"], contraindications: [], instructions: "Ancla banda, tira hacia abdomen." },
  { name: "Peso muerto rumano mancuernas", muscleGroup: "back", equipment: ["dumbbells_only", "full_gym"], contraindications: ["lower_back"], instructions: "Bisagra de cadera, mancuernas cerca del cuerpo." },
  { name: "Superman", muscleGroup: "back", equipment: ["home_no_equipment"], contraindications: ["lower_back"], instructions: "Boca abajo, eleva brazos y piernas simultáneamente." },
  // Hombros
  { name: "Press militar mancuernas", muscleGroup: "shoulders", equipment: ["dumbbells_only", "full_gym"], contraindications: ["shoulder"], instructions: "Empuje vertical sin arquear espalda." },
  { name: "Elevaciones laterales", muscleGroup: "shoulders", equipment: ["dumbbells_only", "full_gym", "bands"], contraindications: ["shoulder"], instructions: "Eleva hasta altura de hombros, controla bajada." },
  { name: "Pájaros con mancuernas", muscleGroup: "shoulders", equipment: ["dumbbells_only", "full_gym"], contraindications: [], instructions: "Inclinado, abre brazos hacia los lados." },
  { name: "Face pulls con banda", muscleGroup: "shoulders", equipment: ["bands", "full_gym"], contraindications: [], instructions: "Tira hacia la cara, codos altos." },
  // Bíceps
  { name: "Curl mancuernas", muscleGroup: "biceps", equipment: ["dumbbells_only", "full_gym"], contraindications: ["wrist"], instructions: "Codos fijos, sube sin balanceo." },
  { name: "Curl martillo", muscleGroup: "biceps", equipment: ["dumbbells_only", "full_gym"], contraindications: [], instructions: "Agarre neutro, alterna o simultáneo." },
  { name: "Curl con banda", muscleGroup: "biceps", equipment: ["bands", "home_no_equipment"], contraindications: [], instructions: "Pisa banda, curl controlado." },
  // Tríceps
  { name: "Extensiones tríceps polea", muscleGroup: "triceps", equipment: ["full_gym"], contraindications: [], instructions: "Codos pegados al cuerpo, extiende completamente." },
  { name: "Press francés mancuerna", muscleGroup: "triceps", equipment: ["dumbbells_only", "full_gym"], contraindications: ["shoulder"], instructions: "Baja mancuerna detrás de la cabeza, extiende." },
  { name: "Fondos en banco (tríceps)", muscleGroup: "triceps", equipment: ["home_no_equipment", "full_gym"], contraindications: ["shoulder", "wrist"], instructions: "Codos hacia atrás, baja hasta 90°." },
  { name: "Extensiones con banda", muscleGroup: "triceps", equipment: ["bands", "home_no_equipment"], contraindications: [], instructions: "Extiende brazos hacia abajo con banda." },
  // Piernas
  { name: "Sentadilla goblet", muscleGroup: "legs", equipment: ["dumbbells_only", "full_gym", "home_no_equipment"], contraindications: ["knee"], instructions: "Mancuerna al pecho, baja hasta paralelo." },
  { name: "Sentadilla con barra", muscleGroup: "legs", equipment: ["barbell_rack", "full_gym"], contraindications: ["knee", "lower_back"], instructions: "Barra en trapecio, profundidad controlada." },
  { name: "Prensa de piernas", muscleGroup: "legs", equipment: ["full_gym"], contraindications: ["lower_back"], instructions: "Pies ancho de hombros, baja sin despegar lumbar." },
  { name: "Zancadas", muscleGroup: "legs", equipment: ["dumbbells_only", "full_gym", "home_no_equipment"], contraindications: ["knee", "ankle"], instructions: "Paso largo, rodilla no pasa punta del pie." },
  { name: "Puente de glúteos", muscleGroup: "legs", equipment: ["home_no_equipment", "bands"], contraindications: [], instructions: "Espalda en suelo, eleva cadera apretando glúteos." },
  { name: "Peso muerto rumano", muscleGroup: "legs", equipment: ["barbell_rack", "full_gym", "dumbbells_only"], contraindications: ["lower_back"], instructions: "Bisagra de cadera, barra cerca de piernas." },
  { name: "Step-ups", muscleGroup: "legs", equipment: ["home_no_equipment", "dumbbells_only"], contraindications: ["knee"], instructions: "Sube a cajón/banco, baja con control." },
  { name: "Curl femoral en máquina", muscleGroup: "legs", equipment: ["full_gym"], contraindications: [], instructions: "Flexiona rodillas, controla excéntrica." },
  // Core
  { name: "Plancha", muscleGroup: "core", equipment: ["home_no_equipment", "full_gym", "dumbbells_only", "bands", "barbell_rack"], contraindications: ["lower_back"], instructions: "Cuerpo recto, aprieta abdomen 30-60s." },
  { name: "Crunch bicicleta", muscleGroup: "core", equipment: ["home_no_equipment"], contraindications: ["lower_back"], instructions: "Alterna codo a rodilla opuesta." },
  { name: "Elevaciones de piernas", muscleGroup: "core", equipment: ["home_no_equipment", "full_gym"], contraindications: ["lower_back"], instructions: "Eleva piernas controlando lumbar." },
  { name: "Dead bug", muscleGroup: "core", equipment: ["home_no_equipment"], contraindications: [], instructions: "Brazo y pierna opuestos, lumbar pegada al suelo." },
  // Full body
  { name: "Burpees modificados", muscleGroup: "full_body", equipment: ["home_no_equipment"], contraindications: ["knee", "ankle", "wrist"], instructions: "Sin salto si hay limitación, paso atrás." },
  { name: "Kettlebell swing", muscleGroup: "full_body", equipment: ["full_gym"], contraindications: ["lower_back"], instructions: "Bisagra explosiva, kettlebell a altura de hombros." },
  { name: "Thrusters mancuernas", muscleGroup: "full_body", equipment: ["dumbbells_only", "full_gym"], contraindications: ["knee", "shoulder"], instructions: "Sentadilla + press en un movimiento." },
];

export function getExercisesForMuscle(
  muscleGroup: MuscleGroup,
  equipment: EquipmentType,
  injuries: InjuryArea[]
): ExerciseDefinition[] {
  return EXERCISE_CATALOG.filter(
    (ex) =>
      ex.muscleGroup === muscleGroup &&
      ex.equipment.includes(equipment) &&
      !ex.contraindications.some((c) => injuries.includes(c))
  );
}

export function getExerciseByName(name: string): ExerciseDefinition | undefined {
  return EXERCISE_CATALOG.find((ex) => ex.name === name);
}

export const PARQ_QUESTIONS = [
  "¿Tu médico te ha dicho alguna vez que tienes problemas cardíacos y que solo debes hacer actividad física recomendada por un médico?",
  "¿Sientes dolor en el pecho cuando haces actividad física?",
  "¿Has tenido dolor en el pecho en el último mes cuando no hacías actividad física?",
  "¿Pierdes el equilibrio por mareos o alguna vez has perdido la conciencia?",
  "¿Tienes algún problema óseo o articular que podría empeorar con el ejercicio?",
  "¿Tu médico te receta actualmente medicamentos para la presión arterial o el corazón?",
  "¿Conoces alguna otra razón por la que no deberías hacer actividad física?",
] as const;

export const INJURY_OPTIONS: { value: InjuryArea; label: string }[] = [
  { value: "knee", label: "Rodilla" },
  { value: "shoulder", label: "Hombro" },
  { value: "lower_back", label: "Espalda baja" },
  { value: "hip", label: "Cadera" },
  { value: "wrist", label: "Muñeca" },
  { value: "ankle", label: "Tobillo" },
];

export const EQUIPMENT_OPTIONS: { value: EquipmentType; label: string; desc: string }[] = [
  { value: "full_gym", label: "Gimnasio completo", desc: "Máquinas, barras, poleas" },
  { value: "barbell_rack", label: "Barra + rack", desc: "Home gym con barra" },
  { value: "dumbbells_only", label: "Solo mancuernas", desc: "Entreno en casa" },
  { value: "bands", label: "Bandas elásticas", desc: "Resistencia portátil" },
  { value: "home_no_equipment", label: "Sin equipo", desc: "Peso corporal" },
];
