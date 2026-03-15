import { Camera, Clock, Lightbulb, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground">
              {city} • {bairro}
            </p>
          </div>
          <DistanceBadge
            walkingMinutes={walkingMinutes}
            drivingMinutes={drivingMinutes}
            currentMode={currentMode}
            isFallback={isFallback}
            originAddress={originAddress}
          />
        </div>

        <Badge variant="secondary" className="mb-4">
          <Clock className="h-3 w-3 mr-1" />
          {windowLabels[bestWindow] || bestWindow}
        </Badge>

        <div className="space-y-3 mb-4">
          <div className="flex gap-2 text-sm">
            <Camera className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <span className="font-medium">{t("common.angle")}:</span> {angle}
            </div>
          </div>

          <div className="flex gap-2 text-sm">
            <Lightbulb className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <span className="font-medium">{t("common.tip")}:</span> {tip}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => window.open(mapsUrl, '_blank')}
        >
          <MapPin className="h-4 w-4 mr-2" />
          {t("common.howToGet")}
        </Button>
      </CardContent>
    </Card>
  );
};
