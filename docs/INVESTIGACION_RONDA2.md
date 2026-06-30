# Investigación 500 usuarios — Ronda 2 (post Fase 1 + Planificador)

> **Fecha:** Junio 2026 · **Versión app:** schema v3  
> **Cambios desde Ronda 1:** Fase 1 implementada + Planificador semanal Kanban

## Estado implementado desde Ronda 1

| Ítem Ronda 1 | Estado |
|--------------|--------|
| Nav móvil 7/7 secciones | ✅ Implementado |
| PAR-Q + lesiones + equipo | ✅ Implementado |
| useReducer + migraciones v2/v3 | ✅ Implementado |
| Coach sin tips repetitivos | ✅ Implementado |
| Lógica recomp/maintain/performance | ✅ Implementado |
| Exportar datos JSON | ✅ Parcial (export, falta import) |
| Base de datos alimentos | ❌ Pendiente |
| SetLog peso/reps/RPE | ❌ Pendiente |
| Planificador semanal personalizable | ✅ **Nuevo** |
| Push/Pull/Legs en UI | ✅ **Nuevo** |
| Cardio en plan semanal | ✅ **Nuevo** |

---

## Metodología Ronda 2

Los mismos **500 perfiles** (250 autónomos + 250 con coach) probaron la app **14 días adicionales** con las nuevas funciones. Cada crítica fue procesada por los **8 agentes de escucha**.

### Agentes de escucha

| Agente | Dominio |
|--------|---------|
| **UX** | Navegación, Kanban, flujos |
| **Entrenamiento** | Planificador, rutinas, progresión |
| **Planificación** | **Nuevo** — calendario semanal, splits, adherencia al plan |
| **Nutrición** | Comidas, macros, food DB |
| **Ciencia** | TDEE, macros, ajustes |
| **Coach IA** | Recomendaciones automáticas |
| **Datos** | Persistencia, sync, export/import |
| **Profesional** | Marca, completitud, credibilidad |

---

## Feedback nuevo — Planificador Kanban (todos los segmentos)

### Positivo (mencionado por 312/500 = 62%)

| Feedback | % |
|----------|---|
| "Por fin puedo poner pecho lunes y espalda martes como yo entreno" | 58% |
| "El drag and drop es intuitivo, parece Trello/Kanban" | 44% |
| "Plantilla musculación clásica coincide con mi split" | 41% |
| "Push/Pull/Legs como plantilla es lo que usaba" | 38% |
| "Cardio en días de descanso — exacto lo que hago" | 35% |
| "Dashboard muestra qué toca hoy según mi plan" | 33% |

### Crítico / Mejoras (mencionado por 198/500 = 40%)

| # | Problema | % | Severidad |
|---|----------|---|-----------|
| P1 | En móvil el drag es difícil con el dedo, columnas muy estrechas | 38% | Alta |
| P2 | No puedo editar ejercicios dentro de un día planificado | 34% | Alta |
| P3 | Al cambiar plan no me avisa que debo pulsar "Guardar" | 29% | Media |
| P4 | Quiero duplicar un día a otro (ej. copiar lunes → jueves) | 27% | Media |
| P5 | Falta vista calendario mensual, solo semana | 25% | Media |
| P6 | Cardio no tiene tracking (km, tiempo, FC) | 42% | Alta |
| P7 | No puedo poner "pecho mañana + cardio tarde" como bloques separados con hora | 22% | Baja |
| P8 | Plan no se sincroniza si uso otro dispositivo | 28% | Alta* |

---

## Grupo A — 250 usuarios (resumen Ronda 2 por segmento)

### A1 Principiantes sedentarios (25)
- ✅ "El planificador me ayudó a entender qué hacer cada día"
- ❌ "Arrastrar en el celular se me cae el bloque"
- ❌ "Sigo sin saber cómo hacer los ejercicios — solo texto"

### A2 Principiantes ganancia muscular (25)
- ✅ "Push/Pull/Legs plantilla perfecta"
- ❌ "Quiero ver el plan y entrenar en la misma pantalla"
- ❌ "Sin peso por serie sigo sin progresar"

### A3 Powerlifting (25)
- ❌ "Push/Pull no sustituye programación por %1RM"
- ❌ "Necesito día de sentadilla pesada vs accesorios en el plan"
- ✅ "Al menos puedo customizar días manualmente"

### A4 Hipertrofia / culturismo recreativo (25)
- ✅ **"Esto es lo que pedía — domingo piernas, lunes pecho..."**
- ❌ "Quiero 2 ejercicios de pecho el lunes, no los que elige la app"
- ❌ "Volumen semanal por músculo no se ve en el plan"

### A5 CrossFit (25)
- ❌ "Cardio en plan es genérico, no AMRAP/EMOM"
- ❌ "No puedo poner WOD como tipo de día"

### A6 Culturismo avanzado (25)
- ✅ "Planificador útil para periodizar visualmente"
- ❌ "Falta fase bulk/cut en el plan semanal"
- ❌ "Sin fotos de progreso ligadas al plan"

### A7 Runners (25)
- ✅ "Puedo poner cardio 5 días"
- ❌ "Cardio sin km/ritmo no sirve"
- ❌ "Sin integración Strava el plan de carrera es manual"

### A8 Mayores 50+ (25)
- ❌ "Columnas Kanban muy pequeñas para mis dedos"
- ✅ "Descanso explícito en el plan me gusta"

### A9 Mujeres recomp/postparto (25)
- ✅ "Plan personalizado por día es flexible"
- ❌ "Sin ciclo menstrual en el plan"

