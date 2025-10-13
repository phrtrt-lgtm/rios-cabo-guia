import { MapPin, ExternalLink, Info, Star, Waves, Landmark, Mountain, Palmtree } from "lucide-react";

interface TouristCardProps {
  name: string;
  description: string;
  location: string;
  tips?: string;
  type?: 'beach' | 'landmark' | 'viewpoint' | 'island';
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
  type
}: TouristCardProps) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " Cabo Frio, RJ")}`;
  
  const Icon = getIconForType(type);
  const mockRating = (Math.random() * 0.5 + 4.2).toFixed(1);

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all">
      <div className="p-6">
        <div className="flex gap-4 mb-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Icon className="w-7 h-7 text-primary" />
            </div>
          </div>
          
          {/* Header */}
          <div className="flex-1 min-w-0">
            <h4 className="text-xl font-semibold text-primary mb-2">{name}</h4>
            {/* Star Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-foreground">{mockRating}</span>
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary underline ml-1"
              >
                (ver no Google)
              </a>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">{location}</span>
          </div>
        </div>

        {tips && (
          <div className="bg-accent/10 p-3 rounded-lg border border-accent/20 mb-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">{tips}</p>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <a 
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md hover:bg-secondary/90 transition-colors"
          >
            <MapPin className="w-3 h-3" /> Ver no Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};
