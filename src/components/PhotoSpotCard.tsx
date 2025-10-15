import { Camera, Clock, Aperture, Lightbulb, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DistanceBadge } from './DistanceBadge';

interface PhotoSpotCardProps {
  name: string;
  city: string;
  bairro: string;
  bestWindow: string;
  angle: string;
  lens: string;
  tip: string;
  mapsUrl: string;
  walkingMinutes: number | null;
  drivingMinutes: number | null;
  currentMode: 'walking' | 'driving';
  isFallback?: boolean;
  originAddress?: string;
}

const windowLabels: Record<string, string> = {
  'golden-sunrise': 'Golden Hour — Amanhecer',
  'golden-sunset': 'Golden Hour — Entardecer',
  'blue-hour': 'Blue Hour',
  'golden-morning': 'Golden Hour — Manhã',
};

export const PhotoSpotCard = ({
  name,
  city,
  bairro,
  bestWindow,
  angle,
  lens,
  tip,
  mapsUrl,
  walkingMinutes,
  drivingMinutes,
  currentMode,
  isFallback,
  originAddress,
}: PhotoSpotCardProps) => {
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
              <span className="font-medium">Ângulo:</span> {angle}
            </div>
          </div>

          <div className="flex gap-2 text-sm">
            <Aperture className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <span className="font-medium">Lente:</span> {lens}
            </div>
          </div>

          <div className="flex gap-2 text-sm">
            <Lightbulb className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <span className="font-medium">Dica:</span> {tip}
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
          Como chegar
        </Button>
      </CardContent>
    </Card>
  );
};
