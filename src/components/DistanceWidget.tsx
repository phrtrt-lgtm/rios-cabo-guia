import { useState, useEffect } from 'react';
import { MapPin, Navigation, Car, Footprints, ArrowUpDown, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { distanceService } from '@/services/distance.service';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = distanceService.getApiKey();
    if (savedKey) {
      setTempApiKey(savedKey);
    }
  }, []);

  const handleSetOrigin = async () => {
    if (!address.trim()) {
      toast({
        title: 'Endereço vazio',
        description: 'Digite um endereço para definir o ponto base.',
        variant: 'destructive',
      });
      return;
    }

    const apiKey = distanceService.getApiKey();
    if (!apiKey) {
      setShowApiKeyDialog(true);
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
    const apiKey = distanceService.getApiKey();
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }

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

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      distanceService.setApiKey(tempApiKey.trim());
      setShowApiKeyDialog(false);
      toast({
        title: 'Chave salva',
        description: 'Agora você pode calcular distâncias.',
      });
    }
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
              <Button
                onClick={() => setShowApiKeyDialog(true)}
                variant="ghost"
                size="sm"
                title="Configurar chave da API"
              >
                <Settings className="h-4 w-4" />
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

      {/* Dialog para chave da API */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Google Maps API</DialogTitle>
            <DialogDescription>
              Para calcular distâncias, você precisa de uma chave da API do Google Maps.
              Obtenha gratuitamente em:{' '}
              <a
                href="https://console.cloud.google.com/google/maps-apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Google Cloud Console
              </a>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Cole sua chave da API aqui"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              type="password"
            />
            <Button onClick={handleSaveApiKey} className="w-full">
              Salvar chave
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
