## Objetivo

Refatorar visualmente o guia turístico RIOS aplicando o sistema de design descrito no prompt — mantendo toda funcionalidade atual (rotas, chatbot, itinerário, distâncias, i18n, dados) e trocando só a camada de apresentação.

## O que vai mudar

**Tokens & tipografia (global)**
- Novo bloco `:root` em `src/index.css` com as CSS vars RIOS: `--terra`, `--terra-light`, `--terra-dark`, `--blue-deep`, `--blue-mid`, `--blue-light`, `--bg` (#FBFAF7), `--fg`, `--muted`, `--border`.
- Mapeio essas vars nos tokens shadcn existentes (`--primary` = blue-deep, `--secondary` = terra, `--accent` = blue-light, `--background` = bg quente) — mantém compatibilidade com todos os componentes shadcn já usados.
- Instalo Fraunces + Inter via `@fontsource` (bun add), registro em `main.tsx`, atualizo `tailwind.config.ts`: `display: Fraunces`, `sans: Inter`.
- Removo referências antigas a Montserrat/Sora/DM Sans do tailwind config (mantém alias para não quebrar imports).

**Capa full-viewport (novo componente `RiosCover.tsx`)**
- Substitui o header + kicker atuais no topo da Index.
- Fundo `--blue-deep`, wordmark "RIOS" em Fraunces 700, tagline "Hospedagens · Cabo Frio", divisor terra, título "Guia Cabo Frio", subtítulo itálico de boas-vindas.
- Círculos decorativos com borders terra/azul-light (::before/::after).
- WeatherWidget + LanguageSelector + HeaderEvents ficam num row discreto no topo direito da capa (versão clara).
- Botão CTA "Explorar o guia" que faz scroll para seção 01.

**Nav sticky reestilizada**
- Após scroll da capa, nav sticky em `--bg` com borda terra opacity 0.4.
- Links em Inter 600 uppercase 10px letter-spacing 0.18em, cor `--muted` inativo, `--terra` ativo/hover.

**Seções numeradas (refator `GuideSection.tsx`)**
- Substitui o header atual pela estrutura: número decorativo grande (Fraunces 64px opacity 0.15 terra) + label uppercase terra + título Fraunces 28px blue-deep.
- Divisor terra 1px opacity 0.4 entre seções.
- Aceita nova prop `number` ("01", "02", ...) e `label` ("Comece por aqui", "Praias", etc).
- Container max-width 880px, padding 80px 48px 0 (24px no mobile).

**Numeração das seções da Index**
```
01 · Praias — Litoral de Cabo Frio
02 · Utilidades — Farmácias, mercados e mais
03 · Gastronomia — Onde a gente come
04 · Arraial do Cabo — Vale o passeio
05 · Búzios — Charme e agito
06 · Trilhas — Aventura a pé
07 · FotoSpots — Melhores ângulos
08 · Rotas — Corrida e bike
09 · Sobre — A gente por trás do guia
```

**Cards reestilizados (visual, sem mudar API)**
- `TouristCard`, `RestaurantCard`, `UtilityCard`, `TrailCard`, `RouteCard`, `PhotoSpotCard`: substituo bg branco puro por white sobre `--bg`, border `--border`, border-left 3px `--terra` (padrão entry-block), radius 14px, título card em Fraunces 600 blue-deep, corpo Inter, labels uppercase terra/muted.
- Dicas continuam destacadas (preservando o pedido anterior de manter dicas visíveis no mobile).
- Shadow trocada para `rgba(26, 58, 82, 0.08)` — sem pretos duros.

**Rodapé (`RiosFooter.tsx` novo)**
- Contact-card blue-deep com: wordmark RIOS, "Fale com a gente", grid 2 col com WhatsApp / Instagram / Airbnb / e-mail.
- Substitui rodapé simples atual.

**Botão flutuante "Criar roteiro"**
- Mantém posição, muda para `--terra` sólido, hover `--terra-dark`, radius 12px (btn-primary do sistema).

## O que NÃO vai mudar

- Nenhuma lógica de dados, i18n, distância, itinerário, chatbot, edge functions, Supabase.
- Estrutura de arquivos de dados (`places.ts`, `trails.ts`, etc).
- ItineraryBuilder, ItineraryPrintView, DistanceWidget, TouristChatbot: mantêm implementação atual.
- Estilos de impressão (`@media print`) preservados.

## Arquivos afetados

**Novos**
- `src/components/RiosCover.tsx`
- `src/components/RiosFooter.tsx`

**Editados**
- `src/index.css` — tokens, remove estilos utilitários antigos (`hero-keyword`, `kicker` mantido reestilizado).
- `tailwind.config.ts` — fontFamily Fraunces/Inter.
- `src/main.tsx` — imports @fontsource.
- `src/pages/Index.tsx` — substitui header/nav/footer, adiciona numeração às seções, remove RiosIntro daqui se necessário.
- `src/components/GuideSection.tsx` — nova estrutura de cabeçalho numerado.
- `src/components/TouristCard.tsx`, `RestaurantCard.tsx`, `UtilityCard.tsx`, `TrailCard.tsx`, `RouteCard.tsx`, `PhotoSpotCard.tsx` — restyle visual usando tokens.
- `src/components/RiosIntro.tsx` — encaixado como bloco dentro da nova capa OU adaptado como seção 00.
- `index.html` — atualiza `<title>` e `<meta description>` (já é "Guia Turístico RIOS", vou garantir description específica).

## Riscos & mitigação

- **Shadcn quebrar**: mantendo o mapeamento HSL dos tokens shadcn existentes, todos os botões/dialogs/tooltips continuam funcionando com a nova paleta.
- **Fontes bloqueadas**: usando `@fontsource` local (não CDN) — funciona offline.
- **Dark mode**: o sistema RIOS é único (claro/quente). Vou remover a variante dark do tailwind config comportamento (mantém classes mas neutraliza) — não é usado pelo app.
- **Regressão nas dicas mobile**: mantido explicitamente — cards continuam mostrando o bloco `Dica` sempre.

## Validação final

- `tsgo` sem erros.
- Screenshot Playwright mobile (390×823) e desktop (1280×1800) da home rolando pelas seções.

Depois de aprovar, vou executar tudo em paralelo (fontes + tokens + componentes) e validar com screenshot.