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
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff' }}>
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
              width: '794px',
              minHeight: '1123px',
              backgroundColor: '#ffffff',
              padding: '30px',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
            }}
          >
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '15px',
              paddingBottom: '10px',
              borderBottom: '3px solid #E67E50',
            }}>
              <img src={riosLogo} alt="Rios" style={{ height: '36px', marginRight: '15px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#E67E50', marginBottom: '2px' }}>
                  Roteiro das Minhas Férias
                </div>
                <div style={{ fontSize: '12px', color: '#666666' }}>Região dos Lagos • RJ</div>
              </div>
              <div style={{ 
                backgroundColor: '#E67E50', 
                color: '#ffffff', 
                padding: '6px 16px', 
                borderRadius: '15px',
                fontSize: '13px',
                fontWeight: 'bold',
                marginRight: '20px',
              }}>
                Dia {dayIndex + 1}
              </div>
              <div style={{ textAlign: 'center', marginRight: '15px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E3A5F' }}>{placesCount}</div>
                <div style={{ fontSize: '10px', color: '#666666' }}>lugares</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E3A5F' }}>{formatDuration(totalTime)}</div>
                <div style={{ fontSize: '10px', color: '#666666' }}>total</div>
              </div>
            </div>

            {origin && (
              <div style={{
                fontSize: '11px',
                padding: '6px 12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '6px',
                marginBottom: '12px',
                color: '#666666',
              }}>
                📍 Partindo de: {origin}
              </div>
            )}

            {/* Content */}
            {Object.entries(TIME_BLOCKS).map(([blockKey, { label, emoji }]) => {
              const block = dayItinerary[blockKey as keyof DayItinerary];
              if (block.length === 0) return null;

              return (
                <div key={blockKey} style={{ marginBottom: '12px' }}>
                  {/* Section Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#FEF3E8',
                    padding: '8px 12px',
                    borderLeft: '4px solid #E67E50',
                    marginBottom: '8px',
                    borderRadius: '0 6px 6px 0',
                  }}>
                    <span style={{ fontSize: '16px', marginRight: '8px' }}>{emoji}</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E3A5F' }}>{label}</span>
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
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '4px 0',
                          }}>
                            <span style={{
                              display: 'inline-block',
                              backgroundColor: '#FFF8E1',
                              border: '1px dashed #E67E50',
                              padding: '4px 14px',
                              borderRadius: '15px',
                              color: '#E67E50',
                              fontSize: '11px',
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
                          borderRadius: '8px',
                          padding: '10px 12px',
                          marginBottom: '6px',
                          backgroundColor: '#ffffff',
                        }}>
                          {/* QR Code - Left side */}
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            marginRight: '12px',
                            minWidth: '60px',
                          }}>
                            <div style={{
                              border: '1px solid #e0e0e0',
                              borderRadius: '6px',
                              padding: '4px',
                              backgroundColor: '#ffffff',
                            }}>
                              <QRCodeSVG 
                                value={mapsUrl}
                                size={50}
                                level="L"
                                bgColor="#ffffff"
                                fgColor="#1E3A5F"
                              />
                            </div>
                            <span style={{ 
                              fontSize: '8px', 
                              color: '#888888',
                              marginTop: '3px',
                              textAlign: 'center',
                            }}>
                              📍 Ver no Maps
                            </span>
                          </div>

                          {/* Time */}
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginRight: '12px',
                            minWidth: '50px',
                          }}>
                            <span style={{ fontSize: '10px', color: '#888888' }}>🕐</span>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E3A5F' }}>
                              {arrivalTime}
                            </span>
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontSize: '14px', 
                              fontWeight: 'bold', 
                              color: '#1E3A5F',
                              marginBottom: '3px',
                            }}>
                              {item.placeName}
                            </div>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              fontSize: '11px',
                              color: '#666666',
                            }}>
                              <span style={{ marginRight: '10px' }}>📍 {item.bairro}, Cabo Frio</span>
                              <span style={{
                                backgroundColor: '#E67E50',
                                color: '#ffffff',
                                padding: '2px 8px',
                                borderRadius: '8px',
                                fontSize: '9px',
                              }}>
                                {CATEGORY_LABELS[item.category] || item.category}
                              </span>
                            </div>
                          </div>

                          {/* Duration */}
                          <div style={{ 
                            textAlign: 'right',
                            minWidth: '55px',
                          }}>
                            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#E67E50' }}>
                              {item.duration}
                            </span>
                            <span style={{ fontSize: '11px', color: '#666666' }}>min</span>
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
              marginTop: '15px',
              padding: '10px 15px',
              backgroundColor: '#FEF3E8',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#1E3A5F',
              fontSize: '11px',
              borderTop: '3px solid #E67E50',
            }}>
              Criado com <strong style={{ color: '#E67E50' }}>Guia Rios</strong> • @rios.cabofrio • Escaneie os QR codes para abrir no Google Maps
            </div>
          </div>
        );
      })}
    </div>
  );
};