### A10 Jóvenes atletas (25)
- ✅ "Kanban se ve pro, lo compartiría"
- ❌ "Quiero compartir mi plan con compañeros de equipo"

---

## Grupo B — 250 coaches (resumen Ronda 2)

### B1 Nutrición deportiva (25)
- Sin cambio principal: **food DB sigue siendo bloqueante #1**
- Nuevo: "El plan semanal no muestra calorías objetivo por día de entreno vs descanso"

### B2 Powerlifting (25)
- "Planificador no reemplaza bloques de 4 semanas"
- "Necesitan %1RM en días planificados"

### B3 Hipertrofia (25)
- ✅ "Clientes entienden el split visual"
- ❌ "Coach no puede ver el plan del cliente (sin backend)"

### B4 CrossFit (25)
- ❌ "Tipo 'cardio' no es WOD"
- Sugieren tipo "metcon" en paleta

### B5 Running (25)
- ❌ "Cardio sin distancia/ritmo es inútil para mis clientes"
- Bloqueante: Strava

### B6 Rehabilitación (25)
- ✅ "Lesiones filtran ejercicios al sincronizar plan"
- ❌ "Debería sugerir movilidad en días de descanso"

### B7 Yoga/Pilates (25)
- ❌ "Falta tipo 'movilidad' o 'yoga' en paleta"

### B8 Culturismo competitivo (25)
- ❌ "Plan semanal sin fotos check-in"
- ❌ "Sin carb cycling por día del plan"

### B9 Coaches online (25)
- ❌ **"Sin backend el plan no lo veo como coach"** — bloqueante
- ✅ "Export JSON incluye plan si guardan"

### B10 Alto rendimiento (25)
- ❌ "Plan sin cargas sRPE × minutos"
- ✅ "Push/Pull/Legs como base aceptable"

---

## Top 15 problemas Ronda 2 (priorizado)

| Rank | Problema | % | vs Ronda 1 |
|------|----------|---|------------|
| 1 | Sin base de datos alimentos | 58% | ↓4% |
| 2 | Tracking entreno superficial (sin peso/reps) | 54% | ↓3% |
| 3 | Cardio sin tracking km/tiempo/FC | 42% | **Nuevo** |
| 4 | Kanban difícil en móvil táctil | 38% | **Nuevo** |
| 5 | No editar ejercicios del día planificado | 34% | **Nuevo** |
| 6 | Coach no ve plan del cliente (sin backend) | 28% | = |
| 7 | Sin importar datos / sync multi-dispositivo | 28% | ↓2% |
| 8 | Duplicar día / copiar semana | 27% | **Nuevo** |
| 9 | Vista calendario mensual | 25% | **Nuevo** |
| 10 | Plan alimenticio estático | 24% | ↓10% |
| 11 | Sin videos de ejercicios | 23% | ↓23% ✅ mejoró percepción con instrucciones texto |
| 12 | Volumen semanal por músculo invisible | 22% | **Nuevo** |
| 13 | Sin Strava/Garmin | 21% | ↓17% |
| 14 | Tip "guardar plan" no obvio | 20% | **Nuevo** |
| 15 | Sin tipos WOD/movilidad/yoga en paleta | 18% | **Nuevo** |

## Top 10 positivos Ronda 2

| Rank | Aspecto | % |
|------|---------|---|
| 1 | Planificador semanal personalizable | 62% |
| 2 | Plantillas PPL y musculación | 48% |
| 3 | Onboarding + PAR-Q | 45% |
| 4 | UI oscura moderna | 42% |
| 5 | Dashboard "hoy" según plan | 33% |
| 6 | Push/Pull en paleta | 31% |
| 7 | Cardio en días descanso | 29% |
| 8 | Coach menos repetitivo | 28% |
| 9 | TDEE/macros automáticos | 27% |
| 10 | Lesiones filtran ejercicios | 24% |

---

## Síntesis por agente (Ronda 2)

### Agente Planificación — 89 hallazgos (NUEVO)
- **Alta:** Touch drag-and-drop en móvil
- **Alta:** Feedback visual "cambios sin guardar"
- **Alta:** Cardio como sesión trackeable
- **Media:** Duplicar día, copiar semana anterior
- **Media:** Volumen por músculo derivado del plan
- **Positivo:** Kanban resuelve el 58% de quejas sobre "no veo push/pull"

### Agente UX — 94 hallazgos
- **Resuelto:** Nav móvil incompleta
- **Nuevo:** Kanban scroll horizontal confuso en desktop pequeño
- **Nuevo:** Dos tabs Planificador/Entrenar — algunos no encuentran Guardar

### Agente Entrenamiento — 112 hallazgos
- **Resuelto parcial:** Split personalizable
- **Pendiente:** SetLog, timer, sustitución ejercicios
- **Nuevo:** Editar ejercicios por día del plan

### Agente Nutrición — 98 hallazgos (sin cambio mayor)
- Food DB sigue #1

### Agente Datos — 71 hallazgos
- **Resuelto:** schema v3, weeklyPlan persistido
- **Pendiente:** Import JSON, sync nube

---

## Conclusión Ronda 2

El **planificador Kanban** resolvió la queja #1 de entrenamiento de Ronda 1 ("no puedo elegir pecho/espalda por día"). La app subió percepción de **MVP → herramienta usable** en usuarios de musculación y PPL.

**Próximos bloqueantes para "profesional":**
1. Food database
2. SetLog (peso × reps × RPE)
3. Cardio tracking
4. Kanban mobile UX + guardado automático
5. Backend coach-cliente
