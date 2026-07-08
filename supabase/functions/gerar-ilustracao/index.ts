// Edge function: gerar-ilustracao
// Gera uma ilustração via Lovable AI Gateway (openai/gpt-image-2) e faz upload
// no bucket privado `guia-ilustracoes`, salvando um signed URL de 1 ano em
// `place_illustrations`. Protegida por header x-admin-token.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const STYLE_PROMPT = (descriptor: string) =>
  `Flat editorial travel illustration with subtle watercolor texture. Scene: ${descriptor}. ` +
  `Color palette strictly limited to: deep navy #1A3A52, terracotta orange #C8642A, soft blue #5DA3C9, warm off-white #FBFAF7, sand beige. ` +
  `Warm coastal daylight, gentle shadows. Composition: wide establishing view, no people in foreground, no text, no lettering, no logos, no borders. ` +
  `Consistent minimalist style as part of an illustration series for a boutique hospitality travel guide.`;

const SIGNED_URL_TTL = 60 * 60 * 24 * 365; // 1 year

interface RequestBody {
  slug: string;
  descriptor: string;
  kind?: string;
  force?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Admin gate
  const provided = req.headers.get('x-admin-token');
  const expected = Deno.env.get('ADMIN_TOKEN');
  if (!expected || !provided || provided !== expected) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const slug = (body.slug ?? '').trim().toLowerCase();
  const descriptor = (body.descriptor ?? '').trim();
  const kind = (body.kind ?? 'place').trim();

  if (!/^[a-z0-9-]{2,80}$/.test(slug)) {
    return new Response(JSON.stringify({ error: 'Invalid slug' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (descriptor.length < 8 || descriptor.length > 600) {
    return new Response(JSON.stringify({ error: 'Descriptor must be 8-600 chars' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Skip if already exists and not forcing
  if (!body.force) {
    const { data: existing } = await supabase
      .from('place_illustrations')
      .select('slug, illustration_url')
      .eq('slug', slug)
      .maybeSingle();
    if (existing?.illustration_url) {
      return new Response(
        JSON.stringify({ ok: true, skipped: true, slug, illustration_url: existing.illustration_url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
  }

  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) {
    return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 1. Generate image directly via OpenAI API (gpt-image-2)
  const genRes = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-2',
      prompt: STYLE_PROMPT(descriptor),
      size: '1024x1024',
      n: 1,
    }),
  });

  if (!genRes.ok) {
    const errBody = await genRes.text();
    console.error(`Image generation failed [${genRes.status}]: ${errBody}`);
    return new Response(
      JSON.stringify({ error: 'Image generation failed', status: genRes.status, details: errBody }),
      { status: genRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const genJson = await genRes.json() as { data?: Array<{ b64_json?: string }> };
  const b64 = genJson.data?.[0]?.b64_json;
  if (!b64) {
    return new Response(JSON.stringify({ error: 'No image data returned', raw: genJson }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 2. Upload PNG to bucket
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const storagePath = `${slug}.png`;
  const { error: upErr } = await supabase.storage
    .from('guia-ilustracoes')
    .upload(storagePath, bytes, {
      contentType: 'image/png',
      cacheControl: '31536000',
      upsert: true,
    });
  if (upErr) {
    return new Response(JSON.stringify({ error: 'Storage upload failed', details: upErr.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 3. Create signed URL (1 year — bucket is private per workspace policy)
  const { data: signed, error: signErr } = await supabase.storage
    .from('guia-ilustracoes')
    .createSignedUrl(storagePath, SIGNED_URL_TTL);
  if (signErr || !signed?.signedUrl) {
    return new Response(
      JSON.stringify({ error: 'Signed URL failed', details: signErr?.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  // 4. Upsert row
  const { error: dbErr } = await supabase
    .from('place_illustrations')
    .upsert({
      slug,
      kind,
      descriptor,
      illustration_url: signed.signedUrl,
      storage_path: storagePath,
    });
  if (dbErr) {
    return new Response(JSON.stringify({ error: 'DB upsert failed', details: dbErr.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({ ok: true, slug, illustration_url: signed.signedUrl, storage_path: storagePath }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
