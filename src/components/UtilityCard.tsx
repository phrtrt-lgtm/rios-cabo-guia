import { MapPin, Clock, Phone, ExternalLink, Info, ShoppingCart, Pill, Coffee, PawPrint, ShoppingBag } from "lucide-react";
import { ReactNode } from "react";
import { resolveUtilityImage } from "@/data/categoryImages";

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
  imageUrl?: string;
  imageCredit?: string;
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
  type,
  imageUrl,
  imageCredit,
  distanceBadge,
}: UtilityCardProps) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + address + ", Cabo Frio, RJ")}`;
  const whatsappUrl = phone.replace(/\D/g, '').length >= 10
    ? `https://wa.me/55${phone.replace(/\D/g, '')}`
    : null;

  const Icon = getIconForType(type);

  // Auto-resolve image from registry if not provided explicitly
  const resolved = !imageUrl ? resolveUtilityImage(name, type) : undefined;
  const finalImageUrl = imageUrl ?? resolved?.src;
  const finalImageCredit = imageCredit ?? resolved?.credit;

  return (
    <article className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200">
      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Thumbnail (photo or icon fallback) */}
        {imageUrl ? (
          <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-1 left-1 bg-background/80 backdrop-blur-sm rounded-full p-0.5">
              <Icon className="w-3 h-3 text-secondary" />
            </div>
            {imageCredit && (
              <span
                className="absolute bottom-0 left-0 right-0 px-1 py-0.5 text-[8px] leading-tight bg-black/50 text-white truncate"
                title={imageCredit}
              >
                {imageCredit.replace(/^Foto:\s*/, '').split('·')[0].trim()}
              </span>
            )}
          </div>
        ) : (
          <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-secondary/15 to-accent/15 flex items-center justify-center">
            <Icon className="w-7 h-7 sm:w-9 sm:h-9 text-secondary" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-display text-base sm:text-lg font-semibold text-primary leading-tight truncate">
              {name}
            </h4>
            {distanceBadge && <div className="flex-shrink-0">{distanceBadge}</div>}
          </div>

          <span className="inline-block w-fit px-2 py-0.5 bg-secondary/10 text-secondary-foreground text-[10px] rounded-full font-medium mb-1.5">
            {neighborhood}
          </span>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-snug mb-1.5">
            {description}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <MapPin className="w-3 h-3 text-secondary flex-shrink-0" />
            <span className="truncate">{address}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Clock className="w-3 h-3 text-secondary flex-shrink-0" />
            <span className="truncate">{hours}</span>
          </div>

          {phone && (
            <div className="flex items-center gap-1.5 text-xs mb-1">
              <Phone className="w-3 h-3 text-secondary flex-shrink-0" />
              {whatsappUrl ? (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                  {phone}
                </a>
              ) : (
                <span className="text-muted-foreground truncate">{phone}</span>
              )}
            </div>
          )}

          {tips && (
            <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground leading-snug mb-1.5">
              <Info className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{tips}</span>
            </p>
          )}

          <div className="mt-auto flex items-center gap-2 pt-1.5">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full hover:bg-secondary/90 transition-colors"
            >
              <MapPin className="w-3 h-3" /> Maps
            </a>
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" /> Site
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
