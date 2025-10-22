import riosLogoIntro from "@/assets/rios-logo-intro.png";
import riosLogoButton from "@/assets/rios-logo-button.png";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function RiosIntro() {
  return (
    <section className="w-full border-t-2 border-[#D2691E] bg-white">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-[720px] mx-auto">
          {/* Text Content */}
          <div className="space-y-4 text-base md:text-lg leading-relaxed text-foreground/90">
            <p>
              Somos a Rios, de Cabo Frio, liderada por Paulo Rios e Thais Rios. A gente transforma imóveis em lugares acolhedores e facilita sua estadia do começo ao fim, com informação clara, manutenção em dia e aquele cuidado de quem vive a cidade.
            </p>
            
            <p>
              Criamos este Guia da Região dos Lagos para você aproveitar melhor o tempo: praias e pontos clássicos, restaurantes certeiros, utilidades por bairro e ferramentas práticas como tempo a pé/🚗 e roteiros prontos. É um guia vivo, atualizado em tempo real com o que a gente realmente usa e recomenda.
            </p>
            
            <p className="font-medium text-[#1e5a7d]">
              Nossa promessa é simples: menos atrito, mais memórias. Se este guia te ajudar a curtir mais Cabo Frio, Arraial e Búzios, a missão está cumprida. Boa viagem! 🌊
            </p>
          </div>

          {/* Logo and Button */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <img 
              src={riosLogoButton} 
              alt="Rios Logo" 
              className="h-8 w-auto"
            />
            <Button
              asChild
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            >
              <a 
                href="https://www.airbnb.com.br/users/profile/1465782997269992090" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <span className="font-semibold">Ver nossos imóveis para alugar</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
