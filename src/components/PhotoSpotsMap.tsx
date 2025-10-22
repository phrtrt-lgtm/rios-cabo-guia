import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
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

// Componente para ajustar o bounds do mapa
function FitBounds({ spots }: { spots: PhotoSpot[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (spots.length > 0) {
      const bounds = L.latLngBounds(spots.map(spot => [spot.lat, spot.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [spots, map]);
  
  return null;
}

export function PhotoSpotsMap({ spots, onAddToItinerary }: PhotoSpotsMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Centro inicial (aproximadamente no meio da região)
  const center: [number, number] = [-22.88, -42.02];

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="w-full h-[360px] md:h-[420px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Carregando mapa...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[280px] md:h-[360px] rounded-lg overflow-hidden border border-border shadow-lg" id="photospots-map">
      <MapContainer
        center={center}
        zoom={11}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
        >
          {spots.map((spot) => (
            <Marker
              key={spot.id}
              position={[spot.lat, spot.lng]}
            >
              <Popup maxWidth={280}>
                <div className="p-2">
                  <h3 className="font-bold text-base mb-1">{spot.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {spot.bairro}, {spot.city}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <a
                        href={spot.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Como chegar
                      </a>
                    </Button>
                    {onAddToItinerary && (
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={() => onAddToItinerary(spot.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar ao roteiro
                      </Button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        
        <FitBounds spots={spots} />
      </MapContainer>
    </div>
  );
}
