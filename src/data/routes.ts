export interface HydrationPoint {
  name: string;
  lat: number;
  lng: number;
}

export interface RunningRoute {
  id: string;
  name: string;
  city: string;
  distance_km: number;
  gain_m: number;
  surface: string;
  description: string;
  start: {
    name: string;
    lat: number;
    lng: number;
    mapsUrl: string;
  };
  hydrationPoints: HydrationPoint[];
  recommendedTime: string;
  warnings: string;
  polyline?: [number, number][];
}

export const runningRoutes: RunningRoute[] = [
  {
    id: 'cf-5k',
    name: 'CF 5K — Orla Praia do Forte + Canal',
    city: 'Cabo Frio',
    distance_km: 5.2,
    gain_m: 15,
    surface: 'Calçadão',
    description: 'Percurso plano pela orla até o Forte São Mateus, retornando pelo Boulevard Canal',
    start: {
      name: 'Praça das Águas',
      lat: -22.8891,
      lng: -42.0158,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Praça+das+Águas+Cabo+Frio',
    },
    hydrationPoints: [
      { name: 'Quiosques da orla', lat: -22.8880, lng: -42.0130 },
      { name: 'Conveniências Canal', lat: -22.8823, lng: -42.0224 },
    ],
    recommendedTime: '6–8h ou 17–19h',
    warnings: 'Atenção ao vento na orla; maior movimento de pedestres após 8h',
    polyline: [
      [-22.8891, -42.0158],
      [-22.8880, -42.0130],
      [-22.8869, -42.0119],
      [-22.8850, -42.0100],
      [-22.8840, -42.0150],
      [-22.8823, -42.0224],
      [-22.8891, -42.0158],
    ],
  },
  {
    id: 'cf-8k',
    name: 'CF 8K — Orla + Lagoa das Palmeiras (Park Lagos)',
    city: 'Cabo Frio',
    distance_km: 8.1,
    gain_m: 25,
    surface: 'Calçadão & ciclofaixa',
    description: 'Da orla até o Park Lagos, contornando parcialmente a Lagoa das Palmeiras',
    start: {
      name: 'Praça das Águas',
      lat: -22.8891,
      lng: -42.0158,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Praça+das+Águas+Cabo+Frio',
    },
    hydrationPoints: [
      { name: 'Quiosques da orla', lat: -22.8880, lng: -42.0130 },
      { name: 'Park Lagos (bebedouros/lojas)', lat: -22.8756, lng: -42.0389 },
    ],
    recommendedTime: '6–8h ou 18–20h',
    warnings: 'Ciclofaixa compartilhada em trechos; atenção a ciclistas',
    polyline: [
      [-22.8891, -42.0158],
      [-22.8880, -42.0130],
      [-22.8850, -42.0200],
      [-22.8820, -42.0280],
      [-22.8780, -42.0350],
      [-22.8756, -42.0389],
      [-22.8780, -42.0350],
      [-22.8820, -42.0280],
      [-22.8891, -42.0158],
    ],
  },
  {
    id: 'cf-12k',
    name: 'CF 12K — Peró ↔ Conchas ↔ Ogiva',
    city: 'Cabo Frio',
    distance_km: 12.3,
    gain_m: 45,
    surface: 'Calçadão & rua calma',
    description: 'Costeira urbana do Peró ao Morro do Vigia/Conchas, seguindo pela Ogiva',
    start: {
      name: 'Praia do Peró (quiosques centrais)',
      lat: -22.8598,
      lng: -42.0489,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Praia+do+Peró+Cabo+Frio',
    },
    hydrationPoints: [
      { name: 'Quiosques Peró', lat: -22.8598, lng: -42.0489 },
      { name: 'Quiosques Conchas', lat: -22.8645, lng: -42.0523 },
      { name: 'Mercadinhos Ogiva', lat: -22.8712, lng: -42.0578 },
    ],
    recommendedTime: '6–8h ou 17–19h',
    warnings: 'Ondulações leves; vento forte na orla; travessias de rua na Ogiva',
    polyline: [
      [-22.8598, -42.0489],
      [-22.8621, -42.0511],
      [-22.8645, -42.0523],
      [-22.8680, -42.0550],
      [-22.8712, -42.0578],
      [-22.8680, -42.0550],
      [-22.8645, -42.0523],
      [-22.8598, -42.0489],
    ],
  },
];

export const extensionRoutes: RunningRoute[] = [
  {
    id: 'arraial-6k',
    name: 'Arraial 6–8K — Praia Grande',
    city: 'Arraial do Cabo',
    distance_km: 7.0,
    gain_m: 10,
    surface: 'Calçadão',
    description: 'Out-and-back pelo calçadão até o deck do pôr do sol',
    start: {
      name: 'Praia Grande',
      lat: -22.9698,
      lng: -42.0278,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Praia+Grande+Arraial+do+Cabo',
    },
    hydrationPoints: [
      { name: 'Quiosques Praia Grande', lat: -22.9698, lng: -42.0278 },
    ],
    recommendedTime: '6–8h ou 17–19h',
    warnings: 'Calçadão pode ficar movimentado após 9h',
  },
  {
    id: 'buzios-7k',
    name: 'Búzios 7–9K — Orla Bardot ⇄ Ossos ⇄ João Fernandes',
    city: 'Armação dos Búzios',
    distance_km: 8.5,
    gain_m: 60,
    surface: 'Calçadão & rua calma',
    description: 'Percurso com subidas curtas pela orla e praias',
    start: {
      name: 'Orla Bardot',
      lat: -22.7472,
      lng: -41.8818,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Orla+Bardot+Búzios',
    },
    hydrationPoints: [
      { name: 'Conveniências Rua das Pedras', lat: -22.7472, lng: -41.8818 },
      { name: 'Quiosques João Fernandes', lat: -22.7589, lng: -41.8928 },
    ],
    recommendedTime: '6–8h ou 18–20h',
    warnings: 'Subidas curtas; atenção ao trânsito em ruas compartilhadas',
  },
];
