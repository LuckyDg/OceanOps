# OceanOps — Inteligencia Pesquera Marítima

Dashboard público de condiciones marítimas y pronósticos de pesca, actualizado diariamente con datos reales y análisis de IA.

## Características

- **Condiciones del mar en tiempo real** — altura de ola, viento, temperatura superficial y visibilidad por zona
- **Predicciones de mareas** — timeline de mareas altas y bajas con countdown a la próxima
- **Tiempo marino** — brújula de viento, escala Beaufort, alertas de navegación
- **Pronóstico IA diario** — análisis en español generado automáticamente por zona
- **Mapa interactivo** — zonas de pesca coloreadas por rating en Leaflet
- **Modo oscuro/claro** — toggle persistente con tema tipo Vercel + acento azul océano
- **Totalmente en español** — UI y pronósticos

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19 + Tailwind CSS v3 |
| Estado | Zustand v5 |
| Mapa | Leaflet |
| Fuente de datos | OpenMeteo Marine API + NOAA Tides |
| IA | Groq (llama-3.1-8b-instant) |
| Package manager | pnpm |

No hay backend ni base de datos. Todos los datos se obtienen diariamente mediante un script cron y se almacenan como JSON estático.

## Instalación

```bash
git clone https://github.com/LuckyDg/OceanOps.git
cd OceanOps
pnpm install
```

## Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
GROQ_API_KEY=gsk_...
```

Obtén una API key gratuita en [console.groq.com](https://console.groq.com). Sin esta key el dashboard funciona con datos pero sin el resumen IA.

## Comandos

```bash
pnpm dev          # servidor de desarrollo en localhost:3000
pnpm build        # build de producción
pnpm fetch-data   # obtener datos del día y generar pronóstico IA
```

## Actualización de datos

El script `pnpm fetch-data` hace lo siguiente en una sola ejecución:

1. Obtiene condiciones marinas de las 5 zonas (OpenMeteo Marine API)
2. Obtiene predicciones de marea de estaciones NOAA
3. Calcula puntuación de pesca (0–100) basada en olas, viento y temperatura
4. Genera resumen en español con Groq IA
5. Escribe `public/data/daily.json`

Para producción se recomienda un GitHub Action o cron job que ejecute este script diariamente a las 06:00 UTC.

## Zonas cubiertas

| Zona | Coordenadas |
|------|------------|
| Golfo de México | 25.0°N, 90.0°O |
| Pacífico Noroeste | 47.5°N, 124.5°O |
| Atlántico NE | 42.0°N, 70.0°O |
| Mar Caribe | 15.0°N, 75.0°O |
| Golfo de Alaska | 57.0°N, 153.0°O |

## Despliegue en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Agrega `GROQ_API_KEY` como variable de entorno
3. Vercel detecta Next.js y pnpm automáticamente

---

Autor: [LuckyDg](https://github.com/LuckyDg)
