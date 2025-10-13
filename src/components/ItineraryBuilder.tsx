import { useState } from 'react';
import { MapPin, Car, Footprints, Calendar, X, Download, Share2, Navigation as NavigationIcon, Grid3x3, List, GripVertical, Trash2, AlertCircle } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { touristPlaces, utilityPlaces, restaurantPlaces, arraialPlaces, buziosPlaces } from '@/data/places';
import { distanceService } from '@/services/distance.service';
import { useToast } from '@/hooks/use-toast';

interface ItineraryBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ItineraryItem {
  id: string;
  placeId: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  suggestedDuration: number;
}

interface DayItinerary {
  [blockId: string]: ItineraryItem[];
}

const TIME_BLOCKS = [
  { id: 'breakfast', label: 'Café', time: '07-09', duration: 120 },
  { id: 'morning', label: 'Manhã', time: '09-12', duration: 180 },
  { id: 'lunch', label: 'Almoço', time: '12-14', duration: 120 },
  { id: 'afternoon', label: 'Tarde', time: '14-17', duration: 180 },
  { id: 'late-afternoon', label: 'Fim de tarde', time: '17-19', duration: 120 },
  { id: 'evening', label: 'Noite', time: '19-21', duration: 120 },
  { id: 'dinner', label: 'Jantar', time: '21-23', duration: 120 },
];

const SUGGESTED_DURATIONS: Record<string, number> = {
  'cafe': 50,
  'beach': 150,
  'landmark': 45,
  'restaurant': 90,
  'boat-tour': 210,
  'trail': 120,
  'default': 60,
};

const getSuggestedDuration = (category: string): number => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('café') || lowerCategory.includes('cafe')) return 50;
  if (lowerCategory.includes('praia') || lowerCategory.includes('beach')) return 150;
  if (lowerCategory.includes('restaurante') || lowerCategory.includes('jantar') || lowerCategory.includes('almoço')) return 90;
  if (lowerCategory.includes('barco') || lowerCategory.includes('passeio')) return 210;
  if (lowerCategory.includes('trilha') || lowerCategory.includes('caminhada')) return 120;
  return SUGGESTED_DURATIONS['default'];
};

// Sortable Item Component
const SortableItineraryItem = ({ item, onRemove }: { item: ItineraryItem; onRemove: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card border border-border rounded-md p-2 flex items-center gap-2 group hover:border-accent transition-colors"
    >
      <div {...attributes} {...listeners} className="cursor-move touch-none">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-foreground truncate">{item.name}</div>
        <div className="text-xs text-muted-foreground">{item.suggestedDuration} min</div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-3 w-3 text-destructive" />
      </Button>
    </div>
  );
};

