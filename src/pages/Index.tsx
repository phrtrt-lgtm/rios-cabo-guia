import { useState, useMemo } from "react";
import { GuideSection } from "@/components/GuideSection";
import { RestaurantCard } from "@/components/RestaurantCard";
import { UtilityCard } from "@/components/UtilityCard";
import { TouristCard } from "@/components/TouristCard";
import { DistanceWidget } from "@/components/DistanceWidget";
import { DistanceBadge } from "@/components/DistanceBadge";
import { ItineraryBuilder } from "@/components/ItineraryBuilder";
import { RiosIntro } from "@/components/RiosIntro";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, ExternalLink, Menu, Home, Utensils, ShoppingBag, Info, Waves, Landmark, Mountain, Palmtree, Navigation, Plus, Filter, Download, Camera, Route } from "lucide-react";
import { distanceService, ETAResult } from "@/services/distance.service";
import { allPlaces, touristPlaces, utilityPlaces, arraialPlaces, buziosPlaces } from "@/data/places";
import { trails } from "@/data/trails";
import { TrailCard } from "@/components/TrailCard";
import { photospots } from "@/data/photospots";
import { PhotoSpotCard } from "@/components/PhotoSpotCard";
import { runningRoutes, extensionRoutes } from "@/data/routes";
import { RouteCard } from "@/components/RouteCard";
import heroImage from "@/assets/hero-cabo-frio.jpg";
import mapImage from "@/assets/map-illustration.jpg";
import riosLogo from "@/assets/rios-logo-full.png";
import riosLogoHeader from "@/assets/rios-logo-header.png";
import riosLogoFooter from "@/assets/rios-logo-footer.png";

// Beach images
import praiaDoForteImg from "@/assets/beaches/praia-do-forte.jpg";
import ilhaDoJaponesImg from "@/assets/beaches/ilha-do-japones.jpg";
import praiaDoP from "@/assets/beaches/praia-do-pero.jpg";
import forteSaoMateusImg from "@/assets/beaches/forte-sao-mateus.jpg";
import morroDaGuiaImg from "@/assets/beaches/morro-da-guia.jpg";
import bairroPassagemImg from "@/assets/beaches/bairro-passagem.jpg";

// Utility images
import drogaRaiaImg from "@/assets/utilities/droga-raia.jpg";
import drogariaPachecoImg from "@/assets/utilities/drogaria-pacheco.jpg";
import supermercadoCaroneImg from "@/assets/utilities/supermercado-carone.jpg";
import supermercadoExtraImg from "@/assets/utilities/supermercado-extra.jpg";
import supermercadoPrincesaImg from "@/assets/utilities/supermercado-princesa.jpg";
import hortifrutiGreenFruitImg from "@/assets/utilities/hortifruti-green-fruit.jpg";
import lojasAmericanasImg from "@/assets/utilities/lojas-americanas.jpg";
import padariaRemmarImg from "@/assets/utilities/padaria-remmar.jpg";
import padariaDupaoImg from "@/assets/utilities/padaria-dupao.jpg";
import pesEPatasImg from "@/assets/utilities/pes-e-patas.jpg";
import racoesECiaImg from "@/assets/utilities/racoes-e-cia.jpg";

// Descrições e dicas dos lugares
const placeInfo: Record<string, { description: string; tips?: string }> = {
  'praia-do-forte': {
    description: 'A praia mais famosa de Cabo Frio, com extensa faixa de areia, quiosques e infraestrutura completa. Águas calmas, ideal para famílias.',
    tips: 'Fica mais movimentada aos finais de semana. Chegue cedo para garantir estacionamento.',
  },
  'ilha-do-japones': {
    description: 'Águas cristalinas e rasas, perfeita para relaxar. Acessível a pé na maré baixa. Verifique a tábua de marés antes de ir.',
    tips: 'Melhor horário: maré baixa. Leve água e protetor solar - não há estrutura na ilha.',
  },
  'pero-conchas': {
    description: 'Praias mais afastadas, com ondas para surf. Conchas oferece trilhas curtas e visual deslumbrante. Ótimas para quem busca natureza.',
    tips: 'Praia do Peró é perfeita para surfistas. Praia das Conchas tem trilhas e piscinas naturais.',
  },
  'forte-sao-mateus': {
    description: 'Fortificação do século XVII com vista panorâmica da cidade. Museu e área histórica. Visite ao entardecer para fotos incríveis.',
    tips: 'Entrada gratuita. Funciona Ter-Dom, 9h-17h. Ótimo para fotos do pôr do sol.',
  },
  'morro-da-guia': {
    description: 'Mirante com farol e vista espetacular de 360° da cidade e do oceano. Trilha curta e acessível. Imperdível ao nascer ou pôr do sol.',
    tips: 'Trilha curta (15 min). Leve água e use calçado confortável. Vista de 360° vale cada passo.',
  },
  'bairro-passagem': {
    description: 'Bairro histórico e charmoso, com casas coloridas, canal, restaurantes à beira d\'água e artesanato local. Perfeito para passeio a pé e gastronomia.',
    tips: 'Fim de tarde é ideal. Experimente os restaurantes de frutos do mar e explore as lojinhas de artesanato.',
  },
  // Arraial do Cabo
  'prainhas-pontal-atalaia': {
    description: 'Mirantes e faixa de areia clara com águas cristalinas. A escadaria famosa leva a prainhas de beleza única.',
    tips: 'Chegue cedo para evitar multidões. Use calçado confortável para a escadaria. Leve água e protetor solar.',
  },
  'praia-do-forno': {
    description: 'Mar geralmente calmo, águas transparentes. Acesso por trilha curta (15-20 min) ou barco-táxi.',
    tips: 'Trilha leve mas leve água. Barco-táxi opera da Praia dos Anjos (R$ 10-15). Snorkel recomendado.',
  },
  'praia-do-farol': {
    description: 'Considerada uma das praias mais bonitas do Brasil. Acesso controlado pela Marinha, apenas por passeio de barco autorizado.',
    tips: 'Reserve passeio com antecedência. Permanência limitada (30-40 min). Proibido levar comida e bebida.',
  },
  'praia-grande-arraial': {
    description: 'Faixa longa de areia clara, ótima para caminhadas. Pôr do sol clássico, geralmente com mais vento.',
    tips: 'Melhor para fim de tarde. Boa estrutura de quiosques. Menos lotada que outras praias.',
  },
  'prainha-arraial': {
    description: 'Bom acesso urbano, mar calmo em dias favoráveis. Pequena e charmosa, ótima para famílias.',
    tips: 'Chegue cedo aos finais de semana. Próxima ao centro, fácil acesso a restaurantes.',
  },
  'praia-dos-anjos': {
    description: 'Marina e ponto de saída para passeios de barco e mergulho. Muitos restaurantes de frutos do mar.',
    tips: 'Contrate passeios aqui. Experimente os restaurantes locais. Estacionamento pode ser difícil.',
  },
  'gruta-azul-arraial': {
    description: 'Gruta submersa com águas azul-turquesa intenso. Acessível apenas por passeio de barco.',
    tips: 'Incluída na maioria dos passeios de barco. Mergulho opcional dentro da gruta.',
  },
  // Búzios
  'praia-geribá': {
    description: 'Praia ampla, boa para surf e ambiente jovem. Próxima ao Porto da Barra. Muitos beach clubs.',
    tips: 'Ótima estrutura de quiosques e beach clubs. Mais agitada aos finais de semana. Boa para esportes.',
  },
  'praia-ferradurinha': {
    description: 'Pequena enseada com águas calmas, perfeita para SUP e caiaque. Visual de cartão-postal.',
    tips: 'Ideal para crianças pelo mar calmo. Aluguel de equipamentos disponível. Chegue cedo.',
  },
  'praia-ferradura': {
    description: 'Enseada maior com mar mais calmo e estrutura. Boa opção para famílias.',
    tips: 'Menos agitada que Geribá. Boa estrutura de beach clubs. Estacionamento disponível.',
  },
  'praia-joao-fernandes': {
    description: 'Estrutura completa de praia com belas vistas. Águas claras, boa para snorkel.',
    tips: 'Reserve cadeiras e guarda-sol com antecedência. Restaurantes na praia. Táxi aquático disponível.',
  },
  'praia-azeda': {
    description: 'Praias cênicas e pequenas, acesso por escadaria. Águas cristalinas e calmas.',
    tips: 'Escadaria tem 200+ degraus. Leve apenas o essencial. Azedinha é menor e mais tranquila.',
  },
  'praia-tartaruga': {
    description: 'Ótima para pôr do sol, mar calmo. Boa estrutura de quiosques.',
    tips: 'Reserve lugar para o pôr do sol. Fica bem próxima ao centro. Fácil acesso.',
  },
  'praia-brava': {
    description: 'Vibe mais selvagem e natural. Atenção a correntes e vento. Boa para surf.',
    tips: 'Mar pode ser agitado - cuidado ao entrar. Menos estrutura. Para quem busca tranquilidade.',
  },
  'orla-bardot': {
    description: 'Passeio à beira-mar com estátuas e casario charmoso. Conecta com a Rua das Pedras.',
    tips: 'Ótimo para fotos. Melhor no fim da tarde. Muitos restaurantes e lojinhas.',
  },
  'porto-da-barra': {
    description: 'Complexo à beira-mar com vários restaurantes. Famoso pelo pôr do sol em Manguinhos.',
    tips: 'Chegue 1h antes do pôr do sol para garantir mesa. Reserve com antecedência aos finais de semana.',
  },
  'rua-das-pedras': {
    description: 'Eixo gastronômico e de compras. Bares, restaurantes e lojas. Noite movimentada.',
    tips: 'Fica lotada à noite. Reserve restaurantes. Ótima para passear e jantar.',
  },
};

