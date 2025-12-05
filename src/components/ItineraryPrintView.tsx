import { MapPin, Clock, Car, Footprints, Calendar, Star } from 'lucide-react';

interface ItineraryItem {
  placeName: string;
  category: string;
  bairro: string;
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
  cafe: { label: 'Café', start: '07:00', emoji: '☕' },
  manha: { label: 'Manhã', start: '09:00', emoji: '🌅' },
  almoco: { label: 'Almoço', start: '12:00', emoji: '🍽️' },
  tarde: { label: 'Tarde', start: '14:00', emoji: '☀️' },
  fimDeTarde: { label: 'Fim de Tarde', start: '17:00', emoji: '🌆' },
  noite: { label: 'Noite', start: '19:00', emoji: '🌙' },
  jantar: { label: 'Jantar', start: '21:00', emoji: '🍴' },
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
  return mins > 0 ? `${hours}h${mins}min` : `${hours}h`;
};

// Inline styles for PDF generation (html2canvas compatible)
const styles = {
  page: {
    width: '210mm',
    minHeight: '297mm',
    backgroundColor: '#ffffff',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box' as const,
  },
  header: {
    backgroundColor: '#1E3A5F',
    color: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
  },
  headerSubtitle: {
    fontSize: '14px',
    opacity: 0.8,
    margin: 0,
  },
  dayBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#E67E50',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  statsRow: {
    display: 'flex',
    gap: '20px',
    marginTop: '12px',
  },
  stat: {
    textAlign: 'center' as const,
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: '11px',
    opacity: 0.7,
  },
  origin: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    marginTop: '12px',
    padding: '8px 12px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '6px',
  },
  blockContainer: {
    marginBottom: '16px',
  },
  blockHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '10px',
    borderLeft: '4px solid #E67E50',
  },
  blockEmoji: {
    fontSize: '18px',
  },
  blockLabel: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  placeCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '8px',
    marginLeft: '20px',
  },
  placeTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: '#6b7280',
    minWidth: '50px',
  },
  placeInfo: {
    flex: 1,
    marginLeft: '12px',
  },
  placeName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1E3A5F',
    margin: '0 0 4px 0',
  },
  placeMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '11px',
    color: '#6b7280',
  },
  placeLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  placeCategory: {
    backgroundColor: '#E67E50',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '10px',
  },
  placeDuration: {
    textAlign: 'right' as const,
    minWidth: '50px',
  },
  durationValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#E67E50',
  },
  durationLabel: {
    fontSize: '10px',
    color: '#6b7280',
  },
  travelConnector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '6px 0',
    marginLeft: '40px',
    color: '#9ca3af',
    fontSize: '11px',
  },
  travelLine: {
    width: '30px',
    height: '1px',
    backgroundColor: '#d1d5db',
  },
  travelBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#f3f4f6',
    padding: '4px 8px',
    borderRadius: '12px',
  },
  footer: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: '#1E3A5F',
    borderRadius: '8px',
    textAlign: 'center' as const,
    color: '#ffffff',
  },
  footerText: {
    fontSize: '12px',
    margin: 0,
  },
  footerLink: {
    fontSize: '11px',
    opacity: 0.7,
    margin: '4px 0 0 0',
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
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.dayBadge}>
                <Calendar size={14} />
                <span>Dia {dayIndex + 1}</span>
              </div>
              <h1 style={styles.headerTitle}>Roteiro Cabo Frio</h1>
              <p style={styles.headerSubtitle}>Região dos Lagos • RJ</p>
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
              {origin && (
                <div style={styles.origin}>
                  <MapPin size={12} />
                  <span>Partindo de: {origin}</span>
                </div>
              )}
            </div>

            {/* Timeline Content */}
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

                        return (
                          <div key={index}>
                            {/* Travel Time Connector */}
                            {item.eta && item.eta > 0 && (
                              <div style={styles.travelConnector}>
                                <div style={styles.travelLine}></div>
                                <div style={styles.travelBadge}>
                                  {mode === 'driving' ? <Car size={10} /> : <Footprints size={10} />}
                                  <span>{item.isFallback && '~'}{item.eta}min</span>
                                </div>
                                <div style={styles.travelLine}></div>
                              </div>
                            )}

                            {/* Place Card */}
                            <div style={styles.placeCard}>
                              <div style={styles.placeTime}>
                                <Clock size={10} />
                                <span>{arrivalTime}</span>
                              </div>
                              <div style={styles.placeInfo}>
                                <h3 style={styles.placeName}>{item.placeName}</h3>
                                <div style={styles.placeMeta}>
                                  <span style={styles.placeLocation}>
                                    <MapPin size={10} />
                                    {item.bairro}
                                  </span>
                                  <span style={styles.placeCategory}>
                                    {CATEGORY_LABELS[item.category] || item.category}
                                  </span>
                                </div>
                              </div>
                              <div style={styles.placeDuration}>
                                <span style={styles.durationValue}>{item.duration}</span>
                                <span style={styles.durationLabel}>min</span>
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

            {/* Footer */}
            <div style={styles.footer}>
              <p style={styles.footerText}>
                <Star size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Criado com <strong>Guia Rios</strong>
                <Star size={12} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />
              </p>
              <p style={styles.footerLink}>@rios.cabofrio</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