export const ItineraryBuilder = ({ open, onOpenChange }: ItineraryBuilderProps) => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('places');
  const [numberOfDays, setNumberOfDays] = useState('3');
  const [origin, setOrigin] = useState('');
  const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mode, setMode] = useState<'walking' | 'driving'>('driving');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTable, setActiveTable] = useState('cabo-beaches');
  const [maxItemsPerBlock, setMaxItemsPerBlock] = useState(2);
  
  // Itinerary state: Map<dayNumber, DayItinerary>
  const [itinerary, setItinerary] = useState<Map<number, DayItinerary>>(new Map());
  
  // Drag state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedPlace, setDraggedPlace] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts (better for mobile)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSetOrigin = async () => {
    if (!origin.trim()) {
      toast({
        title: 'Digite um endereço',
        description: 'Por favor, insira uma localização para definir como origem.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const coords = await distanceService.geocodeAddress(origin);
      setOriginCoords(coords);
      toast({
        title: 'Origem definida!',
        description: `Base definida em: ${origin}`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao definir origem',
        description: 'Não foi possível geocodificar o endereço. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocalização não suportada',
        description: 'Seu navegador não suporta geolocalização.',
        variant: 'destructive',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOriginCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setOrigin('Minha localização atual');
        toast({
          title: 'Localização obtida!',
          description: 'Usando sua localização atual como base.',
        });
      },
      (error) => {
        toast({
          title: 'Erro ao obter localização',
          description: 'Não foi possível acessar sua localização. Verifique as permissões.',
          variant: 'destructive',
        });
      }
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Check if dragging from places table
    const allAvailablePlaces = [...touristPlaces, ...utilityPlaces, ...restaurantPlaces, ...arraialPlaces, ...buziosPlaces];
    const place = allAvailablePlaces.find(p => p.name === active.id);
    if (place) {
      setDraggedPlace(place);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setDraggedPlace(null);
      return;
    }

    // Parse the droppable ID: format is "day-{dayNumber}-{blockId}"
    const overIdStr = String(over.id);
    const match = overIdStr.match(/^day-(\d+)-(.+)$/);
    
    if (match && draggedPlace) {
      const [, dayStr, blockId] = match;
      const dayNumber = parseInt(dayStr);
      
      // Get current day itinerary
      const dayItinerary = itinerary.get(dayNumber) || {};
      const blockItems = dayItinerary[blockId] || [];
      
      // Check limit
      if (blockItems.length >= maxItemsPerBlock) {
        toast({
          title: 'Limite atingido',
          description: `Este bloco já tem ${maxItemsPerBlock} ${maxItemsPerBlock === 1 ? 'item' : 'itens'}. Remova um item ou aumente o limite.`,
          variant: 'destructive',
        });
        setActiveId(null);
        setDraggedPlace(null);
        return;
      }
      
      // Create new item
      const newItem: ItineraryItem = {
        id: `${draggedPlace.name}-${Date.now()}`,
        placeId: draggedPlace.name,
        name: draggedPlace.name,
        category: draggedPlace.category || 'Geral',
        lat: draggedPlace.lat,
        lng: draggedPlace.lng,
        suggestedDuration: getSuggestedDuration(draggedPlace.category || ''),
      };
      
      // Add to block
      const updatedDayItinerary = {
        ...dayItinerary,
        [blockId]: [...blockItems, newItem],
      };
      
      const newItinerary = new Map(itinerary);
      newItinerary.set(dayNumber, updatedDayItinerary);
      setItinerary(newItinerary);
      
      toast({
        title: 'Local adicionado!',
        description: `${draggedPlace.name} adicionado ao roteiro.`,
      });
    }
    
    // Handle reordering within a block
    if (!draggedPlace && active.id !== over.id) {
      const activeIdStr = String(active.id);
      const overIdStr = String(over.id);
      
      // Find which day/block contains the active item
      for (const [dayNumber, dayItinerary] of itinerary.entries()) {
        for (const [blockId, items] of Object.entries(dayItinerary)) {
          const activeIndex = items.findIndex(item => item.id === activeIdStr);
          const overIndex = items.findIndex(item => item.id === overIdStr);
          
          if (activeIndex !== -1 && overIndex !== -1) {
            const reorderedItems = arrayMove(items, activeIndex, overIndex);
            const updatedDayItinerary = {
              ...dayItinerary,
              [blockId]: reorderedItems,
            };
            
            const newItinerary = new Map(itinerary);
            newItinerary.set(dayNumber, updatedDayItinerary);
            setItinerary(newItinerary);
            break;
          }
        }
      }
    }
    
    setActiveId(null);
    setDraggedPlace(null);
  };

  const removeItem = (dayNumber: number, blockId: string, itemId: string) => {
    const dayItinerary = itinerary.get(dayNumber);
    if (!dayItinerary) return;
    
    const blockItems = dayItinerary[blockId] || [];
    const updatedItems = blockItems.filter(item => item.id !== itemId);
    
    const updatedDayItinerary = {
      ...dayItinerary,
      [blockId]: updatedItems,
    };
    
    const newItinerary = new Map(itinerary);
    newItinerary.set(dayNumber, updatedDayItinerary);
    setItinerary(newItinerary);
  };

  const filterPlaces = (places: typeof touristPlaces) => {
    if (!searchQuery.trim()) return places;
    return places.filter((place) =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderPlacesTable = (places: typeof touristPlaces, title: string) => {
    const filtered = filterPlaces(places);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          <span className="text-sm text-muted-foreground">{filtered.length} locais</span>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/50 grid grid-cols-12 gap-4 p-3 text-sm font-medium text-muted-foreground">
            <div className="col-span-4">Nome</div>
            <div className="col-span-3">Bairro/Cidade</div>
            <div className="col-span-2">Categoria</div>
            <div className="col-span-2">Duração sug.</div>
            <div className="col-span-1">Ações</div>
          </div>
          
          <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
            {filtered.map((place) => {
              const suggestedDuration = getSuggestedDuration(place.category || '');
              
              return (
                <div
                  key={place.name}
                  id={place.name}
                  className="grid grid-cols-12 gap-4 p-3 hover:bg-muted/30 transition-colors cursor-move active:opacity-50 touch-none"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'copy';
                    setDraggedPlace(place);
                    setActiveId(place.name);
                  }}
                  onDragEnd={() => {
                    setActiveId(null);
                    setDraggedPlace(null);
                  }}
                >
                  <div className="col-span-4 font-medium text-foreground flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    {place.name}
                  </div>
                  <div className="col-span-3 text-sm text-muted-foreground">{place.category || 'N/A'}</div>
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {place.category || 'Geral'}
                  </div>
                  <div className="col-span-2 text-sm">
                    <Badge variant="secondary" className="text-xs">
                      {suggestedDuration} min
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    <Button variant="ghost" size="sm">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDayGrid = () => {
    const days = Array.from({ length: parseInt(numberOfDays) }, (_, i) => i + 1);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
          <Calendar className="h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            Arraste lugares das tabelas para os blocos de tempo abaixo. Você pode adicionar até {maxItemsPerBlock} {maxItemsPerBlock === 1 ? 'item' : 'itens'} por bloco.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMaxItemsPerBlock(maxItemsPerBlock === 2 ? 3 : 2)}
          >
            Limite: {maxItemsPerBlock} {maxItemsPerBlock === 1 ? 'item' : 'itens'}
          </Button>
        </div>

        <div className="space-y-8">
          {days.map((day) => {
            const dayItinerary = itinerary.get(day) || {};
            
            return (
              <div key={day} className="border border-border rounded-lg overflow-hidden">
                <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Dia {day}</h3>
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
                    Copiar dia
                  </Button>
                </div>
                
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
                  {TIME_BLOCKS.map((block) => {
                    const blockItems = dayItinerary[block.id] || [];
                    const isNearLimit = blockItems.length >= maxItemsPerBlock - 1;
                    const isAtLimit = blockItems.length >= maxItemsPerBlock;
                    
                    return (
                      <div
                        key={block.id}
                        id={`day-${day}-${block.id}`}
                        className={`border-2 border-dashed rounded-lg p-3 min-h-[200px] transition-colors ${
                          isAtLimit
                            ? 'border-destructive/50 bg-destructive/5'
                            : isNearLimit
                            ? 'border-accent/50 bg-accent/5'
                            : 'border-border hover:border-accent/50 bg-background'
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'copy';
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (!draggedPlace) return;
                          
                          if (blockItems.length >= maxItemsPerBlock) {
                            toast({
                              title: 'Limite atingido',
                              description: `Este bloco já tem ${maxItemsPerBlock} itens.`,
                              variant: 'destructive',
                            });
                            return;
                          }
                          
                          const newItem: ItineraryItem = {
                            id: `${draggedPlace.name}-${Date.now()}`,
                            placeId: draggedPlace.name,
                            name: draggedPlace.name,
                            category: draggedPlace.category || 'Geral',
                            lat: draggedPlace.lat,
                            lng: draggedPlace.lng,
                            suggestedDuration: getSuggestedDuration(draggedPlace.category || ''),
                          };
                          
                          const updatedDayItinerary = {
                            ...dayItinerary,
                            [block.id]: [...blockItems, newItem],
                          };
                          
                          const newItinerary = new Map(itinerary);
                          newItinerary.set(day, updatedDayItinerary);
                          setItinerary(newItinerary);
                          
                          toast({
                            title: 'Local adicionado!',
                            description: `${draggedPlace.name} adicionado ao ${block.label}.`,
                          });
                        }}
                      >
                        <div className="text-center mb-3">
                          <div className="font-semibold text-sm text-primary">{block.label}</div>
                          <div className="text-xs text-muted-foreground">{block.time}</div>
                          {isAtLimit && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              Limite atingido
                            </Badge>
                          )}
                        </div>
                        
                        <SortableContext items={blockItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-2 min-h-[120px]">
                            {blockItems.length === 0 ? (
                              <div className="text-xs text-muted-foreground text-center py-8">
                                Arraste lugares aqui
                              </div>
                            ) : (
                              blockItems.map((item) => (
                                <SortableItineraryItem
                                  key={item.id}
                                  item={item}
                                  onRemove={() => removeItem(day, block.id, item.id)}
                                />
                              ))
                            )}
                          </div>
                        </SortableContext>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] h-[95vh] p-0 gap-0">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-border">
            <DialogTitle className="text-2xl font-bold text-primary">
              Construtor de Roteiro Rios
            </DialogTitle>
            <p className="text-muted-foreground text-sm">
              Arraste lugares para os seus dias e crie seu roteiro personalizado
            </p>
          </DialogHeader>

          {/* Controls Bar */}
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[250px]">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Digite sua origem (hotel, pousada...)"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleSetOrigin} variant="secondary">
                Definir
              </Button>
              <Button size="sm" onClick={handleUseMyLocation} variant="outline" className="hidden sm:flex">
                Localização
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={mode === 'walking' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('walking')}
                className="gap-2"
              >
                <Footprints className="h-4 w-4" />
                <span className="hidden sm:inline">A pé</span>
              </Button>
              <Button
                variant={mode === 'driving' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('driving')}
                className="gap-2"
              >
                <Car className="h-4 w-4" />
                <span className="hidden sm:inline">Carro</span>
              </Button>
            </div>

            <Select value={numberOfDays} onValueChange={setNumberOfDays}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Dias" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n} {n === 1 ? 'dia' : 'dias'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b border-border px-6 bg-background">
                <TabsTrigger value="places" className="gap-2">
                  <List className="h-4 w-4" />
                  Selecionar lugares
                </TabsTrigger>
                <TabsTrigger value="itinerary" className="gap-2">
                  <Grid3x3 className="h-4 w-4" />
                  Meu roteiro
                </TabsTrigger>
              </TabsList>

              <TabsContent value="places" className="flex-1 overflow-y-auto p-6 m-0">
                <div className="space-y-6">
                  <Input
                    placeholder="Buscar lugares..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                  />

                  <Tabs value={activeTable} onValueChange={setActiveTable}>
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
                      <TabsTrigger value="cabo-beaches">Cabo Frio</TabsTrigger>
                      <TabsTrigger value="cabo-food">Restaurantes</TabsTrigger>
                      <TabsTrigger value="arraial">Arraial</TabsTrigger>
                      <TabsTrigger value="buzios">Búzios</TabsTrigger>
                    </TabsList>

                    <TabsContent value="cabo-beaches">
                      {renderPlacesTable([...touristPlaces, ...utilityPlaces], 'Praias & Pontos - Cabo Frio')}
                    </TabsContent>

                    <TabsContent value="cabo-food">
                      {renderPlacesTable(restaurantPlaces, 'Restaurantes & Cafés - Cabo Frio')}
                    </TabsContent>

                    <TabsContent value="arraial">
                      {renderPlacesTable(arraialPlaces, 'Arraial do Cabo')}
                    </TabsContent>

                    <TabsContent value="buzios">
                      {renderPlacesTable(buziosPlaces, 'Búzios')}
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>

              <TabsContent value="itinerary" className="flex-1 overflow-y-auto p-6 m-0">
                {renderDayGrid()}
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {originCoords ? (
                <span className="text-accent font-medium">✓ Origem definida</span>
              ) : (
                <span>Defina sua origem para ver tempos estimados</span>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 mr-2" />
                Fechar
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="secondary" size="sm" disabled>
                <NavigationIcon className="h-4 w-4 mr-2" />
                Maps
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <DragOverlay>
        {activeId && draggedPlace ? (
          <div className="bg-card border-2 border-accent rounded-md p-3 shadow-lg">
            <div className="font-medium text-sm">{draggedPlace.name}</div>
            <div className="text-xs text-muted-foreground">{draggedPlace.category}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
