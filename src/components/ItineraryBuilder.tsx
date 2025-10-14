import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, Clock, Trash2, ChevronUp, ChevronDown, ExternalLink, 
  Share2, FileDown, Navigation, Search, X, Calendar, Locate, Car, Footprints
} from 'lucide-react';
import { toast } from 'sonner';
import { touristPlaces, restaurantPlaces, arraialPlaces, buziosPlaces, allPlaces } from '@/data/places';
import { distanceService, PlaceCoords } from '@/services/distance.service';

interface ItineraryBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentOrigin?: { lat: number; lng: number; address: string } | null;
  currentEtas?: { [key: string]: { walking: number; driving: number; isFallback?: boolean } };
  currentMode?: 'walking' | 'driving';
}

interface ItineraryItem {
  placeId: string;
  placeName: string;
  category: string;
  bairro: string;
  lat: number;
  lng: number;
  duration: number;
  eta?: number;
  isFallback?: boolean;
}

interface DayItinerary {
  cafe: ItineraryItem[];
  manha: ItineraryItem[];
  almoco: ItineraryItem[];
  tarde: ItineraryItem[];
  fimDeTarde: ItineraryItem[];
  noite: ItineraryItem[];
  jantar: ItineraryItem[];
}

type TimeBlock = 'cafe' | 'manha' | 'almoco' | 'tarde' | 'fimDeTarde' | 'noite' | 'jantar';

const TIME_BLOCKS = {
  cafe: { label: 'Café', start: '07:00', end: '09:00', maxMinutes: 120 },
  manha: { label: 'Manhã', start: '09:00', end: '12:00', maxMinutes: 180 },
  almoco: { label: 'Almoço', start: '12:00', end: '14:00', maxMinutes: 120 },
  tarde: { label: 'Tarde', start: '14:00', end: '17:00', maxMinutes: 180 },
  fimDeTarde: { label: 'Fim de tarde', start: '17:00', end: '19:00', maxMinutes: 120 },
  noite: { label: 'Noite', start: '19:00', end: '21:00', maxMinutes: 120 },
  jantar: { label: 'Jantar', start: '21:00', end: '23:00', maxMinutes: 120 },
} as const;

const DEFAULT_DURATIONS: { [key: string]: number } = {
  beach: 150,
  island: 120,
  viewpoint: 60,
  landmark: 45,
  restaurant: 90,
  pharmacy: 15,
  supermarket: 30,
  store: 30,
  bakery: 20,
  petshop: 20,
};

const getCidade = (place: PlaceCoords): string => {
  if (arraialPlaces.some(p => p.id === place.id)) return 'Arraial do Cabo';
  if (buziosPlaces.some(p => p.id === place.id)) return 'Búzios';
  return 'Cabo Frio';
};

