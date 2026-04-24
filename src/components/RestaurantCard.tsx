import { MapPin, Clock, DollarSign, ExternalLink, Utensils } from "lucide-react";
import { ReactNode } from "react";

interface RestaurantCardProps {
  name: string;
  description: string;
  address: string;
  hours?: string;
  priceRange: string;
  link?: string;
  category: string;
  distanceBadge?: ReactNode;
}

export const RestaurantCard = ({
  name,
  description,
  address,
  hours,
  priceRange,
  link,
  category,
  distanceBadge,
}: RestaurantCardProps) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + address + ", Cabo Frio, RJ")}`;

  return (
    <article className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200">
      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center">
          <Utensils className="w-7 h-7 sm:w-9 sm:h-9 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-display text-base sm:text-lg font-semibold text-primary leading-tight truncate">
              {name}
            </h4>
            {distanceBadge && <div className="flex-shrink-0">{distanceBadge}</div>}
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="inline-block px-2 py-0.5 bg-accent/20 text-accent-foreground text-[10px] rounded-full">
              {category}
            </span>
            <span className="inline-flex items-center gap-0.5 text-secondary font-semibold text-xs">
              <DollarSign className="w-3 h-3" />
              {priceRange}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-snug mb-1.5">
            {description}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <MapPin className="w-3 h-3 text-secondary flex-shrink-0" />
            <span className="truncate">{address}</span>
          </div>

          {hours && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Clock className="w-3 h-3 text-secondary flex-shrink-0" />
              <span className="truncate">{hours}</span>
            </div>
          )}

          <div className="mt-auto flex items-center gap-2 pt-1.5">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium bg-primary text-primary-foreground px-2.5 py-1 rounded-full hover:bg-primary/90 transition-colors"
            >
              <MapPin className="w-3 h-3" /> Maps
            </a>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" /> Menu
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
