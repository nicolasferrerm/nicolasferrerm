# Requerimientos detallados — FitCoach v2.0

> Derivados del análisis de 500 usuarios beta (250 autónomos + 250 con coach).
> Cada requerimiento tiene ID, prioridad, criterios de aceptación y agente responsable.

## Leyenda de prioridades

| Nivel | Significado |
|-------|-------------|
| **P0** | Bloqueante — impide uso profesional o representa riesgo |
| **P1** | Alta — mencionado por >35% de usuarios o coaches |
| **P2** | Media — mejora significativa de retención/UX |
| **P3** | Baja — diferenciador o nicho avanzado |

---

## Módulo 1: Fundamentos y datos (Agente Datos)

### REQ-DATA-001 — Persistencia robusta con versionado
- **Prioridad:** P0
- **Descripción:** El estado en localStorage debe incluir `schemaVersion` y migraciones automáticas entre versiones.
- **Criterios de aceptación:**
  - [ ] Campo `schemaVersion` en `AppState`
  - [ ] Función `migrateState()` ejecutada al cargar
  - [ ] Tests unitarios para cada migración
  - [ ] Sin pérdida de datos al actualizar la app

### REQ-DATA-002 — Fix de actualizaciones concurrentes de estado
- **Prioridad:** P0
- **Descripción:** Reemplazar `update(partial)` con closure stale por `setState` funcional o reducer.
- **Criterios de aceptación:**
  - [ ] 10 updates rápidos consecutivos persisten todos los cambios
  - [ ] Test de regresión incluido

### REQ-DATA-003 — Exportar e importar datos
- **Prioridad:** P1
- **Descripción:** Permitir backup JSON y restauración para portabilidad y consultas con coach.
- **Criterios de aceptación:**
  - [ ] Botón "Exportar datos" en Perfil → descarga `.json`
  - [ ] Botón "Importar datos" con validación de schema
  - [ ] Confirmación antes de sobrescribir
  - [ ] Export incluye: perfil, peso, comidas, entrenos, revisiones

### REQ-DATA-004 — Unicidad de registros diarios de peso
- **Prioridad:** P2
- **Descripción:** Un solo registro de peso por fecha; editar en lugar de duplicar.
- **Criterios de aceptación:**
  - [ ] Al registrar peso en fecha existente → modal "¿Actualizar?"
  - [ ] Historial sin duplicados por día

### REQ-DATA-005 — Edición y eliminación universal
- **Prioridad:** P1
- **Descripción:** Todo registro (peso, comida, entreno) debe ser editable y eliminable.
- **Criterios de aceptación:**
  - [ ] Swipe o botón editar/eliminar en cada entrada
  - [ ] Confirmación en eliminación
  - [ ] Recálculo de agregados tras edición

---

## Módulo 2: Perfil y onboarding (Agente UX + Ciencia)

### REQ-PROFILE-001 — Screening de salud PAR-Q
- **Prioridad:** P0
- **Descripción:** Cuestionario PAR-Q simplificado antes de generar rutina.
- **Criterios de aceptación:**
  - [ ] 7 preguntas PAR-Q en onboarding (sí/no)
  - [ ] Si alguna respuesta es "sí" → disclaimer + sugerencia consultar médico
  - [ ] No bloquear uso, pero no generar rutina de alto impacto sin confirmación

### REQ-PROFILE-002 — Registro de lesiones y limitaciones
- **Prioridad:** P0
- **Descripción:** Campo multiselección de zonas afectadas y tipo de limitación.
- **Criterios de aceptación:**
  - [ ] Zonas: rodilla, hombro, espalda baja, cadera, muñeca, tobillo, ninguna
  - [ ] Tipo: evitar impacto, evitar carga axial, rango limitado, dolor activo
  - [ ] La rutina excluye ejercicios contraindicados automáticamente
  - [ ] Editable en Perfil

### REQ-PROFILE-003 — Equipo disponible
- **Prioridad:** P1
- **Descripción:** Selección de equipamiento para filtrar ejercicios de rutina.
- **Criterios de aceptación:**
  - [ ] Opciones: gimnasio completo, solo mancuernas, casa sin equipo, bandas, barra + rack
  - [ ] Rutina generada solo con ejercicios compatibles
  - [ ] Regenerar rutina al cambiar equipo

