// Central registry mapping place/trail IDs to local thumbnail images.
// All photos are sourced from Wikimedia Commons under their respective free licenses.
// Credits are shown discreetly on each card (artist + license).

import praiaDoForte from '@/assets/places/praia-do-forte.jpg';
import ilhaDoJapones from '@/assets/places/ilha-do-japones.jpg';
import peroConchas from '@/assets/places/pero-conchas.jpg';
import reservaDoPero from '@/assets/places/reserva-do-pero.jpg';
import forteSaoMateus from '@/assets/places/forte-sao-mateus.jpg';
import morroDaGuia from '@/assets/places/morro-da-guia.jpg';
import bairroPassagem from '@/assets/places/bairro-passagem.jpg';
import praiaDoForno from '@/assets/places/praia-do-forno.jpg';
import prainhasPontal from '@/assets/places/prainhas-pontal.jpg';
import praiaGrandeArraial from '@/assets/places/praia-grande-arraial.jpg';
import grutaAzul from '@/assets/places/gruta-azul.jpg';
import pontalAtalaia from '@/assets/places/pontal-atalaia.jpg';
import ilhaDoFarol from '@/assets/places/ilha-do-farol.jpg';
import praiaJoaoFernandes from '@/assets/places/praia-joao-fernandes.jpg';
import praiaGeriba from '@/assets/places/praia-geriba.jpg';
import praiaAzeda from '@/assets/places/praia-azeda.jpg';
import praiaFerradura from '@/assets/places/praia-ferradura.jpg';
import orlaBardot from '@/assets/places/orla-bardot.jpg';
import ruaPedras from '@/assets/places/rua-pedras.jpg';
import morroPontudaBuzios from '@/assets/places/morro-pontuda-buzios.jpg';
import morroVigiaCaboFrio from '@/assets/places/morro-vigia-cabo-frio.jpg';
import dunasPeroCaboFrio from '@/assets/places/dunas-pero-cabo-frio.jpg';

export interface PlaceImage {
  src: string;
  /** Short attribution: "Photo: <author> · <license>" */
  credit: string;
}

const make = (src: string, artist: string, license: string): PlaceImage => ({
  src,
  credit: `Foto: ${artist} · ${license} (Wikimedia Commons)`,
});

// Map keyed by place / trail ID used elsewhere in the app.
// Multiple IDs can share the same photo when they refer to nearby/related spots.
export const placeImages: Record<string, PlaceImage> = {
  // ========= Cabo Frio =========
  'praia-do-forte': make(praiaDoForte, 'Ezarate', 'CC BY-SA 3.0'),
  'ilha-do-japones': make(ilhaDoJapones, 'Rodrigo Gadelha', 'CC BY-SA 3.0'),
  'pero-conchas': make(peroConchas, 'Carlos Erbs Jr / MTur Destinos', 'Public domain'),
  'reserva-do-pero': make(reservaDoPero, 'Odemilson', 'CC BY-SA 4.0'),
  'forte-sao-mateus': make(forteSaoMateus, 'Halley Pacheco de Oliveira', 'CC BY-SA 3.0'),
  'morro-da-guia': make(morroDaGuia, 'Josué Marinho', 'CC BY 3.0'),
  'bairro-passagem': make(bairroPassagem, 'Newton Paz Peres', 'CC BY-SA 3.0'),

  // ========= Arraial do Cabo =========
  'praia-do-forno': make(praiaDoForno, 'Bruna Sieiro', 'CC BY-SA 3.0'),
  'prainhas-pontal-atalaia': make(prainhasPontal, 'Sophydiah', 'CC BY-SA 4.0'),
  'praia-grande-arraial': make(praiaGrandeArraial, 'Luis Eduardo Souza', 'CC BY-SA 4.0'),
  'gruta-azul-arraial': make(grutaAzul, 'Ezarate', 'CC BY-SA 3.0'),
  'praia-do-farol': make(ilhaDoFarol, 'Ezarate', 'CC BY-SA 3.0'),
  'praia-dos-anjos': make(pontalAtalaia, 'Gladstone Peixoto Moraes', 'Public domain'),
  'prainha-arraial': make(pontalAtalaia, 'Gladstone Peixoto Moraes', 'Public domain'),

  // ========= Búzios =========
  'praia-joao-fernandes': make(praiaJoaoFernandes, 'Halley Pacheco de Oliveira', 'CC BY-SA 3.0'),
  'praia-geribá': make(praiaGeriba, 'Patrick Montenegro', 'CC0'),
  'praia-azeda': make(praiaAzeda, 'Halley Pacheco de Oliveira', 'CC BY-SA 3.0'),
  'praia-ferradura': make(praiaFerradura, 'Msadp77', 'CC BY-SA 3.0'),
  'praia-ferradurinha': make(praiaFerradura, 'Msadp77', 'CC BY-SA 3.0'),
  'orla-bardot': make(orlaBardot, 'Josué Marinho', 'CC BY 3.0'),
  'porto-da-barra': make(orlaBardot, 'Josué Marinho', 'CC BY 3.0'),
  'rua-das-pedras': make(ruaPedras, 'Josué Marinho', 'CC BY 3.0'),
  'praia-tartaruga': make(morroPontudaBuzios, 'Gledson Agra de Carvalho', 'CC BY-SA 4.0'),
  'praia-brava': make(morroPontudaBuzios, 'Gledson Agra de Carvalho', 'CC BY-SA 4.0'),

  // ========= Trails =========
  'morro-vigia-cabo-frio': make(morroVigiaCaboFrio, 'Carlos Erbs Jr / MTur Destinos', 'Public domain'),
  'dunas-pero-cabo-frio': make(dunasPeroCaboFrio, 'Eduardo Cerqueira dos Santos', 'CC BY-SA 3.0'),
  'lencois-pero-cabo-frio': make(dunasPeroCaboFrio, 'Eduardo Cerqueira dos Santos', 'CC BY-SA 3.0'),
  'morro-guia-cabo-frio': make(morroDaGuia, 'Josué Marinho', 'CC BY 3.0'),
  'praia-forno-arraial': make(praiaDoForno, 'Bruna Sieiro', 'CC BY-SA 3.0'),
  'praia-brava-arraial': make(praiaGrandeArraial, 'Luis Eduardo Souza', 'CC BY-SA 4.0'),
  'circuito-atalaia-arraial': make(pontalAtalaia, 'Gladstone Peixoto Moraes', 'Public domain'),
  'prainhas-atalaia-arraial': make(prainhasPontal, 'Sophydiah', 'CC BY-SA 4.0'),
  'serra-emerencias-buzios': make(morroPontudaBuzios, 'Gledson Agra de Carvalho', 'CC BY-SA 4.0'),
};

export function getPlaceImage(id: string): PlaceImage | undefined {
  return placeImages[id];
}
