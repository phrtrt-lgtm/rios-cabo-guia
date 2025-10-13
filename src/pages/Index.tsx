import { GuideSection } from "@/components/GuideSection";
import { RestaurantCard } from "@/components/RestaurantCard";
import { UtilityCard } from "@/components/UtilityCard";
import { TouristCard } from "@/components/TouristCard";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, ExternalLink, Menu, Home, Utensils, ShoppingBag, Info, Waves, Landmark, Mountain, Palmtree } from "lucide-react";
import heroImage from "@/assets/hero-cabo-frio.jpg";
import mapImage from "@/assets/map-illustration.jpg";
import riosLogo from "@/assets/rios-logo-full.png";
import riosLogoHeader from "@/assets/rios-logo-header.png";

// Beach images
import praiaDoForteImg from "@/assets/beaches/praia-do-forte.jpg";
import ilhaDoJaponesImg from "@/assets/beaches/ilha-do-japones.jpg";
import praiaDoP from "@/assets/beaches/praia-do-pero.jpg";
import forteSaoMateusImg from "@/assets/beaches/forte-sao-mateus.jpg";
import morroDaGuiaImg from "@/assets/beaches/morro-da-guia.jpg";
import bairroPassagemImg from "@/assets/beaches/bairro-passagem.jpg";

// Utility images
import drogaRaiaImg from "@/assets/utilities/droga-raia.jpg";
import drogariaPachecoImg from "@/assets/utilities/drogaria-pacheco.jpg";
import supermercadoCaroneImg from "@/assets/utilities/supermercado-carone.jpg";
import supermercadoExtraImg from "@/assets/utilities/supermercado-extra.jpg";
import supermercadoPrincesaImg from "@/assets/utilities/supermercado-princesa.jpg";
import hortifrutiGreenFruitImg from "@/assets/utilities/hortifruti-green-fruit.jpg";
import lojasAmericanasImg from "@/assets/utilities/lojas-americanas.jpg";
import padariaRemmarImg from "@/assets/utilities/padaria-remmar.jpg";
import padariaDupaoImg from "@/assets/utilities/padaria-dupao.jpg";
import pesEPatasImg from "@/assets/utilities/pes-e-patas.jpg";
import racoesECiaImg from "@/assets/utilities/racoes-e-cia.jpg";

