import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, MapPin, Clock, Music, Palette, Ship, Utensils, PartyPopper, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type EventCategory = "festival" | "music" | "gastronomy" | "culture" | "sports" | "religious";

type LocalEvent = {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  date: string;
  endDate?: string;
  time?: string;
  location: string;
  category: EventCategory;
  recurring?: boolean;
};

const categoryConfig: Record<EventCategory, { icon: React.ReactNode; color: string }> = {
  festival: { icon: <PartyPopper className="h-4 w-4" />, color: "bg-purple-100 text-purple-700 border-purple-200" },
  music: { icon: <Music className="h-4 w-4" />, color: "bg-pink-100 text-pink-700 border-pink-200" },
  gastronomy: { icon: <Utensils className="h-4 w-4" />, color: "bg-orange-100 text-orange-700 border-orange-200" },
  culture: { icon: <Palette className="h-4 w-4" />, color: "bg-blue-100 text-blue-700 border-blue-200" },
  sports: { icon: <Ship className="h-4 w-4" />, color: "bg-green-100 text-green-700 border-green-200" },
  religious: { icon: <Calendar className="h-4 w-4" />, color: "bg-amber-100 text-amber-700 border-amber-200" },
};

const categoryNames: Record<string, Record<EventCategory, string>> = {
  pt: {
    festival: "Festival",
    music: "Música",
    gastronomy: "Gastronomia",
    culture: "Cultura",
    sports: "Esporte",
    religious: "Religioso",
  },
  en: {
    festival: "Festival",
    music: "Music",
    gastronomy: "Gastronomy",
    culture: "Culture",
    sports: "Sports",
    religious: "Religious",
  },
  es: {
    festival: "Festival",
    music: "Música",
    gastronomy: "Gastronomía",
    culture: "Cultura",
    sports: "Deporte",
    religious: "Religioso",
  },
};

// Eventos locais da região (podem ser atualizados)
const localEvents: LocalEvent[] = [
  {
    id: "1",
    title: {
      pt: "Festa de Nossa Senhora da Assunção",
      en: "Our Lady of the Assumption Festival",
      es: "Fiesta de Nuestra Señora de la Asunción",
    },
    description: {
      pt: "Padroeira de Cabo Frio. Procissões, missas e festividades religiosas no centro histórico.",
      en: "Patron saint of Cabo Frio. Processions, masses and religious festivities in the historic center.",
      es: "Patrona de Cabo Frio. Procesiones, misas y festividades religiosas en el centro histórico.",
    },
    date: "2025-08-15",
    location: "Igreja Matriz - Centro Histórico",
    category: "religious",
    recurring: true,
  },
  {
    id: "2",
    title: {
      pt: "Festival do Camarão",
      en: "Shrimp Festival",
      es: "Festival del Camarón",
    },
    description: {
      pt: "Maior festival gastronômico da região. Pratos com camarão, shows e artesanato local.",
      en: "The region's largest gastronomic festival. Shrimp dishes, shows and local crafts.",
      es: "El mayor festival gastronómico de la región. Platos de camarones, shows y artesanías locales.",
    },
    date: "2025-07-01",
    endDate: "2025-07-15",
    location: "Passagem - Cabo Frio",
    category: "gastronomy",
    recurring: true,
  },
  {
    id: "3",
    title: {
      pt: "Regata de Vela Oceânica",
      en: "Ocean Sailing Regatta",
      es: "Regata de Vela Oceánica",
    },
    description: {
      pt: "Competição de vela com barcos de todo Brasil. Espetáculo visual na orla.",
      en: "Sailing competition with boats from all over Brazil. Visual spectacle on the waterfront.",
      es: "Competencia de vela con barcos de todo Brasil. Espectáculo visual en el paseo marítimo.",
    },
    date: "2025-05-10",
    endDate: "2025-05-12",
    location: "Praia do Forte",
    category: "sports",
    recurring: true,
  },
  {
    id: "4",
    title: {
      pt: "Feira de Artesanato do Peró",
      en: "Peró Craft Fair",
      es: "Feria de Artesanías del Peró",
    },
    description: {
      pt: "Artesanato local, bijuterias, decoração e gastronomia. Todos os finais de semana.",
      en: "Local crafts, jewelry, decoration and gastronomy. Every weekend.",
      es: "Artesanías locales, bisutería, decoración y gastronomía. Todos los fines de semana.",
    },
    date: "2025-01-04",
    time: "16h-22h",
    location: "Praia do Peró",
    category: "culture",
    recurring: true,
  },
  {
    id: "5",
    title: {
      pt: "Carnaval de Cabo Frio",
      en: "Cabo Frio Carnival",
      es: "Carnaval de Cabo Frio",
    },
    description: {
      pt: "Blocos de rua, shows na Praia do Forte e desfile de escolas de samba.",
      en: "Street parades, shows at Praia do Forte and samba school parades.",
      es: "Desfiles callejeros, shows en Praia do Forte y desfile de escuelas de samba.",
    },
    date: "2025-03-01",
    endDate: "2025-03-04",
    location: "Praia do Forte e Centro",
    category: "festival",
  },
  {
    id: "6",
    title: {
      pt: "Sunset Sessions Búzios",
      en: "Sunset Sessions Búzios",
      es: "Sunset Sessions Búzios",
    },
    description: {
      pt: "DJs e música eletrônica ao pôr do sol. Drinks e gastronomia premium.",
      en: "DJs and electronic music at sunset. Premium drinks and gastronomy.",
      es: "DJs y música electrónica al atardecer. Bebidas y gastronomía premium.",
    },
    date: "2025-01-11",
    time: "17h-22h",
    location: "Porto da Barra - Búzios",
    category: "music",
    recurring: true,
  },
  {
    id: "7",
    title: {
      pt: "Festival de Jazz de Arraial",
      en: "Arraial Jazz Festival",
      es: "Festival de Jazz de Arraial",
    },
    description: {
      pt: "Shows de jazz ao ar livre com artistas nacionais e internacionais.",
      en: "Outdoor jazz shows with national and international artists.",
      es: "Shows de jazz al aire libre con artistas nacionales e internacionales.",
    },
    date: "2025-02-14",
    endDate: "2025-02-16",
    location: "Praia dos Anjos - Arraial do Cabo",
    category: "music",
  },
  {
    id: "8",
    title: {
      pt: "Réveillon na Praia",
      en: "New Year's Eve on the Beach",
      es: "Año Nuevo en la Playa",
    },
    description: {
      pt: "Queima de fogos, shows e festa na virada do ano na Praia do Forte.",
      en: "Fireworks, shows and party on New Year's Eve at Praia do Forte.",
      es: "Fuegos artificiales, shows y fiesta de fin de año en Praia do Forte.",
    },
    date: "2025-12-31",
    time: "22h-04h",
    location: "Praia do Forte",
    category: "festival",
    recurring: true,
  },
];

