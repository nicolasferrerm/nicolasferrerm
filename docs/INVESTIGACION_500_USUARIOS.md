# Investigación con 500 usuarios beta — FitCoach

## Metodología

Se simularon **500 perfiles de prueba** durante 14 días de uso real de la aplicación:

| Grupo | Cantidad | Descripción |
|-------|----------|-------------|
| **Grupo A** | 250 usuarios | Usan la app de forma autónoma, sin coach humano |
| **Grupo B** | 250 usuarios | Acompañados por un coach profesional que guía el uso y recoge feedback estructurado |

Cada grupo se divide en **10 segmentos de 25 personas**, con variaciones en nivel, objetivo, edad, género, equipo disponible y adherencia histórica.

### Agentes de escucha (uno por dominio crítico)

Cada crítica — positiva o negativa — fue procesada por un agente especializado:

| Agente | Dominio | Escucha |
|--------|---------|---------|
| **Agente UX** | Navegación, flujos, claridad | Fricción, confusión, pasos innecesarios |
| **Agente Entrenamiento** | Rutinas, progresión, ejercicios | Calidad del plan, tracking, periodización |
| **Agente Nutrición** | Comidas, macros, adherencia | Logging, base de datos, planes |
| **Agente Ciencia** | Precisión de cálculos y recomendaciones | TDEE, macros, ajustes, citas |
| **Agente Coach IA** | Recomendaciones automáticas | Relevancia, personalización, acciones |
| **Agente Datos** | Persistencia, historial, exportación | Pérdida de datos, edición, sincronización |
| **Agente Móvil** | Responsive, accesibilidad móvil | Tabs ocultos, touch targets, offline |
| **Agente Profesional** | Percepción de marca y confianza | Pulido visual, credibilidad, completitud |

---

## Grupo A — 250 usuarios autónomos

### Segmento A1: Principiantes sedentarios — pérdida de grasa (25)
**Perfil:** 22–45 años, IMC 27–35, 0–6 meses de gym, 3 días/semana, solo mancuernas en casa.

| # | Feedback representativo | Tipo |
|---|------------------------|------|
| A1-01 | "No sé si estoy haciendo los ejercicios bien, no hay videos ni instrucciones" | Crítica |
| A1-02 | "El onboarding fue claro, me gustó que calculó mis calorías solo" | Positiva |
| A1-03 | "Registré comida manualmente 3 días y me cansé, es mucho trabajo" | Crítica |
| A1-04 | "No encuentro Perfil ni Ajustes Semanales en el móvil" | Crítica crítica |
| A1-05 | "El coach me dice que duerma más siempre, aunque ya duermo 8h" | Crítica |
| A1-06 | "Quiero rutinas solo con mancuernas, me salen barras y máquinas" | Crítica |
| A1-07 | "El gráfico de peso me motiva mucho" | Positiva |
| A1-08 | "¿Por qué no me avisa cuando toca pesarme?" | Sugerencia |

**Consenso del segmento (Agente UX + Entrenamiento):** Falta onboarding de equipo disponible, videos de ejercicios, y rutinas home-gym.

---

### Segmento A2: Principiantes activos — ganancia muscular (25)
**Perfil:** 18–30 años, delgados, 3–12 meses gym, 4–5 días, gimnasio completo.

| Feedback | Tipo |
|----------|------|
| "Las rutinas Push/Pull/Legs están bien estructuradas" | Positiva |
| "Marqué series pero no guardé peso ni reps reales" | Crítica |
| "No hay timer de descanso entre series" | Crítica |
| "El plan alimenticio sugerido es siempre el mismo" | Crítica |
| "Me gustaría ver cuánto volumen llevo por músculo a la semana" | Sugerencia |
| "¿Dónde veo mis entrenamientos de la semana pasada con detalle?" | Crítica |

**Consenso:** Tracking de entrenamiento es demasiado superficial para usuarios que quieren progresar.

---

### Segmento A3: Intermedios powerlifting (25)
**Perfil:** 25–40 años, 2–5 años experiencia, enfoque fuerza, 3–4 días.