### REQ-PROFILE-004 — Recálculo automático de macros al cambiar peso
- **Prioridad:** P1
- **Descripción:** Al registrar peso, recalcular TDEE y macros si el cambio es >1 kg respecto al último cálculo.
- **Criterios de aceptación:**
  - [ ] Notificación: "Tu peso cambió X kg. ¿Actualizar objetivos calóricos?"
  - [ ] Mostrar diff: calorías anteriores → nuevas
  - [ ] Usuario puede aceptar o posponer
  - [ ] Log de ajustes aplicados

### REQ-PROFILE-005 — Género e inclusividad
- **Prioridad:** P2
- **Descripción:** Ampliar opciones de género para cálculos metabólicos.
- **Criterios de aceptación:**
  - [ ] Opciones: masculino, femenino, otro (usa promedio Mifflin-St Jeor)
  - [ ] Editable en Perfil

### REQ-PROFILE-006 — Días de entrenamiento flexibles
- **Prioridad:** P2
- **Descripción:** Soportar 1–7 días/semana con templates adaptados.
- **Criterios de aceptación:**
  - [ ] Templates para 1, 2, 3, 4, 5, 6, 7 días
  - [ ] 1–2 días: full body; 6–7: split con día activo/recuperación

---

## Módulo 3: Entrenamiento (Agente Entrenamiento)

### REQ-TRAIN-001 — Log detallado por serie
- **Prioridad:** P0
- **Descripción:** Registrar peso (kg), reps completadas y RPE (1–10) por cada serie.
- **Criterios de aceptación:**
  - [ ] Nuevo tipo `SetLog { exerciseId, setNumber, weightKg, reps, rpe?, completedAt }`
  - [ ] UI: al tocar serie → modal con peso, reps, RPE opcional
  - [ ] Pre-llenar con datos de la sesión anterior del mismo ejercicio
  - [ ] Guardar en `WorkoutSession.setLogs[]`

### REQ-TRAIN-002 — Progresión funcional con historial
- **Prioridad:** P0
- **Descripción:** `suggestProgression()` debe usar datos reales de `SetLog`.
- **Criterios de aceptación:**
  - [ ] Comparar reps completadas vs objetivo del ejercicio
  - [ ] Sugerir +2.5 kg (peso <20) o +5 kg al completar rango superior
  - [ ] Mostrar sugerencia al finalizar ejercicio
  - [ ] Tests unitarios con casos: subir peso, mantener, deload

### REQ-TRAIN-003 — Timer de descanso
- **Prioridad:** P1
- **Descripción:** Temporizador automático al completar una serie.
- **Criterios de aceptación:**
  - [ ] Inicia al marcar serie completada (usa `restSeconds` del ejercicio)
  - [ ] Notificación sonora/vibración al terminar
  - [ ] Botón +30s / saltar descanso
  - [ ] Visible en pantalla de entreno activo

### REQ-TRAIN-004 — Sustitución y edición de ejercicios
- **Prioridad:** P1
- **Descripción:** Cambiar ejercicios de la rutina por alternativas del mismo grupo muscular.
- **Criterios de aceptación:**
  - [ ] Botón "Cambiar" en cada ejercicio → lista de alternativas
  - [ ] Alternativas filtradas por equipo y lesiones
  - [ ] Editar series, reps, descanso manualmente
  - [ ] Cambios persisten en rutina activa

### REQ-TRAIN-005 — Volumen semanal por grupo muscular
- **Prioridad:** P1
- **Descripción:** Dashboard y Coach muestran series efectivas por músculo en la semana.
- **Criterios de aceptación:**
  - [ ] Cálculo: suma de series completadas × factor multiarticulado
  - [ ] Visualización: barras por grupo (pecho, espalda, etc.)
  - [ ] Rango recomendado: 10–20 series/semana (principiante–avanzado)
  - [ ] Alerta si <10 o >25 series/semana

### REQ-TRAIN-006 — Historial completo de entrenamientos
- **Prioridad:** P1
- **Descripción:** Ver todos los entrenamientos pasados con detalle de series.
- **Criterios de aceptación:**
  - [ ] Lista paginada (no solo últimos 5)
  - [ ] Tap en entreno → detalle con SetLogs
  - [ ] Filtro por fecha y tipo de sesión

### REQ-TRAIN-007 — Videos e instrucciones de ejercicios
- **Prioridad:** P1
- **Descripción:** Cada ejercicio tiene descripción, tips y video/GIF demostrativo.
- **Criterios de aceptación:**
  - [ ] Base de datos ampliada: nombre, músculo, equipo, instrucciones, videoUrl
  - [ ] Modal al tocar nombre del ejercicio
  - [ ] Mínimo 50 ejercicios con contenido al lanzar v2

