import { useState } from 'react';
import { MapPin, Navigation, Car, Footprints, ArrowUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { distanceService } from '@/services/distance.service';
import { useToast } from '@/hooks/use-toast';

interface DistanceWidgetProps {
  onOriginSet: (origin: { lat: number; lng: number; address: string }) => void;
  onModeChange: (mode: 'walking' | 'driving') => void;
  onSortByTime: () => void;
  currentMode: 'walking' | 'driving';
  isLoading: boolean;
}

export const DistanceWidget = ({
  onOriginSet,
  onModeChange,
  onSortByTime,
  currentMode,
  isLoading,
}: DistanceWidgetProps) => {
  const [address, setAddress] = useState('');
  const [currentOrigin, setCurrentOrigin] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSetOrigin = async () => {
    if (!address.trim()) {
      toast({
        title: 'Endereço vazio',
        description: 'Digite um endereço para definir o ponto base.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const coords = await distanceService.geocodeAddress(address);
      if (coords) {
        setCurrentOrigin(address);
        onOriginSet({ ...coords, address });
        toast({
          title: 'Ponto base definido',
          description: `Calculando distâncias a partir de: ${address}`,
        });
      } else {
        toast({
          title: 'Endereço não encontrado',
          description: 'Não conseguimos encontrar esse endereço. Tente outro ponto (ex.: rua, bairro, local famoso).',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao processar endereço. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'GPS não disponível',
        description: 'Seu navegador não suporta geolocalização.',
        variant: 'destructive',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: 'Minha localização atual',
        };
        setCurrentOrigin('Minha localização atual');
        onOriginSet(coords);
        toast({
          title: 'Localização obtida',
          description: 'Calculando distâncias a partir da sua localização.',
        });
      },
      (error) => {
        let message = 'Não foi possível obter sua localização.';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Permissão de localização negada. Ative nas configurações do navegador.';
        }
        toast({
          title: 'Erro de localização',
          description: message,
          variant: 'destructive',
        });
      }
    );
  };

  const handleClearOrigin = () => {
    setCurrentOrigin(null);
    setAddress('');
  };

  return (
    <>
      <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <div className="flex flex-col gap-3">
            {/* Input e botões principais */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Digite um endereço em Cabo Frio..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSetOrigin()}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
              <Button
                onClick={handleSetOrigin}
                disabled={isLoading}
                variant="default"
                size="sm"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Definir base
              </Button>
              <Button
                onClick={handleUseMyLocation}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Usar GPS
              </Button>
            </div>

            {/* Status e controles */}
            {currentOrigin && (
              <div className="flex flex-wrap gap-2 items-center justify-between bg-accent/10 px-3 py-2 rounded-md">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-muted-foreground">
                    Base: <span className="font-medium text-foreground">{currentOrigin}</span>
                  </span>
                  <Button
                    onClick={handleClearOrigin}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Limpar
                  </Button>
                </div>

                <div className="flex gap-2 items-center">
                  {/* Toggle de modo */}
                  <div className="flex gap-1 bg-muted p-1 rounded-md">
                    <Button
                      onClick={() => onModeChange('walking')}
                      variant={currentMode === 'walking' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-7 px-3"
                    >
                      <Footprints className="h-4 w-4 mr-1" />
                      A pé
                    </Button>
                    <Button
                      onClick={() => onModeChange('driving')}
                      variant={currentMode === 'driving' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-7 px-3"
                    >
                      <Car className="h-4 w-4 mr-1" />
                      Carro
                    </Button>
                  </div>

                  {/* Ordenar */}
                  <Button
                    onClick={onSortByTime}
                    variant="outline"
                    size="sm"
                    className="h-7 px-3"
                  >
                    <ArrowUpDown className="h-4 w-4 mr-1" />
                    Ordenar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
