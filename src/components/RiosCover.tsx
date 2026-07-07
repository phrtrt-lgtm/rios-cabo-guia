import { ChevronDown } from "lucide-react";
import { WeatherWidget } from "@/components/WeatherWidget";
import { HeaderEvents } from "@/components/HeaderEvents";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

interface RiosCoverProps {
  onExplore: () => void;
}

export const RiosCover = ({ onExplore }: RiosCoverProps) => {
  const { t } = useLanguage();

  return (
    <section className="rios-cover">
      {/* decorative circles */}
      <span className="rios-cover-circle rios-cover-circle-tr" aria-hidden />
      <span className="rios-cover-circle rios-cover-circle-bl" aria-hidden />

      {/* top toolbar */}
      <div className="relative z-10 flex items-center justify-end gap-2">
        <WeatherWidget />
        <HeaderEvents />
        <LanguageSelector />
      </div>

      {/* wordmark + content */}
      <div className="relative z-10 mt-auto">
        <p className="rios-tagline">Hospedagens · Cabo Frio</p>
        <h1 className="rios-wordmark">RIOS</h1>
        <hr className="rios-cover-divider" />
        <h2 className="rios-cover-title">
          Guia de Cabo Frio, Arraial do Cabo & Búzios
        </h2>
        <p className="rios-cover-welcome">
          Praias, restaurantes, mercado da esquina e roteiros — feito por quem mora aqui.
        </p>

        <button onClick={onExplore} className="rios-cover-cta" type="button">
          {t("common.buildItinerary") ? "Explorar o guia" : "Explorar"}
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};
