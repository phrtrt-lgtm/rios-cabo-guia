import { useState, useEffect } from 'react';
import { MapPin, Coffee, Sun, Moon, Navigation, FileText, Share2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DistanceBadge } from '@/components/DistanceBadge';
import { ETAResult } from '@/services/distance.service';
import { cn } from '@/lib/utils';

interface ItineraryPlace {
  id: string;
  name: string;
  category: 'beach' | 'cafe' | 'restaurant' | 'snack' | 'dessert' | 'landmark';
  bairro: string;
  lat: number;
  lng: number;
  description: string;
  links?: {
    maps?: string;
    website?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

interface QuickItineraryProps {
  origin: { lat: number; lng: number; address: string } | null;
  etas: ETAResult[];
  currentMode: 'walking' | 'driving';
  onRecalculateETA?: (places: ItineraryPlace[]) => void;
}

interface ItineraryStop {
  time: 'morning' | 'afternoon' | 'evening';
  label: string;
  icon: any;
  place: ItineraryPlace;
}

// Pool de lugares por bairro com curadoria
const placesByNeighborhood: Record<string, ItineraryPlace[]> = {
  'Braga': [
    {
      id: 'praia-do-forte',
      name: 'Praia do Forte',
      category: 'beach',
      bairro: 'Centro',
      lat: -22.8796,
      lng: -42.0109,
      description: 'Praia principal com infraestrutura completa e águas calmas.',
      links: { maps: 'https://goo.gl/maps/praiadoforte' }
    },
    {
      id: 'office-cafe-braga',
      name: 'Office Café',
      category: 'cafe',
      bairro: 'Braga',
      lat: -22.8834,
      lng: -42.0336,
      description: 'Cafés especiais e opções sem lactose em ambiente aconchegante.',
      links: { instagram: 'https://instagram.com/officecafe' }
    },
    {
      id: 'paelo-braga',
      name: 'Paelo Hamburgueria',
      category: 'restaurant',
      bairro: 'Braga',
      lat: -22.8798,
      lng: -42.0158,
      description: 'Burgers generosos com ingredientes de qualidade.',
      links: { instagram: 'https://instagram.com/paeloburger' }
    },
  ],
  'Vila Nova': [
    {
      id: 'praia-do-forte-vn',
      name: 'Praia do Forte',
      category: 'beach',
      bairro: 'Centro',
      lat: -22.8796,
      lng: -42.0109,
      description: 'Faixa de areia extensa com quiosques e mar calmo.',
      links: { maps: 'https://goo.gl/maps/praiadoforte' }
    },
    {
      id: 'bem-fresh-vn',
      name: 'Bem Fresh',
      category: 'snack',
      bairro: 'Vila Nova',
      lat: -22.8756,
      lng: -42.0221,
      description: 'Saladas, wraps e açaí em ambiente casual.',
      links: {}
    },
    {
      id: 'kento-vn',
      name: 'Kento Cozinha Oriental',
      category: 'restaurant',
      bairro: 'Centro',
      lat: -22.8775,
      lng: -42.0234,
      description: 'Japonês à la carte e rodízio tradicional.',
      links: {}
    },
  ],
  'Algodoal': [
    {
      id: 'ilha-do-japones-alg',
      name: 'Ilha do Japonês',
      category: 'beach',
      bairro: 'Praia do Forte',
      lat: -22.8833,
      lng: -42.0072,
      description: 'Águas cristalinas e rasas, acessível na maré baixa.',
      links: { maps: 'https://goo.gl/maps/ilhadojapones' }
    },
    {
      id: 'office-cafe-alg',
      name: 'Office Café',
      category: 'cafe',
      bairro: 'Braga',
      lat: -22.8834,
      lng: -42.0336,
      description: 'Cafés especiais e ambiente acolhedor.',
      links: { instagram: 'https://instagram.com/officecafe' }
    },
    {
      id: 'picanha-do-ze-alg',
      name: 'Picanha do Zé',
      category: 'restaurant',
      bairro: 'Centro',
      lat: -22.8784,
      lng: -42.0171,
      description: 'Ícone local da picanha na pedra.',
      links: {}
    },
  ],
  'Portinho': [
    {
      id: 'morro-da-guia-port',
      name: 'Morro da Guia',
      category: 'landmark',
      bairro: 'Praia do Forte',
      lat: -22.8847,
      lng: -42.0053,
      description: 'Mirante com vista 360° da cidade e oceano.',
      links: { maps: 'https://goo.gl/maps/morrodaguia' }
    },
    {
      id: 'los-crepes-port',
      name: 'Los Crepes',
      category: 'snack',
      bairro: 'Praia do Forte',
      lat: -22.8803,
      lng: -42.0112,
      description: 'Crepes doces e salgados com clima de praia.',
      links: {}
    },
    {
      id: 'oca-branca-port',
      name: 'Oca Branca',
      category: 'restaurant',
      bairro: 'Praia do Forte',
      lat: -22.8803,
      lng: -42.0112,
      description: 'Frutos do mar e vista para o mar.',
      links: {}
    },
  ],
  'Passagem': [
    {
      id: 'bairro-passagem-pass',
      name: 'Bairro da Passagem',
      category: 'landmark',
      bairro: 'Passagem',
      lat: -22.8819,
      lng: -41.9992,
      description: 'Casas coloridas, canal e charme à beira d\'água.',
      links: { maps: 'https://goo.gl/maps/passagem' }
    },
    {
      id: 'espaco-cafe-pass',
      name: 'Espaço Café',
      category: 'cafe',
      bairro: 'Ville Blanche',
      lat: -22.8799,
      lng: -42.0195,
      description: 'Bolos artesanais e ambiente charmoso.',
      links: {}
    },
    {
      id: 'lena-casa-italiana-pass',
      name: 'Leña Casa Italiana',
      category: 'restaurant',
      bairro: 'Passagem',
      lat: -22.8819,
      lng: -41.9992,
      description: 'Massas artesanais em ambiente contemporâneo.',
      links: {}
    },
    {
      id: 'fixi-kaiseki-pass',
      name: 'Fixi Kaiseki',
      category: 'dessert',
      bairro: 'Passagem',
      lat: -22.8819,
      lng: -41.9992,
      description: 'Menu sazonal do mar, reservas essenciais.',
      links: {}
    },
  ],
};

// Roteiros para Arraial do Cabo
const arraialItineraries: Record<string, ItineraryPlace[]> = {
  'Arraial Clássico': [
    {
      id: 'prainhas-pontal-atalaia',
      name: 'Prainhas do Pontal do Atalaia',
      category: 'beach',
      bairro: 'Atalaia',
      lat: -22.9661,
      lng: -42.0275,
      description: 'Mirantes e faixa de areia clara com águas cristalinas.',
      links: { maps: 'https://goo.gl/maps/prainhasponta' }
    },
    {
      id: 'cafe-arraial',
      name: 'Café Local',
      category: 'cafe',
      bairro: 'Centro',
      lat: -22.9656,
      lng: -42.0289,
      description: 'Café regional com vista para o mar.',
      links: {}
    },
    {
      id: 'praia-forno-arraial',
      name: 'Praia do Forno',
      category: 'beach',
      bairro: 'Forno',
      lat: -22.9686,
      lng: -42.0256,
      description: 'Trilha curta ou barco-táxi. Mar calmo e transparente.',
      links: { maps: 'https://goo.gl/maps/praiaforno' }
    },
    {
      id: 'fixi-arraial',
      name: 'FIXI Arraial',
      category: 'restaurant',
      bairro: 'Arraial',
      lat: -22.9703,
      lng: -42.0206,
      description: 'Cozinha do mar com proposta autoral.',
      links: {}
    },
  ],
  'Arraial Aventura': [
    {
      id: 'praia-forno-trekking',
      name: 'Trilha Praia do Forno',
      category: 'landmark',
      bairro: 'Forno',
      lat: -22.9686,
      lng: -42.0256,
      description: 'Trilha de 15-20min com vista incrível.',
      links: { maps: 'https://goo.gl/maps/trilhaforno' }
    },
    {
      id: 'snack-anjos',
      name: 'Lanche na Praia dos Anjos',
      category: 'snack',
      bairro: 'Praia dos Anjos',
      lat: -22.9703,
      lng: -42.0206,
      description: 'Quiosques com frutos do mar frescos.',
      links: {}
    },
    {
      id: 'passeio-barco-arraial',
      name: 'Passeio de Barco',
      category: 'landmark',
      bairro: 'Praia dos Anjos',
      lat: -22.9703,
      lng: -42.0206,
      description: 'Gruta Azul + Ilha do Farol (controle Marinha).',
      links: {}
    },
  ],
};

// Roteiros para Búzios
const buziosItineraries: Record<string, ItineraryPlace[]> = {
  'Búzios Clássico': [
    {
      id: 'azeda-azedinha',
      name: 'Praia Azeda & Azedinha',
      category: 'beach',
      bairro: 'Ossos',
      lat: -22.7556,
      lng: -41.8833,
      description: 'Praias cênicas, acesso por escadaria de 200+ degraus.',
      links: { maps: 'https://goo.gl/maps/azeda' }
    },
    {
      id: 'cafe-buzios-centro',
      name: 'Café no Centro',
      category: 'cafe',
      bairro: 'Centro',
      lat: -22.7472,
      lng: -41.8817,
      description: 'Cafés charmosos na região da Orla Bardot.',
      links: {}
    },
    {
      id: 'orla-bardot-walk',
      name: 'Orla Bardot',
      category: 'landmark',
      bairro: 'Centro',
      lat: -22.7472,
      lng: -41.8817,
      description: 'Passeio à beira-mar com estátuas e casario.',
      links: { maps: 'https://goo.gl/maps/orlabardot' }
    },
    {
      id: 'rua-pedras-jantar',
      name: 'Rua das Pedras',
      category: 'restaurant',
      bairro: 'Centro',
      lat: -22.7472,
      lng: -41.8844,
      description: 'Jantar em restaurantes charmosos e bares.',
      links: { maps: 'https://goo.gl/maps/ruapedras' }
    },
  ],
  'Búzios Pôr do Sol': [
    {
      id: 'geriba-manha',
      name: 'Praia de Geribá',
      category: 'beach',
      bairro: 'Geribá',
      lat: -22.7597,
      lng: -41.9383,
      description: 'Praia ampla, boa para surf e beach clubs.',
      links: { maps: 'https://goo.gl/maps/geriba' }
    },
    {
      id: 'ferradurinha-tarde',
      name: 'Ferradurinha',
      category: 'beach',
      bairro: 'Ferradurinha',
      lat: -22.7450,
      lng: -41.9086,
      description: 'Pequena enseada com águas calmas para SUP.',
      links: { maps: 'https://goo.gl/maps/ferradurinha' }
    },
    {
      id: 'porto-barra-sunset',
      name: 'Porto da Barra',
      category: 'restaurant',
      bairro: 'Manguinhos',
      lat: -22.7658,
      lng: -41.9281,
      description: 'Pôr do sol + jantar à beira-mar.',
      links: { maps: 'https://goo.gl/maps/portobarra' }
    },
  ],
};

const neighborhoodLabels: Record<string, string> = {
  // Cabo Frio
  'Braga': 'Braga',
  'Vila Nova': 'Vila Nova',
  'Algodoal': 'Algodoal',
  'Portinho': 'Portinho',
  'Passagem': 'Passagem',
  // Arraial do Cabo
  'Arraial Clássico': 'Arraial Clássico',
  'Arraial Aventura': 'Arraial Aventura',
  // Búzios
  'Búzios Clássico': 'Búzios Clássico',
  'Búzios Pôr do Sol': 'Búzios Pôr do Sol',
};

export const QuickItinerary = ({ origin, etas, currentMode }: QuickItineraryProps) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryStop[]>([]);

  const getETA = (placeId: string) => {
    return etas.find(eta => eta.placeId === placeId);
  };

  const generateItinerary = (neighborhood: string) => {
    // Verificar se é roteiro de Arraial ou Búzios
    const isArraial = neighborhood.startsWith('Arraial');
    const isBuzios = neighborhood.startsWith('Búzios');
    
    let places: ItineraryPlace[] = [];
    
    if (isArraial) {
      places = arraialItineraries[neighborhood] || [];
    } else if (isBuzios) {
      places = buziosItineraries[neighborhood] || [];
    } else {
      places = placesByNeighborhood[neighborhood] || [];
    }
    
    if (places.length === 0) return [];

    const stops: ItineraryStop[] = [];

    // Manhã: Praia/Ponto + Café
    const morningBeach = places.find(p => p.category === 'beach' || p.category === 'landmark');
    const morningCafe = places.find(p => p.category === 'cafe');

    if (morningBeach) {
      stops.push({
        time: 'morning',
        label: 'Passeio',
        icon: Sun,
        place: morningBeach,
      });
    }

    if (morningCafe) {
      stops.push({
        time: 'morning',
        label: 'Café',
        icon: Coffee,
        place: morningCafe,
      });
    }

    // Tarde: Lanche
    const afternoonSnack = places.find(p => p.category === 'snack');
    if (afternoonSnack) {
      stops.push({
        time: 'afternoon',
        label: 'Lanche',
        icon: Coffee,
        place: afternoonSnack,
      });
    }

    // Noite: Jantar + Sobremesa
    const eveningRestaurant = places.find(p => p.category === 'restaurant');
    const eveningDessert = places.find(p => p.category === 'dessert');

    if (eveningRestaurant) {
      stops.push({
        time: 'evening',
        label: 'Jantar',
        icon: Moon,
        place: eveningRestaurant,
      });
    }

    if (eveningDessert) {
      stops.push({
        time: 'evening',
        label: 'Sobremesa',
        icon: Moon,
        place: eveningDessert,
      });
    }

    return stops;
  };

  const handleNeighborhoodSelect = (neighborhood: string) => {
    setSelectedNeighborhood(neighborhood);
    const newItinerary = generateItinerary(neighborhood);
    setItinerary(newItinerary);
  };

  const handleOpenMaps = () => {
    if (itinerary.length === 0 || !origin) return;

    const waypoints = itinerary.map(stop => `${stop.place.lat},${stop.place.lng}`).join('|');
    const mode = currentMode === 'walking' ? 'walking' : 'driving';
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${itinerary[itinerary.length - 1].place.lat},${itinerary[itinerary.length - 1].place.lng}&waypoints=${waypoints}&travelmode=${mode}`;
    
    window.open(url, '_blank');
  };

  const handleExportPDF = () => {
    // Implementação simplificada - pode ser expandida
    window.print();
  };

  const handleShare = () => {
    if (!selectedNeighborhood) return;
    
    const url = new URL(window.location.href);
    url.searchParams.set('bairro', selectedNeighborhood);
    url.searchParams.set('modo', currentMode);
    if (origin) {
      url.searchParams.set('lat', origin.lat.toString());
      url.searchParams.set('lng', origin.lng.toString());
    }

    navigator.clipboard.writeText(url.toString());
    alert('Link copiado! Compartilhe seu roteiro.');
  };

  // Carregar roteiro de URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bairro = params.get('bairro');
    if (bairro && neighborhoodLabels[bairro]) {
      handleNeighborhoodSelect(bairro);
    }
  }, []);

  const groupedStops = {
    morning: itinerary.filter(s => s.time === 'morning'),
    afternoon: itinerary.filter(s => s.time === 'afternoon'),
    evening: itinerary.filter(s => s.time === 'evening'),
  };

  return (
    <div className="space-y-6">
      {/* Seletor de Bairro */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-foreground">Escolha seu destino</h3>
        
        {/* Cabo Frio */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2 font-medium">Cabo Frio</p>
          <div className="flex flex-wrap gap-2">
            {['Braga', 'Vila Nova', 'Algodoal', 'Portinho', 'Passagem'].map((key) => (
              <Button
                key={key}
                onClick={() => handleNeighborhoodSelect(key)}
                variant={selectedNeighborhood === key ? 'default' : 'outline'}
                size="sm"
                className="transition-all"
              >
                {neighborhoodLabels[key]}
              </Button>
            ))}
          </div>
        </div>

        {/* Arraial do Cabo */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2 font-medium">Arraial do Cabo</p>
          <div className="flex flex-wrap gap-2">
            {['Arraial Clássico', 'Arraial Aventura'].map((key) => (
              <Button
                key={key}
                onClick={() => handleNeighborhoodSelect(key)}
                variant={selectedNeighborhood === key ? 'default' : 'outline'}
                size="sm"
                className="transition-all"
              >
                {neighborhoodLabels[key]}
              </Button>
            ))}
          </div>
        </div>

        {/* Búzios */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2 font-medium">Búzios</p>
          <div className="flex flex-wrap gap-2">
            {['Búzios Clássico', 'Búzios Pôr do Sol'].map((key) => (
              <Button
                key={key}
                onClick={() => handleNeighborhoodSelect(key)}
                variant={selectedNeighborhood === key ? 'default' : 'outline'}
                size="sm"
                className="transition-all"
              >
                {neighborhoodLabels[key]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerta se não há origem */}
      {!origin && selectedNeighborhood && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
              Defina seu ponto de partida
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              Use o campo acima para calcular os tempos estimados do roteiro.
            </p>
          </div>
        </div>
      )}

      {/* Roteiro Gerado */}
      {selectedNeighborhood && itinerary.length > 0 && (
        <div className="space-y-6">
          {/* Manhã */}
          {groupedStops.morning.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-3 flex items-center gap-2 text-primary">
                <Sun className="h-5 w-5" /> Manhã
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {groupedStops.morning.map((stop, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-start justify-between gap-2">
                        <span className="flex-1">{stop.place.name}</span>
                        {origin && (
                          <DistanceBadge
                            walkingMinutes={getETA(stop.place.id)?.walkingMinutes || null}
                            drivingMinutes={getETA(stop.place.id)?.drivingMinutes || null}
                            currentMode={currentMode}
                            isFallback={getETA(stop.place.id)?.isFallback}
                            originAddress={origin.address}
                          />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">{stop.place.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {stop.place.links?.maps && (
                          <Button asChild variant="outline" size="sm">
                            <a href={stop.place.links.maps} target="_blank" rel="noopener noreferrer">
                              <MapPin className="h-3 w-3 mr-1" /> Como chegar
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tarde */}
          {groupedStops.afternoon.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-3 flex items-center gap-2 text-secondary">
                <Coffee className="h-5 w-5" /> Tarde
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {groupedStops.afternoon.map((stop, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-start justify-between gap-2">
                        <span className="flex-1">{stop.place.name}</span>
                        {origin && (
                          <DistanceBadge
                            walkingMinutes={getETA(stop.place.id)?.walkingMinutes || null}
                            drivingMinutes={getETA(stop.place.id)?.drivingMinutes || null}
                            currentMode={currentMode}
                            isFallback={getETA(stop.place.id)?.isFallback}
                            originAddress={origin.address}
                          />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">{stop.place.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {stop.place.links?.maps && (
                          <Button asChild variant="outline" size="sm">
                            <a href={stop.place.links.maps} target="_blank" rel="noopener noreferrer">
                              <MapPin className="h-3 w-3 mr-1" /> Como chegar
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Noite */}
          {groupedStops.evening.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-3 flex items-center gap-2 text-accent">
                <Moon className="h-5 w-5" /> Noite
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {groupedStops.evening.map((stop, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-start justify-between gap-2">
                        <span className="flex-1">{stop.place.name}</span>
                        {origin && (
                          <DistanceBadge
                            walkingMinutes={getETA(stop.place.id)?.walkingMinutes || null}
                            drivingMinutes={getETA(stop.place.id)?.drivingMinutes || null}
                            currentMode={currentMode}
                            isFallback={getETA(stop.place.id)?.isFallback}
                            originAddress={origin.address}
                          />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">{stop.place.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {stop.place.links?.maps && (
                          <Button asChild variant="outline" size="sm">
                            <a href={stop.place.links.maps} target="_blank" rel="noopener noreferrer">
                              <MapPin className="h-3 w-3 mr-1" /> Como chegar
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Ações do Roteiro */}
          <div className="sticky bottom-4 z-30 bg-background/95 backdrop-blur border border-border rounded-lg p-4 shadow-lg">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button onClick={handleOpenMaps} disabled={!origin} variant="default">
                <Navigation className="h-4 w-4 mr-2" />
                Abrir rota completa
              </Button>
              <Button onClick={handleExportPDF} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};