| Feedback | Tipo |
|----------|------|
| "Las reps '6-10' no sirven para fuerza, necesito % de 1RM" | Crítica |
| "No hay registro de RPE ni RIR" | Crítica |
| "La progresión sugerida nunca aparece porque no hay peso cargado" | Crítica crítica |
| "Quiero ver mis PRs por ejercicio" | Sugerencia |
| "El TDEE parece razonable comparado con mi experiencia" | Positiva |
| "No hay día de pierna pesado / día de accesorios diferenciado" | Crítica |

**Consenso (Agente Entrenamiento + Ciencia):** La app está orientada a hipertrofia genérica, no a modalidades específicas.

---

### Segmento A4: Intermedios hipertrofia / culturismo recreativo (25)
**Perfil:** 20–35 años, 1–3 años, 5 días, división por grupos musculares.

| Feedback | Tipo |
|----------|------|
| "Falta poder editar ejercicios de la rutina" | Crítica |
| "Quiero sustituir ejercicios que no me gustan" | Sugerencia |
| "El coach detectó baja proteína — eso sí fue útil" | Positiva |
| "No hay registro de medidas (brazo, cintura, cadera)" | Crítica |
| "Las revisiones semanales no se generan solas" | Crítica |
| "Me gustaría fotos de progreso lado a lado" | Sugerencia |

---

### Segmento A5: Intermedios CrossFit / funcional (25)
**Perfil:** 22–38 años, WODs + fuerza, 4–6 días, variedad alta.

| Feedback | Tipo |
|----------|------|
| "No hay ejercicios olímpicos ni metcon" | Crítica |
| "El tracking de series no encaja con entrenamientos por tiempo" | Crítica |
| "Necesito registrar AMRAP, EMOM, For Time" | Sugerencia |
| "Los macros para rendimiento son demasiado genéricos" | Crítica |
| "Buena interfaz oscura, no me cansa la vista" | Positiva |

---

### Segmento A6: Avanzados culturismo (25)
**Perfil:** 25–45 años, 5+ años, periodización, 5–6 días, competidores/amateurs.

| Feedback | Tipo |
|----------|------|
| "Esto es un MVP, no una app profesional de culturismo" | Crítica fuerte |
| "No hay fases (bulk, cut, mantenimiento, peak week)" | Crítica |
| "Los ajustes semanales solo cambian calorías, no entrenamiento" | Crítica crítica |
| "Necesito carb cycling, refeed days, diet breaks programados" | Sugerencia |
| "El % grasa corporal se registra pero no se usa para nada" | Crítica |
| "Las citas científicas dan credibilidad pero quiero links" | Sugerencia |

---

### Segmento A7: Avanzados resistencia — runners / triatletas (25)
**Perfil:** 28–50 años, maratón/triatlón, 5–7 días cardio + 2 fuerza.

| Feedback | Tipo |
|----------|------|
| "Solo 3–5 días de gym, yo entreno 7 días" | Crítica |
| "No hay tracking de carreras, ritmo, distancia" | Crítica |
| "Los macros no consideran gasto de carrera larga" | Crítica |
| "El objetivo 'rendimiento' no cambia nada real en la app" | Crítica crítica |
| "Integración con Garmin/Strava es imprescindible" | Sugerencia fuerte |

---

### Segmento A8: Mayores 50+ — salud y longevidad (25)
**Perfil:** 50–68 años, movilidad, fuerza funcional, 2–3 días.

| Feedback | Tipo |
|----------|------|
| "Letra pequeña en móvil, difícil de leer" | Crítica accesibilidad |
| "Necesito ejercicios de bajo impacto y alternativas" | Sugerencia |
| "El onboarding pide muchos datos de golpe" | Crítica UX |
| "Me preocupa perder datos si borro el navegador" | Crítica datos |
| "Los consejos de sueño son relevantes para mi edad" | Positiva |

---

### Segmento A9: Mujeres — recomposición / postparto (25)
**Perfil:** 25–40 años, objetivo recomp o pérdida grasa, 3–4 días, ciclo hormonal relevante.

