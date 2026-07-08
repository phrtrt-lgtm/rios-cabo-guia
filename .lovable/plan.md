
# Reorganização visual — Guia RIOS (Parte A)

Vou reestruturar densidade e navegação do guia mantendo 100% dos dados, cores, tipografia e seções numeradas.

## 1. Navegação sticky com scrollspy
- Substituir as pills quebradas em várias linhas por **uma linha única com scroll horizontal + scroll-snap**, `sticky top-0 z-40` com fundo `--bg` e sombra sutil ao rolar.
- Adicionar hook `useScrollSpy` que observa as `<section id>` via IntersectionObserver e ativa a pill correspondente (fundo terra, texto branco).
- Clique na pill = `scrollIntoView({ behavior: 'smooth', block: 'start' })` respeitando `scroll-mt` da nav sticky.

## 2. Cards compactos + carrossel + bottom sheet
- Novo componente `CompactCard` (~200px de largura, imagem 4:3 topo, nome Fraunces, bairro em label, botão Maps mini). Substitui a exibição inicial de `TouristCard`, `RestaurantCard`, `UtilityCard`, `PhotoSpotCard`, `RouteCard`, `TrailCard`.
- Novo componente `PlaceSheet` (usa `@/components/ui/sheet` do shadcn no lado inferior no mobile) com: imagem grande, descrição completa, bloco DICA em destaque (`bg-terra/8`), botões "Como chegar" e "Adicionar ao roteiro".
- Novo `CardCarousel`: wrapper `overflow-x-auto snap-x snap-mandatory` que renderiza os CompactCards em fila. Abaixo, botão discreto "Ver todos (N)" que alterna estado local para renderizar em `grid-cols-2` (mobile) / `grid-cols-3-4` (desktop).
- Aplicado por seção em Praias, Utilidades (cada subgrupo), Gastronomia, Arraial, Búzios, Trilhas, Photo Spots, Rotas.

## 3. FAB do roteiro
- Trocar o botão retangular grande por um **FAB circular 56px** no canto inferior direito com ícone `Plus`/`Map` + badge contador de itens do roteiro.
- Adicionar `padding-bottom: 96px` nas seções (via classe utilitária) para nada ficar por baixo.
- Ao adicionar item, disparar animação `animate-pulse-once` (definida no `tailwind.config.ts`) e incrementar o badge. Contador vem do state existente do `ItineraryBuilder` (elevar para `Index` ou expor via contexto leve `ItineraryContext`).

## 4. Padronização dos cards de utilidades
- `CompactCard` para utilidades usa placeholder ilustrado neutro: círculo terra 12% com ícone da categoria (Pill, ShoppingCart, Coffee, PawPrint, ShoppingBag) em `--terra`, fundo `--bg`. Fotos irregulares deixam de aparecer no card compacto (continuam disponíveis no sheet).
- Telefone renderizado como `<a href="tel:...">` clicável no sheet.

## 5. Filtros de trilhas como chips
- Em `TrailFilters` (dentro da seção Trilhas), trocar os 4 `<Select>` por chips togáveis em linha horizontal com `overflow-x-auto snap-x`. Cada filtro (cidade, nível, duração, vista) vira grupo de chips com estado ativo em terra. Lógica de filtragem atual preservada.

## 6. Microdetalhes
- Manter números `01`, `02` grandes em Fraunces (já é assim em `GuideSection`).
- Adicionar `loading="lazy"` e `decoding="async"` em todas as `<img>` dos novos componentes.
- Garantir `min-height: 44px` e `min-width: 44px` em todos os botões e pills (via classe utilitária `.tap-target`).
- Envolver animações com `@media (prefers-reduced-motion: reduce) { animation: none; transition: none; }`.

## Arquivos afetados
- **Novos**: `src/components/CompactCard.tsx`, `src/components/CardCarousel.tsx`, `src/components/PlaceSheet.tsx`, `src/components/StickyCategoryNav.tsx`, `src/hooks/useScrollSpy.ts`, `src/contexts/ItineraryContext.tsx`.
- **Editados**: `src/pages/Index.tsx` (troca todas as grids por CardCarousel + monta os sheets), `src/components/ItineraryBuilder.tsx` (consome o contexto), `src/components/TrailCard.tsx` (variante compacta) + filtros da seção Trilhas, `src/index.css` (utilitários `.rios-carousel`, `.tap-target`, `.pulse-once`, reduced-motion), `tailwind.config.ts` (keyframe pulse-once).

## Fora de escopo (Parte A)
- Ilustrações finais de utilidades (fica com placeholder ícone-em-círculo).
- Reescrita de dados/lugares.
- PDF/print e chatbot ficam intactos.

Confirma que sigo com essa direção?
