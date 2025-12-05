import { MapPin, Clock, Car, Footprints, Calendar, Star } from 'lucide-react';
import riosLogo from '@/assets/rios-logo-header.png';

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

export const ItineraryPrintView = ({ itineraries, origin, mode = 'driving' }: ItineraryPrintViewProps) => {
  return (
    <div className="itinerary-print-container">
      {itineraries.map((dayItinerary, dayIndex) => {
        const hasContent = Object.values(dayItinerary).some(block => block.length > 0);
        if (!hasContent) return null;

        const totalTime = calculateTotalDayTime(dayItinerary);
        const placesCount = Object.values(dayItinerary).reduce((total, block) => total + block.length, 0);

        // Calculate timeline with estimated times
        let currentMinutes = 7 * 60; // Start at 7:00

        return (
          <div key={dayIndex} className="itinerary-page">
            {/* Beautiful Header */}
            <div className="itinerary-header">
              <div className="itinerary-header-bg"></div>
              <div className="itinerary-header-content">
                <div className="itinerary-logo-section">
                  <img src={riosLogo} alt="Rios" className="itinerary-logo" />
                </div>
                <div className="itinerary-title-section">
                  <div className="itinerary-badge">
                    <Calendar size={14} />
                    <span>Dia {dayIndex + 1}</span>
                  </div>
                  <h1 className="itinerary-main-title">Roteiro Cabo Frio</h1>
                  <p className="itinerary-subtitle">Região dos Lagos • RJ</p>
                </div>
                <div className="itinerary-stats">
                  <div className="itinerary-stat">
                    <span className="itinerary-stat-value">{placesCount}</span>
                    <span className="itinerary-stat-label">lugares</span>
                  </div>
                  <div className="itinerary-stat">
                    <span className="itinerary-stat-value">{formatDuration(totalTime)}</span>
                    <span className="itinerary-stat-label">total</span>
                  </div>
                </div>
              </div>
              {origin && (
                <div className="itinerary-origin">
                  <MapPin size={12} />
                  <span>Partindo de: {origin}</span>
                </div>
              )}
            </div>

            {/* Timeline Content */}
            <div className="itinerary-timeline">
              {Object.entries(TIME_BLOCKS).map(([blockKey, { label, start, emoji }]) => {
                const block = dayItinerary[blockKey as keyof DayItinerary];
                if (block.length === 0) return null;

                return (
                  <div key={blockKey} className="itinerary-block">
                    <div className="itinerary-block-header">
                      <span className="itinerary-block-emoji">{emoji}</span>
                      <span className="itinerary-block-label">{label}</span>
                    </div>

                    <div className="itinerary-places">
                      {block.map((item, index) => {
                        // Calculate estimated arrival time
                        const arrivalHour = Math.floor(currentMinutes / 60);
                        const arrivalMin = currentMinutes % 60;
                        const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;
                        
                        // Update time for next place
                        currentMinutes += (item.eta || 0) + item.duration;

                        return (
                          <div key={index} className="itinerary-place">
                            {/* Travel Time Connector */}
                            {item.eta && item.eta > 0 && (
                              <div className="itinerary-travel">
                                <div className="itinerary-travel-line"></div>
                                <div className="itinerary-travel-badge">
                                  {mode === 'driving' ? <Car size={10} /> : <Footprints size={10} />}
                                  <span>{item.isFallback && '~'}{item.eta}min</span>
                                </div>
                                <div className="itinerary-travel-line"></div>
                              </div>
                            )}

                            {/* Place Card */}
                            <div className="itinerary-place-card">
                              <div className="itinerary-place-time">
                                <Clock size={10} />
                                <span>{arrivalTime}</span>
                              </div>
                              <div className="itinerary-place-info">
                                <h3 className="itinerary-place-name">{item.placeName}</h3>
                                <div className="itinerary-place-meta">
                                  <span className="itinerary-place-location">
                                    <MapPin size={10} />
                                    {item.bairro}
                                  </span>
                                  <span className="itinerary-place-category">
                                    {CATEGORY_LABELS[item.category] || item.category}
                                  </span>
                                </div>
                              </div>
                              <div className="itinerary-place-duration">
                                <span className="itinerary-duration-value">{item.duration}</span>
                                <span className="itinerary-duration-label">min</span>
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

            {/* Beautiful Footer */}
            <div className="itinerary-footer">
              <div className="itinerary-footer-content">
                <div className="itinerary-footer-brand">
                  <Star size={14} className="itinerary-footer-star" />
                  <span>Criado com <strong>Guia Rios</strong></span>
                  <Star size={14} className="itinerary-footer-star" />
                </div>
                <p className="itinerary-footer-link">@rios.cabofrio</p>
              </div>
              <div className="itinerary-footer-wave"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};