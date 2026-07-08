import { useEffect, useState } from "react";

/**
 * Observes a list of section IDs and returns the ID currently most visible in the viewport.
 * Uses IntersectionObserver with a top offset to account for a sticky nav bar.
 */
export function useScrollSpy(ids: string[], options?: { offset?: number }) {
  const offset = options?.offset ?? 80;
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    if (typeof window === "undefined" || ids.length === 0) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (elements.length === 0) return;

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target.id, entry.intersectionRatio);
        });
        // pick the id with the highest visible ratio
        let best: { id: string; ratio: number } | null = null;
        visibility.forEach((ratio, id) => {
          if (!best || ratio > best.ratio) best = { id, ratio };
        });
        if (best && best.ratio > 0) setActiveId(best.id);
      },
      {
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids.join("|"), offset]);

  return activeId;
}
