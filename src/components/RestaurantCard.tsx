import { MapPin, Clock, DollarSign, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RestaurantCardProps {
  name: string;
  description: string;
  address: string;
  hours?: string;
  priceRange: string;
  link?: string;
  category: string;
}

export const RestaurantCard = ({ 
  name, 
  description, 
  address, 
  hours, 
  priceRange,
  link,
  category 
}: RestaurantCardProps) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ", Cabo Frio, RJ")}`;
  
  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-xl font-bold text-primary mb-1">{name}</h4>
            <span className="inline-block px-3 py-1 bg-accent/20 text-accent-foreground text-xs rounded-full">
              {category}
            </span>
          </div>
          <div className="flex items-center gap-1 text-secondary font-semibold">
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
              className="hover:text-primary underline"
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
          
          {link && (
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-primary" />
              <a 
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Ver menu/Instagram
              </a>
            </div>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mt-3 italic">
          Horários podem mudar — confirme no local ou link acima
        </p>
      </CardContent>
    </Card>
  );
};
