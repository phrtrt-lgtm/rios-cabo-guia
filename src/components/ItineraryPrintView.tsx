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
              padding: '8mm 10mm',
              fontFamily: 'Arial, sans-serif',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
            }}
          >
            {/* Header - Logo + Título */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
              paddingBottom: '6px',
              borderBottom: '2px solid #E67E50',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={riosLogo} 
                  alt="Rios" 
                  style={{ height: '32px', objectFit: 'contain' }} 
                />
                <div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#E67E50',
                    lineHeight: 1.1,
                  }}>
                    Roteiro das Minhas Férias
                  </div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>
                    Região dos Lagos • RJ
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  backgroundColor: '#E67E50',
                  color: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}>
                  Dia {dayIndex + 1}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E3A5F' }}>{placesCount}</div>
                  <div style={{ fontSize: '8px', color: '#6b7280' }}>lugares</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E3A5F' }}>{formatDuration(totalTime)}</div>
                  <div style={{ fontSize: '8px', color: '#6b7280' }}>total</div>
                </div>
              </div>
            </div>

            {origin && (
              <div style={{
                fontSize: '9px',
                padding: '4px 8px',
                backgroundColor: '#f9fafb',
                borderRadius: '4px',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#6b7280',
              }}>
                <MapPin size={10} />
                <span>Partindo de: {origin}</span>
              </div>
            )}

            {/* Timeline Content */}
            <div>
              {Object.entries(TIME_BLOCKS).map(([blockKey, { label, emoji }]) => {
                const block = dayItinerary[blockKey as keyof DayItinerary];
                if (block.length === 0) return null;

                return (
                  <div key={blockKey} style={{ marginBottom: '6px' }}>
                    {/* Block Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 8px',
                      backgroundColor: '#FEF3E8',
                      borderRadius: '4px',
                      marginBottom: '4px',
                      borderLeft: '3px solid #E67E50',
                    }}>
                      <span style={{ fontSize: '12px' }}>{emoji}</span>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#1E3A5F' }}>{label}</span>
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
                          {/* Travel Time - Centralizado e alinhado */}
                          {item.eta && item.eta > 0 && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '2px 0',
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                backgroundColor: '#FFF8E1',
                                border: '1px dashed #E67E50',
                                padding: '2px 10px',
                                borderRadius: '10px',
                                color: '#E67E50',
                                fontSize: '9px',
                                fontWeight: 'bold',
                              }}>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                  {mode === 'driving' ? <Car size={10} /> : <Footprints size={10} />}
                                </span>
                                <span>{item.isFallback && '~'}{item.eta} min de deslocamento</span>
                              </div>
                            </div>
                          )}

                          {/* Place Card */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 8px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            marginBottom: '3px',
                          }}>
                            {/* Time */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '10px',
                              color: '#1E3A5F',
                              fontWeight: 'bold',
                              minWidth: '42px',
                            }}>
                              <Clock size={10} />
                              {arrivalTime}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, marginLeft: '8px' }}>
                              <div style={{
                                fontSize: '11px',
                                fontWeight: 'bold',
                                color: '#1E3A5F',
                                marginBottom: '1px',
                              }}>
                                {item.placeName}
                              </div>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '8px',
                                color: '#6b7280',
                              }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                  <MapPin size={8} />
                                  {item.bairro}, Cabo Frio
                                </span>
                                <span style={{
                                  backgroundColor: '#E67E50',
                                  color: '#ffffff',
                                  padding: '1px 5px',
                                  borderRadius: '6px',
                                  fontSize: '7px',
                                }}>
                                  {CATEGORY_LABELS[item.category] || item.category}
                                </span>
                              </div>
                            </div>

                            {/* Duration */}
                            <div style={{ 
                              textAlign: 'right', 
                              minWidth: '40px', 
                              marginRight: '8px',
                              display: 'flex',
                              alignItems: 'baseline',
                              justifyContent: 'flex-end',
                              gap: '1px',
                            }}>
                              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#E67E50' }}>
                                {item.duration}
                              </span>
                              <span style={{ fontSize: '8px', color: '#6b7280' }}>min</span>
                            </div>

                            {/* QR Code */}
                            <div style={{
                              padding: '3px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '4px',
                            }}>
                              <QRCodeSVG 
                                value={mapsUrl}
                                size={40}
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
              marginTop: 'auto',
              padding: '6px 10px',
              backgroundColor: '#FEF3E8',
              borderRadius: '6px',
              textAlign: 'center',
              color: '#1E3A5F',
              fontSize: '9px',
              borderTop: '2px solid #E67E50',
            }}>
              Criado com <strong style={{ color: '#E67E50' }}>Guia Rios</strong> • @rios.cabofrio • Escaneie os QR codes para abrir no Google Maps
            </div>
          </div>
        );
      })}
    </div>
  );
};