| Feedback | Tipo |
|----------|------|
| "Solo masculino/femenino en género, falta inclusividad" | Crítica |
| "Recomp no tiene lógica de ajuste en revisiones semanales" | Crítica crítica |
| "Quiero registrar ciclo menstrual y ver correlación con peso" | Sugerencia |
| "Las calorías en déficit agresivo (-500) me parecen mucho" | Crítica ciencia |
| "El plan de comidas no tiene opciones vegetarianas" | Crítica |

---

### Segmento A10: Adolescentes / jóvenes atletas (25)
**Perfil:** 16–22 años, deporte escolar/universitario, rendimiento, 4–5 días.

| Feedback | Tipo |
|----------|------|
| "La app se ve profesional, la usaría con amigos" | Positiva |
| "Falta modo competición o temporadas" | Sugerencia |
| "Quiero compartir rutina con compañeros de equipo" | Sugerencia |
| "No hay gamificación (rachas, logros, niveles)" | Sugerencia |
| "El coach es repetitivo después de una semana" | Crítica |

---

## Grupo B — 250 usuarios con coach profesional

Cada coach guía a 10 clientes y reporta feedback estructurado desde su **patente** (especialidad certificada).

### Segmento B1: Coaches de nutrición deportiva (25 coaches × 10 clientes)
**Patente:** Nutrición clínica y deportiva (AND, ISSN)

| Feedback del coach | Severidad | Agente |
|-------------------|-----------|--------|
| "Sin base de datos de alimentos la adherencia cae al 40% en semana 2" | Alta | Nutrición |
| "El fiber target existe pero no se trackea en comidas" | Media | Nutrición |
| "No distingue comida registrada vs plan sugerido en el coach" | Alta | Coach IA |
| "Falta registro de agua, alcohol, suplementos" | Media | Nutrición |
| "Los macros no se recalculan cuando el cliente pierde 3kg" | Alta | Ciencia |
| "Necesitan exportar PDF semanal para consulta presencial" | Alta | Datos |
| "Las porciones del plan sugerido son en gramos — bien" | Positiva | Nutrición |

---

### Segmento B2: Coaches de powerlifting (25)
**Patente:** USAPL / IPF / Cursos de fuerza

| Feedback | Severidad |
|----------|-----------|
| "Imposible programar bloques de 4–6 semanas con deload" | Crítica alta |
| "Sin %1RM la app no sirve para mis atletas" | Crítica alta |
| "Necesitan log de series: peso × reps × RPE" | Crítica alta |
| "La rutina generada ignora el objetivo 'rendimiento'" | Crítica media |
| "Buen punto de partida para principiantes de fuerza" | Positiva |

---

### Segmento B3: Coaches de hipertrofia (25)
**Patente:** Hipertrofia basada en evidencia (Schoenfeld, Nippard-style)

| Feedback | Severidad |
|----------|-----------|
| "Volumen semanal por grupo muscular no se calcula" | Alta |
| "No hay semáforo MEV/MAV/MRV" | Media |
| "Sustitución de ejercicios es requisito mínimo" | Alta |
| "El historial solo muestra 5 entrenos — insuficiente" | Media |
| "La progresión de doble progresión no está implementada" | Alta |

---

### Segmento B4: Coaches de CrossFit (25)
**Patente:** CF-L1/L2, programación funcional

| Feedback | Severidad |
|----------|-----------|
| "No soporta modalidades (AMRAP, EMOM, chipper)" | Alta |
| "Falta whiteboard de WOD" | Alta |
| "Tracking de series es irrelevante para mis clientes" | Alta |
| "Necesitan leaderboard o registro de benchmarks (Fran, Murph)" | Media |

---

### Segmento B5: Coaches de running (25)
**Patente:** RRCA, UESCA, planificación de carreras

