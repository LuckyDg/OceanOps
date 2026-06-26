/**
 * pnpm fetch-data
 * Fetches marine conditions (OpenMeteo), tidal predictions (NOAA),
 * calculates fishing scores, generates AI summary via Groq,
 * writes public/data/daily.json.
 */
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import path from 'path';

// Load .env.local without external deps (tsx doesn't auto-load it)
try {
  readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8')
    .split('\n')
    .forEach((line) => {
      const eq = line.indexOf('=');
      if (eq > 0 && !line.trimStart().startsWith('#')) {
        const key = line.slice(0, eq).trim();
        const val = line.slice(eq + 1).trim();
        if (key && !(key in process.env)) process.env[key] = val;
      }
    });
} catch { /* no .env.local — fine */ }

import { FISHING_ZONES } from '../lib/zones';
import { fetchMarineConditions } from '../lib/openmeteo';
import { fetchTidalData } from '../lib/noaa';
import { calculateFishingConditions } from '../lib/fishing-score';
import type { MarineConditions, FishingConditions } from '../types';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL   = 'llama-3.1-8b-instant';

async function generateAISummary(
  conditions: MarineConditions[],
  fishing: FishingConditions[]
) {
  if (!GROQ_API_KEY) {
    console.warn('⚠  GROQ_API_KEY not set — skipping AI summary');
    return null;
  }

  const condText = conditions.map((c) => {
    const f = fishing.find((fi) => fi.zoneId === c.zoneId);
    return `${c.zoneId}: waves ${c.waveHeightM}m/${c.wavePeriodS}s, wind ${c.windSpeedKmh}km/h, sea temp ${c.seaTempC}°C, fishing score ${f?.score ?? '?'}/100`;
  }).join('\n');

  const zoneIds = conditions.map((c) => c.zoneId).join(', ');

  const prompt = `Eres un experto en pesca marítima. Con base en las condiciones reales de hoy, escribe un resumen JSON para cada zona de pesca. Responde ÚNICAMENTE con JSON válido — sin markdown, sin bloques de código, sin explicaciones. Todo el texto debe estar en español.

Condiciones de hoy:
${condText}

Formato JSON requerido:
{"zones":[{"zoneId":"gulf-mexico","rating":"excellent|good|fair|poor","summary":"2-3 oraciones sobre el pronóstico de pesca para pescadores recreativos y comerciales","keyPoints":["punto específico 1","punto específico 2","punto específico 3"]}]}

Incluye todas las zonas: ${zoneIds}.
Rating según puntuación: 80-100=excellent, 60-79=good, 40-59=fair, 0-39=poor. (los valores de rating siempre en inglés, el resto del texto en español)`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 1400,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('  ✗ Groq API error:', err);
    return null;
  }

  const data = await res.json() as {
    choices: { message: { content: string } }[];
    usage: { total_tokens: number };
  };
  console.log(`  ✓ Groq used ${data.usage?.total_tokens} tokens`);

  const content = data.choices[0]?.message?.content;
  if (!content) return null;

  try {
    const parsed = JSON.parse(content) as {
      zones: { zoneId: string; rating: string; summary: string; keyPoints: string[] }[];
    };
    return {
      date: new Date().toISOString().slice(0, 10),
      generatedAt: new Date().toISOString(),
      model: GROQ_MODEL,
      zones: parsed.zones,
    };
  } catch {
    console.error('  ✗ Failed to parse Groq JSON:', content.slice(0, 200));
    return null;
  }
}

async function main() {
  console.log('🌊 OceanOps daily fetch starting…');
  const today = new Date().toISOString().slice(0, 10);
  console.log(`   Date: ${today}`);

  // 1. Marine conditions from OpenMeteo
  console.log('\n📡 Fetching marine conditions (OpenMeteo)…');
  const condResults = await Promise.allSettled(
    FISHING_ZONES.map((z) => fetchMarineConditions(z))
  );
  const conditions: MarineConditions[] = [];
  condResults.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      conditions.push(r.value);
      console.log(`  ✓ ${FISHING_ZONES[i].id}`);
    } else {
      console.error(`  ✗ ${FISHING_ZONES[i].id}: ${(r.reason as Error).message}`);
    }
  });

  // 2. Tidal predictions from NOAA
  console.log('\n🌊 Fetching tidal predictions (NOAA)…');
  const tidesResults = await Promise.allSettled(
    FISHING_ZONES.map((z) => fetchTidalData(z.id))
  );
  const tides = tidesResults
    .filter((r): r is PromiseFulfilledResult<NonNullable<Awaited<ReturnType<typeof fetchTidalData>>>> =>
      r.status === 'fulfilled' && r.value !== null
    )
    .map((r) => r.value);
  console.log(`  ✓ ${tides.length} tidal stations`);

  // 3. Fishing scores
  const fishing = conditions.map(calculateFishingConditions);
  const best = fishing.reduce((b, f) => f.score > b.score ? f : b);
  console.log(`\n📊 Scores calculated. Best zone: ${best.zoneId} (${best.score}/100, ${best.rating})`);

  // 4. AI summary
  console.log('\n🤖 Generating AI summary (Groq)…');
  const summary = await generateAISummary(conditions, fishing);

  // 5. Write output
  const output = { date: today, updatedAt: new Date().toISOString(), conditions, tides, fishing, summary };
  const outDir = path.join(process.cwd(), 'public', 'data');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, 'daily.json'), JSON.stringify(output, null, 2));

  console.log(`\n✅ Written to public/data/daily.json`);
  console.log(`   ${conditions.length} zones · ${tides.length} tide stations · AI: ${summary ? 'yes' : 'no'}`);
}

main().catch((err: Error) => {
  console.error('\n💥 Fatal:', err.message);
  process.exit(1);
});
