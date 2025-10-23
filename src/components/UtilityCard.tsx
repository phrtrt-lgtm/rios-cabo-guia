import { MapPin, Clock, Phone, ExternalLink, Info, ShoppingCart, Pill, Beef, Coffee, PawPrint, ShoppingBag } from "lucide-react";
import { ReactNode } from "react";
import { ReviewsSection } from "@/components/ReviewsSection";

interface UtilityCardProps {
  name: string;
  description: string;
  address: string;
  neighborhood: string;
  hours: string;
  phone: string;
  website?: string;
  tips?: string;
  image?: string;
  type?: 'pharmacy' | 'supermarket' | 'bakery' | 'petshop' | 'store';
  distanceBadge?: ReactNode;
}

const getIconForType = (type?: string) => {
  switch (type) {
    case 'pharmacy': return Pill;
    case 'supermarket': return ShoppingCart;
    case 'bakery': return Coffee;
    case 'petshop': return PawPrint;
    case 'store': return ShoppingBag;
    default: return ShoppingCart;
  }
};

export const UtilityCard = ({
  name,
  description,
  address,
  neighborhood,
  hours,
  phone,
  website,
  tips,
  image,
  type,
  distanceBadge
}: UtilityCardProps) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + address + ", Cabo Frio, RJ")}`;
  const whatsappUrl = phone.replace(/\D/g, '').length >= 10 
    ? `https://wa.me/55${phone.replace(/\D/g, '')}`
    : null;

  const Icon = getIconForType(type);

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all">
      <div className="p-6">
        <div className="flex gap-4 mb-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
              <Icon className="w-7 h-7 text-secondary" />
            </div>
          </div>
          
          {/* Header */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-primary mb-1">{name}</h4>
                <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary-foreground text-xs rounded-full font-medium">
                  {neighborhood}
                </span>
              </div>
              {distanceBadge && <div className="flex-shrink-0">{distanceBadge}</div>}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">{address}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
            <span className="text-muted-foreground">{hours}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
            {whatsappUrl ? (
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {phone} (WhatsApp)
              </a>
            ) : (
              <span className="text-muted-foreground">{phone}</span>
            )}
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
        
        <div className="flex gap-2 flex-wrap">
          <a 
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md hover:bg-secondary/90 transition-colors"
          >
            <MapPin className="w-3 h-3" /> Ver no Google Maps
          </a>
          {website && (
            <a 
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline px-3 py-1.5"
            >
              <ExternalLink className="w-3 h-3" /> Site
            </a>
          )}
        </div>

        <ReviewsSection placeName={name} address={address} />
      </div>
    </div>
  );
};