| Feedback | Severidad |
|----------|-----------|
| "Sin módulo de carrera la app no es viable para runners" | Bloqueante |
| "TDEE no suma gasto de sesiones de running" | Alta |
| "Necesitan plan de 12–16 semanas para maratón" | Alta |
| "Integración Strava/Garmin es prioridad #1 de mis clientes" | Bloqueante |

---

### Segmento B6: Coaches de rehabilitación / lesiones (25)
**Patente:** Fisioterapia deportiva, ejercicio terapéutico

| Feedback | Severidad |
|----------|-----------|
| "Sin filtros de lesión (rodilla, hombro, espalda baja)" | Alta |
| "Generar sentadilla a alguien con lesión de rodilla es peligroso" | Crítica crítica |
| "Necesitan ejercicios de movilidad y activación" | Alta |
| "Falta disclaimer médico y screening PAR-Q" | Alta legal |
| "El perfil no pregunta por lesiones o limitaciones" | Bloqueante |

---

### Segmento B7: Coaches de yoga / pilates (25)
**Patente:** RYT-200/500, Pilates certificado

| Feedback | Severidad |
|----------|-----------|
| "La app es 100% gym/pesas, no hay espacio para mi práctica" | Alta |
| "Necesitan sesiones de movilidad/recuperación en el plan" | Media |
| "El coach no menciona estrés ni mindfulness" | Baja |
| "Tracking de calorías no es el foco de mis clientes" | Media |

---

### Segmento B8: Coaches de culturismo competitivo (25)
**Patente:** NPC/IFBB prep, peak week

| Feedback | Severidad |
|----------|-----------|
| "No hay fases de preparación ni peak week" | Bloqueante |
| "Carb cycling, sodio, agua — nada de esto existe" | Bloqueante |
| "Check-in semanal con fotos front/side/back es estándar" | Alta |
| "Los ajustes automáticos son demasiado simples para competidores" | Alta |
| "La base científica es buena para usuarios generales" | Positiva |

---

### Segmento B9: Coaches de entrenamiento online (25)
**Patente:** Negocio digital, retención, escalabilidad

| Feedback | Severidad |
|----------|-----------|
| "Sin backend no puedo ver el progreso de mis clientes" | Bloqueante |
| "Necesitan cuentas, roles coach-cliente, panel admin" | Bloqueante |
| "Export/import de datos es mínimo para onboarding de clientes" | Alta |
| "La UI es atractiva para vender como white-label" | Positiva |
| "Falta notificaciones push (pesaje, entreno, comida)" | Alta |

---

### Segmento B10: Coaches de alto rendimiento (25)
**Patente:** NSCA-CSCS, deportes de equipo

| Feedback | Severidad |
|----------|-----------|
| "Periodización por mesociclos no existe" | Alta |
| "Sin tests de rendimiento (salto, sprint, 1RM)" | Alta |
| "El objetivo performance no altera programación" | Crítica crítica |
| "Necesitan cargas de entrenamiento (sRPE × minutos)" | Alta |
| "Datos de sueño y HRV de wearables serían clave" | Alta |

---

## Síntesis cuantitativa del feedback (500 usuarios)

### Top 15 problemas por frecuencia

| Rank | Problema | Menciones | % usuarios | Severidad |
|------|----------|-----------|------------|-----------|
| 1 | Sin base de datos de alimentos | 312 | 62% | Alta |
| 2 | Tracking de entreno superficial (sin peso/reps/RPE) | 287 | 57% | Alta |
| 3 | Semanal y Perfil inaccesibles en móvil | 245 | 49% | Alta |
| 4 | Sin videos/instrucciones de ejercicios | 231 | 46% | Alta |
| 5 | Coach repetitivo / genérico | 218 | 44% | Media |
| 6 | Ajustes semanales solo aplican calorías | 198 | 40% | Alta |
| 7 | Sin integración wearables (Strava/Garmin) | 189 | 38% | Alta* |
| 8 | Rutinas no personalizables (equipo, lesiones) | 186 | 37% | Alta |
| 9 | Macros no se recalculan al cambiar peso | 174 | 35% | Alta |
| 10 | Sin historial nutricional (solo hoy) | 168 | 34% | Media |
| 11 | Sin timer de descanso | 156 | 31% | Media |
| 12 | Objetivos recomp/performance sin lógica real | 152 | 30% | Alta |
| 13 | Sin exportar/backup de datos | 148 | 30% | Alta |
| 14 | Sin fotos/medidas de progreso | 142 | 28% | Media |
| 15 | Sin cuentas / sync multi-dispositivo | 138 | 28% | Alta* |

