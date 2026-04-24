import { MapPin, ExternalLink, Waves, Landmark, Mountain, Palmtree, Star } from "lucide-react";
import { ReactNode } from "react";

interface TouristCardProps {
  name: string;
  description: string;
  location: string;
  tips?: string;
  type?: 'beach' | 'landmark' | 'viewpoint' | 'island';
  distanceBadge?: ReactNode;
  imageUrl?: string;
  imageCredit?: string;
}

const getIconForType = (type?: string) => {
  switch (type) {
    case 'beach': return Waves;
    case 'island': return Palmtree;
    case 'landmark': return Landmark;
    case 'viewpoint': return Mountain;
    default: return Waves;
  }
};

export const TouristCard = ({
  name,
  description,
  location,
  tips,
  type,
  distanceBadge,
  imageUrl,
  imageCredit,
}: TouristCardProps) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " Cabo Frio, RJ")}`;

  const Icon = getIconForType(type);
  const hasPhoto = Boolean(imageUrl);

  return (
    <article className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200">
      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-muted to-accent/10">
          {hasPhoto ? (
            <img
              src={imageUrl}
              alt={`${name} — ${location}`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <Icon className="w-10 h-10 text-primary" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-display text-base sm:text-lg font-semibold text-primary leading-tight truncate">
              {name}
            </h4>
            {distanceBadge && <div className="flex-shrink-0">{distanceBadge}</div>}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
            <MapPin className="w-3 h-3 text-secondary flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-snug mb-2">
            {description}
          </p>

          {tips && (
            <p className="hidden sm:flex items-start gap-1.5 text-xs text-foreground/70 leading-snug mb-2">
              <Star className="w-3 h-3 text-secondary mt-0.5 flex-shrink-0 fill-secondary" />
              <span className="line-clamp-2">
                <span className="font-semibold uppercase tracking-wide text-[10px] text-secondary mr-1">Dica</span>
                {tips}
              </span>
            </p>
          )}

          <div className="mt-auto flex items-center justify-between gap-2">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full hover:bg-secondary/90 transition-colors"
            >
              <MapPin className="w-3 h-3" /> Maps
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            {hasPhoto && imageCredit && (
              <span className="hidden sm:inline-block text-[9px] text-muted-foreground/70 truncate max-w-[50%]">
                {imageCredit}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
