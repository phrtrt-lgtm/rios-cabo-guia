import { GuideSection } from "@/components/GuideSection";
import { RestaurantCard } from "@/components/RestaurantCard";
import { UtilityTable } from "@/components/UtilityTable";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, ExternalLink, Menu, Home, Utensils, ShoppingBag, Info } from "lucide-react";
import heroImage from "@/assets/hero-cabo-frio.jpg";
import mapImage from "@/assets/map-illustration.jpg";
import riosLogo from "@/assets/rios-logo.png";

const Index = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header / Capa */}
      <header className="relative h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <img src={riosLogo} alt="Rios Logo" className="mx-auto mb-8 h-24 object-contain" />
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">
            Cabo Frio por Rios
          </h1>
          <p className="text-2xl md:text-3xl text-secondary mb-2">
            Guia Essencial de Bairros, Praias & Sabores
          </p>
          <p className="text-xl text-muted-foreground">
            Braga • Vila Nova • Algodoal • Portinho • Passagem
          </p>
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
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('sobre')} className="gap-2">
              <Info className="h-4 w-4" /> Sobre
            </Button>
          </div>
        </div>
      </nav>

      {/* Boas-vindas */}
      <GuideSection id="boas-vindas" title="Boas-vindas & Como Usar Este Guia">
        <div className="prose max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            Seja bem-vindo(a) a Cabo Frio! Este guia foi criado para você aproveitar ao máximo sua estadia,
            com dicas locais, endereços úteis e sugestões de passeios nos bairros Braga, Vila Nova, Algodoal, 
            Portinho e Passagem.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 not-prose">
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

      {/* Mapa */}
      <GuideSection id="mapa" title="Mapa de Contexto" className="bg-muted/30">
        <div className="text-center">
          <img 
            src={mapImage} 
            alt="Mapa ilustrado de Cabo Frio com bairros Braga, Vila Nova, Algodoal, Portinho e Passagem" 
            className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Mapa esquemático dos bairros principais e pontos de interesse
          </p>
        </div>
      </GuideSection>

      {/* Praias */}
      <GuideSection id="praias" title="Praias & Pontos Clássicos" printBreak>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Praia do Forte
            </h3>
            <p className="text-muted-foreground mb-4">
              A praia mais famosa de Cabo Frio, com extensa faixa de areia, quiosques e infraestrutura completa. 
              Águas calmas, ideal para famílias.
            </p>
            <a 
              href="https://www.google.com/maps/search/Praia+do+Forte+Cabo+Frio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Como chegar
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Ilha do Japonês
            </h3>
            <p className="text-muted-foreground mb-4">
              Águas cristalinas e rasas, perfeita para relaxar. Acessível a pé na maré baixa. 
              Verifique a tábua de marés antes de ir.
            </p>
            <a 
              href="https://www.google.com/maps/search/Ilha+do+Japonês+Cabo+Frio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Como chegar
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Peró & Conchas
            </h3>
            <p className="text-muted-foreground mb-4">
              Praias mais afastadas, com ondas para surf. Conchas oferece trilhas curtas e visual deslumbrante. 
              Ótimas para quem busca natureza.
            </p>
            <a 
              href="https://www.google.com/maps/search/Praia+do+Peró+Cabo+Frio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Como chegar
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Forte São Mateus
            </h3>
            <p className="text-muted-foreground mb-4">
              Fortificação do século XVII com vista panorâmica da cidade. Museu e área histórica. 
              Visite ao entardecer para fotos incríveis.
            </p>
            <a 
              href="https://www.google.com/maps/search/Forte+São+Mateus+Cabo+Frio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Como chegar
            </a>
          </div>
        </div>
      </GuideSection>

      {/* Utilidades */}
      <GuideSection id="utilidades" title="Essenciais por Bairro" className="bg-muted/30" printBreak>
        <div className="space-y-12">
          {/* Braga */}
          <div>
            <h3 className="text-2xl font-semibold text-secondary mb-6">Braga</h3>
            
            <UtilityTable 
              title="Farmácias"
              items={[
                { name: "Drogaria São Paulo", address: "Av. Júlia Kubitschek, Braga", hours: "24h", phone: "+55 22 2647-9200" },
                { name: "Farmácia Pague Menos", address: "Av. Assunção - Braga", hours: "7h-22h", phone: "+55 22 2645-8100" },
              ]}
            />

            <UtilityTable 
              title="Supermercados"
              items={[
                { name: "Guanabara Supermercados", address: "Av. Júlia Kubitschek, Braga", hours: "7h-22h", phone: "+55 22 2647-3300" },
                { name: "Supermercado Zona Sul", address: "Av. Henrique Terra - Braga", hours: "7h-21h", phone: "+55 22 2645-2200" },
              ]}
            />

            <UtilityTable 
              title="Padarias"
              items={[
                { name: "Panificadora Pão Quente", address: "Rua da Liberdade - Braga", hours: "6h-20h", phone: "+55 22 2645-7800" },
              ]}
            />

            <UtilityTable 
              title="Pet Shops"
              items={[
                { name: "Pet Center Braga", address: "Av. Júlia Kubitschek - Braga", hours: "8h-18h", phone: "+55 22 2647-4500" },
              ]}
            />
          </div>

          {/* Vila Nova */}
          <div>
            <h3 className="text-2xl font-semibold text-secondary mb-6">Vila Nova</h3>
            
            <UtilityTable 
              title="Farmácias"
              items={[
                { name: "Farmácia Popular", address: "R. Victor Igrejas - Vila Nova", hours: "8h-20h", phone: "+55 22 2643-1200" },
              ]}
            />

            <UtilityTable 
              title="Supermercados"
              items={[
                { name: "Mercadinho Vila Nova", address: "R. Jorge Lóssio - Vila Nova", hours: "7h-20h", phone: "+55 22 2643-5600" },
              ]}
            />

            <UtilityTable 
              title="Padarias"
              items={[
                { name: "Padaria Ville Blanche", address: "R. Victor Igrejas - Vila Nova", hours: "6h-19h", phone: "+55 22 2643-8900" },
              ]}
            />
          </div>

          {/* Algodoal */}
          <div>
            <h3 className="text-2xl font-semibold text-secondary mb-6">Algodoal</h3>
            
            <UtilityTable 
              title="Farmácias"
              items={[
                { name: "Drogaria Pacheco", address: "Av. Henrique Terra - Algodoal", hours: "8h-22h", phone: "+55 22 2648-7700" },
              ]}
            />

            <UtilityTable 
              title="Supermercados"
              items={[
                { name: "SuperMarket Algodoal", address: "Av. do Canal - Algodoal", hours: "7h-21h", phone: "+55 22 2648-3400" },
              ]}
            />
          </div>

          {/* Portinho */}
          <div>
            <h3 className="text-2xl font-semibold text-secondary mb-6">Portinho</h3>
            
            <UtilityTable 
              title="Supermercados"
              items={[
                { name: "Supermercado Extra Portinho", address: "R. Henrique Terra - Portinho", hours: "7h-22h", phone: "+55 22 2649-5500" },
              ]}
            />

            <UtilityTable 
              title="Padarias"
              items={[
                { name: "Pão Nosso", address: "Av. Portinho - Portinho", hours: "6h-20h", phone: "+55 22 2649-2300" },
              ]}
            />
          </div>

          {/* Passagem */}
          <div>
            <h3 className="text-2xl font-semibold text-secondary mb-6">Passagem</h3>
            
            <UtilityTable 
              title="Farmácias"
              items={[
                { name: "Farmácia da Passagem", address: "R. Almirante Barroso - Passagem", hours: "8h-20h", phone: "+55 22 2644-6700" },
              ]}
            />

            <UtilityTable 
              title="Supermercados"
              items={[
                { name: "Mercado da Passagem", address: "R. Constantino Menelau - Passagem", hours: "7h-20h", phone: "+55 22 2644-8900" },
              ]}
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
            />
            <RestaurantCard 
              name="Arcos do Canal"
              description="Mediterrâneo/autor à beira do canal, em casa histórica com vista linda. Almoço e jantar diariamente."
              address="R. Constantino Menelau, 76 - Passagem"
              priceRange="$$$"
              category="Mediterrâneo"
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
            />
            <RestaurantCard 
              name="Kento Cozinha Oriental"
              description="Japonês à la carte e rodízio tradicional."
              address="Av. Assunção, 294 - Centro"
              priceRange="$$"
              category="Japonês"
            />
            <RestaurantCard 
              name="Casa Kanaloa"
              description="Cozinha tailandesa adaptada ao paladar brasileiro, ambiente instagramável."
              address="R. Constantino Menelau, 240 - Passagem"
              priceRange="$$"
              category="Tailandês"
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
            />
            <RestaurantCard 
              name="Cabo Grill"
              description="Self-service e churrascaria a quilo, tradicional no almoço."
              address="R. Raul Veiga, 542 - Centro"
              priceRange="$$"
              category="Brasileiro"
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
            />
            <RestaurantCard 
              name="Sem Frescura Burger"
              description="Smashs e batatas elogiadas, com opções de delivery."
              address="Braga"
              priceRange="$$"
              category="Hamburgueria"
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
            />
            <RestaurantCard 
              name="Espaço Café"
              description="Bolos artesanais por encomenda e balcão, ambiente charmoso."
              address="R. Victor Igrejas, 4 - Ville Blanche"
              priceRange="$"
              category="Confeitaria"
            />
            <RestaurantCard 
              name="O Suisso"
              description="Confeitaria clássica de Cabo Frio desde 1975. Tortas e folhados tradicionais."
              address="Av. Assunção, 682 - Centro"
              priceRange="$"
              category="Confeitaria"
            />
            <RestaurantCard 
              name="Brigaderia da Vovó"
              description="Brigadeiros gourmet e tortas caseiras."
              address="R. Treze de Novembro, 60 - Centro"
              hours="Seg-Sáb 11h-19h"
              priceRange="$"
              category="Doces"
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
            />
          </div>
        </div>
      </GuideSection>

      {/* Sobre a Rios */}
      <GuideSection id="sobre" title="Sobre a Rios" printBreak>
        <div className="bg-card p-8 rounded-lg border border-border text-center max-w-3xl mx-auto">
          <img src={riosLogo} alt="Rios Logo" className="mx-auto mb-6 h-16 object-contain" />
          <p className="text-lg text-muted-foreground mb-6">
            A Rios é liderada pelo casal Paulo & Thaís. Ela assina o home staging e a decoração; 
            ele cuida de fotografia e gestão ponta-a-ponta. Operamos em Cabo Frio e Região dos Lagos.
          </p>
          <p className="text-muted-foreground mb-6">
            Cuidamos de imóveis e pessoas, e adoramos indicar bons lugares :)
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild variant="default">
              <a href="https://wa.me/5522999999999" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-4 w-4" /> WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://www.airbnb.com.br" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Airbnb
              </a>
            </Button>
          </div>
        </div>
      </GuideSection>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <img src={riosLogo} alt="Rios Logo" className="mx-auto mb-4 h-12 object-contain opacity-80" />
          <p className="text-sm opacity-80">
            © 2025 Rios • Cabo Frio, RJ • Feito com carinho para nossos hóspedes
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