### REQ-TRAIN-008 — Periodización básica
- **Prioridad:** P2
- **Descripción:** Mesociclos de 4 semanas con semana de deload.
- **Criterios de aceptación:**
  - [ ] Semanas 1–3: progresión normal; semana 4: -40% volumen
  - [ ] Indicador visual de semana actual del mesociclo
  - [ ] Coach sugiere deload si adherencia <50% o fatiga reportada

### REQ-TRAIN-009 — Personal records (PRs)
- **Prioridad:** P2
- **Descripción:** Detectar y celebrar récords personales por ejercicio.
- **Criterios de aceptación:**
  - [ ] PR de peso máximo, reps máximas, volumen (series × reps × peso)
  - [ ] Badge/notificación al batir PR
  - [ ] Sección "Mis récords" en Perfil o Rutinas

### REQ-TRAIN-010 — Modalidades de entrenamiento
- **Prioridad:** P3
- **Descripción:** Soporte para AMRAP, EMOM, For Time (CrossFit/funcional).
- **Criterios de aceptación:**
  - [ ] Tipo de sesión seleccionable al crear/iniciar
  - [ ] Timer countdown / countup según modalidad
  - [ ] Registro de rounds/reps totales

---

## Módulo 4: Nutrición (Agente Nutrición)

### REQ-NUTR-001 — Base de datos de alimentos
- **Prioridad:** P0
- **Descripción:** Buscar alimentos por nombre con macros precalculados.
- **Criterios de aceptación:**
  - [ ] Mínimo 500 alimentos comunes en español (es-ES)
  - [ ] Búsqueda con autocompletado
  - [ ] Porciones: 100g, unidad, taza, cucharada
  - [ ] Al seleccionar → auto-llena calorías y macros
  - [ ] Fuente: USDA/Open Food Facts adaptado

### REQ-NUTR-002 — Historial nutricional
- **Prioridad:** P1
- **Descripción:** Ver y editar comidas de días anteriores.
- **Criterios de aceptación:**
  - [ ] Selector de fecha en página Nutrición
  - [ ] Promedio semanal de calorías y macros
  - [ ] Copiar día anterior ("Comer como ayer")

### REQ-NUTR-003 — Tracking de agua y fibra
- **Prioridad:** P1
- **Descripción:** Activar `DailyLog` con UI para agua y sumar fibra en comidas.
- **Criterios de aceptación:**
  - [ ] Campo `fiber` en `FoodEntry`
  - [ ] Widget de agua en Dashboard (+250ml, +500ml, personalizado)
  - [ ] Objetivo de agua: 35ml × kg corporal
  - [ ] Progress bar de fibra en Nutrición

### REQ-NUTR-004 — Comidas frecuentes y favoritos
- **Prioridad:** P2
- **Descripción:** Guardar combinaciones de alimentos para registro rápido.
- **Criterios de aceptación:**
  - [ ] "Guardar como comida frecuente" al registrar
  - [ ] Lista de favoritos en formulario de registro
  - [ ] Un tap para añadir comida frecuente al día

### REQ-NUTR-005 — Plan alimenticio dinámico
- **Prioridad:** P2
- **Descripción:** Plan sugerido varía por objetivo, preferencias y macros actuales.
- **Criterios de aceptación:**
  - [ ] Preferencias: omnívoro, vegetariano, vegano, sin gluten, sin lactosa
  - [ ] Mínimo 3 opciones por comida
  - [ ] Suma de macros del plan ≈ objetivo diario (±5%)
  - [ ] Rotación semanal (no repetir mismas comidas)

### REQ-NUTR-006 — Registro de suplementos
- **Prioridad:** P3
- **Descripción:** Log de suplementos con macros opcionales.
- **Criterios de aceptación:**
  - [ ] Lista: whey, creatina, pre-entreno, multivitamínico, omega-3
  - [ ] No suma a macros salvo que tenga calorías

---

## Módulo 5: Peso y composición corporal (Agente Ciencia)

### REQ-WEIGHT-001 — Media móvil de peso
- **Prioridad:** P1
- **Descripción:** Mostrar tendencia con media móvil de 7 días, no solo peso diario.
- **Criterios de aceptación:**
  - [ ] Gráfico con línea de peso diario + línea de media 7d
  - [ ] Coach y ajustes usan media 7d, no peso puntual
  - [ ] Explicación en UI: "Usamos promedio semanal para evitar fluctuaciones"

### REQ-WEIGHT-002 — Gráfico de % grasa corporal
- **Prioridad:** P2
- **Descripción:** Si hay datos de % grasa, mostrar tendencia y usar en coach.
- **Criterios de aceptación:**
  - [ ] Segunda línea en gráfico (eje Y secundario)
  - [ ] Coach menciona tendencia de grasa si hay ≥3 registros

