import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, MapPin, Music, Palette, Ship, Utensils, PartyPopper, Waves } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type EventCategory = "festival" | "music" | "gastronomy" | "culture" | "sports" | "religious";

type LocalEvent = {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  // month (0-11) and day for recurring annual events
  month: number;
  day: number;
  endMonth?: number;
  endDay?: number;
  time?: string;
  location: string;
  category: EventCategory;
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
  pt: { festival: "Festival", music: "Música", gastronomy: "Gastronomia", culture: "Cultura", sports: "Esporte", religious: "Religioso" },
  en: { festival: "Festival", music: "Music", gastronomy: "Gastronomy", culture: "Culture", sports: "Sports", religious: "Religious" },
  es: { festival: "Festival", music: "Música", gastronomy: "Gastronomía", culture: "Cultura", sports: "Deporte", religious: "Religioso" },
};

// Eventos recorrentes anuais verificados da Região dos Lagos
// month é 0-indexed (0=janeiro, 11=dezembro)
const annualEvents: LocalEvent[] = [
  {
    id: "carnaval",
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
    month: 1, // Fevereiro
    day: 14,
    endMonth: 1,
    endDay: 17,
    location: "Praia do Forte e Centro - Cabo Frio",
    category: "festival",
  },
  {
    id: "semana-santa",
    title: {
      pt: "Semana Santa em Cabo Frio",
      en: "Holy Week in Cabo Frio",
      es: "Semana Santa en Cabo Frio",
    },
    description: {
      pt: "Procissões, missas e celebrações religiosas na Semana Santa. Alta temporada de visitantes.",
      en: "Processions, masses and religious celebrations during Holy Week. High tourist season.",
      es: "Procesiones, misas y celebraciones religiosas en Semana Santa. Alta temporada de visitantes.",
    },
    month: 3, // Abril (Páscoa 2026: 5 de abril)
    day: 2,
    endMonth: 3,
    endDay: 5,
    location: "Centro Histórico - Cabo Frio",
    category: "religious",
  },
  {
    id: "festa-junina",
    title: {
      pt: "Festa Junina",
      en: "June Festival",
      es: "Fiesta de Junio",
    },
    description: {
      pt: "Quadrilhas, forró, comidas típicas e fogueiras. Tradição cultural em toda a região.",
      en: "Square dances, forró music, traditional food and bonfires. Cultural tradition across the region.",
      es: "Cuadrillas, forró, comidas típicas y fogatas. Tradición cultural en toda la región.",
    },
    month: 5, // Junho
    day: 13,
    endMonth: 5,
    endDay: 29,
    location: "Cabo Frio, Arraial do Cabo e Búzios",
    category: "festival",
  },
  {
    id: "sao-pedro",
    title: {
      pt: "Festa de São Pedro dos Pescadores",
      en: "St. Peter of the Fishermen Festival",
      es: "Fiesta de San Pedro de los Pescadores",
    },
    description: {
      pt: "Procissão marítima em homenagem ao padroeiro dos pescadores na Lagoa de Araruama.",
      en: "Maritime procession honoring the patron saint of fishermen on Araruama Lagoon.",
      es: "Procesión marítima en honor al patrono de los pescadores en la Laguna de Araruama.",
    },
    month: 5, // Junho
    day: 29,
    location: "Arraial do Cabo e Cabo Frio",
    category: "religious",
  },
  {
    id: "assuncao",
    title: {
      pt: "Festa de N. Sra. da Assunção",
      en: "Our Lady of the Assumption Festival",
      es: "Fiesta de Ntra. Sra. de la Asunción",
    },
    description: {
      pt: "Padroeira de Cabo Frio. Procissões, missas e festividades religiosas no centro histórico.",
      en: "Patron saint of Cabo Frio. Processions, masses and festivities at the historic center.",
      es: "Patrona de Cabo Frio. Procesiones, misas y festividades en el centro histórico.",
    },
    month: 7, // Agosto
    day: 15,
    location: "Igreja Matriz - Centro Histórico",
    category: "religious",
  },
  {
    id: "aniversario-cabo-frio",
    title: {
      pt: "Aniversário de Cabo Frio",
      en: "Cabo Frio Anniversary",
      es: "Aniversario de Cabo Frio",
    },
    description: {
      pt: "Fundação de Cabo Frio em 13 de novembro de 1615. Shows, eventos culturais e comemorações.",
      en: "Founding of Cabo Frio on November 13, 1615. Shows, cultural events and celebrations.",
      es: "Fundación de Cabo Frio el 13 de noviembre de 1615. Shows, eventos culturales y celebraciones.",
    },
    month: 10, // Novembro
    day: 13,
    location: "Cabo Frio",
    category: "festival",
  },
];

