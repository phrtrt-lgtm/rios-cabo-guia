/// <reference types="google.maps" />
import { useState, useEffect, useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        initAutocomplete();
        return;
      }

      const apiKey = distanceService.getApiKey();
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=pt-BR&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setTimeout(() => initAutocomplete(), 100);
      };
      script.onerror = () => {
        console.warn('Erro ao carregar Google Maps API. Autocomplete desabilitado.');
      };
      document.head.appendChild(script);
    };

    const initAutocomplete = () => {
      if (!inputRef.current) return;

      try {
        const caboFrioBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(-22.9200, -42.0600),
          new google.maps.LatLng(-22.8400, -41.9600)
        );

        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          bounds: caboFrioBounds,
          strictBounds: false,
          componentRestrictions: { country: 'br' },
          fields: ['formatted_address', 'geometry', 'name'],
          types: ['geocode', 'establishment'],
        });

        // Adicionar estilos ao container de sugestões
        const style = document.createElement('style');
        style.textContent = `
          .pac-container {
            z-index: 9999 !important;
            border-radius: 8px;
            margin-top: 4px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            border: 1px solid hsl(var(--border));
            background-color: hsl(var(--background));
          }
          .pac-item {
            padding: 8px 12px;
            cursor: pointer;
            color: hsl(var(--foreground));
            border-top: 1px solid hsl(var(--border));
          }
          .pac-item:first-child {
            border-top: none;
          }
          .pac-item:hover {
            background-color: hsl(var(--accent));
          }
          .pac-item-query {
            color: hsl(var(--foreground));
            font-weight: 500;
          }
          .pac-matched {
            font-weight: 700;
            color: hsl(var(--primary));
          }
        `;
        document.head.appendChild(style);

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          
          if (!place || !place.geometry || !place.geometry.location) {
            return;
          }

          const selectedAddress = place.formatted_address || place.name || '';
          const coords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: selectedAddress,
          };

          setAddress(selectedAddress);
          setCurrentOrigin(selectedAddress);
          onOriginSet(coords);
          
          toast({
            title: 'Ponto base definido',
            description: `Calculando distâncias a partir de: ${selectedAddress}`,
          });
        });
      } catch (error) {
        console.warn('Erro ao inicializar autocomplete:', error);
      }
    };

    loadGoogleMapsScript();

    return () => {
      if (autocompleteRef.current && typeof google !== 'undefined') {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onOriginSet, toast]);

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
                  ref={inputRef}
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
                Usar minha localização
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
