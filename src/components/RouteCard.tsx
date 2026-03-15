import { MapPin, Droplet, Clock, TrendingUp, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  const paces = [
    { label: '5\'/km', time: (distance_km * 5).toFixed(0) },
    { label: '6\'/km', time: (distance_km * 6).toFixed(0) },
    { label: '7\'/km', time: (distance_km * 7).toFixed(0) },
  ];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{name}</CardTitle>
            <p className="text-sm text-muted-foreground">{city}</p>
          </div>
          <DistanceBadge
            walkingMinutes={walkingMinutes}
            drivingMinutes={drivingMinutes}
            currentMode={currentMode}
            isFallback={isFallback}
            originAddress={originAddress}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-lg font-semibold text-primary">{distance_km}km</div>
            <div className="text-xs text-muted-foreground">{t("common.distance")}</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-lg font-semibold text-primary">{gain_m}m</div>
            <div className="text-xs text-muted-foreground">{t("common.elevation")}</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-lg font-semibold text-primary line-clamp-1">{surface}</div>
            <div className="text-xs text-muted-foreground">{t("common.surface")}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{t("common.time")}:</span> {recommendedTime}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{t("common.start")}:</span> {startName}
          </div>

          {hydrationPoints.length > 0 && (
            <div className="flex items-start gap-2 text-sm">
              <Droplet className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">{t("common.hydration")}:</span>{' '}
                {hydrationPoints.map((p) => p.name).join(', ')}
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 text-sm text-amber-600">
            <TrendingUp className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium">{t("common.warnings")}:</span> {warnings}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">{t("common.estimatedPace")}:</p>
          <div className="flex gap-2">
            {paces.map((pace) => (
              <Badge key={pace.label} variant="outline" className="flex-1 justify-center">
                {pace.label}: {pace.time}min
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(startMapsUrl, '_blank')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {t("common.howToGet")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
