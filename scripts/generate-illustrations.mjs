// scripts/generate-illustrations.mjs
// Batch generator for RIOS guide illustrations.
//
// Usage:
//   ADMIN_TOKEN=... FUNCTION_URL=https://<project>.functions.supabase.co/gerar-ilustracao \
//     node scripts/generate-illustrations.mjs [--force] [--only=slug1,slug2] [--kind=place,trail]
//
// Reads slug+descriptor pairs from ./illustration-descriptors.json (see the
// file for the schema). Sends one request every 3s with exponential backoff
// on 429/5xx.

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const FUNCTION_URL = process.env.FUNCTION_URL;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
if (!FUNCTION_URL || !ADMIN_TOKEN) {
  console.error('Missing FUNCTION_URL or ADMIN_TOKEN env var.');
  process.exit(1);
}

const args = new Map(process.argv.slice(2).map((a) => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v ?? 'true'];
}));

const FORCE = args.get('force') === 'true';
const ONLY = args.has('only') ? new Set(args.get('only').split(',')) : null;
const KIND = args.has('kind') ? new Set(args.get('kind').split(',')) : null;
const DELAY_MS = 3000;

const descriptorsPath = path.join(process.cwd(), 'scripts', 'illustration-descriptors.json');
const descriptors = JSON.parse(fs.readFileSync(descriptorsPath, 'utf8'));

const jobs = descriptors.filter((d) => {
  if (ONLY && !ONLY.has(d.slug)) return false;
  if (KIND && !KIND.has(d.kind)) return false;
  return true;
});

console.log(`Queued ${jobs.length} illustration${jobs.length === 1 ? '' : 's'} ` +
  `(force=${FORCE}). One request every ${DELAY_MS}ms.\n`);

async function callOnce(job, attempt = 1) {
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': ADMIN_TOKEN,
    },
    body: JSON.stringify({ slug: job.slug, descriptor: job.descriptor, kind: job.kind, force: FORCE }),
  });
  const text = await res.text();
  if (!res.ok) {
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      const wait = 2 ** attempt * 1000;
      console.warn(`  ↳ ${res.status} — retry in ${wait}ms (attempt ${attempt + 1}/4)`);
      await new Promise((r) => setTimeout(r, wait));
      return callOnce(job, attempt + 1);
    }
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return JSON.parse(text);
}

let ok = 0;
let skipped = 0;
let failed = 0;
for (let i = 0; i < jobs.length; i++) {
  const job = jobs[i];
  const label = `[${String(i + 1).padStart(3, '0')}/${jobs.length}] ${job.slug}`;
  try {
    const result = await callOnce(job);
    if (result.skipped) {
      skipped++;
      console.log(`${label} · skipped (already generated)`);
    } else {
      ok++;
      console.log(`${label} · ok`);
    }
  } catch (err) {
    failed++;
    console.error(`${label} · FAILED — ${err.message}`);
  }
  if (i < jobs.length - 1) await new Promise((r) => setTimeout(r, DELAY_MS));
}

console.log(`\nDone. ok=${ok} skipped=${skipped} failed=${failed}`);
if (failed > 0) process.exit(1);
