import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Cached across the app — one query on mount, then in-memory lookups.
let cache: Record<string, string> | null = null;
let inFlight: Promise<Record<string, string>> | null = null;

async function fetchAll(): Promise<Record<string, string>> {
  if (cache) return cache;
  if (inFlight) return inFlight;
  inFlight = (async () => {
    const { data, error } = await supabase
      .from('place_illustrations')
      .select('slug, illustration_url');
    if (error) {
      console.warn('[illustrations] fetch failed', error);
      return {};
    }
    const map: Record<string, string> = {};
    for (const row of data ?? []) {
      if (row.illustration_url) map[row.slug] = row.illustration_url;
    }
    cache = map;
    return map;
  })();
  return inFlight;
}

/**
 * Returns a { slug -> illustration_url } map. Loads once per session.
 * Cards call `getIllustration(slug)` and fall back to their current image /
 * icon when nothing is returned.
 */
export function useIllustrations() {
  const [map, setMap] = useState<Record<string, string>>(cache ?? {});
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let mounted = true;
    fetchAll().then((m) => {
      if (mounted) {
        setMap(m);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return {
    map,
    loading,
    getIllustration: (slug: string | undefined | null) =>
      (slug && map[slug]) || undefined,
  };
}
