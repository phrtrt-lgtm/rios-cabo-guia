import { Camera, Clock, Lightbulb, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DistanceBadge } from './DistanceBadge';
import { useLanguage } from '@/contexts/LanguageContext';

interface PhotoSpotCardProps {
  name: string;
  city: string;
  bairro: string;
  bestWindow: string;
  angle: string;
  tip: string;
  mapsUrl: string;
  walkingMinutes: number | null;
  drivingMinutes: number | null;
  currentMode: 'walking' | 'driving';
  isFallback?: boolean;
  originAddress?: string;
}

export const PhotoSpotCard = ({
  name,
  city,
  bairro,
  bestWindow,
  angle,
  tip,
  mapsUrl,
  walkingMinutes,
  drivingMinutes,
  currentMode,
  isFallback,
  originAddress,
}: PhotoSpotCardProps) => {
  const { t } = useLanguage();

  const windowLabels: Record<string, string> = {
    'golden-sunrise': t("photospots.goldenSunrise"),
    'golden-sunset': t("photospots.goldenSunset"),
    'blue-hour': t("photospots.blueHour"),
    'golden-morning': t("photospots.goldenMorning"),
  };

  return (
    <article className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200">
      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
          <Camera className="w-7 h-7 sm:w-9 sm:h-9 text-primary" />
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

          <p className="text-xs text-muted-foreground mb-1.5 truncate">
            {city} • {bairro}
          </p>

          <Badge variant="secondary" className="w-fit text-[10px] py-0 px-1.5 h-5 rounded-full mb-2">
            <Clock className="h-2.5 w-2.5 mr-1" />
            {windowLabels[bestWindow] || bestWindow}
          </Badge>

          <p className="text-xs text-foreground/80 leading-snug line-clamp-2 mb-1">
            <span className="font-medium">{t("common.angle")}:</span> {angle}
          </p>

          <p className="hidden sm:flex items-start gap-1.5 text-[11px] text-muted-foreground leading-snug mb-2">
            <Lightbulb className="h-3 w-3 text-secondary mt-0.5 shrink-0" />
            <span className="line-clamp-2">{tip}</span>
          </p>

          <div className="mt-auto pt-1.5">
            <button
              onClick={() => window.open(mapsUrl, '_blank')}
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
