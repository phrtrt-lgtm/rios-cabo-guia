// Generic category thumbnails (Wikimedia Commons, free licenses).
// Used when a specific establishment photo is not available.

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

const make = (src: string, artist: string, license: string): CategoryImage => ({
  src,
  credit: `Foto: ${artist} · ${license} (Wikimedia Commons)`,
});

// ===== Utilities (by `type` prop) =====
export const utilityCategoryImages: Record<string, CategoryImage> = {
  pharmacy: make(pharmacy, 'Junius', 'Public domain'),
  supermarket: make(supermarket, 'Eugenio Hansen, OFS', 'CC BY-SA 4.0'),
  bakery: make(bakery, 'Eduardo P', 'CC BY-SA 3.0'),
  petshop: make(petshop, 'Globetrotter19', 'CC BY-SA 3.0'),
  store: make(store, 'Joe Mabel', 'CC BY-SA 3.0'),
};

// Special override per utility id (e.g. hortifruti → fruit/veg image)
export const utilityIdImages: Record<string, CategoryImage> = {
  'hortifruti-green': make(hortifruti, 'Nberbar', 'CC BY-SA 4.0'),
};

// ===== Restaurants (mapped from id → cuisine image) =====
export const restaurantImages: Record<string, CategoryImage> = {
  'lena-casa-italiana': make(italian, 'Pixel.la Free Stock Photos', 'CC0'),
  'arcos-do-canal': make(seafood, 'Under the same moon...', 'CC BY 2.0'),
  'fixi-restaurante': make(seafood, 'Under the same moon...', 'CC BY 2.0'),
  'kento-cozinha-oriental': make(japanese, 'Luvpixy', 'CC BY-SA 4.0'),
  'casa-kanaloa': make(seafood, 'Under the same moon...', 'CC BY 2.0'),
  'picanha-do-ze': make(steakhouse, 'Leonardo "Leguas" Carvalho', 'CC BY-SA 2.5'),
  'cabo-grill': make(steakhouse, 'Leonardo "Leguas" Carvalho', 'CC BY-SA 2.5'),
  'paelo-hamburgueria': make(burger, 'JIP', 'CC BY-SA 4.0'),
  'sem-frescura-burger': make(burger, 'JIP', 'CC BY-SA 4.0'),
  'bem-fresh': make(healthy, 'Shixart1985', 'CC BY 2.0'),
  'office-cafe': make(cafe, 'Frettie', 'CC BY 3.0'),
  'espaco-cafe': make(cafe, 'Frettie', 'CC BY 3.0'),
  'o-suisso': make(dessert, 'Mayra (Maych) on Flickr', 'CC BY-SA 2.0'),
  'brigaderia-da-vovo': make(dessert, 'Mayra (Maych) on Flickr', 'CC BY-SA 2.0'),
  'los-crepes': make(crepe, 'Rudy Herman', 'CC BY 2.0'),
  'nova-onda': make(seafood, 'Under the same moon...', 'CC BY 2.0'),
  'restaurante-estrela-do-mar': make(seafood, 'Under the same moon...', 'CC BY 2.0'),
  'oca-branca': make(seafood, 'Under the same moon...', 'CC BY 2.0'),
  'mister-sheik': make(arabic, 'PattayaPatrol', 'CC BY-SA 4.0'),
};

export function getUtilityImage(id: string, type?: string): CategoryImage | undefined {
  if (utilityIdImages[id]) return utilityIdImages[id];
  if (type && utilityCategoryImages[type]) return utilityCategoryImages[type];
  return undefined;
}

export function getRestaurantImage(id: string): CategoryImage | undefined {
  return restaurantImages[id];
}

// ===== Auto-resolution by name (used by card components) =====
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Map normalized restaurant name → cuisine image key
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

// Fallback by cuisine category label (PT)
const categoryFallback: Record<string, CategoryImage> = {
  italiano: make(italian, 'Pixel.la Free Stock Photos', 'CC0'),
  mediterraneo: make(seafood, 'Under the same moon...', 'CC BY 2.0'),
  'frutos-do-mar': make(seafood, 'Under the same moon...', 'CC BY 2.0'),
  peixes: make(seafood, 'Under the same moon...', 'CC BY 2.0'),
  japones: make(japanese, 'Luvpixy', 'CC BY-SA 4.0'),
  oriental: make(japanese, 'Luvpixy', 'CC BY-SA 4.0'),
  asiatico: make(japanese, 'Luvpixy', 'CC BY-SA 4.0'),
  tailandes: make(seafood, 'Under the same moon...', 'CC BY 2.0'),
  carnes: make(steakhouse, 'Leonardo "Leguas" Carvalho', 'CC BY-SA 2.5'),
  churrasco: make(steakhouse, 'Leonardo "Leguas" Carvalho', 'CC BY-SA 2.5'),
  espetinhos: make(steakhouse, 'Leonardo "Leguas" Carvalho', 'CC BY-SA 2.5'),
  'hamburguer': make(burger, 'JIP', 'CC BY-SA 4.0'),
  hamburgueria: make(burger, 'JIP', 'CC BY-SA 4.0'),
  saudavel: make(healthy, 'Shixart1985', 'CC BY 2.0'),
  acai: make(healthy, 'Shixart1985', 'CC BY 2.0'),
  cafe: make(cafe, 'Frettie', 'CC BY 3.0'),
  cafeteria: make(cafe, 'Frettie', 'CC BY 3.0'),
  'cafe-brunch': make(cafe, 'Frettie', 'CC BY 3.0'),
  doces: make(dessert, 'Mayra (Maych) on Flickr', 'CC BY-SA 2.0'),
  confeitaria: make(dessert, 'Mayra (Maych) on Flickr', 'CC BY-SA 2.0'),
  sobremesas: make(dessert, 'Mayra (Maych) on Flickr', 'CC BY-SA 2.0'),
  sorveteria: make(dessert, 'Mayra (Maych) on Flickr', 'CC BY-SA 2.0'),
  creperia: make(crepe, 'Rudy Herman', 'CC BY 2.0'),
  arabe: make(arabic, 'PattayaPatrol', 'CC BY-SA 4.0'),
  pizza: make(italian, 'Pixel.la Free Stock Photos', 'CC0'),
};

/** Resolve image for a restaurant by its display name, with optional category fallback. */
export function resolveRestaurantImage(name: string, category?: string): CategoryImage | undefined {
  const id = restaurantNameToId[norm(name)];
  if (id && restaurantImages[id]) return restaurantImages[id];
  if (category) {
    const key = norm(category);
    if (categoryFallback[key]) return categoryFallback[key];
  }
  return undefined;
}

// Map normalized utility name → utility id
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

/** Resolve image for a utility by its display name + type. */
export function resolveUtilityImage(name: string, type?: string): CategoryImage | undefined {
  const id = utilityNameToId[norm(name)];
  if (id && utilityIdImages[id]) return utilityIdImages[id];
  if (type && utilityCategoryImages[type]) return utilityCategoryImages[type];
  return undefined;
}

