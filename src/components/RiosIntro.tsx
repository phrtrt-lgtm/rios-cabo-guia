import riosLogoIntro from "@/assets/rios-logo-intro.png";
import riosLogoButton from "@/assets/rios-logo-button.png";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function RiosIntro() {
  const { t } = useLanguage();

  return (
    <section className="w-full border-t-2 border-[#D2691E] bg-white">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-[720px] mx-auto">
          {/* Text Content */}
          <div className="space-y-4 text-base md:text-lg leading-relaxed text-foreground/90">
            <p>{t("intro.p1")}</p>
            <p>{t("intro.p2")}</p>
            <p className="font-medium text-[#1e5a7d]">{t("intro.p3")}</p>
          </div>

          {/* Button */}
          <div className="mt-6 flex justify-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 bg-background border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg transition-all"
            >
              <a 
                href="https://www.airbnb.com.br/users/profile/1465782997269992090" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <span className="font-semibold">{t("common.seeProperties")}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
