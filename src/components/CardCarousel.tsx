import { Children, ReactNode, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardCarouselProps {
  children: ReactNode;
  /** Fixed width applied to each card in carousel mode (px). Default 280. */
  itemWidth?: number;
  /** Show the "Ver todos" toggle. Default true. */
  showExpand?: boolean;
  /** Label prefix, e.g. "Ver todos". */
  expandLabel?: string;
  className?: string;
}

/**
 * Wraps a list of cards in a horizontal snap carousel, with a "Ver todos (N)"
 * toggle that expands into a 2-column grid using the same cards.
 */
export const CardCarousel = ({
  children,
  itemWidth = 280,
  showExpand = true,
  expandLabel = "Ver todos",
  className,
}: CardCarouselProps) => {
  const [expanded, setExpanded] = useState(false);
  const items = Children.toArray(children);
  const count = items.length;

  if (count === 0) return null;

  return (
    <div className={cn("relative", className)}>
      {expanded ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((child, i) => (
            <div key={i} className="min-w-0">
              {child}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="rios-carousel flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 pb-2"
          role="list"
        >
          {items.map((child, i) => (
            <div
              key={i}
              role="listitem"
              className="snap-start shrink-0"
              style={{ width: `${itemWidth}px`, maxWidth: "85vw" }}
            >
              {child}
            </div>
          ))}
        </div>
      )}

      {showExpand && count > 1 && (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="tap-target inline-flex items-center gap-1 text-xs font-medium text-secondary hover:text-secondary/80 transition-colors px-2"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                Recolher
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                {expandLabel} ({count})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
