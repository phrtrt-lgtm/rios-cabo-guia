// Image registry for restaurants and utilities.
// Priority: REAL establishment photos (sourced via Firecrawl from public web)
//           → category fallback (generic representative photo).

// ===== Real establishment photos =====
import lenaCasaItaliana from '@/assets/places-real/lena-casa-italiana.jpg';
import arcosDoCanal from '@/assets/places-real/arcos-do-canal.jpg';
import fixiRestaurante from '@/assets/places-real/fixi-restaurante.jpg';
import kentoCozinhaOriental from '@/assets/places-real/kento-cozinha-oriental.jpg';
import casaKanaloa from '@/assets/places-real/casa-kanaloa.jpg';
import picanhaDoZe from '@/assets/places-real/picanha-do-ze.jpg';
import caboGrill from '@/assets/places-real/cabo-grill.jpg';
import paeloHamburgueria from '@/assets/places-real/paelo-hamburgueria.jpg';
import semFrescuraBurger from '@/assets/places-real/sem-frescura-burger.jpg';
import bemFresh from '@/assets/places-real/bem-fresh.jpg';
import officeCafe from '@/assets/places-real/office-cafe.jpg';
import espacoCafe from '@/assets/places-real/espaco-cafe.jpg';
import oSuisso from '@/assets/places-real/o-suisso.jpg';
import brigaderiaDaVovo from '@/assets/places-real/brigaderia-da-vovo.jpg';
import losCrepes from '@/assets/places-real/los-crepes.jpg';
import novaOnda from '@/assets/places-real/nova-onda.jpg';
import restauranteEstrelaDoMar from '@/assets/places-real/restaurante-estrela-do-mar.jpg';
import ocaBranca from '@/assets/places-real/oca-branca.jpg';
import misterSheik from '@/assets/places-real/mister-sheik.jpg';
import drogaRaia from '@/assets/places-real/droga-raia.jpg';
import drogariaPacheco from '@/assets/places-real/drogaria-pacheco.jpg';
import supermercadoCarone from '@/assets/places-real/supermercado-carone.jpg';
import supermercadoExtra from '@/assets/places-real/supermercado-extra.jpg';
import supermercadoPrincesa from '@/assets/places-real/supermercado-princesa.jpg';
import hortifrutiGreenReal from '@/assets/places-real/hortifruti-green.jpg';
import lojasAmericanas from '@/assets/places-real/lojas-americanas.jpg';
import padariaRemmar from '@/assets/places-real/padaria-remmar.jpg';
import padariaDupao from '@/assets/places-real/padaria-dupao.jpg';
import pesEPatas from '@/assets/places-real/pes-e-patas.jpg';
import racoesECia from '@/assets/places-real/racoes-e-cia.jpg';

// ===== Category fallback photos (generic, Wikimedia Commons) =====
import pharmacy from '@/assets/categories/pharmacy.jpg';
import supermarket from '@/assets/categories/supermarket.jpg';
import bakery from '@/assets/categories/bakery.jpg';
import petshop from '@/assets/categories/petshop.jpg';
import store from '@/assets/categories/store.jpg';
import hortifruti from '@/assets/categories/hortifruti.jpg';
import italian from '@/assets/categories/italian.jpg';
import japanese from '@/assets/categories/japanese.jpg';
import seafood from '@/assets/categories/seafood.jpg';
import burger from '@/assets/categories/burger.jpg';
import steakhouse from '@/assets/categories/steakhouse.jpg';
import arabic from '@/assets/categories/arabic.jpg';
import crepe from '@/assets/categories/crepe.jpg';
import cafe from '@/assets/categories/cafe.jpg';
import dessert from '@/assets/categories/dessert.jpg';
import healthy from '@/assets/categories/healthy.jpg';

export interface CategoryImage {
  src: string;
  credit: string;
}

const make = (src: string, credit: string): CategoryImage => ({ src, credit });

// Real photos — credit set to public web source.
const real = (src: string, source: string): CategoryImage => ({
  src,
  credit: `Foto: ${source}`,
});

