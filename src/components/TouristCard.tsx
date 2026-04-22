import { MapPin, ExternalLink, Info, Waves, Landmark, Mountain, Palmtree, Star } from "lucide-react";
import { ReactNode } from "react";

interface TouristCardProps {
  name: string;
  description: string;
  location: string;
  tips?: string;
  type?: 'beach' | 'landmark' | 'viewpoint' | 'island';
  distanceBadge?: ReactNode;
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
  distanceBadge
}: TouristCardProps) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " Cabo Frio, RJ")}`;
  
  const Icon = getIconForType(type);

  return (
    <div className="group bg-card rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/40 transition-all duration-300">
      {/* Visual header com gradient sutil + ETA badge no canto */}
      <div className="relative h-40 bg-gradient-to-br from-primary/10 via-muted to-accent/10 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <Icon className="w-20 h-20 text-primary" />
        </div>
        {/* Pílula com ícone tipo */}
        <div className="absolute top-4 left-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-xs font-display font-medium text-primary">
            <Icon className="w-3.5 h-3.5" />
            <span className="capitalize">{type || 'praia'}</span>
          </div>
        </div>
        {/* ETA no canto inferior direito */}
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