// Resolve an annual event to actual dates for a given year
function resolveEventDates(event: LocalEvent, year: number) {
  const start = new Date(year, event.month, event.day, 12, 0, 0);
  const end = event.endMonth !== undefined && event.endDay !== undefined
    ? new Date(year, event.endMonth, event.endDay, 23, 59, 59)
    : new Date(year, event.month, event.day, 23, 59, 59);
  return { start, end };
}

const formatDate = (start: Date, end: Date, lang: string): string => {
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const locale = lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US";
  const startFormatted = start.toLocaleDateString(locale, options);
  const endFormatted = end.toLocaleDateString(locale, options);
  const sameDay = start.getDate() === end.getDate() && start.getMonth() === end.getMonth();
  return sameDay ? startFormatted : `${startFormatted} – ${endFormatted}`;
};

export function LocalEvents() {
  const { t, language } = useLanguage();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  // Look ahead up to 6 months
  const lookahead = new Date(today);
  lookahead.setMonth(lookahead.getMonth() + 6);

  // Build list of resolved upcoming events (this year, and next year if needed)
  const upcoming: Array<{ event: LocalEvent; start: Date; end: Date }> = [];

  for (const event of annualEvents) {
    for (const y of [year, year + 1]) {
      const { start, end } = resolveEventDates(event, y);
      // Show if event ends today or later, and starts within 6-month window
      if (end >= today && start <= lookahead) {
        upcoming.push({ event, start, end });
      }
    }
  }

  // Sort by start date, deduplicate
  upcoming.sort((a, b) => a.start.getTime() - b.start.getTime());

  // Remove duplicates (same event id)
  const seen = new Set<string>();
  const filtered = upcoming.filter(({ event }) => {
    if (seen.has(event.id)) return false;
    seen.add(event.id);
    return true;
  });

  // Separate ongoing from upcoming
  const ongoing = filtered.filter(({ start, end }) => start <= today && end >= today);
  const next = filtered.filter(({ start }) => start > today);

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 via-pink-400/5 to-orange-500/10 border-purple-200/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-purple-500" />
          <span className="font-semibold text-sm">
            {t("events.title", "Próximos Eventos")}
          </span>
        </div>

        <div className="space-y-2">
          {ongoing.length > 0 && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-purple-600 px-1">
                {language === "en" ? "Happening now" : language === "es" ? "Ahora" : "Acontecendo agora"}
              </p>
              {ongoing.map(({ event, start, end }) => (
                <EventRow key={event.id + "-ongoing"} event={event} start={start} end={end} language={language} />
              ))}
            </>
          )}

          {next.length > 0 && (
            <>
              {ongoing.length > 0 && (
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-1 pt-1">
                  {language === "en" ? "Coming up" : language === "es" ? "Próximamente" : "Em breve"}
                </p>
              )}
              {next.map(({ event, start, end }) => (
                <EventRow key={event.id + "-next"} event={event} start={start} end={end} language={language} />
              ))}
            </>
          )}

          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {t("events.noEvents", "Nenhum evento programado para os próximos meses.")}
            </p>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground mt-3 px-1 italic">
          {language === "en"
            ? "Recurring annual events. Dates may vary."
            : language === "es"
            ? "Eventos anuales recurrentes. Las fechas pueden variar."
            : "Eventos anuais recorrentes. Datas aproximadas."}
        </p>
      </CardContent>
    </Card>
  );
}

function EventRow({
  event,
  start,
  end,
  language,
}: {
  event: LocalEvent;
  start: Date;
  end: Date;
  language: string;
}) {
  const isOngoing = start <= new Date() && end >= new Date();

  return (
    <div className="flex items-center gap-3 p-2 bg-background/80 rounded-lg border border-border/50">
      <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg text-center shrink-0">
        <div>
          <div className="text-xs font-bold text-purple-700">{start.getDate()}</div>
          <div className="text-[9px] text-purple-600 uppercase">
            {start.toLocaleDateString(
              language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en-US",
              { month: "short" }
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">
          {event.title[language] || event.title.pt}
        </h4>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <Badge className={`${categoryConfig[event.category].color} text-[10px] px-1.5 py-0.5`}>
          {categoryConfig[event.category].icon}
        </Badge>
        {isOngoing && (
          <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
            {language === "en" ? "Now" : language === "es" ? "Ahora" : "Agora"}
          </span>
        )}
      </div>
    </div>
  );
}
