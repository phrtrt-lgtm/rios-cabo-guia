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

interface ItineraryPrintViewProps {
  itineraries: ItineraryItem[][];
  startTimes: string[];
  origin?: string;
  mode?: 'walking' | 'driving';
}

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

const timeToMinutes = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
};

const formatTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const calculateTotalDayTime = (items: ItineraryItem[]): number => {
  return items.reduce((total, item) => total + (item.eta || 0) + item.duration, 0);
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

export const ItineraryPrintView = ({ itineraries, startTimes, origin, mode = 'driving' }: ItineraryPrintViewProps) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff' }}>
      {itineraries.map((dayItems, dayIndex) => {
        if (dayItems.length === 0) return null;

        const totalTime = calculateTotalDayTime(dayItems);
        const startTime = startTimes[dayIndex] || '08:00';
        let currentMinutes = timeToMinutes(startTime);

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
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '3px solid #E67E50',
            }}>
              <img src={riosLogo} alt="Rios" style={{ height: '40px', marginRight: '20px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#E67E50', marginBottom: '3px' }}>
                  Roteiro das Minhas Férias
                </div>
                <div style={{ fontSize: '13px', color: '#666666' }}>Região dos Lagos • RJ</div>
              </div>
              <div style={{ 
                backgroundColor: '#E67E50', 
                color: '#ffffff', 
                padding: '8px 20px', 
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                marginRight: '25px',
              }}>
                Dia {dayIndex + 1}
              </div>
              <div style={{ textAlign: 'center', marginRight: '20px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E3A5F' }}>{dayItems.length}</div>
                <div style={{ fontSize: '11px', color: '#666666' }}>lugares</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E3A5F' }}>{formatDuration(totalTime)}</div>
                <div style={{ fontSize: '11px', color: '#666666' }}>total</div>
              </div>
            </div>

            {origin && (
              <div style={{
                fontSize: '12px',
                padding: '8px 15px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                marginBottom: '15px',
                color: '#666666',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span>📍 Partindo de: {origin}</span>
                <span style={{ fontWeight: 'bold', color: '#1E3A5F' }}>
                  🕐 Início: {startTime}
                </span>
              </div>
            )}

            {/* Lista de lugares */}
            <div>
              {dayItems.map((item, index) => {
                // Calcular horários
                const arrivalTime = formatTime(currentMinutes);
                currentMinutes += (item.eta || 0);
                const startActivityTime = formatTime(currentMinutes);
                currentMinutes += item.duration;
                const endTime = formatTime(currentMinutes);
                
                const mapsUrl = getGoogleMapsUrl(item.lat, item.lng);

                return (
                  <div key={index}>
                    {/* Tempo de deslocamento */}
                    {item.eta && item.eta > 0 && (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '8px 0',
                      }}>
                        <span style={{
                          display: 'inline-block',
                          backgroundColor: '#FFF8E1',
                          border: '1px dashed #E67E50',
                          padding: '6px 16px',
                          borderRadius: '20px',
                          color: '#E67E50',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}>
                          {mode === 'driving' ? '🚗' : '🚶'} {item.isFallback && '~'}{item.eta} min de deslocamento
                        </span>
                      </div>
                    )}

                    {/* Card do lugar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #e0e0e0',
                      borderRadius: '10px',
                      padding: '12px 15px',
                      marginBottom: '8px',
                      backgroundColor: '#ffffff',
                    }}>
                      {/* Horário */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginRight: '15px',
                        minWidth: '70px',
                        padding: '8px',
                        backgroundColor: '#f0f9ff',
                        borderRadius: '8px',
                      }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E3A5F' }}>
                          {startActivityTime}
                        </span>
                        <span style={{ fontSize: '10px', color: '#666666' }}>
                          até {endTime}
                        </span>
                      </div>

                      {/* Número */}
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#E67E50',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        marginRight: '15px',
                        flexShrink: 0,
                      }}>
                        {index + 1}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, marginRight: '15px' }}>
                        <div style={{ 
                          fontSize: '15px', 
                          fontWeight: 'bold', 
                          color: '#1E3A5F',
                          marginBottom: '4px',
                        }}>
                          {item.placeName}
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          fontSize: '12px',
                          color: '#666666',
                        }}>
                          <span style={{ marginRight: '12px' }}>📍 {item.bairro}, Cabo Frio</span>
                          <span style={{
                            backgroundColor: '#1E3A5F',
                            color: '#ffffff',
                            padding: '3px 10px',
                            borderRadius: '10px',
                            fontSize: '10px',
                          }}>
                            {CATEGORY_LABELS[item.category] || item.category}
                          </span>
                        </div>
                      </div>

                      {/* Duração */}
                      <div style={{ 
                        textAlign: 'center',
                        marginRight: '15px',
                        minWidth: '60px',
                      }}>
                        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#E67E50' }}>
                          {item.duration}
                        </div>
                        <div style={{ fontSize: '10px', color: '#666666' }}>minutos</div>
                      </div>

                      {/* QR Code */}
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                      }}>
                        <div style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '5px',
                          backgroundColor: '#ffffff',
                        }}>
                          <QRCodeSVG 
                            value={mapsUrl}
                            size={55}
                            level="L"
                            bgColor="#ffffff"
                            fgColor="#1E3A5F"
                          />
                        </div>
                        <span style={{ 
                          fontSize: '9px', 
                          color: '#888888',
                          marginTop: '4px',
                          textAlign: 'center',
                        }}>
                          📍 Ver no Maps
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{
              marginTop: '20px',
              padding: '12px 20px',
              backgroundColor: '#FEF3E8',
              borderRadius: '10px',
              textAlign: 'center',
              color: '#1E3A5F',
              fontSize: '12px',
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
