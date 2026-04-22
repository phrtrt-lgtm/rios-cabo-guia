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
      <div className="sticky top-[57px] z-40 bg-background/90 backdrop-blur-xl border-b border-border/60">
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
                  className="w-full rounded-full px-5 h-11"
                />
              </div>
              <Button
                onClick={handleSetOrigin}
                disabled={isLoading}
                variant="default"
                size="sm"
                className="rounded-full h-11 px-5 font-display"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Definir base
              </Button>
              <Button
                onClick={handleUseMyLocation}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="rounded-full h-11 px-5 font-display"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Usar minha localização
              </Button>
            </div>

            {/* Origin card — gradient ocean com radius grande */}
            {currentOrigin && (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-5 md:p-6 shadow-lg">
                {/* Glow coral decorativo */}
                <div className="pointer-events-none absolute -top-20 -right-10 w-72 h-72 rounded-full bg-secondary/25 blur-3xl" />

                <div className="relative flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-[220px]">
                    <div className="w-11 h-11 rounded-2xl bg-white/15 grid place-items-center flex-shrink-0">
                      <MapPin className="h-5 w-5" style={{ color: 'hsl(var(--accent))' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-[11px] font-medium uppercase tracking-[0.14em] opacity-70 mb-0.5">
                        Sua origem
                      </div>
                      <div className="font-display text-base font-medium truncate">{currentOrigin}</div>
                    </div>
                    <Button
                      onClick={handleClearOrigin}
                      variant="ghost"
                      size="sm"
                      className="rounded-full h-8 px-3 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/15"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="flex gap-2 items-center">
                    <div className="flex gap-1 bg-white/10 p-1 rounded-full">
                      <Button
                        onClick={() => onModeChange('walking')}
                        size="sm"
                        className={`rounded-full h-8 px-4 font-display text-xs border-0 ${
                          currentMode === 'walking'
                            ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                            : 'bg-transparent text-primary-foreground hover:bg-white/15'
                        }`}
                      >
                        <Footprints className="h-3.5 w-3.5 mr-1" />
                        A pé
                      </Button>
                      <Button
                        onClick={() => onModeChange('driving')}
                        size="sm"
                        className={`rounded-full h-8 px-4 font-display text-xs border-0 ${
                          currentMode === 'driving'
                            ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                            : 'bg-transparent text-primary-foreground hover:bg-white/15'
                        }`}
                      >
                        <Car className="h-3.5 w-3.5 mr-1" />
                        Carro
                      </Button>
                    </div>

                    <Button
                      onClick={onSortByTime}
                      size="sm"
                      className="rounded-full h-8 px-4 font-display text-xs bg-white/10 text-primary-foreground hover:bg-white/20 border-0"
                    >
                      <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
                      Ordenar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
