import { MapPin, Clock, DollarSign, ExternalLink, Utensils } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  distanceBadge
}: RestaurantCardProps) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + address + ", Cabo Frio, RJ")}`;
  
  return (
    <Card className="mb-4 hover:shadow-lg transition-all hover:border-primary/50">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Utensils className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-xl font-bold text-primary flex-1">{name}</h4>
                  {distanceBadge && <div className="flex-shrink-0">{distanceBadge}</div>}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-block px-3 py-1 bg-accent/20 text-accent-foreground text-xs rounded-full">
                    {category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-secondary font-semibold ml-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">{priceRange}</span>
              </div>
            </div>
        
            <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-foreground">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <a 
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline flex-1"
                >
                  {address}
                </a>
              </div>
              
              {hours && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{hours}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3 pt-2">
                <a 
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
                >
                  <MapPin className="w-3 h-3" /> Ver no Google Maps
                </a>
                {link && (
                  <a 
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> Menu/Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-3 italic">
          Horários podem mudar — confirme no Google Maps
        </p>
      </CardContent>
    </Card>
  );
};
