import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, MapPin, Music, Palette, Ship, Utensils, PartyPopper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  // Get current month events only
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthEvents = localEvents.filter(event => {
    const eventDate = new Date(event.date + "T12:00:00");
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const monthNames: Record<string, string[]> = {
    pt: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 via-pink-400/5 to-orange-500/10 border-purple-200/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-purple-500" />
          <span className="font-semibold text-sm">
            {t("events.title", "Eventos")} - {monthNames[language]?.[currentMonth] || monthNames.pt[currentMonth]}
          </span>
        </div>

        {monthEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("events.noEvents", "Nenhum evento programado para este mês.")}
          </p>
        ) : (
          <div className="space-y-2">
            {monthEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-2 bg-background/80 rounded-lg border border-border/50"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg text-center shrink-0">
                  <div>
                    <div className="text-xs font-bold text-purple-700">
                      {new Date(event.date + "T12:00:00").getDate()}
                    </div>
                    <div className="text-[9px] text-purple-600 uppercase">
                      {new Date(event.date + "T12:00:00").toLocaleDateString(language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en-US", { month: "short" })}
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {event.title[language] || event.title.pt}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
                <Badge className={`${categoryConfig[event.category].color} text-[10px] px-1.5 py-0.5 shrink-0`}>
                  {categoryConfig[event.category].icon}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