const Index = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border py-6">
        <div className="container mx-auto px-4 flex justify-center">
          <img src={riosLogoHeader} alt="Rios - Cabo Frio" className="h-16 object-contain" />
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


      {/* Praias */}
      <GuideSection id="praias" title="Praias & Pontos Clássicos" printBreak>
        <div className="grid md:grid-cols-2 gap-6">
          <TouristCard 
            name="Praia do Forte"
            description="A praia mais famosa de Cabo Frio, com extensa faixa de areia, quiosques e infraestrutura completa. Águas calmas, ideal para famílias."
            location="Centro, Cabo Frio"
            tips="Fica mais movimentada aos finais de semana. Chegue cedo para garantir estacionamento."
            type="beach"
          />
          
          <TouristCard 
            name="Ilha do Japonês"
            description="Águas cristalinas e rasas, perfeita para relaxar. Acessível a pé na maré baixa. Verifique a tábua de marés antes de ir."
            location="Praia do Forte, Cabo Frio"
            tips="Melhor horário: maré baixa. Leve água e protetor solar - não há estrutura na ilha."
            type="island"
          />
          
          <TouristCard 
            name="Peró & Conchas"
            description="Praias mais afastadas, com ondas para surf. Conchas oferece trilhas curtas e visual deslumbrante. Ótimas para quem busca natureza."
            location="Peró, Cabo Frio"
            tips="Praia do Peró é perfeita para surfistas. Praia das Conchas tem trilhas e piscinas naturais."
            type="beach"
          />
          
          <TouristCard 
            name="Forte São Mateus"
            description="Fortificação do século XVII com vista panorâmica da cidade. Museu e área histórica. Visite ao entardecer para fotos incríveis."
            location="Praia do Forte, Cabo Frio"
            tips="Entrada gratuita. Funciona Ter-Dom, 9h-17h. Ótimo para fotos do pôr do sol."
            type="landmark"
          />
          
          <TouristCard 
            name="Morro da Guia"
            description="Mirante com farol e vista espetacular de 360° da cidade e do oceano. Trilha curta e acessível. Imperdível ao nascer ou pôr do sol."
            location="Praia do Forte, Cabo Frio"
            tips="Trilha curta (15 min). Leve água e use calçado confortável. Vista de 360° vale cada passo."
            type="viewpoint"
          />
          
          <TouristCard 
            name="Bairro da Passagem"
            description="Bairro histórico e charmoso, com casas coloridas, canal, restaurantes à beira d'água e artesanato local. Perfeito para passeio a pé e gastronomia."
            location="Passagem, Cabo Frio"
            tips="Fim de tarde é ideal. Experimente os restaurantes de frutos do mar e explore as lojinhas de artesanato."
            type="landmark"
          />
        </div>
      </GuideSection>

      {/* Utilidades */}
      <GuideSection id="utilidades" title="Essenciais por Bairro — Utilidades" className="bg-muted/30" printBreak>
        <p className="text-muted-foreground mb-8">
          Estabelecimentos selecionados nos bairros principais. Sempre confirme horários antes de ir.
        </p>

        {/* Farmácias */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Farmácias</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <UtilityCard 
              name="Droga Raia"
              description="Rede nacional com atendimento ágil e produtos de saúde, beleza e perfumaria. Ideal para compras de última hora."
              address="Av. Henrique Terra, 1700 - Shopping Park Lagos"
              neighborhood="Palmeiras"
              hours="Diariamente 8h-22h"
              phone="(22) 2648-3400"
              website="https://www.drogaraia.com.br"
              tips="Delivery disponível. Aceita principais cartões e tem programa de fidelidade."
              type="pharmacy"
            />
            <UtilityCard 
              name="Drogaria Pacheco"
              description="Farmácia completa com setor de manipulação, cosméticos e conveniência. Atendimento profissional."
              address="Av. Assunção, 850 - Centro"
              neighborhood="Centro"
              hours="Seg-Sáb 7h-22h, Dom 8h-20h"
              phone="(22) 2645-7100"
              website="https://www.drogariaspacheco.com.br"
              tips="Programa de descontos para idosos. Estacionamento próprio."
              type="pharmacy"
            />
          </div>
        </div>

        {/* Supermercados */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Supermercados & Hortifruti</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <UtilityCard 
              name="Supermercado Carone"
              description="Supermercado regional com boa variedade de produtos, açougue próprio e seção de hortifruti. Preços competitivos."
              address="Av. Júlia Kubitschek, 550 - Braga"
              neighborhood="Braga"
              hours="Seg-Sáb 7h-21h, Dom 7h-20h"
              phone="(22) 2647-5200"
              website="https://www.carone.com.br"
              tips="Estacionamento amplo. Delivery disponível via app próprio."
              type="supermarket"
            />
            <UtilityCard 
              name="Supermercado Extra"
              description="Hipermercado com grande variedade de produtos alimentícios, eletrodomésticos e utilidades. Compras grandes."
              address="Av. Henrique Terra, 1580 - Novo Portinho"
              neighborhood="Novo Portinho"
              hours="Seg-Sáb 7h-22h, Dom 7h-21h"
              phone="(22) 2649-7800"
              website="https://www.paodeacucar.com"
              tips="Praça de alimentação interna. Cartão fidelidade com descontos."
              type="supermarket"
            />
            <UtilityCard 
              name="Supermercado Princesa"
              description="Mercado de bairro com atendimento familiar e produtos frescos. Ótimo para compras rápidas do dia a dia."
              address="Rua Jorge Lóssio, 245 - Vila Nova"
              neighborhood="Vila Nova"
              hours="Seg-Sáb 7h-20h, Dom 7h-13h"
              phone="(22) 2643-2100"
              tips="Aceita encomendas de pães e bolos. Entrega local."
              type="supermarket"
            />
            <UtilityCard 
              name="Hortifruti Green Fruit"
              description="Especializado em frutas, verduras e legumes orgânicos e convencionais. Produtos sempre frescos e de qualidade."
              address="Av. Assunção, 1120 - Centro"
              neighborhood="Centro"
              hours="Seg-Sáb 6h-20h, Dom 6h-14h"
              phone="(22) 2645-9300"
              tips="Delivery rápido na região. Sucos naturais feitos na hora."
              type="supermarket"
            />
          </div>
        </div>

        {/* Lojas de Variedades */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Variedades & Conveniência</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <UtilityCard 
              name="Lojas Americanas"
              description="Loja de departamentos com eletrônicos, utilidades, cosméticos, brinquedos e alimentos. Resolve emergências."
              address="Av. Henrique Terra, 1700 - Shopping Park Lagos"
              neighborhood="Palmeiras"
              hours="Seg-Sáb 10h-22h, Dom 14h-20h"
              phone="(22) 2648-5700"
              website="https://www.americanas.com.br"
              tips="Aceita cartões de todas as bandeiras. App com descontos exclusivos."
              type="store"
            />
          </div>
        </div>

        {/* Padarias */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Padarias & Confeitarias</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <UtilityCard 
              name="Padaria Remmar"
              description="Padaria tradicional de Cabo Frio desde 1987. Pães artesanais, bolos decorados e café da manhã com mesas. Ambiente acolhedor."
              address="Rua Henrique Terra, 820 - Braga"
              neighborhood="Braga"
              hours="Diariamente 5h30-21h"
              phone="(22) 2647-2200"
              tips="Experimente o pão francês quentinho e os sonhos recheados. Estacionamento na rua."
              type="bakery"
            />
            <UtilityCard 
              name="Padaria Dupão"
              description="Padaria moderna com grande variedade de pães frescos, doces, salgados e café expresso. Atendimento rápido."
              address="Av. Júlia Kubitschek, 720 - Braga"
              neighborhood="Braga"
              hours="Diariamente 5h-21h30"
              phone="(22) 2645-8800"
              tips="Promoções diárias no período da tarde. Wi-Fi gratuito."
              type="bakery"
            />
          </div>
        </div>

        {/* Pet Shops */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">Pet Shops</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <UtilityCard 
              name="Pés e Patas"
              description="Rede especializada em pet shop com rações, acessórios, brinquedos e produtos veterinários. Atendimento especializado."
              address="Av. Assunção, 950 - Centro"
              neighborhood="Centro"
              hours="Seg-Sáb 8h-18h"
              phone="(22) 2645-3100"
              website="https://www.redepesepatas.com.br"
              tips="Programa de fidelidade. Entrega grátis acima de R$ 100."
              type="petshop"
            />
            <UtilityCard 
              name="Rações & Cia"
              description="Pet shop completo com grande variedade de rações Premium, medicamentos e acessórios. Preços competitivos."
              address="Rua Henrique Terra, 1450 - Portinho"
              neighborhood="Portinho"
              hours="Seg-Sex 8h-19h, Sáb 8h-17h"
              phone="(22) 2649-4200"
              tips="Aceita todas as formas de pagamento. Estacionamento fácil."
              type="petshop"
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
