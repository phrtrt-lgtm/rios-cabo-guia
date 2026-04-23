import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LocalEvents } from "@/components/LocalEvents";

type EventCategory = "festival" | "music" | "gastronomy" | "culture" | "sports" | "religious";

type LocalEvent = {
  id: string;
  title: Record<string, string>;
  month: number;
  day: number;
  endMonth?: number;
  endDay?: number;
  category: EventCategory;
};

// Same source list as LocalEvents — kept minimal here for the next-event preview
const annualEvents: LocalEvent[] = [
  { id: "carnaval", title: { pt: "Carnaval de Cabo Frio", en: "Cabo Frio Carnival", es: "Carnaval de Cabo Frio" }, month: 1, day: 14, endMonth: 1, endDay: 17, category: "festival" },
  { id: "semana-santa", title: { pt: "Semana Santa", en: "Holy Week", es: "Semana Santa" }, month: 3, day: 2, endMonth: 3, endDay: 5, category: "religious" },
  { id: "festa-junina", title: { pt: "Festa Junina", en: "June Festival", es: "Fiesta de Junio" }, month: 5, day: 13, endMonth: 5, endDay: 29, category: "festival" },
  { id: "sao-pedro", title: { pt: "São Pedro dos Pescadores", en: "St. Peter Festival", es: "San Pedro" }, month: 5, day: 29, category: "religious" },
  { id: "assuncao", title: { pt: "N. Sra. da Assunção", en: "Our Lady of the Assumption", es: "Ntra. Sra. de la Asunción" }, month: 7, day: 15, category: "religious" },
  { id: "aniversario-cabo-frio", title: { pt: "Aniversário de Cabo Frio", en: "Cabo Frio Anniversary", es: "Aniversario de Cabo Frio" }, month: 10, day: 13, category: "festival" },
];

function getNextEvent(language: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();

  const candidates: Array<{ event: LocalEvent; start: Date; end: Date }> = [];
  for (const event of annualEvents) {
    for (const y of [year, year + 1]) {
      const start = new Date(y, event.month, event.day, 12, 0, 0);
      const end = event.endMonth !== undefined && event.endDay !== undefined
        ? new Date(y, event.endMonth, event.endDay, 23, 59, 59)
        : new Date(y, event.month, event.day, 23, 59, 59);
      if (end >= today) candidates.push({ event, start, end });
    }
  }
  candidates.sort((a, b) => a.start.getTime() - b.start.getTime());
  const next = candidates[0];
  if (!next) return null;

  const isOngoing = next.start <= today && next.end >= today;
  const locale = language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en-US";
  const dateLabel = next.start.toLocaleDateString(locale, { day: "numeric", month: "short" });
  const title = next.event.title[language] || next.event.title.pt;
  return { title, dateLabel, isOngoing };
}

export function HeaderEvents() {
  const { language } = useLanguage();
  const next = getNextEvent(language);

  const ongoingLabel = language === "en" ? "Now" : language === "es" ? "Ahora" : "Agora";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100/80 to-pink-100/80 rounded-full border border-purple-200/50 shadow-sm hover:shadow-md transition-shadow"
          aria-label="Eventos"
        >
          <Calendar className="h-4 w-4 text-purple-600" />
          {next ? (
            <span className="text-xs sm:text-sm text-foreground font-medium truncate max-w-[160px] sm:max-w-[260px]">
              {next.isOngoing && (
                <span className="mr-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                  {ongoingLabel}
                </span>
              )}
              {next.title}
              <span className="text-muted-foreground ml-1.5 hidden sm:inline">· {next.dateLabel}</span>
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-0 border-0 shadow-xl">
        <LocalEvents />
      </PopoverContent>
    </Popover>
  );
}
