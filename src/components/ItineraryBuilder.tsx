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
  MapPin, Clock, Trash2, ChevronUp, ChevronDown, X,
  Share2, FileDown, Search, Calendar, Locate, Car, Footprints, Loader2, Route
} from 'lucide-react';
import { toast } from 'sonner';
import { touristPlaces, restaurantPlaces, arraialPlaces, buziosPlaces, allPlaces } from '@/data/places';
import { trails } from '@/data/trails';
import { photospots } from '@/data/photospots';
import { runningRoutes, extensionRoutes } from '@/data/routes';
import { distanceService, PlaceCoords } from '@/services/distance.service';
import { ItineraryPrintView } from './ItineraryPrintView';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  trail: 120,
  photospot: 30,
  route: 90,
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
  const [placeTab, setPlaceTab] = useState<'cabo-frio' | 'restaurants' | 'arraial' | 'buzios' | 'trilhas' | 'fotospots' | 'rotas'>('cabo-frio');
  const [isPrinting, setIsPrinting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

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

  // Recalcular TODAS as ETAs do dia inteiro - entre blocos consecutivos
  const recalculateAllDayETAs = async (dayIndex: number) => {
    if (!originCoords) {
      toast.error('Defina uma origem primeiro');
      return;
    }

    const newItineraries = [...itineraries];
    const dayItinerary = newItineraries[dayIndex];
    
    // Flatten todos os itens do dia em ordem
    const blockOrder: TimeBlock[] = ['cafe', 'manha', 'almoco', 'tarde', 'fimDeTarde', 'noite', 'jantar'];
    let previousPoint: { lat: number; lng: number } | null = originCoords;
    
    toast.info('Calculando distâncias entre os lugares...');
    
    for (const blockKey of blockOrder) {
      const block = dayItinerary[blockKey];
      
      for (let i = 0; i < block.length; i++) {
        const item = block[i];
        
        if (previousPoint) {
          const eta = await calculateETA(previousPoint, { lat: item.lat, lng: item.lng });
          block[i].eta = eta;
        }
        
        // O próximo ponto é este lugar atual
        previousPoint = { lat: item.lat, lng: item.lng };
      }
    }

    setItineraries(newItineraries);
    toast.success('Roteiro gerado com sucesso! Distâncias calculadas.');
  };

  // Gerar roteiro - recalcula ETAs do dia atual
  const handleGenerateItinerary = async () => {
    setIsCalculating(true);
    try {
      await recalculateAllDayETAs(currentDay - 1);
    } finally {
      setIsCalculating(false);
    }
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

  // Exportar roteiro como PDF usando html2canvas + jsPDF
  const handleExportPDF = async () => {
    const hasContent = itineraries.some(day => 
      Object.values(day).some(block => block.length > 0)
    );

    if (!hasContent) {
      toast.error('Adicione lugares ao roteiro antes de exportar');
      return;
    }

    setIsPrinting(true);
    toast.info('Gerando PDF do roteiro...');

    try {
      const printContainer = document.getElementById('itinerary-print-target');
      if (!printContainer) {
        throw new Error('Container de impressão não encontrado');
      }

      // Temporarily show the print container for capture
      printContainer.style.display = 'block';
      printContainer.style.position = 'absolute';
      printContainer.style.left = '-9999px';
      printContainer.style.top = '0';

      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pages = printContainer.querySelectorAll('.itinerary-page');
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, 297));
      }

      // Hide the container again
      printContainer.style.display = 'none';
      
      pdf.save(`roteiro-cabo-frio-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsPrinting(false);
    }
  };

  // Renderizar tabela de seleção
  const renderPlacesTable = (places: PlaceCoords[]) => {
    const filtered = filterPlaces(places);
    
    return (
      <div className="space-y-4">
        {/* Barra de ação com destino */}
        <div className="flex gap-3 items-center flex-wrap p-4 bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent rounded-xl border border-secondary/20">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <Input
              placeholder="Buscar por nome, bairro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-secondary/30 focus:border-secondary focus:ring-secondary/30"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground font-medium">Adicionar em:</span>
            <Select value={targetDay.toString()} onValueChange={(v) => setTargetDay(Number(v))}>
              <SelectTrigger className="w-28 border-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: numDays }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>Dia {i + 1}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={targetBlock} onValueChange={(v) => setTargetBlock(v as TimeBlock)}>
              <SelectTrigger className="w-36 border-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TIME_BLOCKS).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleAddSelected} 
            disabled={selectedPlaces.size === 0}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md"
          >
            Adicionar {selectedPlaces.size > 0 && `(${selectedPlaces.size})`}
          </Button>
        </div>

        <div className="border-2 border-secondary/20 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full table-fixed">
              <thead className="bg-gradient-to-r from-secondary/15 via-secondary/10 to-secondary/5 border-b-2 border-secondary/20 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 text-left w-12">
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
                      className="border-secondary data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                    />
                  </th>
                  <th className="px-3 py-3 text-left font-bold text-sm text-foreground w-[35%]">Nome</th>
                  <th className="px-3 py-3 text-left font-bold text-sm text-foreground w-[40%]">Descrição</th>
                  <th className="px-3 py-3 text-center font-bold text-sm text-foreground w-[13%]">Ação</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((place, idx) => {
                  const isSelected = selectedPlaces.has(place.id);
                  
                  return (
                    <tr 
                      key={place.id} 
                      className={`border-t border-border/30 transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-secondary/10 hover:bg-secondary/15' 
                          : idx % 2 === 0 
                            ? 'bg-background hover:bg-secondary/5' 
                            : 'bg-muted/20 hover:bg-secondary/5'
                      }`}
                      onClick={() => {
                        const newSet = new Set(selectedPlaces);
                        if (isSelected) {
                          newSet.delete(place.id);
                        } else {
                          newSet.add(place.id);
                        }
                        setSelectedPlaces(newSet);
                      }}
                    >
                      <td className="px-3 py-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            const newSet = new Set(selectedPlaces);
                            if (checked) {
                              newSet.add(place.id);
                            } else {
                              newSet.delete(place.id);
                            }
                            setSelectedPlaces(newSet);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="border-secondary data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div>
                          <span className={`font-medium text-sm ${isSelected ? 'text-secondary' : ''}`}>
                            {place.name}
                          </span>
                          <span className="block text-xs text-muted-foreground">{place.bairro}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs text-muted-foreground line-clamp-2">
                          {place.description || '-'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddPlace(place);
                          }}
                          className="h-7 text-xs bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground border-secondary/30"
                          variant="outline"
                        >
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
      </div>
    );
  };

  // Renderizar roteiro do dia em layout de colunas
  const renderItinerary = () => {
    if (!itineraries[currentDay - 1]) return null;
    
    const dayItinerary = itineraries[currentDay - 1];
    
    return (
      <div className="flex gap-3 overflow-x-auto pb-4 pt-2">
        {Object.entries(TIME_BLOCKS).map(([blockKey, { label, start, end, maxMinutes }]) => {
          const block = dayItinerary[blockKey as TimeBlock];
          const totalTime = calculateBlockTime(block);
          const isOvertime = totalTime > maxMinutes;
          const progressPercent = Math.min((totalTime / maxMinutes) * 100, 100);
          
          return (
            <Card 
              key={blockKey} 
              className={`flex flex-col h-full min-w-[200px] flex-shrink-0 border-2 transition-all ${
                isOvertime 
                  ? 'border-destructive/50 bg-destructive/5' 
                  : block.length > 0 
                    ? 'border-secondary/30 bg-secondary/5' 
                    : 'border-border/50 hover:border-secondary/20'
              }`}
            >
              <CardContent className="p-0 flex flex-col h-full">
                {/* Header do bloco */}
                <div className="p-3 border-b border-border/50 bg-gradient-to-r from-muted/50 to-transparent">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-foreground">{label}</h3>
                    <Badge 
                      variant="outline" 
                      className="text-[10px] font-medium bg-background/80 border-secondary/30"
                    >
                      {start} - {end}
                    </Badge>
                  </div>
                  {/* Barra de progresso */}
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${
                        isOvertime ? 'bg-destructive' : 'bg-secondary'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className={`flex items-center justify-between mt-1.5 text-[10px] ${
                    isOvertime ? 'text-destructive font-medium' : 'text-muted-foreground'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {totalTime}min usados
                    </span>
                    <span>{maxMinutes}min max</span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 p-2 overflow-auto">
                  {block.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-8">
                      <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-xs">Nenhum lugar</span>
                      <span className="text-[10px]">Adicione na aba "Selecionar"</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {block.map((item, index) => (
                        <div key={index}>
                          {/* Conector de deslocamento */}
                          {item.eta && item.eta > 0 && (
                            <div className="flex items-center gap-1.5 py-1.5 px-2">
                              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                              <span className="flex items-center gap-1 text-[10px] text-secondary font-medium bg-secondary/10 px-2 py-0.5 rounded-full">
                                {mode === 'driving' ? <Car className="w-3 h-3" /> : <Footprints className="w-3 h-3" />}
                                {item.isFallback && '~'}{item.eta}min
                              </span>
                              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                            </div>
                          )}
                          
                          {/* Card do lugar */}
                          <div className="border border-secondary/20 rounded-lg p-2.5 bg-background shadow-sm text-xs group relative hover:shadow-md hover:border-secondary/40 transition-all">
                            <div className="space-y-1.5">
                              <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                  <MapPin className="w-3 h-3 text-secondary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold leading-tight break-words text-foreground">{item.placeName}</h4>
                                  <p className="text-muted-foreground text-[10px]">{item.bairro}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground pl-8">
                                <span className="flex items-center gap-1 bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full font-medium">
                                  <Clock className="w-2.5 h-2.5" />
                                  <Select
                                    value={item.duration.toString()}
                                    onValueChange={(v) => handleUpdateDuration(currentDay - 1, blockKey as TimeBlock, index, Number(v))}
                                  >
                                    <SelectTrigger className="h-4 w-12 text-[10px] border-0 bg-transparent p-0 font-medium">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="30">30min</SelectItem>
                                      <SelectItem value="45">45min</SelectItem>
                                      <SelectItem value="60">1h</SelectItem>
                                      <SelectItem value="90">1h30</SelectItem>
                                      <SelectItem value="120">2h</SelectItem>
                                      <SelectItem value="180">3h</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  permanência
                                </span>
                              </div>
                            </div>
                              
                            <div className="absolute -right-1 -top-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                              <Button
                                size="sm"
                                className="h-5 w-5 p-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm"
                                onClick={() => handleMoveUp(currentDay - 1, blockKey as TimeBlock, index)}
                                disabled={index === 0}
                              >
                                <ChevronUp className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                className="h-5 w-5 p-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm"
                                onClick={() => handleMoveDown(currentDay - 1, blockKey as TimeBlock, index)}
                                disabled={index === block.length - 1}
                              >
                                <ChevronDown className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                className="h-5 w-5 p-0 bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm"
                                onClick={() => handleRemoveItem(currentDay - 1, blockKey as TimeBlock, index)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-background via-background to-secondary/5 p-0">
        {/* Header sofisticado */}
        <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground px-6 py-4">
          <DialogHeader className="p-0">
            <DialogTitle className="flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/90 flex items-center justify-center shadow-lg">
                  <Calendar className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Construtor de Roteiro</h2>
                  <p className="text-primary-foreground/70 text-sm font-normal">Monte sua experiência perfeita na Região dos Lagos</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onOpenChange(false)}
                className="text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Barra de configuração */}
        <div className="px-6 py-4 border-b border-secondary/20 bg-secondary/5">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-[200px] flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <Input
                  placeholder="Digite o endereço da origem..."
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="pl-10 border-secondary/30 focus:border-secondary focus:ring-secondary/30"
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleUseMyLocation}
                className="border-secondary/30 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all"
              >
                <Locate className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              <Button
                variant={mode === 'walking' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('walking')}
                className={mode === 'walking' 
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md' 
                  : 'hover:bg-secondary/10 text-muted-foreground'
                }
              >
                <Footprints className="w-4 h-4 mr-1.5" />
                A pé
              </Button>
              <Button
                variant={mode === 'driving' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('driving')}
                className={mode === 'driving' 
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md' 
                  : 'hover:bg-secondary/10 text-muted-foreground'
                }
              >
                <Car className="w-4 h-4 mr-1.5" />
                Carro
              </Button>
            </div>

            <Select value={numDays.toString()} onValueChange={(v) => setNumDays(Number(v))}>
              <SelectTrigger className="w-40 border-secondary/30 focus:ring-secondary/30">
                <Calendar className="w-4 h-4 mr-2 text-secondary" />
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
        </div>

        {/* Tabs principais */}
        <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as any)} className="flex-1 overflow-hidden flex flex-col px-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 mt-4">
            <TabsTrigger 
              value="places" 
              className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-md transition-all"
            >
              <Search className="w-4 h-4 mr-2" />
              Selecionar lugares
            </TabsTrigger>
            <TabsTrigger 
              value="itinerary"
              className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-md transition-all"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Meu roteiro
            </TabsTrigger>
          </TabsList>

          {/* Aba Selecionar lugares */}
          <TabsContent value="places" className="flex-1 overflow-auto">
            <Tabs value={placeTab} onValueChange={(v) => setPlaceTab(v as any)}>
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="cabo-frio">Praias</TabsTrigger>
                <TabsTrigger value="restaurants">Restaurantes</TabsTrigger>
                <TabsTrigger value="arraial">Arraial</TabsTrigger>
                <TabsTrigger value="buzios">Búzios</TabsTrigger>
                <TabsTrigger value="trilhas">Trilhas</TabsTrigger>
                <TabsTrigger value="fotospots">Foto-spots</TabsTrigger>
                <TabsTrigger value="rotas">Rotas</TabsTrigger>
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
              <TabsContent value="trilhas" className="mt-4">
                {renderPlacesTable(trails.map(t => ({
                  id: t.id,
                  name: t.name,
                  category: 'trail',
                  bairro: t.bairro || t.cidade,
                  lat: t.lat,
                  lng: t.lng,
                })))}
              </TabsContent>
              <TabsContent value="fotospots" className="mt-4">
                {renderPlacesTable(photospots.map(p => ({
                  id: p.id,
                  name: p.name,
                  category: 'photospot',
                  bairro: p.bairro || p.city,
                  lat: p.lat,
                  lng: p.lng,
                })))}
              </TabsContent>
              <TabsContent value="rotas" className="mt-4">
                {renderPlacesTable([...runningRoutes, ...extensionRoutes].map(r => ({
                  id: r.id,
                  name: r.name,
                  category: 'route',
                  bairro: r.city,
                  lat: r.start.lat,
                  lng: r.start.lng,
                })))}
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

        {/* Rodapé sofisticado */}
        <div className="flex gap-3 border-t border-secondary/20 px-6 py-4 bg-muted/30">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            Fechar
          </Button>
          <div className="flex-1" />
          <Button 
            onClick={handleGenerateItinerary}
            disabled={isCalculating}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md px-6"
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculando distâncias...
              </>
            ) : (
              <>
                <Route className="w-4 h-4 mr-2" />
                Gerar Roteiro
              </>
            )}
          </Button>
          <Button 
            variant="outline"
            onClick={() => toast.info('Compartilhamento em breve!')}
            className="border-secondary/30 hover:bg-secondary/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          <Button 
            onClick={handleExportPDF}
            disabled={isPrinting}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md px-6"
          >
            <FileDown className="w-4 h-4 mr-2" />
            {isPrinting ? 'Gerando roteiro...' : 'Exportar PDF'}
          </Button>
        </div>

        {/* Print View - Hidden container for PDF generation */}
        <div id="itinerary-print-target" style={{ display: 'none' }}>
          <ItineraryPrintView 
            itineraries={itineraries}
            origin={origin}
            mode={mode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};