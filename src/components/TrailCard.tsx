import { MapPin, Clock, Mountain, Sun, AlertTriangle, ExternalLink, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DistanceBadge } from '@/components/DistanceBadge';
import { Trail } from '@/data/trails';

interface TrailCardProps {
  trail: Trail;
  walkingMinutes: number | null;
  drivingMinutes: number | null;
  currentMode: 'walking' | 'driving';
  isFallback?: boolean;
  originAddress?: string;
  onAddToItinerary?: (trail: Trail) => void;
}

const difficultyColors = {
  'Fácil': 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
  'Fácil-Moderado': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  'Moderado': 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
};

export const TrailCard = ({
  trail,
  walkingMinutes,
  drivingMinutes,
  currentMode,
  isFallback = false,
  originAddress,
  onAddToItinerary,
}: TrailCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {trail.imageUrl && (
        <div className="aspect-[3/2] overflow-hidden bg-muted">
          <img
            src={trail.imageUrl}
            alt={`Vista da trilha ${trail.name} em ${trail.cidade}`}
            className="w-full h-full object-cover"
          />
          {trail.imageCredit && (
            <p className="text-xs text-muted-foreground px-3 py-1 bg-background/80 backdrop-blur-sm">
              {trail.imageCredit}
            </p>
          )}
        </div>
      )}
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-1">
            {trail.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {trail.cidade}{trail.bairro ? ` • ${trail.bairro}` : ''}
          </p>
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed">
          {trail.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {trail.timeTotal}
          </Badge>
          <Badge variant="outline" className={difficultyColors[trail.difficulty]}>
            <Mountain className="h-3.5 w-3.5" />
            {trail.difficulty}
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <Sun className="h-3.5 w-3.5" />
            {trail.exposure}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-foreground">🎁 Recompensa: </span>
            <span className="text-muted-foreground">{trail.reward}</span>
          </div>
          <div>
            <span className="font-medium text-foreground">⏰ Melhor horário: </span>
            <span className="text-muted-foreground">{trail.bestTime}</span>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">{trail.alerts}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          {(walkingMinutes !== null || drivingMinutes !== null) && (
            <DistanceBadge
              walkingMinutes={walkingMinutes}
              drivingMinutes={drivingMinutes}
              currentMode={currentMode}
              isFallback={isFallback}
              originAddress={originAddress}
            />
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
          >
            <a
              href={trail.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              Como chegar
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          
          {onAddToItinerary && (
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => onAddToItinerary(trail)}
            >
              <Plus className="h-4 w-4" />
              Adicionar ao roteiro
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
