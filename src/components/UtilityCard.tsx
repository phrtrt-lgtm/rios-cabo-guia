import { MapPin, Clock, Phone, ExternalLink, Info } from "lucide-react";

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
}

export const UtilityCard = ({
  name,
  description,
  address,
  neighborhood,
  hours,
  phone,
  website,
  tips,
  image
}: UtilityCardProps) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ", Cabo Frio, RJ")}`;
  const whatsappUrl = phone.replace(/\D/g, '').length >= 10 
    ? `https://wa.me/55${phone.replace(/\D/g, '')}`
    : null;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
      {image && (
        <div className="relative h-48 overflow-hidden bg-muted">
          <img 
            src={image} 
            alt={`${name} - ${neighborhood}`}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
            {neighborhood}
          </span>
        </div>
      )}
      
      <div className="p-6">
        <h4 className="text-xl font-semibold text-primary mb-2">{name}</h4>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">{address}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-muted-foreground">{hours}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary flex-shrink-0" />
            {whatsappUrl ? (
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {phone}
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
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <MapPin className="w-3 h-3" /> Como chegar
          </a>
          {website && (
            <>
              <span className="text-muted-foreground">•</span>
              <a 
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" /> Site
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
