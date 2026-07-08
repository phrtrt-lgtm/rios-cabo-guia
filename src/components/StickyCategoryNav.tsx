import { useEffect, useRef } from "react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";

export interface CategoryNavItem {
  id: string;
  label: string;
}

interface StickyCategoryNavProps {
  items: CategoryNavItem[];
}

export const StickyCategoryNav = ({ items }: StickyCategoryNavProps) => {
  const activeId = useScrollSpy(
    items.map((i) => i.id),
    { offset: 96 }
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // auto-scroll active pill into view
  useEffect(() => {
    if (!activeId || !containerRef.current) return;
    const el = containerRef.current.querySelector<HTMLButtonElement>(
      `[data-nav-id="${activeId}"]`
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeId]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav
      className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 no-print"
      aria-label="Categorias"
    >
      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none px-4 py-2"
      >
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              data-nav-id={item.id}
              onClick={() => handleClick(item.id)}
              className={cn(
                "tap-target snap-start shrink-0 rounded-full px-4 h-11 inline-flex items-center justify-center",
                "font-sans text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors",
                active
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              )}
              aria-current={active ? "true" : undefined}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
