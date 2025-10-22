import riosLogoIntro from "@/assets/rios-logo-intro.png";

export function RiosIntro() {
  return (
    <section className="w-full border-t-2 border-[#D2691E] bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Logo and Title - Left Column */}
          <div className="flex-shrink-0 md:w-64">
            <img 
              src={riosLogoIntro} 
              alt="Logo RIOS — Operação e Gestão de Hospedagens" 
              className="h-9 md:h-10 object-contain mb-4"
            />
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e5a7d] leading-tight">
              Rios — feita por quem mora e cuida
            </h2>
          </div>

          {/* Text Content - Right Column */}
          <div className="flex-1 max-w-[720px] space-y-4 text-base md:text-lg leading-relaxed text-foreground/90">
            <p>
              Somos a Rios, de Cabo Frio, liderada por Paulo (fotografia e gestão) e Thaís (home staging e decoração). A gente transforma imóveis em lugares acolhedores e facilita sua estadia do começo ao fim, com informação clara, manutenção em dia e aquele cuidado de quem vive a cidade.
            </p>
            
            <p>
              Criamos este Guia da Região dos Lagos para você aproveitar melhor o tempo: praias e pontos clássicos, restaurantes certeiros, utilidades por bairro e ferramentas práticas como tempo a pé/🚗 e roteiros prontos. É um guia vivo, atualizado com o que a gente realmente usa e recomenda.
            </p>
            
            <p className="font-medium text-[#1e5a7d]">
              Nossa promessa é simples: menos atrito, mais memórias. Se este guia te ajudar a curtir mais Cabo Frio, Arraial e Búzios, a missão está cumprida. Boa viagem! 🌊
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
