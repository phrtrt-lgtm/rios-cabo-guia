import { PlaceCoords } from '@/services/distance.service';

// Coordenadas de praias e pontos turísticos
export const touristPlaces: PlaceCoords[] = [
  {
    id: 'praia-do-forte',
    name: 'Praia do Forte',
    category: 'beach',
    lat: -22.8796,
    lng: -42.0109,
    bairro: 'Centro',
  },
  {
    id: 'ilha-do-japones',
    name: 'Ilha do Japonês',
    category: 'island',
    lat: -22.8833,
    lng: -42.0072,
    bairro: 'Praia do Forte',
  },
  {
    id: 'pero-conchas',
    name: 'Peró & Conchas',
    category: 'beach',
    lat: -22.8122,
    lng: -41.9958,
    bairro: 'Peró',
  },
  {
    id: 'forte-sao-mateus',
    name: 'Forte São Mateus',
    category: 'landmark',
    lat: -22.8853,
    lng: -42.0186,
    bairro: 'Praia do Forte',
  },
  {
    id: 'morro-da-guia',
    name: 'Morro da Guia',
    category: 'viewpoint',
    lat: -22.8847,
    lng: -42.0053,
    bairro: 'Praia do Forte',
  },
  {
    id: 'bairro-passagem',
    name: 'Bairro da Passagem',
    category: 'landmark',
    lat: -22.8819,
    lng: -41.9992,
    bairro: 'Passagem',
  },
];

// Coordenadas de utilidades
export const utilityPlaces: PlaceCoords[] = [
  {
    id: 'droga-raia',
    name: 'Droga Raia',
    category: 'pharmacy',
    lat: -22.8784,
    lng: -42.0171,
    bairro: 'Palmeiras',
  },
  {
    id: 'drogaria-pacheco',
    name: 'Drogaria Pacheco',
    category: 'pharmacy',
    lat: -22.8756,
    lng: -42.0221,
    bairro: 'Centro',
  },
  {
    id: 'supermercado-carone',
    name: 'Supermercado Carone',
    category: 'supermarket',
    lat: -22.8834,
    lng: -42.0336,
    bairro: 'Braga',
  },
  {
    id: 'supermercado-extra',
    name: 'Supermercado Extra',
    category: 'supermarket',
    lat: -22.8798,
    lng: -42.0158,
    bairro: 'Novo Portinho',
  },
  {
    id: 'supermercado-princesa',
    name: 'Supermercado Princesa',
    category: 'supermarket',
    lat: -22.8911,
    lng: -42.0389,
    bairro: 'Braga',
  },
  {
    id: 'hortifruti-green',
    name: 'Hortifruti Green Fruit',
    category: 'supermarket',
    lat: -22.8801,
    lng: -42.0214,
    bairro: 'Centro',
  },
  {
    id: 'lojas-americanas',
    name: 'Lojas Americanas',
    category: 'store',
    lat: -22.8772,
    lng: -42.0231,
    bairro: 'Centro',
  },
  {
    id: 'padaria-remmar',
    name: 'Padaria Remmar',
    category: 'bakery',
    lat: -22.8932,
    lng: -42.0512,
    bairro: 'Braga',
  },
  {
    id: 'padaria-dupao',
    name: 'Padaria Dupão',
    category: 'bakery',
    lat: -22.8756,
    lng: -42.0268,
    bairro: 'Centro',
  },
  {
    id: 'pes-e-patas',
    name: 'Pés e Patas',
    category: 'petshop',
    lat: -22.8821,
    lng: -42.0307,
    bairro: 'Braga',
  },
  {
    id: 'racoes-e-cia',
    name: 'Rações & Cia',
    category: 'petshop',
    lat: -22.8799,
    lng: -42.0195,
    bairro: 'Centro',
  },
];

// Coordenadas de restaurantes (exemplos - você pode adicionar mais conforme necessário)
export const restaurantPlaces: PlaceCoords[] = [
  {
    id: 'restaurante-estrela-do-mar',
    name: 'Restaurante Estrela do Mar',
    category: 'restaurant',
    lat: -22.8819,
    lng: -41.9992,
    bairro: 'Passagem',
  },
  {
    id: 'oca-branca',
    name: 'Oca Branca',
    category: 'restaurant',
    lat: -22.8803,
    lng: -42.0112,
    bairro: 'Praia do Forte',
  },
  {
    id: 'mister-sheik',
    name: 'Mister Sheik',
    category: 'restaurant',
    lat: -22.8775,
    lng: -42.0234,
    bairro: 'Centro',
  },
];

// Todas as localidades
export const allPlaces: PlaceCoords[] = [
  ...touristPlaces,
  ...utilityPlaces,
  ...restaurantPlaces,
];
