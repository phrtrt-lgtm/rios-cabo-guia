import { MapPin, Clock, Mountain, Sun, AlertTriangle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DistanceBadge } from '@/components/DistanceBadge';
import { Trail } from '@/data/trails';
import { useLanguage } from '@/contexts/LanguageContext';

interface TrailCardProps {
  trail: Trail;
  walkingMinutes: number | null;
  drivingMinutes: number | null;
  currentMode: 'walking' | 'driving';
  isFallback?: boolean;
  originAddress?: string;
}

const difficultyColors: Record<string, string> = {
  'Fácil': 'bg-green-500/10 text-green-700 border-green-500/30',
  'Fácil-Moderado': 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
  'Moderado': 'bg-orange-500/10 text-orange-700 border-orange-500/30',
};

export const TrailCard = ({
  trail,
  walkingMinutes,
  drivingMinutes,
  currentMode,
  isFallback = false,
  originAddress,
}: TrailCardProps) => {
  const { t } = useLanguage();

  return (
    <article className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200">
      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-muted to-accent/10">
          {trail.imageUrl ? (
            <img
              src={trail.imageUrl}
              alt={`${trail.name} - ${trail.cidade}`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <Mountain className="w-10 h-10 text-primary" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display text-base sm:text-lg font-semibold text-primary leading-tight truncate">
              {trail.name}
            </h3>
            {(walkingMinutes !== null || drivingMinutes !== null) && (
              <div className="flex-shrink-0">
                <DistanceBadge
                  walkingMinutes={walkingMinutes}
                  drivingMinutes={drivingMinutes}
                  currentMode={currentMode}
                  isFallback={isFallback}
                  originAddress={originAddress}
                />
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground mb-1.5 truncate">
            {trail.cidade}{trail.bairro ? ` • ${trail.bairro}` : ''}
          </p>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-snug mb-2">
            {trail.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge variant="outline" className="gap-1 text-[10px] py-0 px-1.5 h-5 rounded-full">
              <Clock className="h-2.5 w-2.5" />
              {trail.timeTotal}
            </Badge>
            <Badge variant="outline" className={`${difficultyColors[trail.difficulty]} text-[10px] py-0 px-1.5 h-5 rounded-full gap-1`}>
              <Mountain className="h-2.5 w-2.5" />
              {trail.difficulty}
            </Badge>
            <Badge variant="outline" className="gap-1 text-[10px] py-0 px-1.5 h-5 rounded-full">
              <Sun className="h-2.5 w-2.5" />
              {trail.exposure}
            </Badge>
          </div>

          <p className="hidden sm:flex items-start gap-1.5 text-[11px] text-muted-foreground leading-snug mb-2">
            <AlertTriangle className="h-3 w-3 text-secondary mt-0.5 shrink-0" />
            <span className="line-clamp-2">{trail.alerts}</span>
          </p>

          <div className="mt-auto pt-1.5">
            <a
              href={trail.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full hover:bg-secondary/90 transition-colors"
            >
              <MapPin className="w-3 h-3" /> {t("common.howToGet")}
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
