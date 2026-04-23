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
    <div className="group bg-card rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/40 transition-all duration-300">
      {/* Visual header — real photo when available, otherwise gradient with icon */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-gradient-to-br from-primary/10 via-muted to-accent/10">
        {hasPhoto ? (
          <>
            <img
              src={imageUrl}
              alt={`${name} — ${location}`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Subtle bottom gradient so badges remain readable */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <Icon className="w-20 h-20 text-primary" />
          </div>
        )}

        {/* Type pill */}
        <div className="absolute top-4 left-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/85 backdrop-blur-md border border-border/50 text-xs font-display font-medium text-primary shadow-sm">
            <Icon className="w-3.5 h-3.5" />
            <span className="capitalize">{type || 'praia'}</span>
          </div>
        </div>

        {/* Photo credit (very small, top-right) */}
        {hasPhoto && imageCredit && (
          <div className="absolute top-4 right-4 max-w-[60%] text-right">
            <span className="inline-block text-[10px] leading-tight text-white/90 bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded-full truncate">
              {imageCredit}
            </span>
          </div>
        )}

        {/* ETA bottom-right */}
        {distanceBadge && (
          <div className="absolute bottom-4 right-4">
            {distanceBadge}
          </div>
        )}
      </div>

      <div className="p-6">
        <h4 className="font-display text-2xl font-semibold text-primary mb-3 leading-tight">{name}</h4>
        
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
        
        <div className="flex items-start gap-2 text-sm mb-4">
          <MapPin className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
          <span className="text-muted-foreground">{location}</span>
        </div>

        {tips && (
          <div className="host-tip mb-4">
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0 fill-secondary" />
              <p className="text-sm text-foreground/80 leading-relaxed">
                <span className="host-tip-label mr-2">Dica do anfitrião</span>
                {tips}
              </p>
            </div>
          </div>
        )}
        
        <a 
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-display font-medium bg-secondary text-secondary-foreground px-4 py-2 rounded-full hover:bg-secondary/90 transition-colors"
        >
          <MapPin className="w-3 h-3" /> Ver no Google Maps
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
