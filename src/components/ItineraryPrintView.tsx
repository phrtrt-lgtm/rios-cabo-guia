import { MapPin, Clock, Car, Footprints, Calendar } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
};

// Compact inline styles for PDF
const styles = {
  page: {
    width: '210mm',
    minHeight: '297mm',
    maxHeight: '297mm',
    backgroundColor: '#ffffff',
    padding: '8mm 10mm',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box' as const,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#1E3A5F',
    color: '#ffffff',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dayBadge: {
    backgroundColor: '#E67E50',
    color: '#ffffff',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
  },
  headerSubtitle: {
    fontSize: '10px',
    opacity: 0.7,
    margin: 0,
  },
  statsRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  stat: {
    textAlign: 'center' as const,
  },
  statValue: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: '8px',
    opacity: 0.7,
  },
  origin: {
    fontSize: '9px',
    padding: '4px 8px',
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#6b7280',
  },
  blockContainer: {
    marginBottom: '6px',
  },
  blockHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px',
    backgroundColor: '#FEF3E8',
    borderRadius: '4px',
    marginBottom: '4px',
    borderLeft: '3px solid #E67E50',
  },
  blockEmoji: {
    fontSize: '12px',
  },
  blockLabel: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  placeRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 6px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    marginBottom: '3px',
    marginLeft: '8px',
    gap: '6px',
  },
  placeTime: {
    fontSize: '9px',
    color: '#1E3A5F',
    fontWeight: 'bold',
    minWidth: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#1E3A5F',
    margin: 0,
  },
  placeMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '8px',
    color: '#6b7280',
  },
  placeCategory: {
    backgroundColor: '#E67E50',
    color: '#ffffff',
    padding: '1px 5px',
    borderRadius: '6px',
    fontSize: '7px',
  },
  placeDuration: {
    textAlign: 'right' as const,
    minWidth: '30px',
  },
  durationValue: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#E67E50',
  },
  durationLabel: {
    fontSize: '7px',
    color: '#6b7280',
  },
  qrCode: {
    width: '28px',
    height: '28px',
    padding: '2px',
    backgroundColor: '#ffffff',
    borderRadius: '2px',
  },
  travelConnector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '2px 0',
    marginLeft: '20px',
    color: '#9ca3af',
    fontSize: '8px',
  },
  travelBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    backgroundColor: '#FEF9E8',
    border: '1px dashed #E67E50',
    padding: '2px 6px',
    borderRadius: '8px',
    color: '#E67E50',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: '6px',
    padding: '6px 10px',
    backgroundColor: '#1E3A5F',
    borderRadius: '6px',
    textAlign: 'center' as const,
    color: '#ffffff',
    fontSize: '9px',
  },
  coordsText: {
    fontSize: '7px',
    color: '#9ca3af',
  },
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
          <div key={dayIndex} className="itinerary-page" style={styles.page}>
            {/* Compact Header */}
            <div style={styles.header}>
              <div style={styles.headerLeft}>
                <div style={styles.dayBadge}>
                  <Calendar size={10} />
                  <span>Dia {dayIndex + 1}</span>
                </div>
                <div>
                  <h1 style={styles.headerTitle}>Roteiro Cabo Frio</h1>
                  <p style={styles.headerSubtitle}>Região dos Lagos • RJ</p>
                </div>
              </div>
              <div style={styles.statsRow}>
                <div style={styles.stat}>
                  <div style={styles.statValue}>{placesCount}</div>
                  <div style={styles.statLabel}>lugares</div>
                </div>
                <div style={styles.stat}>
                  <div style={styles.statValue}>{formatDuration(totalTime)}</div>
                  <div style={styles.statLabel}>total</div>
                </div>
              </div>
            </div>

            {origin && (
              <div style={styles.origin}>
                <MapPin size={10} />
                <span>Partindo de: {origin}</span>
              </div>
            )}

            {/* Timeline Content - Compact */}
            <div>
              {Object.entries(TIME_BLOCKS).map(([blockKey, { label, emoji }]) => {
                const block = dayItinerary[blockKey as keyof DayItinerary];
                if (block.length === 0) return null;

                return (
                  <div key={blockKey} style={styles.blockContainer}>
                    <div style={styles.blockHeader}>
                      <span style={styles.blockEmoji}>{emoji}</span>
                      <span style={styles.blockLabel}>{label}</span>
                    </div>

                    <div>
                      {block.map((item, index) => {
                        const arrivalHour = Math.floor(currentMinutes / 60);
                        const arrivalMin = currentMinutes % 60;
                        const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;
                        
                        currentMinutes += (item.eta || 0) + item.duration;

                        const mapsUrl = getGoogleMapsUrl(item.lat, item.lng, item.placeName);

                        return (
                          <div key={index}>
                            {/* Travel Time Connector */}
                            {item.eta && item.eta > 0 && (
                              <div style={styles.travelConnector}>
                                <div style={styles.travelBadge}>
                                  {mode === 'driving' ? <Car size={8} /> : <Footprints size={8} />}
                                  <span>{item.isFallback && '~'}{item.eta}min de deslocamento</span>
                                </div>
                              </div>
                            )}

                            {/* Place Row - Compact */}
                            <div style={styles.placeRow}>
                              <div style={styles.placeTime}>
                                <Clock size={8} />
                                {arrivalTime}
                              </div>
                              
                              <div style={styles.placeInfo}>
                                <h3 style={styles.placeName}>{item.placeName}</h3>
                                <div style={styles.placeMeta}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    <MapPin size={7} />
                                    {item.bairro}, Cabo Frio
                                  </span>
                                  <span style={styles.placeCategory}>
                                    {CATEGORY_LABELS[item.category] || item.category}
                                  </span>
                                  <span style={styles.coordsText}>
                                    {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                                  </span>
                                </div>
                              </div>
                              
                              <div style={styles.placeDuration}>
                                <span style={styles.durationValue}>{item.duration}</span>
                                <span style={styles.durationLabel}>min</span>
                              </div>

                              {/* QR Code for Google Maps */}
                              <div style={styles.qrCode} title="Escaneie para abrir no Maps">
                                <QRCodeSVG 
                                  value={mapsUrl}
                                  size={24}
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
                  </div>
                );
              })}
            </div>

            {/* Compact Footer */}
            <div style={styles.footer}>
              Criado com <strong>Guia Rios</strong> • @rios.cabofrio • Escaneie os QR codes para abrir no Maps
            </div>
          </div>
        );
      })}
    </div>
  );
};
