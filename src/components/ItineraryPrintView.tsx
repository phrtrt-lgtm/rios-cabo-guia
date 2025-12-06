import { MapPin, Clock, Car, Footprints } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import riosLogo from '@/assets/rios-logo-header.png';

interface ItineraryItem {
  placeName: string;
  category: string;
  bairro: string;
  lat: number;
  lng: number;
  duration: number;
  eta?: number;
  isFallback?: boolean;
}

interface DayItinerary {
  cafe: ItineraryItem[];
  manha: ItineraryItem[];
  almoco: ItineraryItem[];
  tarde: ItineraryItem[];
  fimDeTarde: ItineraryItem[];
  noite: ItineraryItem[];
  jantar: ItineraryItem[];
}

interface ItineraryPrintViewProps {
  itineraries: DayItinerary[];
  origin?: string;
  mode?: 'walking' | 'driving';
}

const TIME_BLOCKS = {
  cafe: { label: 'Café', emoji: '☕' },
  manha: { label: 'Manhã', emoji: '🌅' },
  almoco: { label: 'Almoço', emoji: '🍽️' },
  tarde: { label: 'Tarde', emoji: '☀️' },
  fimDeTarde: { label: 'Fim de Tarde', emoji: '🌆' },
  noite: { label: 'Noite', emoji: '🌙' },
  jantar: { label: 'Jantar', emoji: '🍴' },
} as const;

const CATEGORY_LABELS: { [key: string]: string } = {
  beach: 'Praia',
  island: 'Ilha',
  viewpoint: 'Mirante',
  landmark: 'Ponto Turístico',
  restaurant: 'Restaurante',
  trail: 'Trilha',
  photospot: 'Foto-spot',
  route: 'Rota',
};

const calculateTotalDayTime = (dayItinerary: DayItinerary): number => {
  return Object.values(dayItinerary).reduce((total, block) => {
    return total + block.reduce((blockTotal, item) => blockTotal + (item.eta || 0) + item.duration, 0);
  }, 0);
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
};

const getGoogleMapsUrl = (lat: number, lng: number, name: string): string => {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};

export const ItineraryPrintView = ({ itineraries, origin, mode = 'driving' }: ItineraryPrintViewProps) => {
  return (
    <div>
      {itineraries.map((dayItinerary, dayIndex) => {
        const hasContent = Object.values(dayItinerary).some(block => block.length > 0);
        if (!hasContent) return null;

        const totalTime = calculateTotalDayTime(dayItinerary);
        const placesCount = Object.values(dayItinerary).reduce((total, block) => total + block.length, 0);

        let currentMinutes = 7 * 60;

        return (
          <div 
            key={dayIndex} 
            className="itinerary-page" 
            style={{
              width: '210mm',
              minHeight: '297mm',
              backgroundColor: '#ffffff',
              padding: '10mm',
              fontFamily: 'Arial, sans-serif',
              boxSizing: 'border-box',
            }}
          >
            {/* Header com Logo */}
            <div style={{
              backgroundColor: '#1E3A5F',
              color: '#ffffff',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img 
                  src={riosLogo} 
                  alt="Rios" 
                  style={{ height: '40px', objectFit: 'contain' }} 
                />
                <div>
                  <div style={{
                    backgroundColor: '#E67E50',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    marginBottom: '4px',
                  }}>
                    Dia {dayIndex + 1}
                  </div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>Região dos Lagos • RJ</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{placesCount}</div>
                  <div style={{ fontSize: '9px', opacity: 0.7 }}>lugares</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{formatDuration(totalTime)}</div>
                  <div style={{ fontSize: '9px', opacity: 0.7 }}>total</div>
                </div>
              </div>
            </div>

            {origin && (
              <div style={{
                fontSize: '10px',
                padding: '6px 10px',
                backgroundColor: '#f3f4f6',
                borderRadius: '6px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#6b7280',
              }}>
                <MapPin size={12} />
                <span>Partindo de: {origin}</span>
              </div>
            )}

            {/* Timeline Content */}
            <div>
              {Object.entries(TIME_BLOCKS).map(([blockKey, { label, emoji }]) => {
                const block = dayItinerary[blockKey as keyof DayItinerary];
                if (block.length === 0) return null;

                return (
                  <div key={blockKey} style={{ marginBottom: '8px' }}>
                    {/* Block Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      backgroundColor: '#FEF3E8',
                      borderRadius: '6px',
                      marginBottom: '6px',
                      borderLeft: '4px solid #E67E50',
                    }}>
                      <span style={{ fontSize: '14px' }}>{emoji}</span>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E3A5F' }}>{label}</span>
                    </div>

                    {/* Places */}
                    {block.map((item, index) => {
                      const arrivalHour = Math.floor(currentMinutes / 60);
                      const arrivalMin = currentMinutes % 60;
                      const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;
                      
                      currentMinutes += (item.eta || 0) + item.duration;
                      const mapsUrl = getGoogleMapsUrl(item.lat, item.lng, item.placeName);

                      return (
                        <div key={index}>
                          {/* Travel Time */}
                          {item.eta && item.eta > 0 && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '4px 0',
                              marginLeft: '60px',
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                backgroundColor: '#FFF8E1',
                                border: '1px dashed #E67E50',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                color: '#E67E50',
                                fontSize: '10px',
                                fontWeight: 'bold',
                              }}>
                                {mode === 'driving' ? <Car size={12} /> : <Footprints size={12} />}
                                <span>{item.isFallback && '~'}{item.eta} min de deslocamento</span>
                              </div>
                            </div>
                          )}

                          {/* Place Card */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 10px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            marginBottom: '4px',
                            marginLeft: '10px',
                          }}>
                            {/* Time */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              color: '#1E3A5F',
                              fontWeight: 'bold',
                              minWidth: '50px',
                            }}>
                              <Clock size={12} />
                              {arrivalTime}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, marginLeft: '10px' }}>
                              <div style={{
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: '#1E3A5F',
                                marginBottom: '2px',
                              }}>
                                {item.placeName}
                              </div>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '9px',
                                color: '#6b7280',
                              }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                  <MapPin size={9} />
                                  {item.bairro}, Cabo Frio
                                </span>
                                <span style={{
                                  backgroundColor: '#E67E50',
                                  color: '#ffffff',
                                  padding: '2px 6px',
                                  borderRadius: '8px',
                                  fontSize: '8px',
                                }}>
                                  {CATEGORY_LABELS[item.category] || item.category}
                                </span>
                              </div>
                            </div>

                            {/* Duration */}
                            <div style={{ textAlign: 'right', minWidth: '45px', marginRight: '10px' }}>
                              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#E67E50' }}>
                                {item.duration}
                              </span>
                              <span style={{ fontSize: '9px', color: '#6b7280' }}>min</span>
                            </div>

                            {/* QR Code - Bigger */}
                            <div style={{
                              padding: '4px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '6px',
                            }}>
                              <QRCodeSVG 
                                value={mapsUrl}
                                size={45}
                                level="L"
                                bgColor="#ffffff"
                                fgColor="#1E3A5F"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{
              marginTop: '12px',
              padding: '8px 12px',
              backgroundColor: '#1E3A5F',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#ffffff',
              fontSize: '10px',
            }}>
              Criado com <strong>Guia Rios</strong> • @rios.cabofrio • Escaneie os QR codes para abrir no Google Maps
            </div>
          </div>
        );
      })}
    </div>
  );
};