### REQ-WEIGHT-003 — Medidas corporales
- **Prioridad:** P2
- **Descripción:** Registrar cintura, cadera, brazo, muslo, pecho.
- **Criterios de aceptación:**
  - [ ] Formulario de medidas con cinta métrica
  - [ ] Gráfico de evolución por medida
  - [ ] Coach correlaciona medidas con peso (recomposición)

### REQ-WEIGHT-004 — Fotos de progreso
- **Prioridad:** P2
- **Descripción:** Subir fotos front/side/back con fecha.
- **Criterios de aceptación:**
  - [ ] Almacenamiento local (IndexedDB para binarios)
  - [ ] Comparador lado a lado (fecha A vs fecha B)
  - [ ] Privacidad: fotos solo en dispositivo

---

## Módulo 6: Coach inteligente (Agente Coach IA)

### REQ-COACH-001 — Eliminar recomendaciones genéricas repetitivas
- **Prioridad:** P0
- **Descripción:** No inyectar tip de sueño si ya fue dado o si hay datos de sueño ≥7h.
- **Criterios de aceptación:**
  - [ ] `DailyLog.sleepHours` alimenta al coach
  - [ ] Recomendaciones tienen `dismissedAt` o `shownCount`
  - [ ] No repetir misma recomendación en <7 días
  - [ ] Máximo 5 recomendaciones activas

### REQ-COACH-002 — Lógica completa para todos los objetivos
- **Prioridad:** P1
- **Descripción:** `recomp`, `maintain`, `performance` deben tener ajustes y recomendaciones propias.
- **Criterios de aceptación:**
  - [ ] Recomp: déficit leve + alto volumen de proteína + alerta si pierde >0.5kg/sem
  - [ ] Maintain: alerta si cambio >±0.5kg/sem
  - [ ] Performance: priorizar adherencia a entreno y carbohidratos pre/post
  - [ ] Tests unitarios por objetivo

### REQ-COACH-003 — Distinguir datos registrados vs vacíos
- **Prioridad:** P1
- **Descripción:** Coach adapta mensaje según calidad de datos del usuario.
- **Criterios de aceptación:**
  - [ ] Score de completitud: % días con comida, peso, entreno registrados
  - [ ] Si <50%: recomendaciones de hábito de registro
  - [ ] Si >80%: recomendaciones de optimización avanzada

### REQ-COACH-004 — Aplicar todos los tipos de ajuste semanal
- **Prioridad:** P1
- **Descripción:** `applyAdjustments()` debe soportar volumen, intensidad, proteína, cardio.
- **Criterios de aceptación:**
  - [ ] Cada `WeeklyAdjustment.type` tiene handler de aplicación
  - [ ] Confirmación individual por ajuste
  - [ ] Log de ajustes aplicados con fecha y razón

### REQ-COACH-005 — Revisión semanal automática
- **Prioridad:** P2
- **Descripción:** Generar revisión cada domingo si hay datos suficientes.
- **Criterios de aceptación:**
  - [ ] Al abrir app el domingo (o lunes): banner "Tu revisión semanal está lista"
  - [ ] Requiere ≥4 días con datos en la semana
  - [ ] Notificación local (si PWA)

### REQ-COACH-006 — Chat interactivo con coach
- **Prioridad:** P3
- **Descripción:** Preguntas en lenguaje natural sobre plan, progreso, dudas.
- **Criterios de aceptación:**
  - [ ] Input de texto en página Coach
  - [ ] Respuestas basadas en datos del usuario + reglas de science.ts
  - [ ] Tono motivacional y educativo en español

---

## Módulo 7: UX y móvil (Agente UX + Móvil)

### REQ-UX-001 — Navegación móvil completa
- **Prioridad:** P0
- **Descripción:** Acceso a las 7 secciones desde móvil.
- **Criterios de aceptación:**
  - [ ] Menú hamburguesa o scroll horizontal con las 7 rutas
  - [ ] Semanal y Perfil accesibles sin escribir URL
  - [ ] Test en viewport 375px

### REQ-UX-002 — Validación y feedback de formularios
- **Prioridad:** P1
- **Descripción:** Validar inputs y mostrar errores inline.
- **Criterios de aceptación:**
  - [ ] Campos requeridos marcados
  - [ ] Mensajes de error en español debajo del campo
  - [ ] Toast de éxito al guardar (peso, comida, entreno)

