# Requerimientos — Estado actualizado (Jun 2026)

> 500 usuarios beta · Ronda 1 + Ronda 2 · Schema v3  
> Leyenda estado: ✅ Hecho · 🟡 Parcial · ❌ Pendiente

## Resumen ejecutivo

| Estado | Cantidad |
|--------|----------|
| ✅ Completado | 18 |
| 🟡 Parcial | 6 |
| ❌ Pendiente | 44 |
| **Nuevos (Ronda 2)** | 12 |
| **Total** | **68** |

---

## Módulo 0: Planificador semanal (Agente Planificación) — NUEVO

### REQ-PLAN-001 — Kanban táctil optimizado móvil ✅🟡
- **Prioridad:** P1
- **Estado:** 🟡 Parcial — funciona desktop; móvil estrecho
- **Descripción:** Columnas más anchas en móvil, tap-to-add alternativo al drag.
- **Criterios pendientes:**
  - [ ] Botón "+" en cada columna abre selector de tipo
  - [ ] Columnas min-width 140px en móvil
  - [ ] Haptic feedback al soltar

### REQ-PLAN-002 — Planificador semanal Kanban ✅
- **Prioridad:** P0
- **Estado:** ✅ Implementado
- 7 columnas, drag-and-drop, paleta 12 tipos, plantillas

### REQ-PLAN-003 — Plantillas PPL, musculación, upper/lower ✅
- **Prioridad:** P1
- **Estado:** ✅ Implementado

### REQ-PLAN-004 — Sincronización plan → rutina ejecutable ✅
- **Prioridad:** P0
- **Estado:** ✅ `syncRoutineFromPlan()`

### REQ-PLAN-005 — Indicador "cambios sin guardar" ❌
- **Prioridad:** P1
- **Estado:** ❌ Pendiente
- **Criterios:**
  - [ ] Banner amarillo si `plan !== savedPlan`
  - [ ] Auto-guardar opcional cada 30s
  - [ ] Confirmación al salir sin guardar

### REQ-PLAN-006 — Duplicar día / copiar semana ❌
- **Prioridad:** P2
- **Criterios:**
  - [ ] Menú contextual "Copiar a..." en columna
  - [ ] "Duplicar semana anterior"

### REQ-PLAN-007 — Vista calendario mensual ❌
- **Prioridad:** P2
- **Criterios:**
  - [ ] Calendario con color por tipo de sesión
  - [ ] Tap día → editar plan de ese día

### REQ-PLAN-008 — Editar ejercicios por día planificado ❌
- **Prioridad:** P1
- **Criterios:**
  - [ ] Tap en bloque "Pecho" → ver/editar lista de ejercicios
  - [ ] Sustituir, añadir, quitar ejercicios
  - [ ] Cambios persisten en rutina sincronizada

### REQ-PLAN-009 — Volumen semanal por músculo desde plan ❌
- **Prioridad:** P2
- **Criterios:**
  - [ ] Barra debajo del Kanban: series/semana por grupo
  - [ ] Alerta si <10 o >25 series

### REQ-PLAN-010 — Tipos adicionales en paleta ❌
- **Prioridad:** P2
- **Tipos:** movilidad, yoga, metcon, HIIT
- **Criterios:**
  - [ ] Cada tipo con ejercicios o protocolo asociado

### REQ-PLAN-011 — Cardio trackeable ❌
- **Prioridad:** P1
- **Criterios:**
  - [ ] Al iniciar sesión cardio: duración, distancia, FC opcional
  - [ ] Historial de sesiones cardio
  - [ ] Integración futura Strava

### REQ-PLAN-012 — Calorías diferenciadas día entreno vs descanso ❌
- **Prioridad:** P2
- **Criterios:**
  - [ ] Coach/nutrición sugiere +carbos en días piernas/push
  - [ ] -carbos o mantenimiento en descanso

---

## Módulo 1: Fundamentos (Agente Datos)

| ID | Requerimiento | Prioridad | Estado |
|----|---------------|-----------|--------|
| DATA-001 | Schema versionado + migraciones | P0 | ✅ v3 |
| DATA-002 | useReducer sin stale closure | P0 | ✅ |
| DATA-003 | Exportar/importar datos | P1 | 🟡 Export ✅ Import ❌ |
| DATA-004 | Unicidad peso por día | P2 | ✅ |
| DATA-005 | Edición/eliminación universal | P1 | ❌ |

