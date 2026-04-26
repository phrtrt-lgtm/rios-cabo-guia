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