### REQ-UX-003 — Estados vacíos y guards de ruta
- **Prioridad:** P1
- **Descripción:** Sub-páginas sin perfil redirigen a onboarding, no `return null`.
- **Criterios de aceptación:**
  - [ ] Redirect a `/` con onboarding si `!profile`
  - [ ] EmptyState con CTA en cada sección sin datos

### REQ-UX-004 — PWA instalable
- **Prioridad:** P2
- **Descripción:** App instalable en móvil con icono y splash screen.
- **Criterios de aceptación:**
  - [ ] `manifest.json` con iconos 192/512
  - [ ] Service worker para cache de assets
  - [ ] Banner "Instalar app" en móvil

### REQ-UX-005 — Accesibilidad
- **Prioridad:** P2
- **Descripción:** Cumplir WCAG 2.1 AA básico.
- **Criterios de aceptación:**
  - [ ] Contraste mínimo 4.5:1 en texto
  - [ ] Tamaño de fuente mínimo 14px en móvil
  - [ ] Labels en todos los inputs
  - [ ] Navegación por teclado funcional

### REQ-UX-006 — Calendario de actividad
- **Prioridad:** P2
- **Descripción:** Vista mensual con entrenos, comidas registradas y peso.
- **Criterios de aceptación:**
  - [ ] Calendario con dots de color por tipo de actividad
  - [ ] Tap en día → resumen del día

---

## Módulo 8: Ciencia y credibilidad (Agente Ciencia)

### REQ-SCI-001 — Tests automatizados del motor científico
- **Prioridad:** P0
- **Descripción:** Cobertura de tests para todas las funciones en `science.ts`.
- **Criterios de aceptación:**
  - [ ] ≥90% cobertura de `science.ts`
  - [ ] Casos: cada objetivo, cada nivel actividad, bordes de peso
  - [ ] CI ejecuta tests en cada PR

### REQ-SCI-002 — Citas científicas verificables
- **Prioridad:** P2
- **Descripción:** Links a papers o fuentes en recomendaciones del coach.
- **Criterios de aceptación:**
  - [ ] Cada `scienceBasis` tiene `sourceUrl` opcional
  - [ ] Links a PubMed, ISSN, o resúmenes accesibles
  - [ ] Biblioteca de fuentes en página "Acerca de"

### REQ-SCI-003 — Déficit/superávit personalizado
- **Prioridad:** P2
- **Descripción:** Ajustar magnitud de déficit/superávit según % grasa y peso.
- **Criterios de aceptación:**
  - [ ] Si % grasa >25%: déficit hasta -750 kcal
  - [ ] Si % grasa <15%: déficit máximo -300 kcal
  - [ ] Superávit ganancia: 200–400 kcal según experiencia

---

## Módulo 9: Plataforma profesional (Agente Profesional)

### REQ-PRO-001 — Sistema de cuentas y roles
- **Prioridad:** P1 (coaches) / P3 (casual)
- **Descripción:** Auth con roles usuario y coach para gestión de clientes.
- **Criterios de aceptación:**
  - [ ] Registro/login (email + password o OAuth)
  - [ ] Rol coach: ver lista de clientes, progreso agregado
  - [ ] Rol usuario: vincular con código de coach
  - [ ] Backend: Supabase o similar

### REQ-PRO-002 — Integración wearables
- **Prioridad:** P2
- **Descripción:** Importar pasos, sueño, calorías activas de Apple Health / Google Fit / Strava.
- **Criterios de aceptación:**
  - [ ] Conexión OAuth con Strava (mínimo)
  - [ ] Pasos y sueño alimentan `DailyLog`
  - [ ] Coach usa datos de wearable si disponibles

### REQ-PRO-003 — Gamificación y retención
- **Prioridad:** P3
- **Descripción:** Rachas, logros y niveles para motivar adherencia.
- **Criterios de aceptación:**
  - [ ] Racha de días consecutivos con registro
  - [ ] Logros: "Primera semana completa", "10 entrenos", "PR batido"
  - [ ] Sección de logros en Dashboard

### REQ-PRO-004 — Modo claro/oscuro
- **Prioridad:** P3
- **Descripción:** Toggle de tema con persistencia.
- **Criterios de aceptación:**
  - [ ] Toggle en Perfil o header
  - [ ] Respeta `prefers-color-scheme` por defecto

---

## Resumen de requerimientos

| Prioridad | Cantidad |
|-----------|----------|
| P0 | 12 |
| P1 | 24 |
| P2 | 18 |
| P3 | 8 |
| **Total** | **62** |