// ===== Real photos by establishment id =====
const realPhotos: Record<string, CategoryImage> = {
  // Restaurants
  'lena-casa-italiana': real(lenaCasaItaliana, 'TripAdvisor'),
  'arcos-do-canal': real(arcosDoCanal, 'TripAdvisor'),
  'fixi-restaurante': real(fixiRestaurante, 'TripAdvisor'),
  'kento-cozinha-oriental': real(kentoCozinhaOriental, 'TripAdvisor'),
  'casa-kanaloa': real(casaKanaloa, 'TripAdvisor'),
  'picanha-do-ze': real(picanhaDoZe, 'TripAdvisor'),
  'cabo-grill': real(caboGrill, 'TripAdvisor'),
  'paelo-hamburgueria': real(paeloHamburgueria, 'TripAdvisor'),
  'sem-frescura-burger': real(semFrescuraBurger, 'TripAdvisor'),
  'bem-fresh': real(bemFresh, 'TripAdvisor'),
  'office-cafe': real(officeCafe, 'TripAdvisor'),
  'espaco-cafe': real(espacoCafe, 'Instagram'),
  'o-suisso': real(oSuisso, 'TripAdvisor'),
  'brigaderia-da-vovo': real(brigaderiaDaVovo, 'TripAdvisor'),
  'los-crepes': real(losCrepes, 'Instagram'),
  'nova-onda': real(novaOnda, 'TripAdvisor'),
  'restaurante-estrela-do-mar': real(restauranteEstrelaDoMar, 'TripAdvisor'),
  'oca-branca': real(ocaBranca, 'Prefeitura de Cabo Frio'),
  'mister-sheik': real(misterSheik, 'Instagram'),
  // Utilities
  'droga-raia': real(drogaRaia, 'Dreamstime'),
  'drogaria-pacheco': real(drogariaPacheco, 'iNews BR'),
  'supermercado-carone': real(supermercadoCarone, 'Instagram'),
  'supermercado-extra': real(supermercadoExtra, 'Folha dos Lagos'),
  'supermercado-princesa': real(supermercadoPrincesa, 'Princesa Supermercados'),
  'hortifruti-green': real(hortifrutiGreenReal, 'Instagram'),
  'lojas-americanas': real(lojasAmericanas, 'AdobeStock'),
  'padaria-remmar': real(padariaRemmar, 'TripAdvisor'),
  'padaria-dupao': real(padariaDupao, 'TripAdvisor'),
  'pes-e-patas': real(pesEPatas, 'Site oficial'),
  'racoes-e-cia': real(racoesECia, 'Instagram'),
};

// ===== Generic category fallbacks =====
const utilityCategoryFallback: Record<string, CategoryImage> = {
  pharmacy: make(pharmacy, 'Foto: Junius · Public domain (Wikimedia Commons)'),
  supermarket: make(supermarket, 'Foto: Eugenio Hansen, OFS · CC BY-SA 4.0 (Wikimedia Commons)'),
  bakery: make(bakery, 'Foto: Eduardo P · CC BY-SA 3.0 (Wikimedia Commons)'),
  petshop: make(petshop, 'Foto: Globetrotter19 · CC BY-SA 3.0 (Wikimedia Commons)'),
  store: make(store, 'Foto: Joe Mabel · CC BY-SA 3.0 (Wikimedia Commons)'),
};

