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

const getGoogleMapsUrl = (lat: number, lng: number): string => {
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
              padding: '6mm 8mm',
              fontFamily: 'Arial, sans-serif',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
            }}
          >
            {/* Header */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4px' }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: 'middle' }}>
                    <img src={riosLogo} alt="Rios" style={{ height: '28px' }} />
                  </td>
                  <td style={{ verticalAlign: 'middle', paddingLeft: '10px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#E67E50', lineHeight: 1.2 }}>
                      Roteiro das Minhas Férias
                    </div>
                    <div style={{ fontSize: '9px', color: '#6b7280' }}>Região dos Lagos • RJ</div>
                  </td>
                  <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                    <span style={{
                      backgroundColor: '#E67E50',
                      color: '#fff',
                      padding: '3px 10px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                    }}>Dia {dayIndex + 1}</span>
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle', width: '50px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E3A5F' }}>{placesCount}</div>
                    <div style={{ fontSize: '7px', color: '#6b7280' }}>lugares</div>
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle', width: '50px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E3A5F' }}>{formatDuration(totalTime)}</div>
                    <div style={{ fontSize: '7px', color: '#6b7280' }}>total</div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div style={{ borderBottom: '2px solid #E67E50', marginBottom: '5px' }}></div>

            {origin && (
              <div style={{
                fontSize: '8px',
                padding: '3px 6px',
                backgroundColor: '#f9fafb',
                borderRadius: '3px',
                marginBottom: '5px',
                color: '#6b7280',
              }}>
                📍 Partindo de: {origin}
              </div>
            )}

            {/* Content - Using tables for perfect alignment */}
            {Object.entries(TIME_BLOCKS).map(([blockKey, { label, emoji }]) => {
              const block = dayItinerary[blockKey as keyof DayItinerary];
              if (block.length === 0) return null;

              return (
                <div key={blockKey} style={{ marginBottom: '4px' }}>
                  {/* Section Header */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3px' }}>
                    <tbody>
                      <tr>
                        <td style={{
                          backgroundColor: '#FEF3E8',
                          padding: '3px 8px',
                          borderLeft: '3px solid #E67E50',
                          borderRadius: '0 4px 4px 0',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: '#1E3A5F',
                        }}>
                          {emoji} {label}
                        </td>
                      </tr>
                    </tbody>
                  </table>

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
                          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
                            <tbody>
                              <tr>
                                <td style={{ textAlign: 'center', padding: '2px 0' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    backgroundColor: '#FFF8E1',
                                    border: '1px dashed #E67E50',
                                    padding: '2px 8px',
                                    borderRadius: '8px',
                                    color: '#E67E50',
                                    fontSize: '8px',
                                    fontWeight: 'bold',
                                  }}>
                                    {mode === 'driving' ? '🚗' : '🚶'} {item.isFallback && '~'}{item.eta} min de deslocamento
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}

                        {/* Place Card - Table for perfect alignment */}
                        <table style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          marginBottom: '3px',
                          backgroundColor: '#fff',
                        }}>
                          <tbody>
                            <tr>
                              {/* Time */}
                              <td style={{
                                width: '45px',
                                padding: '5px 6px',
                                verticalAlign: 'middle',
                                fontSize: '9px',
                                fontWeight: 'bold',
                                color: '#1E3A5F',
                              }}>
                                🕐 {arrivalTime}
                              </td>
                              
                              {/* Info */}
                              <td style={{ padding: '5px 8px', verticalAlign: 'middle' }}>
                                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1E3A5F', marginBottom: '1px' }}>
                                  {item.placeName}
                                </div>
                                <div style={{ fontSize: '7px', color: '#6b7280' }}>
                                  📍 {item.bairro}, Cabo Frio
                                  <span style={{
                                    backgroundColor: '#E67E50',
                                    color: '#fff',
                                    padding: '1px 4px',
                                    borderRadius: '4px',
                                    fontSize: '6px',
                                    marginLeft: '6px',
                                  }}>
                                    {CATEGORY_LABELS[item.category] || item.category}
                                  </span>
                                </div>
                              </td>
                              
                              {/* Duration */}
                              <td style={{
                                width: '50px',
                                padding: '5px',
                                verticalAlign: 'middle',
                                textAlign: 'right',
                              }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#E67E50' }}>{item.duration}</span>
                                <span style={{ fontSize: '7px', color: '#6b7280' }}>min</span>
                              </td>
                              
                              {/* QR Code */}
                              <td style={{
                                width: '45px',
                                padding: '4px',
                                verticalAlign: 'middle',
                              }}>
                                <div style={{
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '3px',
                                  padding: '2px',
                                  backgroundColor: '#fff',
                                  display: 'inline-block',
                                }}>
                                  <QRCodeSVG 
                                    value={mapsUrl}
                                    size={36}
                                    level="L"
                                    bgColor="#ffffff"
                                    fgColor="#1E3A5F"
                                  />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Footer */}
            <div style={{
              marginTop: '6px',
              padding: '4px 8px',
              backgroundColor: '#FEF3E8',
              borderRadius: '4px',
              textAlign: 'center',
              color: '#1E3A5F',
              fontSize: '8px',
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
