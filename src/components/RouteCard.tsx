import { MapPin, Droplet, Clock, TrendingUp, Route as RouteIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DistanceBadge } from './DistanceBadge';
import { useLanguage } from '@/contexts/LanguageContext';

interface RouteCardProps {
  name: string;
  city: string;
  distance_km: number;
  gain_m: number;
  surface: string;
  description: string;
  startName: string;
  startMapsUrl: string;
  hydrationPoints: { name: string }[];
  recommendedTime: string;
  warnings: string;
  walkingMinutes: number | null;
  drivingMinutes: number | null;
  currentMode: 'walking' | 'driving';
  isFallback?: boolean;
  originAddress?: string;
}

export const RouteCard = ({
  name,
  city,
  distance_km,
  gain_m,
  surface,
  description,
  startName,
  startMapsUrl,
  hydrationPoints,
  recommendedTime,
  warnings,
  walkingMinutes,
  drivingMinutes,
  currentMode,
  isFallback,
  originAddress,
}: RouteCardProps) => {
  const { t } = useLanguage();

  return (
    <article className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200">
      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center">
          <RouteIcon className="w-7 h-7 sm:w-9 sm:h-9 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display text-base sm:text-lg font-semibold text-primary leading-tight truncate">
              {name}
            </h3>
            <DistanceBadge
              walkingMinutes={walkingMinutes}
              drivingMinutes={drivingMinutes}
              currentMode={currentMode}
              isFallback={isFallback}
              originAddress={originAddress}
            />
          </div>

          <p className="text-xs text-muted-foreground mb-1.5 truncate">{city}</p>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-snug mb-2">
            {description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-5 rounded-full">
              {distance_km}km
            </Badge>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-5 rounded-full">
              ↑{gain_m}m
            </Badge>
            <Badge variant="outline" className="gap-1 text-[10px] py-0 px-1.5 h-5 rounded-full">
              <Clock className="h-2.5 w-2.5" />
              {recommendedTime}
            </Badge>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-5 rounded-full line-clamp-1">
              {surface}
            </Badge>
          </div>

          <p className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground leading-snug mb-1">
            <MapPin className="w-3 h-3 text-secondary shrink-0" />
            <span className="truncate"><span className="font-medium">{t("common.start")}:</span> {startName}</span>
          </p>

          {hydrationPoints.length > 0 && (
            <p className="hidden sm:flex items-start gap-1.5 text-[11px] text-muted-foreground leading-snug mb-1">
              <Droplet className="w-3 h-3 text-secondary shrink-0 mt-0.5" />
              <span className="line-clamp-1">{hydrationPoints.map((p) => p.name).join(', ')}</span>
            </p>
          )}

          {warnings && (
            <p className="flex items-start gap-1.5 text-[11px] text-secondary leading-snug mb-2">
              <TrendingUp className="w-3 h-3 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{warnings}</span>
            </p>
          )}

          <div className="mt-auto pt-1.5">
            <button
              onClick={() => window.open(startMapsUrl, '_blank')}
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full hover:bg-secondary/90 transition-colors"
            >
              <MapPin className="w-3 h-3" /> {t("common.howToGet")}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