const categoryFallback: Record<string, CategoryImage> = {
  italiano: make(italian, 'Foto: Pixel.la · CC0 (Wikimedia Commons)'),
  pizza: make(italian, 'Foto: Pixel.la · CC0 (Wikimedia Commons)'),
  mediterraneo: make(seafood, 'Foto: Under the same moon... · CC BY 2.0 (Wikimedia Commons)'),
  'frutos-do-mar': make(seafood, 'Foto: Under the same moon... · CC BY 2.0 (Wikimedia Commons)'),
  peixes: make(seafood, 'Foto: Under the same moon... · CC BY 2.0 (Wikimedia Commons)'),
  japones: make(japanese, 'Foto: Luvpixy · CC BY-SA 4.0 (Wikimedia Commons)'),
  oriental: make(japanese, 'Foto: Luvpixy · CC BY-SA 4.0 (Wikimedia Commons)'),
  asiatico: make(japanese, 'Foto: Luvpixy · CC BY-SA 4.0 (Wikimedia Commons)'),
  tailandes: make(seafood, 'Foto: Under the same moon... · CC BY 2.0 (Wikimedia Commons)'),
  carnes: make(steakhouse, 'Foto: Leonardo Carvalho · CC BY-SA 2.5 (Wikimedia Commons)'),
  churrasco: make(steakhouse, 'Foto: Leonardo Carvalho · CC BY-SA 2.5 (Wikimedia Commons)'),
  espetinhos: make(steakhouse, 'Foto: Leonardo Carvalho · CC BY-SA 2.5 (Wikimedia Commons)'),
  brasileiro: make(steakhouse, 'Foto: Leonardo Carvalho · CC BY-SA 2.5 (Wikimedia Commons)'),
  hamburguer: make(burger, 'Foto: JIP · CC BY-SA 4.0 (Wikimedia Commons)'),
  hamburgueria: make(burger, 'Foto: JIP · CC BY-SA 4.0 (Wikimedia Commons)'),
  saudavel: make(healthy, 'Foto: Shixart1985 · CC BY 2.0 (Wikimedia Commons)'),
  acai: make(healthy, 'Foto: Shixart1985 · CC BY 2.0 (Wikimedia Commons)'),
  cafe: make(cafe, 'Foto: Frettie · CC BY 3.0 (Wikimedia Commons)'),
  cafeteria: make(cafe, 'Foto: Frettie · CC BY 3.0 (Wikimedia Commons)'),
  'cafe-colonial': make(cafe, 'Foto: Frettie · CC BY 3.0 (Wikimedia Commons)'),
  doces: make(dessert, 'Foto: Mayra · CC BY-SA 2.0 (Wikimedia Commons)'),
  confeitaria: make(dessert, 'Foto: Mayra · CC BY-SA 2.0 (Wikimedia Commons)'),
  sobremesas: make(dessert, 'Foto: Mayra · CC BY-SA 2.0 (Wikimedia Commons)'),
  sorveteria: make(dessert, 'Foto: Mayra · CC BY-SA 2.0 (Wikimedia Commons)'),
  creperia: make(crepe, 'Foto: Rudy Herman · CC BY 2.0 (Wikimedia Commons)'),
  crepes: make(crepe, 'Foto: Rudy Herman · CC BY 2.0 (Wikimedia Commons)'),
  arabe: make(arabic, 'Foto: PattayaPatrol · CC BY-SA 4.0 (Wikimedia Commons)'),
};

// ===== Name normalizer =====
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Map normalized restaurant name → id (so the components can resolve from `name` alone)
const restaurantNameToId: Record<string, string> = {
  'lena-casa-italiana': 'lena-casa-italiana',
  'arcos-do-canal': 'arcos-do-canal',
  'fixi-restaurante': 'fixi-restaurante',
  'kento-cozinha-oriental': 'kento-cozinha-oriental',
  'casa-kanaloa': 'casa-kanaloa',
  'picanha-do-ze': 'picanha-do-ze',
  'cabo-grill': 'cabo-grill',
  'paelo-hamburgueria': 'paelo-hamburgueria',
  'sem-frescura-burger': 'sem-frescura-burger',
  'bem-fresh': 'bem-fresh',
  'office-cafe-braga': 'office-cafe',
  'espaco-cafe': 'espaco-cafe',
  'o-suisso': 'o-suisso',
  'brigaderia-da-vovo': 'brigaderia-da-vovo',
  'los-crepes': 'los-crepes',
  'nova-onda': 'nova-onda',
  'restaurante-estrela-do-mar': 'restaurante-estrela-do-mar',
  'oca-branca': 'oca-branca',
  'mister-sheik': 'mister-sheik',
};

const utilityNameToId: Record<string, string> = {
  'droga-raia': 'droga-raia',
  'drogaria-pacheco': 'drogaria-pacheco',
  'supermercado-carone': 'supermercado-carone',
  'supermercado-extra': 'supermercado-extra',
  'supermercado-princesa': 'supermercado-princesa',
  'hortifruti-green-fruit': 'hortifruti-green',
  'lojas-americanas': 'lojas-americanas',
  'padaria-remmar': 'padaria-remmar',
  'padaria-dupao': 'padaria-dupao',
  'pes-e-patas': 'pes-e-patas',
  'racoes-cia': 'racoes-e-cia',
};

/** Resolve image for a restaurant by display name (real photo > category fallback). */
export function resolveRestaurantImage(name: string, category?: string): CategoryImage | undefined {
  const id = restaurantNameToId[norm(name)];
  if (id && realPhotos[id]) return realPhotos[id];
  if (category) {
    const key = norm(category);
    if (categoryFallback[key]) return categoryFallback[key];
  }
  return undefined;
}

/** Resolve image for a utility by display name + type (real photo > category fallback). */
export function resolveUtilityImage(name: string, type?: string): CategoryImage | undefined {
  const id = utilityNameToId[norm(name)];
  if (id && realPhotos[id]) return realPhotos[id];
  if (type && utilityCategoryFallback[type]) return utilityCategoryFallback[type];
  return undefined;
}
