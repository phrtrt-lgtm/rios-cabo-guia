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

// Eventos locais da região - apenas eventos verificados/recorrentes
const localEvents: LocalEvent[] = [
  {
    id: "1",
    title: {
      pt: "Feira de Artesanato do Canal",
      en: "Canal Craft Fair",
      es: "Feria de Artesanías del Canal",
    },
    description: {
      pt: "Artesanato local na Avenida dos Pescadores. Todos os finais de semana no verão.",
      en: "Local crafts on Fishermen's Avenue. Every weekend in summer.",
      es: "Artesanías locales en la Avenida de los Pescadores. Todos los fines de semana en verano.",
    },
    date: "2026-01-04",
    time: "17h-22h",
    location: "Av. dos Pescadores - Cabo Frio",
    category: "culture",
    recurring: true,
  },
  {
    id: "2",
    title: {
      pt: "Rua das Pedras - Vida Noturna",
      en: "Rua das Pedras - Nightlife",
      es: "Rua das Pedras - Vida Nocturna",
    },
    description: {
      pt: "Bares, restaurantes e música ao vivo na famosa rua de Búzios. Todas as noites.",
      en: "Bars, restaurants and live music on Búzios' famous street. Every night.",
      es: "Bares, restaurantes y música en vivo en la famosa calle de Búzios. Todas las noches.",
    },
    date: "2026-01-01",
    endDate: "2026-03-31",
    time: "19h-03h",
    location: "Rua das Pedras - Búzios",
    category: "music",
    recurring: true,
  },
  {
    id: "3",
    title: {
      pt: "Passeios de Barco - Arraial do Cabo",
      en: "Boat Tours - Arraial do Cabo",
      es: "Paseos en Barco - Arraial do Cabo",
    },
    description: {
      pt: "Escunas saem diariamente da Praia dos Anjos para praias paradisíacas.",
      en: "Boats depart daily from Praia dos Anjos to paradise beaches.",
      es: "Barcos salen diariamente de Praia dos Anjos a playas paradisíacas.",
    },
    date: "2026-01-01",
    endDate: "2026-12-31",
    time: "10h-16h",
    location: "Praia dos Anjos - Arraial do Cabo",
    category: "sports",
    recurring: true,
  },
  {
    id: "4",
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
    date: "2026-02-14",
    endDate: "2026-02-17",
    location: "Praia do Forte e Centro",
    category: "festival",
  },
  {
    id: "5",
    title: {
      pt: "Festa de Nossa Senhora da Assunção",
      en: "Our Lady of the Assumption Festival",
      es: "Fiesta de Nuestra Señora de la Asunción",
    },
    description: {
      pt: "Padroeira de Cabo Frio. Procissões, missas e festividades religiosas.",
      en: "Patron saint of Cabo Frio. Processions, masses and religious festivities.",
      es: "Patrona de Cabo Frio. Procesiones, misas y festividades religiosas.",
    },
    date: "2026-08-15",
    location: "Igreja Matriz - Centro Histórico",
    category: "religious",
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
