# FitCoach — Tu entrenador personal inteligente

Plataforma de fitness completa con rutinas, nutrición, control de peso y coach basado en ciencia.

## Características

- **Rutinas de ejercicio** — Generadas según objetivo, experiencia y días disponibles (Full Body, Upper/Lower, Push/Pull/Legs)
- **Planes alimenticios** — Macros calculados con ecuación Mifflin-St Jeor y tracking de calorías
- **Control de peso** — Registro diario con gráfico de tendencia y análisis semanal
- **Coach inteligente** — Recomendaciones basadas en evidencia científica (ISSN, Morton et al., Schoenfeld)
- **Ajustes semanales** — Revisión automática con ajustes de calorías, volumen e intensidad
- **Perfil personalizable** — 5 objetivos de entrenamiento, 3 niveles de experiencia

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS 4
- Recharts (gráficos)
- Lucide React (iconos)
- LocalStorage (persistencia)

## Base científica

- **TDEE**: Ecuación Mifflin-St Jeor (1990)
- **Macros**: ISSN Position Stand (2017), Morton et al. meta-análisis (2018)
- **Progresión**: Sobrecarga progresiva (Schoenfeld, 2010)
- **Ajustes**: Hall et al. (2011, 2012), Garthe et al. (2013), Peos et al. (2021)
