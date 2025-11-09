import { MapPin, Clock, Navigation, Calendar } from 'lucide-react';
import riosLogo from '@/assets/rios-logo-full.png';

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
  cafe: { label: 'Café da Manhã', start: '07:00', end: '09:00', icon: '☕' },
  manha: { label: 'Manhã', start: '09:00', end: '12:00', icon: '🌅' },
  almoco: { label: 'Almoço', start: '12:00', end: '14:00', icon: '🍽️' },
  tarde: { label: 'Tarde', start: '14:00', end: '17:00', icon: '☀️' },
  fimDeTarde: { label: 'Fim de Tarde', start: '17:00', end: '19:00', icon: '🌆' },
  noite: { label: 'Noite', start: '19:00', end: '21:00', icon: '🌙' },
  jantar: { label: 'Jantar', start: '21:00', end: '23:00', icon: '🍴' },
} as const;

const calculateBlockTime = (block: ItineraryItem[]): number => {
  return block.reduce((total, item) => total + (item.eta || 0) + item.duration, 0);
};

export const ItineraryPrintView = ({ itineraries, origin, mode = 'driving' }: ItineraryPrintViewProps) => {
  return (
    <div className="print-only hidden">
      {itineraries.map((dayItinerary, dayIndex) => {
        const hasContent = Object.values(dayItinerary).some(block => block.length > 0);
        if (!hasContent) return null;

        return (
          <div key={dayIndex} className="print-page">
            {/* Header */}
            <div className="print-header">
              <img src={riosLogo} alt="Rios" className="print-logo" />
              <div className="print-header-content">
                <h1 className="print-title">Roteiro - Dia {dayIndex + 1}</h1>
                <p className="print-subtitle">Região dos Lagos • Cabo Frio</p>
                {origin && (
                  <div className="print-origin">
                    <MapPin className="w-4 h-4" />
                    <span>Origem: {origin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="print-timeline">
              {Object.entries(TIME_BLOCKS).map(([blockKey, { label, start, end, icon }]) => {
                const block = dayItinerary[blockKey as keyof DayItinerary];
                if (block.length === 0) return null;

                const totalTime = calculateBlockTime(block);

                return (
                  <div key={blockKey} className="print-block">
                    <div className="print-block-header">
                      <div className="print-block-title">
                        <span className="print-block-icon">{icon}</span>
                        <div>
                          <h2 className="print-block-name">{label}</h2>
                          <p className="print-block-time">{start} - {end}</p>
                        </div>
                      </div>
                      <div className="print-block-total">
                        <Clock className="w-4 h-4" />
                        <span>{totalTime} min</span>
                      </div>
                    </div>

                    <div className="print-places">
                      {block.map((item, index) => (
                        <div key={index} className="print-place">
                          <div className="print-place-number">{index + 1}</div>
                          <div className="print-place-content">
                            <div className="print-place-header">
                              <h3 className="print-place-name">{item.placeName}</h3>
                              <span className="print-place-category">{item.category}</span>
                            </div>
                            <p className="print-place-location">
                              <MapPin className="w-3 h-3" />
                              {item.bairro}
                            </p>
                            <div className="print-place-meta">
                              {item.eta && item.eta > 0 && (
                                <span className="print-place-eta">
                                  <Navigation className="w-3 h-3" />
                                  {item.isFallback && '~'}{item.eta} min
                                  <span className="print-place-mode">({mode === 'walking' ? 'a pé' : 'carro'})</span>
                                </span>
                              )}
                              <span className="print-place-duration">
                                <Clock className="w-3 h-3" />
                                {item.duration} min
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="print-footer">
              <p>Criado com o Guia Rios • Região dos Lagos</p>
              <p>www.airbnb.com.br/users/profile/1465782997269992090</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
