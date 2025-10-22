import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PhotoSpot } from '@/data/photospots';
import { Button } from './ui/button';
import { Navigation, Plus } from 'lucide-react';

// Fix para ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface PhotoSpotsMapProps {
  spots: PhotoSpot[];
  onAddToItinerary?: (spotId: string) => void;
}

export function PhotoSpotsMap({ spots, onAddToItinerary }: PhotoSpotsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Inicializar o mapa
    const map = L.map(mapContainerRef.current, {
      center: [-22.88, -42.02],
      zoom: 10,
      scrollWheelZoom: true,
    });

    // Adicionar tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Adicionar marcadores
    spots.forEach((spot) => {
      const marker = L.marker([spot.lat, spot.lng]).addTo(map);
      
      // Criar conteúdo do popup
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2';
      popupContent.innerHTML = `
        <h3 class="font-bold text-base mb-1">${spot.name}</h3>
        <p class="text-sm text-muted-foreground mb-3">${spot.bairro}, ${spot.city}</p>
        <div class="flex flex-col gap-2" id="popup-buttons-${spot.id}"></div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280 });

      // Adicionar event listener para quando o popup abrir
      marker.on('popupopen', () => {
        const buttonsContainer = document.getElementById(`popup-buttons-${spot.id}`);
        if (!buttonsContainer) return;

        // Limpar conteúdo anterior
        buttonsContainer.innerHTML = '';

        // Botão "Como chegar"
        const linkButton = document.createElement('a');
        linkButton.href = spot.mapsUrl;
        linkButton.target = '_blank';
        linkButton.rel = 'noopener noreferrer';
        linkButton.className = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 w-full';
        linkButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-navigation">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
          Como chegar
        `;
        buttonsContainer.appendChild(linkButton);

        // Botão "Adicionar ao roteiro"
        if (onAddToItinerary) {
          const addButton = document.createElement('button');
          addButton.className = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 w-full';
          addButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            Adicionar ao roteiro
          `;
          addButton.onclick = () => onAddToItinerary(spot.id);
          buttonsContainer.appendChild(addButton);
        }
      });
    });

    // Ajustar bounds se houver marcadores
    if (spots.length > 0) {
      const bounds = L.latLngBounds(spots.map(spot => [spot.lat, spot.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }

    mapRef.current = map;

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [spots, onAddToItinerary]);

  if (spots.length === 0) {
    return (
      <div className="w-full h-[280px] md:h-[360px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum ponto disponível</p>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainerRef}
      className="w-full h-[280px] md:h-[360px] rounded-lg overflow-hidden border border-border shadow-lg" 
      id="photospots-map"
    />
  );
}