---

## Módulo 2: Perfil (Agente UX)

| ID | Requerimiento | Prioridad | Estado |
|----|---------------|-----------|--------|
| PROFILE-001 | PAR-Q | P0 | ✅ |
| PROFILE-002 | Lesiones → filtrar ejercicios | P0 | ✅ |
| PROFILE-003 | Equipo disponible | P1 | ✅ |
| PROFILE-004 | Recálculo macros al cambiar peso | P1 | ✅ |
| PROFILE-005 | Género inclusivo | P2 | ✅ |
| PROFILE-006 | Días flexibles 1–7 | P2 | 🟡 Planificador sí; onboarding no |

---

## Módulo 3: Entrenamiento (Agente Entrenamiento)

| ID | Requerimiento | Prioridad | Estado |
|----|---------------|-----------|--------|
| TRAIN-001 | SetLog peso×reps×RPE | P0 | ❌ |
| TRAIN-002 | Progresión funcional | P0 | ❌ |
| TRAIN-003 | Timer descanso | P1 | ❌ |
| TRAIN-004 | Sustitución ejercicios | P1 | ❌ |
| TRAIN-005 | Volumen semanal por músculo | P1 | ❌ |
| TRAIN-006 | Historial completo entrenos | P1 | 🟡 Solo últimos 5 |
| TRAIN-007 | Videos/instrucciones | P1 | 🟡 Texto en exercises.ts |
| TRAIN-008 | Periodización 4 sem + deload | P2 | ❌ |
| TRAIN-009 | PRs automáticos | P2 | ❌ |
| TRAIN-010 | Modalidades CrossFit | P3 | ❌ |

---

## Módulo 4: Nutrición (Agente Nutrición)

| ID | Requerimiento | Prioridad | Estado |
|----|---------------|-----------|--------|
| NUTR-001 | Base datos alimentos 500+ | P0 | ❌ |
| NUTR-002 | Historial nutricional | P1 | ❌ |
| NUTR-003 | Agua y fibra | P1 | ❌ |
| NUTR-004 | Comidas frecuentes | P2 | ❌ |
| NUTR-005 | Plan dinámico por preferencias | P2 | ❌ |
| NUTR-006 | Suplementos | P3 | ❌ |

---

## Módulo 5–9: Sin cambios de prioridad

Ver `REQUERIMIENTOS.md` original para detalle completo de:
- Peso y composición (WEIGHT-001 a 004)
- Coach IA (COACH-001 a 006) — COACH-001 ✅, COACH-002 ✅ parcial, COACH-004 🟡
- UX (UX-001 ✅, UX-003 ✅, UX-004 PWA ❌)
- Ciencia (SCI-001 ✅ 18 tests)
- Plataforma (PRO-001 auth ❌, PRO-002 Strava ❌)

---

## Prioridad inmediata — Top 10 siguientes

| # | ID | Descripción | Impacto |
|---|-----|-------------|---------|
| 1 | NUTR-001 | Food database | 58% usuarios |
| 2 | TRAIN-001 | SetLog | 54% usuarios |
| 3 | PLAN-011 | Cardio trackeable | 42% Ronda 2 |
| 4 | PLAN-001 | Kanban móvil tap-to-add | 38% Ronda 2 |
| 5 | PLAN-008 | Editar ejercicios por día | 34% Ronda 2 |
| 6 | PLAN-005 | Cambios sin guardar | 29% Ronda 2 |
| 7 | DATA-003 | Import JSON | 28% coaches |
| 8 | TRAIN-003 | Timer descanso | 31% |
| 9 | PRO-001 | Backend coach-cliente | Bloqueante coaches |
| 10 | PLAN-006 | Duplicar día | 27% |

---

## Criterios de aceptación — Planificador móvil (REQ-PLAN-001 detalle)

```gherkin
Dado que estoy en móvil (<768px)
Cuando toco el botón "+" en la columna "Lunes"
Entonces veo un menú con: Pecho, Espalda, Piernas, Push, Pull, Cardio, Descanso...
Cuando selecciono "Pecho"
Entonces aparece el bloque en Lunes sin necesidad de drag
Y el banner "Cambios sin guardar" es visible
Cuando pulso "Guardar plan"
Entonces el plan persiste y la rutina se sincroniza
```