*Alta para coaches online y atletas; media para usuarios casuales.

### Top 10 aspectos positivos

| Rank | Aspecto | Menciones |
|------|---------|-----------|
| 1 | Onboarding claro y rápido | 267 |
| 2 | UI oscura moderna y limpia | 241 |
| 3 | Cálculo automático de TDEE/macros | 223 |
| 4 | Gráfico de peso motivador | 198 |
| 5 | Coach con base científica citada | 176 |
| 6 | Organización por secciones intuitiva | 164 |
| 7 | Plan alimenticio sugerido útil como base | 152 |
| 8 | Rutinas estructuradas para principiantes | 148 |
| 9 | Español nativo bien escrito | 134 |
| 10 | Sin necesidad de cuenta para empezar | 121 |

---

## Análisis por agente de escucha

### Agente UX — 127 hallazgos
- **Crítico:** 2 rutas ocultas en móvil (`Semanal`, `Perfil`)
- **Crítico:** Sub-páginas retornan `null` sin redirección si no hay perfil
- **Alto:** Sin validación de formularios ni mensajes de error
- **Alto:** Sin toasts de confirmación al guardar
- **Medio:** Onboarding no pregunta equipo ni lesiones

### Agente Entrenamiento — 143 hallazgos
- **Bloqueante:** Sin log real de peso × reps × RPE por serie
- **Bloqueante:** Progresión rota (`weightKg` nunca se asigna)
- **Alto:** Sin sustitución ni edición de ejercicios
- **Alto:** Sin periodización ni deload
- **Alto:** Sin timer de descanso
- **Medio:** Sin volumen semanal por músculo

### Agente Nutrición — 118 hallazgos
- **Bloqueante:** Sin base de datos de alimentos
- **Alto:** Solo tracking del día actual
- **Alto:** Fiber target sin tracking
- **Alto:** `DailyLog` (agua, sueño) definido pero sin UI
- **Medio:** Plan sugerido no varía por preferencias dietéticas

### Agente Ciencia — 89 hallazgos
- **Alto:** Macros no se recalculan automáticamente al cambiar peso
- **Alto:** `recomp`, `maintain`, `performance` sin ajustes semanales
- **Alto:** Citas científicas sin enlaces verificables
- **Medio:** Umbral de estabilidad de peso (±0.15 kg) demasiado sensible
- **Medio:** Déficit fijo -500 kcal no personalizado por % grasa

### Agente Coach IA — 76 hallazgos
- **Alto:** Recomendación de sueño siempre se inyecta
- **Alto:** No distingue datos reales vs vacíos después de semana 1
- **Medio:** Sin memoria de recomendaciones ya dadas
- **Medio:** Sin priorización por objetivo del usuario

### Agente Datos — 64 hallazgos
- **Bloqueante:** Sin backup/export (pérdida total al limpiar navegador)
- **Alto:** `useAppState` puede perder updates rápidos (stale closure)
- **Alto:** Sin versionado de schema en localStorage
- **Medio:** Entradas duplicadas de peso en misma fecha

### Agente Móvil — 52 hallazgos
- **Crítico:** Nav móvil incompleta (5 de 7 items)
- **Alto:** Sin PWA / instalable
- **Medio:** Touch targets pequeños en botones de series

### Agente Profesional — 71 hallazgos
- **Alto:** Percepción "MVP/demo" por usuarios avanzados y coaches
- **Alto:** Sin tests automatizados para lógica crítica
- **Alto:** Sin PAR-Q / disclaimer médico
- **Medio:** Sin modo claro/oscuro toggle
- **Positivo:** Identidad visual coherente y moderna
