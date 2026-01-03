import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "pt" | "en" | "es";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations dictionary
const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Header & Navigation
    "nav.home": "Início",
    "nav.beaches": "Praias",
    "nav.utilities": "Utilidades",
    "nav.gastronomy": "Gastronomia",
    "nav.arraial": "Arraial",
    "nav.buzios": "Búzios",
    "nav.trails": "Trilhas",
    "nav.photospots": "Foto-spots",
    "nav.routes": "Rotas",
    "nav.about": "Sobre",
    "header.subtitle": "Guia Turístico de Cabo Frio",
    
    // Sections
    "section.welcome": "Boas-vindas & Como Usar Este Guia",
    "section.beaches": "Praias & Pontos Turísticos",
    "section.utilities": "Utilidades",
    "section.gastronomy": "Gastronomia",
    "section.arraial": "Arraial do Cabo",
    "section.buzios": "Búzios",
    "section.trails": "Trilhas",
    "section.photospots": "Foto-spots",
    "section.routes": "Rotas de Corrida & Ciclismo",
    "section.about": "Sobre o Imóvel",
    
    // Common
    "common.seeMore": "Ver mais",
    "common.seeOnMap": "Ver no mapa",
    "common.walking": "A pé",
    "common.driving": "De carro",
    "common.minutes": "min",
    "common.hours": "h",
    "common.km": "km",
    "common.difficulty": "Dificuldade",
    "common.duration": "Duração",
    "common.distance": "Distância",
    "common.tips": "Dicas",
    "common.description": "Descrição",
    "common.bestTime": "Melhor horário",
    "common.phone": "Telefone",
    "common.address": "Endereço",
    
    // Difficulty levels
    "difficulty.easy": "Fácil",
    "difficulty.moderate": "Moderada",
    "difficulty.hard": "Difícil",
    
    // Categories
    "category.beach": "Praia",
    "category.landmark": "Ponto turístico",
    "category.restaurant": "Restaurante",
    "category.pharmacy": "Farmácia",
    "category.supermarket": "Supermercado",
    "category.bakery": "Padaria",
    "category.petshop": "Pet Shop",
    "category.trail": "Trilha",
    "category.viewpoint": "Mirante",
    
    // Chatbot
    "chatbot.title": "Guia Rios",
    "chatbot.subtitle": "Seu assistente turístico",
    "chatbot.placeholder": "Digite sua pergunta...",
    "chatbot.suggestions": "Sugestões",
    "chatbot.greeting": "Olá! 👋 Sou o Guia Rios, seu assistente turístico de Cabo Frio e região.",
    "chatbot.help": "Pergunte sobre praias, restaurantes, passeios, trilhas ou qualquer dica da região!",
    
    // Itinerary
    "itinerary.title": "Montar Roteiro",
    "itinerary.addPlace": "Adicionar lugar",
    "itinerary.morning": "Manhã",
    "itinerary.afternoon": "Tarde",
    "itinerary.evening": "Noite",
    "itinerary.export": "Exportar PDF",
    "itinerary.clear": "Limpar",
    
    // Distance widget
    "distance.myLocation": "Minha localização",
    "distance.enterAddress": "Digite um endereço",
    "distance.sortByTime": "Ordenar por tempo",
    "distance.calculating": "Calculando distâncias...",
    
    // Footer
    "footer.copyright": "© 2025 Rios • Cabo Frio, RJ • Feito com carinho para nossos hóspedes",
  },
  en: {
    // Header & Navigation
    "nav.home": "Home",
    "nav.beaches": "Beaches",
    "nav.utilities": "Utilities",
    "nav.gastronomy": "Dining",
    "nav.arraial": "Arraial",
    "nav.buzios": "Búzios",
    "nav.trails": "Trails",
    "nav.photospots": "Photo spots",
    "nav.routes": "Routes",
    "nav.about": "About",
    "header.subtitle": "Cabo Frio Tourist Guide",
    
    // Sections
    "section.welcome": "Welcome & How to Use This Guide",
    "section.beaches": "Beaches & Tourist Spots",
    "section.utilities": "Utilities",
    "section.gastronomy": "Dining",
    "section.arraial": "Arraial do Cabo",
    "section.buzios": "Búzios",
    "section.trails": "Trails",
    "section.photospots": "Photo spots",
    "section.routes": "Running & Cycling Routes",
    "section.about": "About the Property",
    
    // Common
    "common.seeMore": "See more",
    "common.seeOnMap": "See on map",
    "common.walking": "Walking",
    "common.driving": "Driving",
    "common.minutes": "min",
    "common.hours": "h",
    "common.km": "km",
    "common.difficulty": "Difficulty",
    "common.duration": "Duration",
    "common.distance": "Distance",
    "common.tips": "Tips",
    "common.description": "Description",
    "common.bestTime": "Best time",
    "common.phone": "Phone",
    "common.address": "Address",
    
    // Difficulty levels
    "difficulty.easy": "Easy",
    "difficulty.moderate": "Moderate",
    "difficulty.hard": "Hard",
    
    // Categories
    "category.beach": "Beach",
    "category.landmark": "Landmark",
    "category.restaurant": "Restaurant",
    "category.pharmacy": "Pharmacy",
    "category.supermarket": "Supermarket",
    "category.bakery": "Bakery",
    "category.petshop": "Pet Shop",
    "category.trail": "Trail",
    "category.viewpoint": "Viewpoint",
    
    // Chatbot
    "chatbot.title": "Rios Guide",
    "chatbot.subtitle": "Your tourist assistant",
    "chatbot.placeholder": "Type your question...",
    "chatbot.suggestions": "Suggestions",
    "chatbot.greeting": "Hello! 👋 I'm Rios Guide, your Cabo Frio and region tourist assistant.",
    "chatbot.help": "Ask about beaches, restaurants, tours, trails or any tips about the region!",
    
    // Itinerary
    "itinerary.title": "Build Itinerary",
    "itinerary.addPlace": "Add place",
    "itinerary.morning": "Morning",
    "itinerary.afternoon": "Afternoon",
    "itinerary.evening": "Evening",
    "itinerary.export": "Export PDF",
    "itinerary.clear": "Clear",
    
    // Distance widget
    "distance.myLocation": "My location",
    "distance.enterAddress": "Enter an address",
    "distance.sortByTime": "Sort by time",
    "distance.calculating": "Calculating distances...",
    
    // Footer
    "footer.copyright": "© 2025 Rios • Cabo Frio, RJ • Made with love for our guests",
  },
  es: {
    // Header & Navigation
    "nav.home": "Inicio",
    "nav.beaches": "Playas",
    "nav.utilities": "Utilidades",
    "nav.gastronomy": "Gastronomía",
    "nav.arraial": "Arraial",
    "nav.buzios": "Búzios",
    "nav.trails": "Senderos",
    "nav.photospots": "Foto-spots",
    "nav.routes": "Rutas",
    "nav.about": "Sobre",
    "header.subtitle": "Guía Turística de Cabo Frio",
    
    // Sections
    "section.welcome": "Bienvenida & Cómo Usar Esta Guía",
    "section.beaches": "Playas & Puntos Turísticos",
    "section.utilities": "Utilidades",
    "section.gastronomy": "Gastronomía",
    "section.arraial": "Arraial do Cabo",
    "section.buzios": "Búzios",
    "section.trails": "Senderos",
    "section.photospots": "Foto-spots",
    "section.routes": "Rutas de Running & Ciclismo",
    "section.about": "Sobre la Propiedad",
    
    // Common
    "common.seeMore": "Ver más",
    "common.seeOnMap": "Ver en mapa",
    "common.walking": "Caminando",
    "common.driving": "En auto",
    "common.minutes": "min",
    "common.hours": "h",
    "common.km": "km",
    "common.difficulty": "Dificultad",
    "common.duration": "Duración",
    "common.distance": "Distancia",
    "common.tips": "Consejos",
    "common.description": "Descripción",
    "common.bestTime": "Mejor horario",
    "common.phone": "Teléfono",
    "common.address": "Dirección",
    
    // Difficulty levels
    "difficulty.easy": "Fácil",
    "difficulty.moderate": "Moderado",
    "difficulty.hard": "Difícil",
    
    // Categories
    "category.beach": "Playa",
    "category.landmark": "Punto turístico",
    "category.restaurant": "Restaurante",
    "category.pharmacy": "Farmacia",
    "category.supermarket": "Supermercado",
    "category.bakery": "Panadería",
    "category.petshop": "Pet Shop",
    "category.trail": "Sendero",
    "category.viewpoint": "Mirador",
    
    // Chatbot
    "chatbot.title": "Guía Rios",
    "chatbot.subtitle": "Tu asistente turístico",
    "chatbot.placeholder": "Escribe tu pregunta...",
    "chatbot.suggestions": "Sugerencias",
    "chatbot.greeting": "¡Hola! 👋 Soy Guía Rios, tu asistente turístico de Cabo Frio y región.",
    "chatbot.help": "¡Pregunta sobre playas, restaurantes, tours, senderos o cualquier consejo de la región!",
    
    // Itinerary
    "itinerary.title": "Crear Itinerario",
    "itinerary.addPlace": "Agregar lugar",
    "itinerary.morning": "Mañana",
    "itinerary.afternoon": "Tarde",
    "itinerary.evening": "Noche",
    "itinerary.export": "Exportar PDF",
    "itinerary.clear": "Limpiar",
    
    // Distance widget
    "distance.myLocation": "Mi ubicación",
    "distance.enterAddress": "Ingresa una dirección",
    "distance.sortByTime": "Ordenar por tiempo",
    "distance.calculating": "Calculando distancias...",
    
    // Footer
    "footer.copyright": "© 2025 Rios • Cabo Frio, RJ • Hecho con cariño para nuestros huéspedes",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language") as Language;
    return saved || "pt";
  });
  const [isLoading, setIsLoading] = useState(false);

  const setLanguage = (lang: Language) => {
    setIsLoading(true);
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    setTimeout(() => setIsLoading(false), 100);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || fallback || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
