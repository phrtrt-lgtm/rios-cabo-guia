/// <reference types="google.maps" />
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [itineraries, setItineraries] = useState<ItineraryItem[][]>([]);
  const [startTimes, setStartTimes] = useState<string[]>(['08:00']); // Horário inicial de cada dia
  const [origin, setOrigin] = useState(currentOrigin?.address || '');
  const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number } | null>(
    currentOrigin ? { lat: currentOrigin.lat, lng: currentOrigin.lng } : null
  );
  const [mode, setMode] = useState<'walking' | 'driving'>(currentMode);
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());
  const [targetDay, setTargetDay] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeTab, setPlaceTab] = useState<'cabo-frio' | 'restaurants' | 'arraial' | 'buzios' | 'trilhas' | 'fotospots' | 'rotas'>('cabo-frio');
  const [isPrinting, setIsPrinting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const originInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Inicializar Google Places Autocomplete
  useEffect(() => {
    if (!open) return;

    const initAutocomplete = () => {
      if (!originInputRef.current) return;

      try {
        const caboFrioBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(-22.9200, -42.0600),
          new google.maps.LatLng(-22.8400, -41.9600)
        );

        autocompleteRef.current = new google.maps.places.Autocomplete(originInputRef.current, {
          bounds: caboFrioBounds,
          strictBounds: false,
          componentRestrictions: { country: 'br' },
          fields: ['formatted_address', 'geometry', 'name'],
          types: ['geocode', 'establishment'],
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          
          if (!place || !place.geometry || !place.geometry.location) {
            return;
          }

          const selectedAddress = place.formatted_address || place.name || '';
          const coords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          setOrigin(selectedAddress);
          setOriginCoords(coords);
          toast.success(`Origem definida: ${selectedAddress}`);
        });
      } catch (error) {
        console.warn('Erro ao inicializar autocomplete:', error);
      }
    };

    // Verificar se Google Maps já está carregado
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
      setTimeout(() => initAutocomplete(), 100);
    } else {
      // Carregar script se não existir
      const apiKey = distanceService.getApiKey();
      if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=pt-BR&loading=async`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setTimeout(() => initAutocomplete(), 100);
        };
        document.head.appendChild(script);
      } else {
        // Script existe mas ainda não carregou
        const checkGoogle = setInterval(() => {
          if (typeof google !== 'undefined' && google.maps && google.maps.places) {
            clearInterval(checkGoogle);
            initAutocomplete();
          }
        }, 100);
        // Limpar após 5 segundos
        setTimeout(() => clearInterval(checkGoogle), 5000);
      }
    }

    return () => {
      if (autocompleteRef.current && typeof google !== 'undefined') {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [open]);

  // Função para formatar minutos em horário HH:MM
  const formatTime = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60) % 24;
    const mins = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Função para converter horário HH:MM em minutos
  const timeToMinutes = (time: string): number => {
    const [hours, mins] = time.split(':').map(Number);
    return hours * 60 + mins;
  };

  // Calcular horários de cada item do dia
  const calculateItemTimes = (dayIndex: number) => {
    const dayItems = itineraries[dayIndex] || [];
    const startTime = startTimes[dayIndex] || '08:00';
    let currentMinutes = timeToMinutes(startTime);
    
    return dayItems.map((item) => {
      const arrivalTime = formatTime(currentMinutes);
      currentMinutes += (item.eta || 0);
      const startActivityTime = formatTime(currentMinutes);
      currentMinutes += item.duration;
      const endTime = formatTime(currentMinutes);
      
      return { arrivalTime, startActivityTime, endTime };
    });
  };

  // Inicializar itinerários e horários
  useEffect(() => {
    const newItineraries = Array(numDays).fill(null).map((_, i) => 
      itineraries[i] || []
    );
    setItineraries(newItineraries);
    
    const newStartTimes = Array(numDays).fill(null).map((_, i) => 
      startTimes[i] || '08:00'
    );
    setStartTimes(newStartTimes);
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
    const dayItems = newItineraries[targetDay - 1] || [];

    for (const place of placesToAdd) {
      let eta = 0;
      let prevPoint = originCoords;
      
      if (dayItems.length > 0) {
        const lastItem = dayItems[dayItems.length - 1];
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

      dayItems.push(newItem);
    }

    newItineraries[targetDay - 1] = dayItems;
    setItineraries(newItineraries);
    setSelectedPlaces(new Set());
    
    toast.success(`${placesToAdd.length} lugar(es) adicionado(s) ao Dia ${targetDay}`);
  };

  // Adicionar lugar individual
  const handleAddPlace = async (place: PlaceCoords) => {
    const newItineraries = [...itineraries];
    const dayItems = newItineraries[targetDay - 1] || [];

    let eta = 0;
    let prevPoint = originCoords;
    
    if (dayItems.length > 0) {
      const lastItem = dayItems[dayItems.length - 1];
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

    dayItems.push(newItem);
    newItineraries[targetDay - 1] = dayItems;
    setItineraries(newItineraries);
    
    toast.success(`${place.name} adicionado ao Dia ${targetDay}`);
  };

  // Remover item
  const handleRemoveItem = (dayIndex: number, itemIndex: number) => {
    const newItineraries = [...itineraries];
    newItineraries[dayIndex].splice(itemIndex, 1);
    setItineraries(newItineraries);
    toast.success('Item removido');
  };

  // Mover item para cima
  const handleMoveUp = async (dayIndex: number, itemIndex: number) => {
    if (itemIndex === 0) return;
    
    const newItineraries = [...itineraries];
    const items = newItineraries[dayIndex];
    
    [items[itemIndex], items[itemIndex - 1]] = [items[itemIndex - 1], items[itemIndex]];
    
    setItineraries(newItineraries);
    await recalculateDayETAs(dayIndex);
  };

  // Mover item para baixo
  const handleMoveDown = async (dayIndex: number, itemIndex: number) => {
    const items = itineraries[dayIndex];
    if (itemIndex === items.length - 1) return;
    
    const newItineraries = [...itineraries];
    const newItems = newItineraries[dayIndex];
    
    [newItems[itemIndex], newItems[itemIndex + 1]] = [newItems[itemIndex + 1], newItems[itemIndex]];
    
    setItineraries(newItineraries);
    await recalculateDayETAs(dayIndex);
  };

  // Recalcular ETAs do dia
  const recalculateDayETAs = async (dayIndex: number) => {
    if (!originCoords) return;
    
    const newItineraries = [...itineraries];
    const items = newItineraries[dayIndex];
    
    for (let i = 0; i < items.length; i++) {
      const prevPoint = i === 0 ? originCoords : { lat: items[i - 1].lat, lng: items[i - 1].lng };
      const eta = await calculateETA(prevPoint, { lat: items[i].lat, lng: items[i].lng });
      items[i].eta = eta;
    }

    setItineraries(newItineraries);
  };

  // Gerar roteiro - recalcula ETAs do dia atual
  const handleGenerateItinerary = async () => {
    if (!originCoords) {
      toast.error('Defina uma origem primeiro');
      return;
    }
    
    setIsCalculating(true);
    toast.info('Calculando distâncias...');
    
    try {
      await recalculateDayETAs(currentDay - 1);
      toast.success('Roteiro gerado com sucesso!');
    } finally {
      setIsCalculating(false);
    }
  };

  // Atualizar duração
  const handleUpdateDuration = (dayIndex: number, itemIndex: number, newDuration: number) => {
    const newItineraries = [...itineraries];
    newItineraries[dayIndex][itemIndex].duration = newDuration;
    setItineraries(newItineraries);
  };

  // Calcular tempo total do dia
  const calculateDayTime = (items: ItineraryItem[]): number => {
    return items.reduce((total, item) => total + (item.eta || 0) + item.duration, 0);
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

  // Exportar PDF
  const handleExportPDF = async () => {
    const hasContent = itineraries.some(day => day.length > 0);

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

      printContainer.style.display = 'block';
      printContainer.style.position = 'fixed';
      printContainer.style.left = '0';
      printContainer.style.top = '0';
      printContainer.style.zIndex = '-9999';
      printContainer.style.opacity = '1';
      printContainer.style.visibility = 'visible';
      printContainer.style.background = '#ffffff';

      await new Promise(resolve => setTimeout(resolve, 1000));

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pages = printContainer.querySelectorAll('.itinerary-page');
      
      if (pages.length === 0) {
        throw new Error('Nenhuma página encontrada para exportar');
      }
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        page.style.width = '794px';
        page.style.minHeight = '1123px';
        page.style.backgroundColor = '#ffffff';
        
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: page.scrollWidth,
          height: page.scrollHeight,
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, 297));
      }

      printContainer.style.display = 'none';
      
      pdf.save(`roteiro-cabo-frio-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF. Tente novamente.');
      
      const printContainer = document.getElementById('itinerary-print-target');
      if (printContainer) {
        printContainer.style.display = 'none';
      }
    } finally {
      setIsPrinting(false);
    }
  };

  // Renderizar tabela de seleção - Mobile optimized
  const renderPlacesTable = (places: PlaceCoords[]) => {
    const filtered = filterPlaces(places);
    
    return (
      <div className="space-y-3">
        {/* Barra de busca e ações - Mobile stack */}
        <div className="flex flex-col gap-2 p-3 md:p-4 bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent rounded-xl border border-secondary/20">
          {/* Linha 1: Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <Input
              placeholder="Buscar por nome, bairro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 text-sm border-secondary/30 focus:border-secondary focus:ring-secondary/30"
            />
          </div>
          
          {/* Linha 2: Dia + Adicionar */}
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Dia:</span>
              <Select value={targetDay.toString()} onValueChange={(v) => setTargetDay(Number(v))}>
                <SelectTrigger className="w-20 h-8 text-sm border-secondary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: numDays }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>Dia {i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleAddSelected} 
              disabled={selectedPlaces.size === 0}
              className="h-8 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md"
            >
              + Adicionar {selectedPlaces.size > 0 && `(${selectedPlaces.size})`}
            </Button>
          </div>
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

  // Renderizar roteiro do dia - lista simples
  const renderItinerary = () => {
    const dayIndex = currentDay - 1;
    const dayItems = itineraries[dayIndex] || [];
    const itemTimes = calculateItemTimes(dayIndex);
    const totalTime = calculateDayTime(dayItems);
    const totalHours = Math.floor(totalTime / 60);
    const totalMins = totalTime % 60;
    const startTime = startTimes[dayIndex] || '08:00';
    const endTime = dayItems.length > 0 ? itemTimes[itemTimes.length - 1]?.endTime : startTime;
    
    if (dayItems.length === 0) {
      return (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">
              Nenhum lugar adicionado ainda.<br />
              Vá em "Selecionar lugares" para adicionar.
            </p>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="space-y-3 md:space-y-4">
        {/* Header do dia - Mobile optimized */}
        <div className="p-3 md:p-4 rounded-xl border bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent border-secondary/20">
          {/* Linha 1: Título + Tempo total */}
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-base md:text-lg">Dia {dayIndex + 1}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{dayItems.length} lugares</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xl md:text-2xl font-bold text-secondary">
                {totalHours > 0 ? `${totalHours}h${totalMins > 0 ? totalMins : ''}` : `${totalMins}min`}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground">tempo total</p>
            </div>
          </div>
          
          {/* Linha 2: Horário início + Range */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Início:</span>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => {
                  const newStartTimes = [...startTimes];
                  newStartTimes[dayIndex] = e.target.value;
                  setStartTimes(newStartTimes);
                }}
                className="w-20 h-7 text-xs"
              />
            </div>
            
            {dayItems.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs md:text-sm">
                <span className="font-medium text-primary">{startTime}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium text-primary">{endTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Lista de lugares */}
        <div className="space-y-2">
          {dayItems.map((item, index) => {
            const times = itemTimes[index];
            
            return (
              <div key={index}>
                {/* Conector de deslocamento */}
                {item.eta && item.eta > 0 && (
                  <div className="flex items-center gap-2 py-2 px-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                    <span className="flex items-center gap-1.5 text-xs text-secondary font-medium bg-secondary/10 px-3 py-1 rounded-full">
                      {mode === 'driving' ? <Car className="w-3.5 h-3.5" /> : <Footprints className="w-3.5 h-3.5" />}
                      {item.isFallback && '~'}{item.eta} min
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                  </div>
                )}
                
                {/* Card do lugar - Mobile optimized */}
                <Card className="hover:shadow-md hover:border-secondary/40 transition-all">
                  <CardContent className="p-3 md:p-4">
                    {/* Mobile: Layout vertical | Desktop: Layout horizontal */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      {/* Linha 1 mobile: Número + Nome + Remover */}
                      <div className="flex items-center gap-2 md:gap-4">
                        {/* Número da ordem */}
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        
                        {/* Horário - Desktop only inline */}
                        <div className="hidden md:flex flex-col items-center min-w-[70px]">
                          <span className="text-lg font-bold text-primary">{times?.startActivityTime}</span>
                          <span className="text-[10px] text-muted-foreground">até {times?.endTime}</span>
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm md:text-base text-foreground truncate">{item.placeName}</h4>
                          <p className="text-xs md:text-sm text-muted-foreground">{item.bairro}</p>
                        </div>
                        
                        {/* Remover - Always visible */}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 md:h-8 md:w-8 text-destructive hover:text-destructive flex-shrink-0"
                          onClick={() => handleRemoveItem(dayIndex, index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Linha 2 mobile: Horário + Duração + Mover */}
                      <div className="flex items-center gap-2 md:gap-4 pl-9 md:pl-0">
                        {/* Horário - Mobile only */}
                        <div className="md:hidden flex items-center gap-1 text-xs">
                          <span className="font-medium text-primary">{times?.startActivityTime}</span>
                          <span className="text-muted-foreground">-</span>
                          <span className="text-muted-foreground">{times?.endTime}</span>
                        </div>
                        
                        {/* Duração */}
                        <div className="flex items-center gap-1.5 ml-auto md:ml-0">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <Select
                            value={item.duration.toString()}
                            onValueChange={(v) => handleUpdateDuration(dayIndex, index, Number(v))}
                          >
                            <SelectTrigger className="w-20 md:w-24 h-7 md:h-8 text-xs md:text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15min</SelectItem>
                              <SelectItem value="30">30min</SelectItem>
                              <SelectItem value="45">45min</SelectItem>
                              <SelectItem value="60">1h</SelectItem>
                              <SelectItem value="90">1h30</SelectItem>
                              <SelectItem value="120">2h</SelectItem>
                              <SelectItem value="150">2h30</SelectItem>
                              <SelectItem value="180">3h</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Mover - Always visible */}
                        <div className="flex gap-0.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 md:h-8 md:w-8"
                            onClick={() => handleMoveUp(dayIndex, index)}
                            disabled={index === 0}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 md:h-8 md:w-8"
                            onClick={() => handleMoveDown(dayIndex, index)}
                            disabled={index === dayItems.length - 1}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] md:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-background via-background to-secondary/5 p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground px-4 md:px-6 py-3 md:py-4">
          <DialogHeader className="p-0">
            <DialogTitle className="flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary/90 flex items-center justify-center shadow-lg">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="text-base md:text-xl font-bold tracking-tight">Construtor de Roteiro</h2>
                  <p className="text-primary-foreground/70 text-xs md:text-sm font-normal hidden sm:block">Monte sua experiência perfeita</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onOpenChange(false)}
                className="text-primary-foreground hover:bg-primary-foreground/10 rounded-full h-8 w-8"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Barra de configuração - Mobile optimized */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-secondary/20 bg-secondary/5">
          <div className="flex flex-col gap-3">
            {/* Linha 1: Origem + Localização */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <Input
                  ref={originInputRef}
                  placeholder="Endereço de origem..."
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="pl-10 h-9 text-sm border-secondary/30 focus:border-secondary focus:ring-secondary/30"
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleUseMyLocation}
                className="h-9 w-9 border-secondary/30 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all flex-shrink-0"
              >
                <Locate className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Linha 2: Modo + Dias */}
            <div className="flex gap-2 items-center">
              <div className="flex gap-1 p-1 bg-muted rounded-lg flex-shrink-0">
                <Button
                  variant={mode === 'walking' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMode('walking')}
                  className={`h-7 px-2 md:px-3 ${mode === 'walking' 
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md' 
                    : 'hover:bg-secondary/10 text-muted-foreground'
                  }`}
                >
                  <Footprints className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1.5">A pé</span>
                </Button>
                <Button
                  variant={mode === 'driving' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMode('driving')}
                  className={`h-7 px-2 md:px-3 ${mode === 'driving' 
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md' 
                    : 'hover:bg-secondary/10 text-muted-foreground'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1.5">Carro</span>
                </Button>
              </div>

              <Select value={numDays.toString()} onValueChange={(v) => setNumDays(Number(v))}>
                <SelectTrigger className="flex-1 h-9 border-secondary/30 focus:ring-secondary/30">
                  <Calendar className="w-4 h-4 mr-2 text-secondary" />
                  <SelectValue placeholder="Dias" />
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
          <TabsContent value="places" className="flex-1 overflow-auto pb-4">
            <Tabs value={placeTab} onValueChange={(v) => setPlaceTab(v as any)}>
              {/* Categorias com scroll horizontal no mobile */}
              <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 pb-2">
                <TabsList className="inline-flex w-auto min-w-full md:grid md:w-full md:grid-cols-7 gap-1">
                  <TabsTrigger value="cabo-frio" className="whitespace-nowrap text-xs md:text-sm px-3 md:px-4">Praias</TabsTrigger>
                  <TabsTrigger value="restaurants" className="whitespace-nowrap text-xs md:text-sm px-3 md:px-4">Restaurantes</TabsTrigger>
                  <TabsTrigger value="arraial" className="whitespace-nowrap text-xs md:text-sm px-3 md:px-4">Arraial</TabsTrigger>
                  <TabsTrigger value="buzios" className="whitespace-nowrap text-xs md:text-sm px-3 md:px-4">Búzios</TabsTrigger>
                  <TabsTrigger value="trilhas" className="whitespace-nowrap text-xs md:text-sm px-3 md:px-4">Trilhas</TabsTrigger>
                  <TabsTrigger value="fotospots" className="whitespace-nowrap text-xs md:text-sm px-3 md:px-4">Foto-spots</TabsTrigger>
                  <TabsTrigger value="rotas" className="whitespace-nowrap text-xs md:text-sm px-3 md:px-4">Rotas</TabsTrigger>
                </TabsList>
              </div>
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

        {/* Rodapé - Mobile optimized */}
        <div className="border-t border-secondary/20 px-4 md:px-6 py-3 md:py-4 bg-muted/30">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Mobile: Botões principais empilhados */}
            <div className="flex gap-2 flex-1">
              <Button 
                onClick={handleGenerateItinerary}
                disabled={isCalculating}
                className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 shadow-md h-10"
              >
                {isCalculating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Route className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">Calcular</span>
                  </>
                )}
              </Button>
              <Button 
                onClick={handleExportPDF}
                disabled={isPrinting}
                className="flex-1 sm:flex-none bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md h-10"
              >
                <FileDown className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">{isPrinting ? 'Gerando...' : 'PDF'}</span>
                <span className="sm:hidden">PDF</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => toast.info('Compartilhamento em breve!')}
                className="h-10 w-10 sm:w-auto sm:px-4 border-secondary/30 hover:bg-secondary/10 flex-shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline ml-1.5">Compartilhar</span>
              </Button>
            </div>
            
            {/* Fechar */}
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground h-10 sm:order-first"
            >
              <X className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Fechar</span>
            </Button>
          </div>
        </div>

        {/* Print View */}
        <div id="itinerary-print-target" style={{ display: 'none' }}>
          <ItineraryPrintView 
            itineraries={itineraries}
            startTimes={startTimes}
            origin={origin}
            mode={mode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
