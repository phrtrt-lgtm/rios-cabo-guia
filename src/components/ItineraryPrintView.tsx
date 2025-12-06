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

const getGoogleMapsUrl = (lat: number, lng: number): string => {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};

export const ItineraryPrintView = ({ itineraries, origin, mode = 'driving' }: ItineraryPrintViewProps) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {itineraries.map((dayItinerary, dayIndex) => {
        const hasContent = Object.values(dayItinerary).some(block => block.length > 0);
        if (!hasContent) return null;

        const totalTime = calculateTotalDayTime(dayItinerary);
        const placesCount = Object.values(dayItinerary).reduce((total, block) => total + block.length, 0);

        let currentMinutes = 7 * 60;

        return (
          <div 
            key={dayIndex} 
            style={{
              width: '210mm',
              minHeight: '297mm',
              backgroundColor: '#ffffff',
              padding: '8mm',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
            }}
          >
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '8px',
              borderBottom: '2px solid #E67E50',
              paddingBottom: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={riosLogo} alt="Rios" style={{ height: '30px' }} />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#E67E50' }}>
                    Roteiro das Minhas Férias
                  </div>
                  <div style={{ fontSize: '10px', color: '#666' }}>Região dos Lagos • RJ</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  backgroundColor: '#E67E50',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                }}>Dia {dayIndex + 1}</span>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E3A5F' }}>{placesCount}</div>
                  <div style={{ fontSize: '8px', color: '#666' }}>lugares</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E3A5F' }}>{formatDuration(totalTime)}</div>
                  <div style={{ fontSize: '8px', color: '#666' }}>total</div>
                </div>
              </div>
            </div>

            {origin && (
              <div style={{
                fontSize: '9px',
                padding: '4px 8px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                marginBottom: '8px',
                color: '#666',
              }}>
                📍 Partindo de: {origin}
              </div>
            )}

            {/* Content */}
            {Object.entries(TIME_BLOCKS).map(([blockKey, { label, emoji }]) => {
              const block = dayItinerary[blockKey as keyof DayItinerary];
              if (block.length === 0) return null;

              return (
                <div key={blockKey} style={{ marginBottom: '8px' }}>
                  {/* Section Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#FEF3E8',
                    padding: '5px 10px',
                    borderLeft: '3px solid #E67E50',
                    marginBottom: '6px',
                  }}>
                    <span style={{ fontSize: '14px' }}>{emoji}</span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1E3A5F' }}>{label}</span>
                  </div>

                  {/* Places */}
                  {block.map((item, index) => {
                    const arrivalHour = Math.floor(currentMinutes / 60);
                    const arrivalMin = currentMinutes % 60;
                    const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;
                    
                    currentMinutes += (item.eta || 0) + item.duration;
                    const mapsUrl = getGoogleMapsUrl(item.lat, item.lng);

                    return (
                      <div key={index}>
                        {/* Travel Time */}
                        {item.eta && item.eta > 0 && (
                          <div style={{ textAlign: 'center', padding: '3px 0' }}>
                            <span style={{
                              display: 'inline-block',
                              backgroundColor: '#FFF8E1',
                              border: '1px dashed #E67E50',
                              padding: '3px 12px',
                              borderRadius: '12px',
                              color: '#E67E50',
                              fontSize: '9px',
                              fontWeight: 'bold',
                            }}>
                              {mode === 'driving' ? '🚗' : '🚶'} {item.isFallback && '~'}{item.eta} min de deslocamento
                            </span>
                          </div>
                        )}

                        {/* Place Card */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          padding: '8px',
                          marginBottom: '4px',
                          backgroundColor: '#fff',
                          gap: '10px',
                        }}>
                          {/* QR Code - Left side */}
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            minWidth: '55px',
                          }}>
                            <div style={{
                              border: '1px solid #e0e0e0',
                              borderRadius: '4px',
                              padding: '3px',
                              backgroundColor: '#fff',
                            }}>
                              <QRCodeSVG 
                                value={mapsUrl}
                                size={45}
                                level="L"
                                bgColor="#ffffff"
                                fgColor="#1E3A5F"
                              />
                            </div>
                            <span style={{ 
                              fontSize: '6px', 
                              color: '#888',
                              marginTop: '2px',
                              textAlign: 'center',
                            }}>
                              📍 Maps
                            </span>
                          </div>

                          {/* Time */}
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '40px',
                          }}>
                            <span style={{ fontSize: '8px', color: '#888' }}>🕐</span>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#1E3A5F' }}>
                              {arrivalTime}
                            </span>
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1 }}>
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
                              color: '#666',
                            }}>
                              <span>📍 {item.bairro}, Cabo Frio</span>
                              <span style={{
                                backgroundColor: '#E67E50',
                                color: '#fff',
                                padding: '2px 6px',
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
                            minWidth: '45px',
                          }}>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#E67E50' }}>
                              {item.duration}
                            </span>
                            <span style={{ fontSize: '9px', color: '#666' }}>min</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Footer */}
            <div style={{
              marginTop: '10px',
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