const Index = () => {
  const [origin, setOrigin] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [etas, setEtas] = useState<ETAResult[]>([]);
  const [currentMode, setCurrentMode] = useState<'walking' | 'driving'>('driving');
  const [isLoading, setIsLoading] = useState(false);
  const [sortByTime, setSortByTime] = useState(false);
  const [itineraryBuilderOpen, setItineraryBuilderOpen] = useState(false);

  const getPlaceDescription = (placeId: string) => placeInfo[placeId]?.description || '';
  const getPlaceTips = (placeId: string) => placeInfo[placeId]?.tips;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOriginSet = async (newOrigin: { lat: number; lng: number; address: string }) => {
    setOrigin(newOrigin);
    setIsLoading(true);
    
    try {
      const results = await distanceService.batchCalculateETAs(newOrigin, allPlaces);
      setEtas(results);
    } catch (error) {
      console.error('Erro ao calcular distâncias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (mode: 'walking' | 'driving') => {
    setCurrentMode(mode);
  };

  const handleSortByTime = () => {
    setSortByTime(!sortByTime);
  };

  const getETA = (placeId: string) => {
    return etas.find(eta => eta.placeId === placeId);
  };

  // Ordenar cards por tempo se ativado
  const sortedTouristPlaces = useMemo(() => {
    if (!sortByTime || !origin) return touristPlaces;
    
    return [...touristPlaces].sort((a, b) => {
      const etaA = getETA(a.id);
      const etaB = getETA(b.id);
      if (!etaA || !etaB) return 0;
      
      const timeA = currentMode === 'walking' ? etaA.walkingMinutes : etaA.drivingMinutes;
      const timeB = currentMode === 'walking' ? etaB.walkingMinutes : etaB.drivingMinutes;
      return timeA - timeB;
    });
  }, [sortByTime, origin, etas, currentMode]);

  const sortedUtilityPlaces = useMemo(() => {
    if (!sortByTime || !origin) return utilityPlaces;
    
    return [...utilityPlaces].sort((a, b) => {
      const etaA = getETA(a.id);
      const etaB = getETA(b.id);
      if (!etaA || !etaB) return 0;
      
      const timeA = currentMode === 'walking' ? etaA.walkingMinutes : etaA.drivingMinutes;
      const timeB = currentMode === 'walking' ? etaB.walkingMinutes : etaB.drivingMinutes;
      return timeA - timeB;
    });
  }, [sortByTime, origin, etas, currentMode]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border pt-6 pb-3">
        <div className="container mx-auto px-4 flex flex-col items-center gap-2">
          <img src={riosLogoHeader} alt="Rios - Cabo Frio" className="h-16 object-contain" />
          <p className="text-[#D2691E] text-base md:text-lg font-montserrat font-bold tracking-wider uppercase">Guia Turístico de Cabo Frio</p>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('boas-vindas')} className="gap-2">
              <Home className="h-4 w-4" /> Início
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('praias')} className="gap-2">
              <MapPin className="h-4 w-4" /> Praias
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('utilidades')} className="gap-2">
              <ShoppingBag className="h-4 w-4" /> Utilidades
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('gastronomia')} className="gap-2">
              <Utensils className="h-4 w-4" /> Gastronomia
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('arraial')} className="gap-2">
              <Waves className="h-4 w-4" /> Arraial
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('buzios')} className="gap-2">
              <Palmtree className="h-4 w-4" /> Búzios
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('trilhas')} className="gap-2">
              <Mountain className="h-4 w-4" /> Trilhas
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('fotospots')} className="gap-2">
              <Camera className="h-4 w-4" /> Foto-spots
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('rotas')} className="gap-2">
              <Route className="h-4 w-4" /> Rotas
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('sobre')} className="gap-2">
              <Info className="h-4 w-4" /> Sobre
            </Button>
          </div>
        </div>
      </nav>

      {/* Distance Widget */}
      <DistanceWidget 
        onOriginSet={handleOriginSet}
        onModeChange={handleModeChange}
        onSortByTime={handleSortByTime}
        currentMode={currentMode}
        isLoading={isLoading}
      />

      {/* Rios Introduction */}
      <RiosIntro />

      {/* Boas-vindas */}
      <GuideSection id="boas-vindas" title="Boas-vindas & Como Usar Este Guia">
        <div className="prose max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            Seja bem-vindo(a) a Cabo Frio! Este guia foi criado para você aproveitar ao máximo sua estadia,
            com dicas locais, endereços úteis e sugestões de passeios nos bairros Braga, Vila Nova, Algodoal, 
            Portinho e Passagem.
          </p>
          
          <div className="mb-4 not-prose">
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-6 rounded-lg border-2 border-primary/30">
              <h3 className="font-bold text-xl text-primary mb-3 text-center">📍 O que você encontra neste guia</h3>
              <p className="text-sm text-foreground/80 text-center mb-2">
                Além de praias, restaurantes e utilidades, preparamos seções especiais para você explorar a região:
              </p>
              <ul className="text-sm space-y-1 max-w-2xl mx-auto">
                <li className="flex items-center gap-2">
                  <span className="text-primary">🥾</span>
                  <span><strong>Trilhas:</strong> Percursos com níveis de dificuldade, tempo estimado e dicas práticas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">📸</span>
                  <span><strong>Foto-spots:</strong> Melhores locais e horários para fotos incríveis da região</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">🏃‍♂️</span>
                  <span><strong>Rotas para corrida e ciclismo:</strong> Circuitos mapeados com distâncias, altimetria e pontos de hidratação</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 not-prose">
            <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/30">
              <h3 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                <Plus className="h-5 w-5" /> Montar meu roteiro
              </h3>
              <p className="text-sm">Clique no botão flutuante no canto inferior direito para criar seu roteiro personalizado. Selecione lugares, organize por blocos do dia e veja os tempos de deslocamento.</p>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <Navigation className="h-5 w-5" /> Calcular distâncias
              </h3>
              <p className="text-sm">Digite um endereço ou use "Minha localização" para ver o tempo estimado a pé e de carro até cada lugar.</p>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5" /> Melhor horário
              </h3>
              <p className="text-sm">Praias ficam mais tranquilas pela manhã (até 11h). Evite o sol forte entre 11h-15h.</p>
            </div>
            
            <div className="bg-secondary/5 p-4 rounded-lg border border-secondary/20">
              <h3 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                <Phone className="h-5 w-5" /> Contatos
              </h3>
              <p className="text-sm">Links com ☎️ abrem WhatsApp. 📍 levam ao Google Maps.</p>
            </div>
            
            <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
              <h3 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Offline
              </h3>
              <p className="text-sm">Salve este guia no celular para consultar sem internet.</p>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-primary mb-2">💵 Custo</h3>
              <p className="text-sm">$ = econômico, $$ = médio, $$$ = alto</p>
            </div>
          </div>
        </div>
      </GuideSection>

      {/* Floating Itinerary Builder Button */}
      <Button
        onClick={() => setItineraryBuilderOpen(true)}
        className="fixed bottom-8 right-8 rounded-full shadow-lg h-14 px-6 gap-2 z-50 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        size="lg"
      >
        <Plus className="h-5 w-5" />
        Montar meu roteiro
      </Button>

      {/* Itinerary Builder Modal */}
      <ItineraryBuilder
        open={itineraryBuilderOpen}
        onOpenChange={setItineraryBuilderOpen}
        currentOrigin={origin}
        currentEtas={etas.reduce((acc, eta) => {
          acc[eta.placeId] = {
            walking: eta.walkingMinutes,
            driving: eta.drivingMinutes,
            isFallback: eta.isFallback
          };
          return acc;
        }, {} as { [key: string]: { walking: number; driving: number; isFallback?: boolean } })}
        currentMode={currentMode}
      />

      {/* Praias */}
      <GuideSection id="praias" title="Praias & Pontos Clássicos" printBreak>
        <div className="grid md:grid-cols-2 gap-6">
          {sortedTouristPlaces.map((place) => {
            const eta = getETA(place.id);
            return (
              <TouristCard 
                key={place.id}
                name={place.name}
                description={getPlaceDescription(place.id)}
                location={place.bairro || 'Cabo Frio'}
                tips={getPlaceTips(place.id)}
                type={place.category as any}
                distanceBadge={eta && origin ? (
                  <DistanceBadge 
                    walkingMinutes={eta.walkingMinutes}
                    drivingMinutes={eta.drivingMinutes}
                    currentMode={currentMode}
                    isFallback={eta.isFallback}
                    originAddress={origin.address}
                  />
                ) : undefined}
              />
            );
          })}
        </div>
      </GuideSection>

      {/* Utilidades */}
      <GuideSection id="utilidades" title="Essenciais por Bairro — Utilidades" className="bg-muted/30" printBreak>
        <p className="text-muted-foreground mb-8">
          Estabelecimentos selecionados nos bairros principais. Sempre confirme horários antes de ir.
        </p>

        {/* Farmácias */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Farmácias</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <UtilityCard 
              name="Droga Raia"
              description="Rede nacional com atendimento ágil e produtos de saúde, beleza e perfumaria. Ideal para compras de última hora."
              address="Av. Henrique Terra, 1700 - Shopping Park Lagos"
              neighborhood="Palmeiras"
              hours="Diariamente 8h-22h"
              phone="(22) 2648-3400"
              website="https://www.drogaraia.com.br"
              tips="Delivery disponível. Aceita principais cartões e tem programa de fidelidade."
              type="pharmacy"
              distanceBadge={origin && getETA('droga-raia') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('droga-raia')?.walkingMinutes || null}
                  drivingMinutes={getETA('droga-raia')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('droga-raia')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
            <UtilityCard 
              name="Drogaria Pacheco"
              description="Farmácia completa com setor de manipulação, cosméticos e conveniência. Atendimento profissional."
              address="Av. Assunção, 850 - Centro"
              neighborhood="Centro"
              hours="Seg-Sáb 7h-22h, Dom 8h-20h"
              phone="(22) 2645-7100"
              website="https://www.drogariaspacheco.com.br"
              tips="Programa de descontos para idosos. Estacionamento próprio."
              type="pharmacy"
              distanceBadge={origin && getETA('drogaria-pacheco') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('drogaria-pacheco')?.walkingMinutes || null}
                  drivingMinutes={getETA('drogaria-pacheco')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('drogaria-pacheco')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
          </div>
        </div>

        {/* Supermercados */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Supermercados & Hortifruti</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <UtilityCard 
              name="Supermercado Carone"
              description="Supermercado regional com boa variedade de produtos, açougue próprio e seção de hortifruti. Preços competitivos."
              address="Av. Júlia Kubitschek, 550 - Braga"
              neighborhood="Braga"
              hours="Seg-Sáb 7h-21h, Dom 7h-20h"
              phone="(22) 2647-5200"
              website="https://www.carone.com.br"
              tips="Estacionamento amplo. Delivery disponível via app próprio."
              type="supermarket"
              distanceBadge={origin && getETA('supermercado-carone') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('supermercado-carone')?.walkingMinutes || null}
                  drivingMinutes={getETA('supermercado-carone')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('supermercado-carone')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
            <UtilityCard 
              name="Supermercado Extra"
              description="Hipermercado com grande variedade de produtos alimentícios, eletrodomésticos e utilidades. Compras grandes."
              address="Av. Henrique Terra, 1580 - Novo Portinho"
              neighborhood="Novo Portinho"
              hours="Seg-Sáb 7h-22h, Dom 7h-21h"
              phone="(22) 2649-7800"
              website="https://www.paodeacucar.com"
              tips="Praça de alimentação interna. Cartão fidelidade com descontos."
              type="supermarket"
              distanceBadge={origin && getETA('supermercado-extra') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('supermercado-extra')?.walkingMinutes || null}
                  drivingMinutes={getETA('supermercado-extra')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('supermercado-extra')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
            <UtilityCard 
              name="Supermercado Princesa"
              description="Mercado de bairro com atendimento familiar e produtos frescos. Ótimo para compras rápidas do dia a dia."
              address="Rua Jorge Lóssio, 245 - Vila Nova"
              neighborhood="Vila Nova"
              hours="Seg-Sáb 7h-20h, Dom 7h-13h"
              phone="(22) 2643-2100"
              tips="Aceita encomendas de pães e bolos. Entrega local."
              type="supermarket"
              distanceBadge={origin && getETA('supermercado-princesa') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('supermercado-princesa')?.walkingMinutes || null}
                  drivingMinutes={getETA('supermercado-princesa')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('supermercado-princesa')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
            <UtilityCard 
              name="Hortifruti Green Fruit"
              description="Especializado em frutas, verduras e legumes orgânicos e convencionais. Produtos sempre frescos e de qualidade."
              address="Av. Assunção, 1120 - Centro"
              neighborhood="Centro"
              hours="Seg-Sáb 6h-20h, Dom 6h-14h"
              phone="(22) 2645-9300"
              tips="Delivery rápido na região. Sucos naturais feitos na hora."
              type="supermarket"
              distanceBadge={origin && getETA('hortifruti-green') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('hortifruti-green')?.walkingMinutes || null}
                  drivingMinutes={getETA('hortifruti-green')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('hortifruti-green')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
          </div>
        </div>

        {/* Lojas de Variedades */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Variedades & Conveniência</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <UtilityCard 
              name="Lojas Americanas"
              description="Loja de departamentos com eletrônicos, utilidades, cosméticos, brinquedos e alimentos. Resolve emergências."
              address="Av. Henrique Terra, 1700 - Shopping Park Lagos"
              neighborhood="Palmeiras"
              hours="Seg-Sáb 10h-22h, Dom 14h-20h"
              phone="(22) 2648-5700"
              website="https://www.americanas.com.br"
              tips="Aceita cartões de todas as bandeiras. App com descontos exclusivos."
              type="store"
              distanceBadge={origin && getETA('lojas-americanas') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('lojas-americanas')?.walkingMinutes || null}
                  drivingMinutes={getETA('lojas-americanas')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('lojas-americanas')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
          </div>
        </div>

        {/* Padarias */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Padarias & Confeitarias</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <UtilityCard 
              name="Padaria Remmar"
              description="Padaria tradicional de Cabo Frio desde 1987. Pães artesanais, bolos decorados e café da manhã com mesas. Ambiente acolhedor."
              address="Rua Henrique Terra, 820 - Braga"
              neighborhood="Braga"
              hours="Diariamente 5h30-21h"
              phone="(22) 2647-2200"
              tips="Experimente o pão francês quentinho e os sonhos recheados. Estacionamento na rua."
              type="bakery"
              distanceBadge={origin && getETA('padaria-remmar') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('padaria-remmar')?.walkingMinutes || null}
                  drivingMinutes={getETA('padaria-remmar')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('padaria-remmar')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
            <UtilityCard 
              name="Padaria Dupão"
              description="Padaria moderna com grande variedade de pães frescos, doces, salgados e café expresso. Atendimento rápido."
              address="Av. Júlia Kubitschek, 720 - Braga"
              neighborhood="Braga"
              hours="Diariamente 5h-21h30"
              phone="(22) 2645-8800"
              tips="Promoções diárias no período da tarde. Wi-Fi gratuito."
              type="bakery"
              distanceBadge={origin && getETA('padaria-dupao') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('padaria-dupao')?.walkingMinutes || null}
                  drivingMinutes={getETA('padaria-dupao')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('padaria-dupao')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
          </div>
        </div>

        {/* Pet Shops */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Pet Shops</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <UtilityCard 
              name="Pés e Patas"
              description="Rede especializada em pet shop com rações, acessórios, brinquedos e produtos veterinários. Atendimento especializado."
              address="Av. Assunção, 950 - Centro"
              neighborhood="Centro"
              hours="Seg-Sáb 8h-18h"
              phone="(22) 2645-3100"
              website="https://www.redepesepatas.com.br"
              tips="Programa de fidelidade. Entrega grátis acima de R$ 100."
              type="petshop"
              distanceBadge={origin && getETA('pes-e-patas') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('pes-e-patas')?.walkingMinutes || null}
                  drivingMinutes={getETA('pes-e-patas')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('pes-e-patas')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
            <UtilityCard 
              name="Rações & Cia"
              description="Pet shop completo com grande variedade de rações Premium, medicamentos e acessórios. Preços competitivos."
              address="Rua Henrique Terra, 1450 - Portinho"
              neighborhood="Portinho"
              hours="Seg-Sex 8h-19h, Sáb 8h-17h"
              phone="(22) 2649-4200"
              tips="Aceita todas as formas de pagamento. Estacionamento fácil."
              type="petshop"
              distanceBadge={origin && getETA('racoes-e-cia') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('racoes-e-cia')?.walkingMinutes || null}
                  drivingMinutes={getETA('racoes-e-cia')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('racoes-e-cia')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
          </div>
        </div>
      </GuideSection>

      {/* Shopping Park Lagos */}
      <GuideSection id="shopping" title="Shopping Park Lagos" printBreak>
        <div className="bg-card p-8 rounded-lg border border-border">
          <p className="text-lg text-muted-foreground mb-6">
            O principal shopping de Cabo Frio, com lojas, restaurantes, cinema e serviços essenciais para o visitante.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Endereço
              </h4>
              <p className="text-muted-foreground">Av. Henrique Terra, 1.700 – Palmeiras</p>
              <a 
                href="https://www.google.com/maps/search/Shopping+Park+Lagos+Cabo+Frio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline mt-2"
              >
                <ExternalLink className="h-4 w-4" /> Como chegar
              </a>
            </div>
            
            <div>
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5" /> Horários
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Lojas: Seg-Sáb 10h-22h, Dom 14h-20h</li>
                <li>• Praça de alimentação: 10h-22h todos os dias</li>
                <li>• Cinema: conforme programação</li>
              </ul>
            </div>
          </div>

          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
            <h4 className="font-semibold text-accent mb-2">O que resolve aqui:</h4>
            <p className="text-sm text-muted-foreground">
              Farmácia 24h, supermercado, bancos/caixas eletrônicos, lojas de conveniência, 
              livraria, fast-food e restaurantes diversos.
            </p>
          </div>
        </div>
      </GuideSection>

      {/* Gastronomia */}
      <GuideSection id="gastronomia" title="Gastronomia — Curadoria Rios" className="bg-muted/30" printBreak>
        <p className="text-muted-foreground mb-8">
          Nossas indicações favoritas, testadas e aprovadas. Horários podem variar — sempre confirme no link ou telefone.
        </p>

        {/* Italiano */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Italiano</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <RestaurantCard 
              name="Leña Casa Italiana"
              description="Casa italiana contemporânea em ambiente charmoso. Foco em massas artesanais, entradas e pratos para compartilhar. Reservas recomendadas."
              address="Av. Hilton Massa, 169 - Passagem"
              priceRange="$$$"
              category="Italiano"
              distanceBadge={origin && getETA('lena-casa-italiana') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('lena-casa-italiana')?.walkingMinutes || null}
                  drivingMinutes={getETA('lena-casa-italiana')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('lena-casa-italiana')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
            <RestaurantCard 
              name="Arcos do Canal"
              description="Mediterrâneo/autor à beira do canal, em casa histórica com vista linda. Almoço e jantar diariamente."
              address="R. Constantino Menelau, 76 - Passagem"
              priceRange="$$$"
              category="Mediterrâneo"
              distanceBadge={origin && getETA('arcos-do-canal') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('arcos-do-canal')?.walkingMinutes || null}
                  drivingMinutes={getETA('arcos-do-canal')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('arcos-do-canal')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
          </div>
        </div>

        {/* Asiático */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Asiático / Japonês</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <RestaurantCard 
              name="Fixi Kaiseki"
              description="Projeto kaiseki com menu sazonal do mar. Operação intimista, reservas essenciais."
              address="R. Almirante Barroso, 392 - Passagem"
              hours="Qui-Sáb 19h-23h, Dom 12h-16h"
              priceRange="$$$"
              category="Japonês"
              distanceBadge={origin && getETA('fixi-kaiseki') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('fixi-kaiseki')?.walkingMinutes || null}
                  drivingMinutes={getETA('fixi-kaiseki')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('fixi-kaiseki')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
            <RestaurantCard 
              name="Kento Cozinha Oriental"
              description="Japonês à la carte e rodízio tradicional."
              address="Av. Assunção, 294 - Centro"
              priceRange="$$"
              category="Japonês"
              distanceBadge={origin && getETA('kento-cozinha-oriental') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('kento-cozinha-oriental')?.walkingMinutes || null}
                  drivingMinutes={getETA('kento-cozinha-oriental')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('kento-cozinha-oriental')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
            <RestaurantCard 
              name="Casa Kanaloa"
              description="Cozinha tailandesa adaptada ao paladar brasileiro, ambiente instagramável."
              address="R. Constantino Menelau, 240 - Passagem"
              priceRange="$$"
              category="Tailandês"
              distanceBadge={origin && getETA('casa-kanaloa') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('casa-kanaloa')?.walkingMinutes || null}
                  drivingMinutes={getETA('casa-kanaloa')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('casa-kanaloa')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
          </div>
        </div>

        {/* Brasileiro */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Brasileiro / Churrasco</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <RestaurantCard 
              name="Picanha do Zé"
              description="Ícone local da picanha na pedra, serviço ágil e ambiente descontraído."
              address="Av. dos Pescadores, 100 - Centro"
              priceRange="$$"
              category="Churrasco"
              distanceBadge={origin && getETA('picanha-do-ze') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('picanha-do-ze')?.walkingMinutes || null}
                  drivingMinutes={getETA('picanha-do-ze')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('picanha-do-ze')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
            <RestaurantCard 
              name="Cabo Grill"
              description="Self-service e churrascaria a quilo, tradicional no almoço."
              address="R. Raul Veiga, 542 - Centro"
              priceRange="$$"
              category="Brasileiro"
              distanceBadge={origin && getETA('cabo-grill') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('cabo-grill')?.walkingMinutes || null}
                  drivingMinutes={getETA('cabo-grill')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('cabo-grill')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
          </div>
        </div>

        {/* Hamburguerias */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Hamburguerias</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <RestaurantCard 
              name="Paelo Hamburgueria"
              description="Burgers generosos e bem executados com ingredientes de qualidade."
              address="R. Henrique Terra, s/n - Novo Portinho"
              hours="18h-23:45 (confirmar)"
              priceRange="$$"
              category="Hamburgueria"
              distanceBadge={origin && getETA('paelo-hamburgueria') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('paelo-hamburgueria')?.walkingMinutes || null}
                  drivingMinutes={getETA('paelo-hamburgueria')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('paelo-hamburgueria')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
            <RestaurantCard 
              name="Sem Frescura Burger"
              description="Smashs e batatas elogiadas, com opções de delivery."
              address="Braga"
              priceRange="$$"
              category="Hamburgueria"
              distanceBadge={origin && getETA('sem-frescura-burger') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('sem-frescura-burger')?.walkingMinutes || null}
                  drivingMinutes={getETA('sem-frescura-burger')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('sem-frescura-burger')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
          </div>
        </div>

        {/* Saudável */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Saudável / Leve</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <RestaurantCard 
              name="Bem Fresh"
              description="Saladas, wraps, açaí. Opções vegetarianas e veganas em ambiente casual."
              address="Centro / Vila Nova"
              priceRange="$"
              category="Saudável"
              distanceBadge={origin && getETA('bem-fresh') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('bem-fresh')?.walkingMinutes || null}
                  drivingMinutes={getETA('bem-fresh')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('bem-fresh')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
          </div>
        </div>

        {/* Cafés */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Cafés & Doces</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <RestaurantCard 
              name="Office Café"
              description="Cafés especiais, opções sem lactose e veganas, espaço aconchegante."
              address="Braga e Passagem (2 unidades)"
              priceRange="$"
              category="Café"
              distanceBadge={origin && getETA('office-cafe') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('office-cafe')?.walkingMinutes || null}
                  drivingMinutes={getETA('office-cafe')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('office-cafe')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
            <RestaurantCard 
              name="Espaço Café"
              description="Bolos artesanais por encomenda e balcão, ambiente charmoso."
              address="R. Victor Igrejas, 4 - Ville Blanche"
              priceRange="$"
              category="Confeitaria"
              distanceBadge={origin && getETA('espaco-cafe') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('espaco-cafe')?.walkingMinutes || null}
                  drivingMinutes={getETA('espaco-cafe')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('espaco-cafe')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
            <RestaurantCard 
              name="O Suisso"
              description="Confeitaria clássica de Cabo Frio desde 1975. Tortas e folhados tradicionais."
              address="Av. Assunção, 682 - Centro"
              priceRange="$"
              category="Confeitaria"
              distanceBadge={origin && getETA('o-suisso') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('o-suisso')?.walkingMinutes || null}
                  drivingMinutes={getETA('o-suisso')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('o-suisso')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
            <RestaurantCard 
              name="Brigaderia da Vovó"
              description="Brigadeiros gourmet e tortas caseiras."
              address="R. Treze de Novembro, 60 - Centro"
              hours="Seg-Sáb 11h-19h"
              priceRange="$"
              category="Doces"
              distanceBadge={origin && getETA('brigaderia-da-vovo') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('brigaderia-da-vovo')?.walkingMinutes || null}
                  drivingMinutes={getETA('brigaderia-da-vovo')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('brigaderia-da-vovo')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
          </div>
        </div>

        {/* Crepes */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Crepes</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <RestaurantCard 
              name="Los Crepes"
              description="Crepes doces e salgados, clima de praia. Duas unidades."
              address="Av. Hilton Massa, 890 - Praia do Forte + Park Lagos"
              priceRange="$"
              category="Crepes"
              distanceBadge={origin && getETA('los-crepes') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('los-crepes')?.walkingMinutes || null}
                  drivingMinutes={getETA('los-crepes')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('los-crepes')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
          </div>
        </div>

        {/* Buffet */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Buffet de Café</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <RestaurantCard 
              name="Nova Onda"
              description="Café da manhã aberto ao público e 'café colonial' no fim da tarde (confirmar valores)."
              address="Praia do Forte"
              priceRange="$$"
              category="Café Colonial"
              distanceBadge={origin && getETA('nova-onda') ? (
                <DistanceBadge 
                  walkingMinutes={getETA('nova-onda')?.walkingMinutes || null}
                  drivingMinutes={getETA('nova-onda')?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={getETA('nova-onda')?.isFallback}
                  originAddress={origin.address}
                />
              ) : undefined}
            />
          </div>
        </div>
      </GuideSection>

      {/* Arraial do Cabo */}
      <GuideSection id="arraial" title="Arraial do Cabo" className="bg-muted/30" printBreak>
        <p className="text-lg text-primary mb-4 font-semibold">
          Águas claras, trilhas e mirantes — o Caribe brasileiro na nossa vizinhança
        </p>
        <p className="text-muted-foreground mb-8">
          A apenas 30 minutos de Cabo Frio, Arraial do Cabo é famoso por suas águas cristalinas 
          e praias paradisíacas. Confira os principais pontos turísticos.
        </p>

        {/* Praias & Pontos - Arraial */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6 flex items-center gap-2">
            <Waves className="h-6 w-6" /> Praias & Pontos Turísticos
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {arraialPlaces.map((place) => {
              const eta = getETA(place.id);
              return (
                <TouristCard 
                  key={place.id}
                  name={place.name}
                  description={getPlaceDescription(place.id)}
                  location={place.bairro || 'Arraial do Cabo'}
                  tips={getPlaceTips(place.id)}
                  type={place.category as any}
                  distanceBadge={eta && origin ? (
                    <DistanceBadge 
                      walkingMinutes={eta.walkingMinutes}
                      drivingMinutes={eta.drivingMinutes}
                      currentMode={currentMode}
                      isFallback={eta.isFallback}
                      originAddress={origin.address}
                    />
                  ) : undefined}
                />
              );
            })}
          </div>
        </div>

        {/* Gastronomia Arraial */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6 flex items-center gap-2">
            <Utensils className="h-6 w-6" /> Destaque Gastronômico
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <RestaurantCard 
              name="FIXI (Arraial do Cabo)"
              description="Cozinha do mar com proposta autoral. Peixes frescos, frutos do mar e ingredientes sazonais em pratos criativos."
              address="Arraial do Cabo"
              priceRange="$$$"
              category="Frutos do Mar"
              hours="Consultar horários"
            />
            <div className="bg-accent/10 p-6 rounded-lg border border-accent/20 flex items-center">
              <p className="text-sm text-muted-foreground">
                <strong className="text-accent">Nota:</strong> Existe também o Fixi Kaiseki na Passagem (Cabo Frio) — 
                veja mais na seção de Gastronomia de Cabo Frio acima.
              </p>
            </div>
          </div>
        </div>

        {/* Roteiros Arraial */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-secondary mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6" /> Roteiros em 1 Clique
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <Mountain className="h-5 w-5" /> Clássico Visual
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">☀️</span>
                  <span><strong>Manhã:</strong> Mirante Pontal do Atalaia</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">🏖️</span>
                  <span><strong>Tarde:</strong> Prainhas do Atalaia</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">🌅</span>
                  <span><strong>Fim de tarde:</strong> Pôr do sol na Praia Grande</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">🍽️</span>
                  <span><strong>Noite:</strong> Jantar no centro</span>
                </li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <Waves className="h-5 w-5" /> Mar & Trilha
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">🥾</span>
                  <span><strong>Manhã:</strong> Trilha para Praia do Forno</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">🤿</span>
                  <span><strong>Meio-dia:</strong> Snorkel na Praia do Forno</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">⛵</span>
                  <span><strong>Tarde:</strong> Passeio de barco (Gruta Azul + Ilha do Farol)</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-amber-500/10 rounded border border-amber-500/20">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  ⚠️ Praia do Farol tem controle da Marinha — permanência limitada a 30-40 min
                </p>
              </div>
            </div>
          </div>
        </div>
      </GuideSection>

      {/* Búzios */}
      <GuideSection id="buzios" title="Búzios" printBreak>
        <p className="text-lg text-primary mb-4 font-semibold">
          Mais de 20 praias, noites animadas e pôr do sol inesquecível
        </p>
        <p className="text-muted-foreground mb-8">
          A cerca de 40km de Cabo Frio, Búzios é o destino sofisticado da Região dos Lagos, 
          com praias paradisíacas, gastronomia internacional e vida noturna vibrante.
        </p>

        {/* Praias & Pontos - Búzios */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6 flex items-center gap-2">
            <Palmtree className="h-6 w-6" /> Praias & Pontos Turísticos
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {buziosPlaces.map((place) => {
              const eta = getETA(place.id);
              return (
                <TouristCard 
                  key={place.id}
                  name={place.name}
                  description={getPlaceDescription(place.id)}
                  location={place.bairro || 'Búzios'}
                  tips={getPlaceTips(place.id)}
                  type={place.category as any}
                  distanceBadge={eta && origin ? (
                    <DistanceBadge 
                      walkingMinutes={eta.walkingMinutes}
                      drivingMinutes={eta.drivingMinutes}
                      currentMode={currentMode}
                      isFallback={eta.isFallback}
                      originAddress={origin.address}
                    />
                  ) : undefined}
                />
              );
            })}
          </div>
        </div>

        {/* Gastronomia Búzios */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6 flex items-center gap-2">
            <Utensils className="h-6 w-6" /> Centros Gastronômicos
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Porto da Barra
              </h4>
              <p className="text-muted-foreground mb-4">
                Complexo à beira-mar em Manguinhos com vários restaurantes. Famoso pelo pôr do sol com vista para a Praia de Geribá.
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Chegue 1h antes do pôr do sol</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>Reserve com antecedência aos finais de semana</span>
                </p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Rua das Pedras
              </h4>
              <p className="text-muted-foreground mb-4">
                Principal eixo gastronômico de Búzios. Restaurantes, bares e lojas em rua de pedras charmosa. Noite movimentada e animada.
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-primary">🍽️</span>
                  <span>3 perfis: rápido/econômico ($$), família ($$), autoral ($$$)</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-primary">🌙</span>
                  <span>Fica lotada à noite — reserve mesa</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Roteiros Búzios */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-secondary mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6" /> Roteiros em 1 Clique
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <Mountain className="h-5 w-5" /> Clássico de Cartões-Postais
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">☀️</span>
                  <span><strong>Manhã:</strong> Praia Azeda & Azedinha (escadaria)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">🚶</span>
                  <span><strong>Tarde:</strong> Passeio pela Orla Bardot</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">🌙</span>
                  <span><strong>Noite:</strong> Jantar na Rua das Pedras</span>
                </li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <Waves className="h-5 w-5" /> Pôr do Sol em Manguinhos
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">🏖️</span>
                  <span><strong>Manhã/Meio-dia:</strong> Geribá ou Ferradurinha</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">🌅</span>
                  <span><strong>Fim de tarde:</strong> Pôr do sol no Porto da Barra</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">🍽️</span>
                  <span><strong>Noite:</strong> Jantar no Porto da Barra</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </GuideSection>

      {/* Trilhas */}
      <GuideSection id="trilhas" title="Trilhas da Região dos Lagos" printBreak>
        <p className="text-lg text-muted-foreground mb-8">
          Descubra as melhores trilhas de Cabo Frio, Arraial do Cabo e Búzios. 
          Mirantes, dunas, costões e praias selvagens esperam por você.
        </p>

        {/* Filtros de trilhas */}
        <div className="mb-8 p-4 bg-secondary/5 rounded-lg border border-secondary/20">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-secondary" />
            <h3 className="font-semibold text-secondary">Filtrar trilhas</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="px-3 py-2 rounded-md border border-input bg-background text-sm">
              <option value="">Todas as cidades</option>
              <option value="Cabo Frio">Cabo Frio</option>
              <option value="Arraial do Cabo">Arraial do Cabo</option>
              <option value="Armação dos Búzios">Búzios</option>
            </select>
            <select className="px-3 py-2 rounded-md border border-input bg-background text-sm">
              <option value="">Todos os níveis</option>
              <option value="Fácil">Fácil</option>
              <option value="Fácil-Moderado">Fácil-Moderado</option>
              <option value="Moderado">Moderado</option>
            </select>
            <select className="px-3 py-2 rounded-md border border-input bg-background text-sm">
              <option value="">Todas as durações</option>
              <option value="curta">&lt;1h</option>
              <option value="média">1-2h</option>
              <option value="longa">2-4h</option>
            </select>
            <select className="px-3 py-2 rounded-md border border-input bg-background text-sm">
              <option value="">Todas as vistas</option>
              <option value="Mirante">Mirante</option>
              <option value="Costão">Costão</option>
              <option value="Piscinas">Piscinas</option>
              <option value="Dunas">Dunas</option>
              <option value="Praia">Praia</option>
            </select>
          </div>
        </div>

        {/* Card informativo sobre Praia do Farol */}
        <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-1 shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-400 mb-2">
                Praia do Farol (Ilha do Farol) - Acesso apenas por barco
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
                A famosa Praia do Farol não possui acesso terrestre. A visita é controlada pela Marinha 
                e feita exclusivamente por passeios de barco autorizados que saem da Marina dos Anjos.
              </p>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-amber-500/50 hover:bg-amber-500/10"
              >
                <a
                  href="https://www.google.com/maps?q=Marina+dos+Anjos+Arraial+do+Cab o"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Ver ponto de embarque
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Cabo Frio */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
            <Mountain className="h-6 w-6" />
            Cabo Frio
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {trails
              .filter(trail => trail.cidade === 'Cabo Frio')
              .map(trail => {
                const eta = getETA(trail.id);
                return (
                  <TrailCard
                    key={trail.id}
                    trail={trail}
                    walkingMinutes={eta?.walkingMinutes || null}
                    drivingMinutes={eta?.drivingMinutes || null}
                    currentMode={currentMode}
                    isFallback={eta?.isFallback}
                    originAddress={origin?.address}
                  />
                );
              })}
          </div>
        </div>

        {/* Arraial do Cabo */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
            <Waves className="h-6 w-6" />
            Arraial do Cabo
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {trails
              .filter(trail => trail.cidade === 'Arraial do Cabo')
              .map(trail => {
                const eta = getETA(trail.id);
                return (
                  <TrailCard
                    key={trail.id}
                    trail={trail}
                    walkingMinutes={eta?.walkingMinutes || null}
                    drivingMinutes={eta?.drivingMinutes || null}
                    currentMode={currentMode}
                    isFallback={eta?.isFallback}
                    originAddress={origin?.address}
                  />
                );
              })}
          </div>
        </div>

        {/* Búzios */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
            <Palmtree className="h-6 w-6" />
            Armação dos Búzios
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {trails
              .filter(trail => trail.cidade === 'Armação dos Búzios')
              .map(trail => {
                const eta = getETA(trail.id);
                return (
                  <TrailCard
                    key={trail.id}
                    trail={trail}
                    walkingMinutes={eta?.walkingMinutes || null}
                    drivingMinutes={eta?.drivingMinutes || null}
                    currentMode={currentMode}
                    isFallback={eta?.isFallback}
                    originAddress={origin?.address}
                  />
                );
              })}
          </div>
        </div>

      {/* Botão PDF */}
        <div className="flex justify-center mt-8">
          <Button
            variant="secondary"
            size="lg"
            className="gap-2"
            onClick={() => {
              // TODO: Implementar geração de PDF
              console.log('Gerar PDF das trilhas');
            }}
          >
            <Download className="h-5 w-5" />
            Baixar PDF das Trilhas
          </Button>
        </div>
      </GuideSection>

      {/* Foto-spots */}
      <GuideSection id="fotospots" title="Foto-spots & Horário da Luz" printBreak>
        <p className="text-lg text-muted-foreground mb-8">
          Capture os melhores momentos da Região dos Lagos. Descubra pontos fotogênicos, 
          janelas de luz ideais e dicas de composição para fotos incríveis.
        </p>

        {/* Filtros de foto-spots */}
        <div className="mb-8 p-4 bg-secondary/5 rounded-lg border border-secondary/20">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-secondary" />
            <h3 className="font-semibold text-secondary">Filtrar foto-spots</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="px-3 py-2 rounded-md border border-input bg-background text-sm">
              <option value="">Todas as cidades</option>
              <option value="Cabo Frio">Cabo Frio</option>
              <option value="Arraial do Cabo">Arraial do Cabo</option>
              <option value="Armação dos Búzios">Búzios</option>
            </select>
            <select className="px-3 py-2 rounded-md border border-input bg-background text-sm">
              <option value="">Todas as janelas</option>
              <option value="golden-sunrise">Golden Hour — Amanhecer</option>
              <option value="golden-sunset">Golden Hour — Entardecer</option>
              <option value="blue-hour">Blue Hour</option>
              <option value="golden-morning">Golden Hour — Manhã</option>
            </select>
            <select className="px-3 py-2 rounded-md border border-input bg-background text-sm">
              <option value="">Todos os tipos</option>
              <option value="costão">Costão</option>
              <option value="igreja">Igreja</option>
              <option value="canal">Canal</option>
              <option value="praia">Praia</option>
              <option value="orla">Orla</option>
              <option value="mirante">Mirante</option>
            </select>
          </div>
        </div>

        {/* Cabo Frio */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
            <Camera className="h-6 w-6" />
            Cabo Frio
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photospots
              .filter(spot => spot.city === 'Cabo Frio')
              .map(spot => {
                const eta = getETA(spot.id);
                return (
                  <PhotoSpotCard
                    key={spot.id}
                    name={spot.name}
                    city={spot.city}
                    bairro={spot.bairro}
                    bestWindow={spot.bestWindow}
                    angle={spot.angle}
                    tip={spot.tip}
                    mapsUrl={spot.mapsUrl}
                    walkingMinutes={eta?.walkingMinutes || null}
                    drivingMinutes={eta?.drivingMinutes || null}
                    currentMode={currentMode}
                    isFallback={eta?.isFallback}
                    originAddress={origin?.address}
                  />
                );
              })}
          </div>
        </div>

        {/* Arraial do Cabo */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
            <Waves className="h-6 w-6" />
            Arraial do Cabo
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photospots
              .filter(spot => spot.city === 'Arraial do Cabo')
              .map(spot => {
                const eta = getETA(spot.id);
                return (
                  <PhotoSpotCard
                    key={spot.id}
                    name={spot.name}
                    city={spot.city}
                    bairro={spot.bairro}
                    bestWindow={spot.bestWindow}
                    angle={spot.angle}
                    tip={spot.tip}
                    mapsUrl={spot.mapsUrl}
                    walkingMinutes={eta?.walkingMinutes || null}
                    drivingMinutes={eta?.drivingMinutes || null}
                    currentMode={currentMode}
                    isFallback={eta?.isFallback}
                    originAddress={origin?.address}
                  />
                );
              })}
          </div>
        </div>

        {/* Búzios */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
            <Palmtree className="h-6 w-6" />
            Armação dos Búzios
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photospots
              .filter(spot => spot.city === 'Armação dos Búzios')
              .map(spot => {
                const eta = getETA(spot.id);
                return (
                  <PhotoSpotCard
                    key={spot.id}
                    name={spot.name}
                    city={spot.city}
                    bairro={spot.bairro}
                    bestWindow={spot.bestWindow}
                    angle={spot.angle}
                    tip={spot.tip}
                    mapsUrl={spot.mapsUrl}
                    walkingMinutes={eta?.walkingMinutes || null}
                    drivingMinutes={eta?.drivingMinutes || null}
                    currentMode={currentMode}
                    isFallback={eta?.isFallback}
                    originAddress={origin?.address}
                  />
                );
              })}
          </div>
        </div>

        {/* Botão PDF */}
        <div className="flex justify-center mt-8">
          <Button
            variant="secondary"
            size="lg"
            className="gap-2"
            onClick={() => {
              // TODO: Implementar geração de PDF
              console.log('Gerar PDF dos foto-spots');
            }}
          >
            <Download className="h-5 w-5" />
            Mapa de Foto-spots Rios (PDF)
          </Button>
        </div>
      </GuideSection>

      {/* Rotas para correr/pedalar */}
      <GuideSection id="rotas" title="Rotas para Correr/Pedalar" printBreak>
        <p className="text-lg text-muted-foreground mb-8">
          Circuitos seguros para corrida e ciclismo em Cabo Frio, com extensões para Arraial e Búzios. 
          Explore a orla, lagoas e paisagens da região de forma ativa e saudável.
        </p>

        {/* Cabo Frio - Rotas principais */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
            <Route className="h-6 w-6" />
            Cabo Frio — Rotas Principais
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {runningRoutes.map(route => {
              const eta = getETA(route.id);
              return (
                <RouteCard
                  key={route.id}
                  name={route.name}
                  city={route.city}
                  distance_km={route.distance_km}
                  gain_m={route.gain_m}
                  surface={route.surface}
                  description={route.description}
                  startName={route.start.name}
                  startMapsUrl={route.start.mapsUrl}
                  hydrationPoints={route.hydrationPoints}
                  recommendedTime={route.recommendedTime}
                  warnings={route.warnings}
                  walkingMinutes={eta?.walkingMinutes || null}
                  drivingMinutes={eta?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={eta?.isFallback}
                  originAddress={origin?.address}
                />
              );
            })}
          </div>
        </div>

        {/* Extensões - Arraial e Búzios */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
            <Navigation className="h-6 w-6" />
            Extensões — Arraial do Cabo & Búzios
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {extensionRoutes.map(route => {
              const eta = getETA(route.id);
              return (
                <RouteCard
                  key={route.id}
                  name={route.name}
                  city={route.city}
                  distance_km={route.distance_km}
                  gain_m={route.gain_m}
                  surface={route.surface}
                  description={route.description}
                  startName={route.start.name}
                  startMapsUrl={route.start.mapsUrl}
                  hydrationPoints={route.hydrationPoints}
                  recommendedTime={route.recommendedTime}
                  warnings={route.warnings}
                  walkingMinutes={eta?.walkingMinutes || null}
                  drivingMinutes={eta?.drivingMinutes || null}
                  currentMode={currentMode}
                  isFallback={eta?.isFallback}
                  originAddress={origin?.address}
                />
              );
            })}
          </div>
        </div>

        {/* Botão PDF */}
        <div className="flex justify-center mt-8">
          <Button
            variant="secondary"
            size="lg"
            className="gap-2"
            onClick={() => {
              // TODO: Implementar geração de PDF
              console.log('Gerar PDF das rotas');
            }}
          >
            <Download className="h-5 w-5" />
            Baixar Guia de Rotas (PDF)
          </Button>
        </div>
      </GuideSection>

      {/* Contato */}
      <GuideSection id="sobre" title="Atendimento" printBreak>
        <div className="bg-card p-8 rounded-lg border border-border text-center max-w-3xl mx-auto">
          <img src={riosLogoFooter} alt="Rios Logo" className="mx-auto mb-6 h-16 object-contain" />
          <p className="text-lg text-muted-foreground mb-6">
            A Rios cuida de imóveis e pessoas em Cabo Frio e Região dos Lagos. 
            Oferecemos hospedagens exclusivas com todo o conforto e charme que você merece.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild variant="default" size="lg">
              <a href="https://wa.me/5522999999999" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-5 w-5" /> Falar no WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://www.airbnb.com.br" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" /> Ver Imóveis no Airbnb
              </a>
            </Button>
          </div>
        </div>
      </GuideSection>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">
            © 2025 Rios • Cabo Frio, RJ • Feito com carinho para nossos hóspedes
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
