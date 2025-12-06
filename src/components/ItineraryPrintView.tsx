import { QRCodeSVG } from 'qrcode.react';
import riosLogo from '@/assets/rios-logo-header.png';
import { Clock, MapPin, Calendar, Car, Footprints, Route } from 'lucide-react';

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
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#ffffff' }}>
      {itineraries.map((dayItems, dayIndex) => {
        if (dayItems.length === 0) return null;

        const totalTime = calculateTotalDayTime(dayItems);
        const startTime = startTimes[dayIndex] || '08:00';
        let currentMinutes = timeToMinutes(startTime);
        const totalHours = Math.floor(totalTime / 60);
        const totalMins = totalTime % 60;

        // Calcular horários de cada item
        const itemTimes = dayItems.map((item) => {
          const arrivalTime = formatTime(currentMinutes);
          currentMinutes += (item.eta || 0);
          const startActivityTime = formatTime(currentMinutes);
          currentMinutes += item.duration;
          const endTime = formatTime(currentMinutes);
          return { arrivalTime, startActivityTime, endTime };
        });

        // Resetar currentMinutes para recalcular no mapa
        currentMinutes = timeToMinutes(startTime);
        const endTime = dayItems.length > 0 ? itemTimes[itemTimes.length - 1]?.endTime : startTime;

        return (
          <div 
            key={dayIndex} 
            className="itinerary-page"
            style={{
              width: '794px',
              minHeight: '1123px',
              backgroundColor: '#ffffff',
              padding: '24px',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
            }}
          >
            {/* Header com Logo */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: '2px solid #E67E50',
            }}>
              <img src={riosLogo} alt="Rios" style={{ height: '36px', marginRight: '16px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E3A5F' }}>
                  Meu Roteiro
                </div>
                <div style={{ fontSize: '12px', color: '#666666' }}>Região dos Lagos • RJ</div>
              </div>
            </div>

            {/* Instruções - Réplica do builder */}
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(30, 58, 95, 0.2)',
              background: 'linear-gradient(to right, rgba(30, 58, 95, 0.05), rgba(30, 58, 95, 0.02), transparent)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(30, 58, 95, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Route style={{ width: '16px', height: '16px', color: '#1E3A5F' }} />
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#1E3A5F', marginBottom: '4px' }}>
                  Roteiro do Dia {dayIndex + 1}
                </div>
                <div style={{ fontSize: '11px', color: '#666666' }}>
                  Escaneie os QR codes para abrir cada local no Google Maps
                </div>
              </div>
            </div>

            {/* Header do dia - Réplica do builder */}
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(230, 126, 80, 0.2)',
              background: 'linear-gradient(to right, rgba(230, 126, 80, 0.1), rgba(230, 126, 80, 0.05), transparent)',
              marginBottom: '12px',
            }}>
              {/* Linha 1: Título + Tempo total */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#E67E50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Calendar style={{ width: '18px', height: '18px', color: '#ffffff' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1E3A5F' }}>Dia {dayIndex + 1}</div>
                    <div style={{ fontSize: '12px', color: '#666666' }}>{dayItems.length} lugares</div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#E67E50' }}>
                    {totalHours > 0 ? `${totalHours}h${totalMins > 0 ? totalMins : ''}` : `${totalMins}min`}
                  </div>
                  <div style={{ fontSize: '10px', color: '#666666' }}>tempo total</div>
                </div>
              </div>
              
              {/* Linha 2: Horário início + Range */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock style={{ width: '14px', height: '14px', color: '#666666' }} />
                  <span style={{ fontSize: '12px', color: '#666666' }}>Início: {startTime}</span>
                </div>
                
                {dayItems.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <span style={{ fontWeight: '500', color: '#1E3A5F' }}>{startTime}</span>
                    <span style={{ color: '#666666' }}>→</span>
                    <span style={{ fontWeight: '500', color: '#1E3A5F' }}>{endTime}</span>
                  </div>
                )}

                {origin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#666666' }}>
                    <MapPin style={{ width: '12px', height: '12px' }} />
                    <span>Partindo de: {origin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lista de lugares - Réplica exata do builder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dayItems.map((item, index) => {
                const times = itemTimes[index];
                const prevItem = index > 0 ? dayItems[index - 1] : null;
                const mapsUrl = getGoogleMapsUrl(item.lat, item.lng);

                return (
                  <div key={index}>
                    {/* Conector de deslocamento - Mais compacto */}
                    {item.eta && item.eta > 0 && (
                      <div style={{ padding: '4px 8px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          backgroundColor: 'rgba(230, 126, 80, 0.05)',
                          border: '1px dashed rgba(230, 126, 80, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                        }}>
                          {mode === 'driving' ? (
                            <Car style={{ width: '14px', height: '14px', color: '#E67E50' }} />
                          ) : (
                            <Footprints style={{ width: '14px', height: '14px', color: '#E67E50' }} />
                          )}
                          <span style={{ fontSize: '11px', color: '#666666' }}>
                            <span style={{ fontWeight: '500', color: '#1E3A5F' }}>
                              {prevItem ? prevItem.placeName : origin || 'Origem'}
                            </span>
                            <span style={{ margin: '0 6px', color: '#E67E50' }}>→</span>
                            <span style={{ fontWeight: '500', color: '#1E3A5F' }}>{item.placeName}</span>
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#E67E50' }}>
                            {item.isFallback && '~'}{item.eta} min
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Card do lugar */}
                    <div style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}>
                      {/* Número da ordem */}
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#E67E50',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        flexShrink: 0,
                      }}>
                        {index + 1}
                      </div>

                      {/* Horário */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: '55px',
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E3A5F' }}>
                          {times?.startActivityTime}
                        </span>
                        <span style={{ fontSize: '9px', color: '#666666' }}>
                          até {times?.endTime}
                        </span>
                      </div>

                      {/* Info - sem corte */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          fontWeight: '600', 
                          fontSize: '13px', 
                          color: '#1E3A5F',
                          marginBottom: '2px',
                          lineHeight: '1.2',
                        }}>
                          {item.placeName}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666666' }}>
                          {item.bairro}
                        </div>
                      </div>

                      {/* Tempo de permanência - mais compacto */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        flexShrink: 0,
                      }}>
                        <Clock style={{ width: '12px', height: '12px', color: '#666666' }} />
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#1E3A5F' }}>
                          {item.duration}min
                        </span>
                      </div>

                      {/* QR Code - maior */}
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        flexShrink: 0,
                      }}>
                        <div style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          padding: '4px',
                          backgroundColor: '#ffffff',
                        }}>
                          <QRCodeSVG 
                            value={mapsUrl}
                            size={58}
                            level="L"
                            bgColor="#ffffff"
                            fgColor="#1E3A5F"
                          />
                        </div>
                        <span style={{ 
                          fontSize: '8px', 
                          color: '#888888',
                          marginTop: '2px',
                        }}>
                          Maps
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
              padding: '10px 16px',
              backgroundColor: 'rgba(230, 126, 80, 0.1)',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#1E3A5F',
              fontSize: '11px',
              borderTop: '2px solid #E67E50',
            }}>
              Criado com <strong style={{ color: '#E67E50' }}>Guia Rios</strong> • @rios.cabofrio
            </div>
          </div>
        );
      })}
    </div>
  );
};
