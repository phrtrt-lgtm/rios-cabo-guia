import { Car, Footprints } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DistanceBadgeProps {
  walkingMinutes: number | null;
  drivingMinutes: number | null;
  currentMode: 'walking' | 'driving';
  isFallback?: boolean;
  originAddress?: string;
}

export const DistanceBadge = ({
  walkingMinutes,
  drivingMinutes,
  currentMode,
  isFallback = false,
  originAddress,
}: DistanceBadgeProps) => {
  if (walkingMinutes === null || drivingMinutes === null) {
    return null;
  }

  const minutes = currentMode === 'walking' ? walkingMinutes : drivingMinutes;
  const Icon = currentMode === 'walking' ? Footprints : Car;
  const prefix = isFallback ? '~' : '';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/20 text-accent-foreground rounded-full text-xs font-medium border border-accent/30 hover:bg-accent/30 transition-colors">
            <Icon className="h-3.5 w-3.5" />
            <span>
              {prefix}{minutes} min
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">Estimativa a partir de:</p>
            <p className="text-sm text-muted-foreground">{originAddress || 'Ponto definido'}</p>
            {isFallback && (
              <p className="text-xs text-amber-500">~ Estimativa aproximada (offline)</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