export const ItineraryBuilder = ({ 
  open, 
  onOpenChange,
  currentOrigin,
  currentEtas = {},
  currentMode = 'driving',
}: ItineraryBuilderProps) => {
  const [numDays, setNumDays] = useState(1);
  const [currentDay, setCurrentDay] = useState(1);
  const [currentTab, setCurrentTab] = useState<'itinerary' | 'places'>('itinerary');
  const [itineraries, setItineraries] = useState<DayItinerary[]>([]);
  const [origin, setOrigin] = useState(currentOrigin?.address || '');
  const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number } | null>(
    currentOrigin ? { lat: currentOrigin.lat, lng: currentOrigin.lng } : null
  );
  const [mode, setMode] = useState<'walking' | 'driving'>(currentMode);
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());
  const [targetDay, setTargetDay] = useState(1);
  const [targetBlock, setTargetBlock] = useState<TimeBlock>('manha');
  const [searchQuery, setSearchQuery] = useState('');
  const [placeTab, setPlaceTab] = useState<'cabo-frio' | 'restaurants' | 'arraial' | 'buzios'>('cabo-frio');

  // Inicializar itinerários
  useEffect(() => {
    const emptyDay: DayItinerary = {
      cafe: [],
      manha: [],
      almoco: [],
      tarde: [],
      fimDeTarde: [],
      noite: [],
      jantar: [],
    };
    const newItineraries = Array(numDays).fill(null).map(() => 
      JSON.parse(JSON.stringify(emptyDay))
    );
    setItineraries(newItineraries);
  }, [numDays]);

  // Atualizar origem e modo
  useEffect(() => {
    if (currentOrigin) {
      setOriginCoords({ lat: currentOrigin.lat, lng: currentOrigin.lng });
      setOrigin(currentOrigin.address);
    }
    setMode(currentMode);
  }, [currentOrigin, currentMode]);

  // Calcular ETA entre dois pontos
  const calculateETA = async (from: { lat: number; lng: number }, to: { lat: number; lng: number }): Promise<number> => {
    try {
      const results = await distanceService.batchCalculateETAs(from, [{
        id: 'temp',
        name: 'temp',
        category: 'temp',
        lat: to.lat,
        lng: to.lng,
      }]);
      
      return mode === 'walking' ? results[0]?.walkingMinutes || 0 : results[0]?.drivingMinutes || 0;
    } catch {
      return 0;
    }
  };

  // Adicionar lugares selecionados
  const handleAddSelected = async () => {
    if (selectedPlaces.size === 0) {
      toast.error('Selecione ao menos um lugar');
      return;
    }

    const placesToAdd = allPlaces.filter(p => selectedPlaces.has(p.id));
    const newItineraries = [...itineraries];
    const dayItinerary = newItineraries[targetDay - 1];
    const block = dayItinerary[targetBlock];

    for (const place of placesToAdd) {
      let eta = 0;
      let prevPoint = originCoords;
      
      if (block.length > 0) {
        const lastItem = block[block.length - 1];
        prevPoint = { lat: lastItem.lat, lng: lastItem.lng };
      }

      if (prevPoint) {
        eta = await calculateETA(prevPoint, { lat: place.lat, lng: place.lng });
      }

      const newItem: ItineraryItem = {
        placeId: place.id,
        placeName: place.name,
        category: place.category,
        bairro: place.bairro || getCidade(place),
        lat: place.lat,
        lng: place.lng,
        duration: DEFAULT_DURATIONS[place.category] || 60,
        eta,
        isFallback: currentEtas[place.id]?.isFallback,
      };

      block.push(newItem);
    }

    setItineraries(newItineraries);
    setSelectedPlaces(new Set());
    
    toast.success(`${placesToAdd.length} lugar(es) adicionado(s) ao ${TIME_BLOCKS[targetBlock].label}`);
  };

  // Adicionar lugar individual
  const handleAddPlace = async (place: PlaceCoords) => {
    const newItineraries = [...itineraries];
    const dayItinerary = newItineraries[targetDay - 1];
    const block = dayItinerary[targetBlock];

    let eta = 0;
    let prevPoint = originCoords;
    
    if (block.length > 0) {
      const lastItem = block[block.length - 1];
      prevPoint = { lat: lastItem.lat, lng: lastItem.lng };
    }

    if (prevPoint) {
      eta = await calculateETA(prevPoint, { lat: place.lat, lng: place.lng });
    }

    const newItem: ItineraryItem = {
      placeId: place.id,
      placeName: place.name,
      category: place.category,
      bairro: place.bairro || getCidade(place),
      lat: place.lat,
      lng: place.lng,
      duration: DEFAULT_DURATIONS[place.category] || 60,
      eta,
      isFallback: currentEtas[place.id]?.isFallback,
    };

    block.push(newItem);
    setItineraries(newItineraries);
    
    toast.success(`${place.name} adicionado ao ${TIME_BLOCKS[targetBlock].label}`);
  };

  // Remover item
  const handleRemoveItem = (dayIndex: number, blockKey: TimeBlock, itemIndex: number) => {
    const newItineraries = [...itineraries];
    newItineraries[dayIndex][blockKey].splice(itemIndex, 1);
    setItineraries(newItineraries);
    toast.success('Item removido');
  };

  // Mover item para cima
  const handleMoveUp = async (dayIndex: number, blockKey: TimeBlock, itemIndex: number) => {
    if (itemIndex === 0) return;
    
    const newItineraries = [...itineraries];
    const block = newItineraries[dayIndex][blockKey];
    
    [block[itemIndex], block[itemIndex - 1]] = [block[itemIndex - 1], block[itemIndex]];
    
    setItineraries(newItineraries);
    await recalculateBlockETAs(dayIndex, blockKey);
  };

  // Mover item para baixo
  const handleMoveDown = async (dayIndex: number, blockKey: TimeBlock, itemIndex: number) => {
    const block = itineraries[dayIndex][blockKey];
    if (itemIndex === block.length - 1) return;
    
    const newItineraries = [...itineraries];
    const newBlock = newItineraries[dayIndex][blockKey];
    
    [newBlock[itemIndex], newBlock[itemIndex + 1]] = [newBlock[itemIndex + 1], newBlock[itemIndex]];
    
    setItineraries(newItineraries);
    await recalculateBlockETAs(dayIndex, blockKey);
  };

  // Recalcular ETAs de um bloco
  const recalculateBlockETAs = async (dayIndex: number, blockKey: TimeBlock) => {
    const newItineraries = [...itineraries];
    const block = newItineraries[dayIndex][blockKey];
    if (block.length === 0 || !originCoords) return;

    for (let i = 0; i < block.length; i++) {
      const prevPoint = i === 0 ? originCoords : { lat: block[i - 1].lat, lng: block[i - 1].lng };
      const eta = await calculateETA(prevPoint, { lat: block[i].lat, lng: block[i].lng });
      block[i].eta = eta;
    }

    setItineraries(newItineraries);
  };

  // Atualizar duração
  const handleUpdateDuration = (dayIndex: number, blockKey: TimeBlock, itemIndex: number, newDuration: number) => {
    const newItineraries = [...itineraries];
    newItineraries[dayIndex][blockKey][itemIndex].duration = newDuration;
    setItineraries(newItineraries);
  };

  // Calcular tempo total do bloco
  const calculateBlockTime = (block: ItineraryItem[]): number => {
    return block.reduce((total, item) => total + (item.eta || 0) + item.duration, 0);
  };

  // Filtrar lugares
  const filterPlaces = (places: PlaceCoords[]) => {
    if (!searchQuery) return places;
    const query = searchQuery.toLowerCase();
    return places.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.bairro?.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  };

  // Usar localização atual
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOriginCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setOrigin('Minha localização');
        toast.success('Localização obtida!');
      },
      () => {
        toast.error('Erro ao obter localização');
      }
    );
  };

  // Renderizar tabela de seleção
  const renderPlacesTable = (places: PlaceCoords[]) => {
    const filtered = filterPlaces(places);
    
    return (
      <div className="space-y-4">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, bairro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={targetDay.toString()} onValueChange={(v) => setTargetDay(Number(v))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: numDays }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>Dia {i + 1}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={targetBlock} onValueChange={(v) => setTargetBlock(v as TimeBlock)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TIME_BLOCKS).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddSelected} disabled={selectedPlaces.size === 0}>
            Adicionar {selectedPlaces.size > 0 && `(${selectedPlaces.size})`}
          </Button>
        </div>

        <div className="border rounded-lg overflow-auto max-h-[500px]">
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="p-3 text-left w-12">
                  <Checkbox
                    checked={filtered.length > 0 && filtered.every(p => selectedPlaces.has(p.id))}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPlaces(new Set([...selectedPlaces, ...filtered.map(p => p.id)]));
                      } else {
                        const newSet = new Set(selectedPlaces);
                        filtered.forEach(p => newSet.delete(p.id));
                        setSelectedPlaces(newSet);
                      }
                    }}
                  />
                </th>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Local</th>
                <th className="p-3 text-left">Categoria</th>
                <th className="p-3 text-left">ETA</th>
                <th className="p-3 text-left">Duração</th>
                <th className="p-3 text-left w-32">Ação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((place) => {
                const eta = currentEtas[place.id]?.[mode] || 0;
                const defaultDuration = DEFAULT_DURATIONS[place.category] || 60;
                
                return (
                  <tr key={place.id} className="border-t hover:bg-muted/30">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedPlaces.has(place.id)}
                        onCheckedChange={(checked) => {
                          const newSet = new Set(selectedPlaces);
                          if (checked) {
                            newSet.add(place.id);
                          } else {
                            newSet.delete(place.id);
                          }
                          setSelectedPlaces(newSet);
                        }}
                      />
                    </td>
                    <td className="p-3 font-medium">{place.name}</td>
                    <td className="p-3 text-sm text-muted-foreground">{place.bairro || getCidade(place)}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">{place.category}</Badge>
                    </td>
                    <td className="p-3 text-sm">
                      {eta > 0 ? (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {currentEtas[place.id]?.isFallback && '~'}{eta} min
                        </span>
                      ) : '-'}
                    </td>
                    <td className="p-3 text-sm">{defaultDuration} min</td>
                    <td className="p-3">
                      <Button size="sm" variant="ghost" onClick={() => handleAddPlace(place)}>
                        Adicionar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Renderizar roteiro do dia
  const renderItinerary = () => {
    if (!itineraries[currentDay - 1]) return null;
    
    const dayItinerary = itineraries[currentDay - 1];
    
    return (
      <div className="space-y-6">
        {Object.entries(TIME_BLOCKS).map(([blockKey, { label, start, end, maxMinutes }]) => {
          const block = dayItinerary[blockKey as TimeBlock];
          const totalTime = calculateBlockTime(block);
          const isOvertime = totalTime > maxMinutes;
          
          return (
            <Card key={blockKey} className={isOvertime ? 'border-destructive' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{label}</h3>
                    <Badge variant="outline" className="text-xs">
                      {start} - {end}
                    </Badge>
                  </div>
                  <div className={`flex items-center gap-2 ${isOvertime ? 'text-destructive' : ''}`}>
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {totalTime} / {maxMinutes} min
                    </span>
                    {isOvertime && (
                      <Badge variant="destructive" className="text-xs">
                        Ajustar tempo
                      </Badge>
                    )}
                  </div>
                </div>

                {block.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Nenhum lugar adicionado neste bloco
                  </div>
                ) : (
                  <div className="space-y-2">
                    {block.map((item, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-background">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-primary" />
                              <h4 className="font-medium">{item.placeName}</h4>
                              <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.bairro}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Navigation className="w-3 h-3" />
                                {item.isFallback && '~'}{item.eta || 0} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <Select
                                  value={item.duration.toString()}
                                  onValueChange={(v) => handleUpdateDuration(currentDay - 1, blockKey as TimeBlock, index, Number(v))}
                                >
                                  <SelectTrigger className="h-6 w-20 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="30">30 min</SelectItem>
                                    <SelectItem value="45">45 min</SelectItem>
                                    <SelectItem value="60">60 min</SelectItem>
                                    <SelectItem value="90">90 min</SelectItem>
                                    <SelectItem value="120">120 min</SelectItem>
                                    <SelectItem value="180">180 min</SelectItem>
                                  </SelectContent>
                                </Select>
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMoveUp(currentDay - 1, blockKey as TimeBlock, index)}
                              disabled={index === 0}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMoveDown(currentDay - 1, blockKey as TimeBlock, index)}
                              disabled={index === block.length - 1}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveItem(currentDay - 1, blockKey as TimeBlock, index)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Construtor de Roteiro Rios</span>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Barra superior */}
        <div className="flex gap-4 items-center flex-wrap border-b pb-4">
          <div className="flex-1 min-w-[200px] flex gap-2">
            <Input
              placeholder="Digite o endereço da origem..."
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="icon" onClick={handleUseMyLocation}>
              <Locate className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={mode === 'walking' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('walking')}
            >
              <Footprints className="w-4 h-4 mr-1" />
              A pé
            </Button>
            <Button
              variant={mode === 'driving' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('driving')}
            >
              <Car className="w-4 h-4 mr-1" />
              Carro
            </Button>
          </div>

          <Select value={numDays.toString()} onValueChange={(v) => setNumDays(Number(v))}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Quantos dias?" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1} {i === 0 ? 'dia' : 'dias'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs principais */}
        <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as any)} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="places">Selecionar lugares</TabsTrigger>
            <TabsTrigger value="itinerary">Meu roteiro</TabsTrigger>
          </TabsList>

          {/* Aba Selecionar lugares */}
          <TabsContent value="places" className="flex-1 overflow-auto">
            <Tabs value={placeTab} onValueChange={(v) => setPlaceTab(v as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="cabo-frio">Praias & Pontos</TabsTrigger>
                <TabsTrigger value="restaurants">Restaurantes</TabsTrigger>
                <TabsTrigger value="arraial">Arraial</TabsTrigger>
                <TabsTrigger value="buzios">Búzios</TabsTrigger>
              </TabsList>

              <TabsContent value="cabo-frio" className="mt-4">
                {renderPlacesTable(touristPlaces)}
              </TabsContent>
              <TabsContent value="restaurants" className="mt-4">
                {renderPlacesTable(restaurantPlaces)}
              </TabsContent>
              <TabsContent value="arraial" className="mt-4">
                {renderPlacesTable(arraialPlaces)}
              </TabsContent>
              <TabsContent value="buzios" className="mt-4">
                {renderPlacesTable(buziosPlaces)}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Aba Meu roteiro */}
          <TabsContent value="itinerary" className="flex-1 overflow-auto">
            <div className="mb-4">
              <Tabs value={currentDay.toString()} onValueChange={(v) => setCurrentDay(Number(v))}>
                <TabsList>
                  {Array.from({ length: numDays }, (_, i) => (
                    <TabsTrigger key={i + 1} value={(i + 1).toString()}>
                      Dia {i + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            {renderItinerary()}
          </TabsContent>
        </Tabs>

        {/* Rodapé */}
        <div className="flex gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <div className="flex-1" />
          <Button variant="outline" disabled>
            <FileDown className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" disabled>
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="outline" disabled>
            <Navigation className="w-4 h-4 mr-2" />
            Maps
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};