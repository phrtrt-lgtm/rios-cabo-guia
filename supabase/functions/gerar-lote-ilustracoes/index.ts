// Edge function: gerar-lote-ilustracoes
// Dispara em background a geração de todas as ilustrações pendentes, uma a uma.
// Protegida por header x-batch-token (env BATCH_TOKEN).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const STYLE_PROMPT = (descriptor: string) =>
  `Flat editorial travel illustration with subtle watercolor texture. Scene: ${descriptor}. ` +
  `Color palette strictly limited to: deep navy #1A3A52, terracotta orange #C8642A, soft blue #5DA3C9, warm off-white #FBFAF7, sand beige. ` +
  `Warm coastal daylight, gentle shadows. Composition: wide establishing view, no people in foreground, no text, no lettering, no logos, no borders. ` +
  `Consistent minimalist style as part of an illustration series for a boutique hospitality travel guide.`;

const SIGNED_URL_TTL = 60 * 60 * 24 * 365;
const DELAY_MS = 1500;

interface Descriptor {
  slug: string;
  kind: string;
  descriptor: string;
}

async function generateOne(
  supabase: ReturnType<typeof createClient>,
  openaiKey: string,
  job: Descriptor,
): Promise<{ ok: boolean; slug: string; error?: string; url?: string }> {
  try {
    const genRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-2',
        prompt: STYLE_PROMPT(job.descriptor),
        size: '1024x1024',
        n: 1,
      }),
    });
    if (!genRes.ok) {
      const t = await genRes.text();
      return { ok: false, slug: job.slug, error: `openai ${genRes.status}: ${t.slice(0, 200)}` };
    }
    const genJson = await genRes.json() as { data?: Array<{ b64_json?: string }> };
    const b64 = genJson.data?.[0]?.b64_json;
    if (!b64) return { ok: false, slug: job.slug, error: 'no b64_json' };

    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const storagePath = `${job.slug}.png`;
    const { error: upErr } = await supabase.storage
      .from('guia-ilustracoes')
      .upload(storagePath, bytes, {
        contentType: 'image/png',
        cacheControl: '31536000',
        upsert: true,
      });
    if (upErr) return { ok: false, slug: job.slug, error: `upload: ${upErr.message}` };

    const { data: signed, error: signErr } = await supabase.storage
      .from('guia-ilustracoes')
      .createSignedUrl(storagePath, SIGNED_URL_TTL);
    if (signErr || !signed?.signedUrl) {
      return { ok: false, slug: job.slug, error: `sign: ${signErr?.message}` };
    }

    const { error: dbErr } = await supabase
      .from('place_illustrations')
      .upsert({
        slug: job.slug,
        kind: job.kind,
        descriptor: job.descriptor,
        illustration_url: signed.signedUrl,
        storage_path: storagePath,
      });
    if (dbErr) return { ok: false, slug: job.slug, error: `db: ${dbErr.message}` };

    return { ok: true, slug: job.slug, url: signed.signedUrl };
  } catch (e) {
    return { ok: false, slug: job.slug, error: (e as Error).message };
  }
}

async function runBatch(descriptors: Descriptor[], force: boolean) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const openaiKey = Deno.env.get('OPENAI_API_KEY')!;

  console.log(`[batch] starting ${descriptors.length} jobs (force=${force})`);
  let done = 0, skipped = 0, failed = 0;

  for (const job of descriptors) {
    if (!force) {
      const { data: existing } = await supabase
        .from('place_illustrations')
        .select('illustration_url')
        .eq('slug', job.slug)
        .maybeSingle();
      if (existing?.illustration_url) {
        skipped++;
        console.log(`[batch] SKIP ${job.slug} (${done + skipped + failed}/${descriptors.length})`);
        continue;
      }
    }
    const result = await generateOne(supabase, openaiKey, job);
    if (result.ok) {
      done++;
      console.log(`[batch] OK   ${job.slug} (${done + skipped + failed}/${descriptors.length})`);
    } else {
      failed++;
      console.error(`[batch] FAIL ${job.slug}: ${result.error}`);
    }
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
  console.log(`[batch] done. ok=${done} skipped=${skipped} failed=${failed}`);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const token = req.headers.get('x-batch-token');
  const expected = Deno.env.get('BATCH_TOKEN');
  if (!expected || token !== expected) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let body: { descriptors: Descriptor[]; force?: boolean };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (!Array.isArray(body.descriptors) || body.descriptors.length === 0) {
    return new Response(JSON.stringify({ error: 'descriptors[] required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // @ts-ignore EdgeRuntime is available in Supabase edge functions
  EdgeRuntime.waitUntil(runBatch(body.descriptors, body.force ?? false));

  return new Response(
    JSON.stringify({ ok: true, queued: body.descriptors.length, message: 'processing in background' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
