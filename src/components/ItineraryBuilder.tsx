import { useState } from 'react';
import { MapPin, Car, Footprints, Calendar, X, Download, Share2, Navigation as NavigationIcon, Grid3x3, List } from 'lucide-react';
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
import { touristPlaces, utilityPlaces, restaurantPlaces, arraialPlaces, buziosPlaces } from '@/data/places';
import { distanceService } from '@/services/distance.service';
import { useToast } from '@/hooks/use-toast';

interface ItineraryBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export const ItineraryBuilder = ({ open, onOpenChange }: ItineraryBuilderProps) => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('places');
  const [numberOfDays, setNumberOfDays] = useState('3');
  const [origin, setOrigin] = useState('');
  const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mode, setMode] = useState<'walking' | 'driving'>('driving');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTable, setActiveTable] = useState('cabo-beaches');

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
            <div className="col-span-2">ETA</div>
            <div className="col-span-1">Ações</div>
          </div>
          
          <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
            {filtered.map((place) => (
              <div
                key={place.name}
                className="grid grid-cols-12 gap-4 p-3 hover:bg-muted/30 transition-colors cursor-move"
                draggable
              >
                <div className="col-span-4 font-medium text-foreground">{place.name}</div>
                <div className="col-span-3 text-sm text-muted-foreground">{place.category || 'N/A'}</div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {place.category || 'Geral'}
                </div>
                <div className="col-span-2 text-sm">
                  {originCoords ? (
                    <span className="text-accent font-medium">~ 15 min</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
                <div className="col-span-1">
                  <Button variant="ghost" size="sm">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
            Arraste lugares das tabelas para os blocos de tempo abaixo. O sistema calculará automaticamente os tempos de deslocamento.
          </p>
        </div>

        <div className="space-y-8">
          {days.map((day) => (
            <div key={day} className="border border-border rounded-lg overflow-hidden">
              <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                <h3 className="font-semibold text-lg">Dia {day}</h3>
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
                  Copiar dia
                </Button>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                {TIME_BLOCKS.map((block) => (
                  <div
                    key={block.id}
                    className="border-2 border-dashed border-border rounded-lg p-3 min-h-[200px] hover:border-accent/50 transition-colors bg-background"
                  >
                    <div className="text-center mb-3">
                      <div className="font-semibold text-sm text-primary">{block.label}</div>
                      <div className="text-xs text-muted-foreground">{block.time}</div>
                    </div>
                    
                    <div className="space-y-2 min-h-[120px] flex flex-col items-center justify-center">
                      <div className="text-xs text-muted-foreground text-center">
                        Arraste lugares aqui
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
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
            <Button size="sm" onClick={handleUseMyLocation} variant="outline">
              Usar minha localização
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
              A pé
            </Button>
            <Button
              variant={mode === 'driving' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('driving')}
              className="gap-2"
            >
              <Car className="h-4 w-4" />
              Carro
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
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="cabo-beaches">Praias & Pontos (Cabo Frio)</TabsTrigger>
                    <TabsTrigger value="cabo-food">Restaurantes & Cafés (Cabo Frio)</TabsTrigger>
                    <TabsTrigger value="arraial">Arraial do Cabo</TabsTrigger>
                    <TabsTrigger value="buzios">Búzios</TabsTrigger>
                  </TabsList>

                  <TabsContent value="cabo-beaches">
                    {renderPlacesTable([...touristPlaces, ...utilityPlaces], 'Praias & Pontos Turísticos - Cabo Frio')}
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
        <div className="p-6 border-t border-border bg-muted/30 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {originCoords ? (
              <span className="text-accent font-medium">✓ Origem definida</span>
            ) : (
              <span>Defina sua origem para ver tempos estimados</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Fechar
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Download className="h-4 w-4 mr-2" />
              Gerar PDF
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="secondary" size="sm" disabled>
              <NavigationIcon className="h-4 w-4 mr-2" />
              Abrir no Maps
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