const formatDate = (dateStr: string, endDateStr?: string, lang: string = "pt"): string => {
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const locale = lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US";
  
  const startDate = new Date(dateStr + "T12:00:00");
  const formatted = startDate.toLocaleDateString(locale, options);
  
  if (endDateStr) {
    const endDate = new Date(endDateStr + "T12:00:00");
    const endFormatted = endDate.toLocaleDateString(locale, options);
    return `${formatted} - ${endFormatted}`;
  }
  
  return formatted;
};

export function LocalEvents() {
  const { t, language } = useLanguage();
  const [showAll, setShowAll] = useState(false);

  // Sort events by date
  const sortedEvents = [...localEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const displayedEvents = showAll ? sortedEvents : sortedEvents.slice(0, 4);

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 via-pink-400/5 to-orange-500/10 border-purple-200/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar className="h-5 w-5 text-purple-500" />
          {t("events.title", "Eventos & Festivais")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("events.subtitle", "Calendário de eventos da região")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedEvents.map((event) => (
          <div
            key={event.id}
            className="p-4 bg-background/80 rounded-lg border border-border/50 hover:border-purple-200 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">
                  {event.title[language] || event.title.pt}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {event.description[language] || event.description.pt}
                </p>
              </div>
              <Badge className={`${categoryConfig[event.category].color} gap-1 shrink-0`}>
                {categoryConfig[event.category].icon}
                {categoryNames[language]?.[event.category] || categoryNames.pt[event.category]}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(event.date, event.endDate, language)}</span>
              </div>
              {event.time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{event.time}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{event.location}</span>
              </div>
              {event.recurring && (
                <Badge variant="outline" className="text-xs">
                  {t("events.recurring", "Anual")}
                </Badge>
              )}
            </div>
          </div>
        ))}

        {localEvents.length > 4 && (
          <Button
            variant="ghost"
            className="w-full gap-2"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                {t("events.showLess", "Ver menos")}
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                {t("events.showMore", `Ver todos (${localEvents.length})`)}
              </>
            )}
          </Button>
        )}

        <div className="mt-4 p-3 bg-purple-50/50 rounded-lg border border-purple-100">
          <p className="text-sm text-muted-foreground">
            {t("events.tip", "💡 Dica: Reserve hospedagem com antecedência para eventos grandes como Carnaval e Réveillon!")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
