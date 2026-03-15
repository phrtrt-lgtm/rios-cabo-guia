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
    "section.beaches": "Praias & Pontos Clássicos",
    "section.utilities": "Essenciais por Bairro — Utilidades",
    "section.gastronomy": "Gastronomia — Curadoria Rios",
    "section.arraial": "Arraial do Cabo",
    "section.buzios": "Búzios",
    "section.trails": "Trilhas da Região dos Lagos",
    "section.photospots": "Foto-spots & Horário da Luz",
    "section.routes": "Rotas para Correr/Pedalar",
    "section.about": "Sobre Nós",
    "section.shopping": "Shopping Park Lagos",
    
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
    "common.howToGet": "Como chegar",
    "common.seeProperties": "Ver Nossos Imóveis",
    "common.seeOnAirbnb": "Ver Imóveis no Airbnb",
    "common.downloadPDF": "Baixar PDF das Trilhas",
    "common.showMap": "Mostrar mapa",
    "common.hideMap": "Ocultar mapa",
    "common.buildItinerary": "Montar meu roteiro",
    "common.filterTrails": "Filtrar trilhas",
    "common.allCities": "Todas as cidades",
    "common.allLevels": "Todos os níveis",
    "common.allDurations": "Todas as durações",
    "common.allViews": "Todas as vistas",
    "common.reward": "Recompensa",
    "common.alerts": "Atenção",
    "common.angle": "Ângulo",
    "common.tip": "Dica",
    "common.time": "Horário",
    "common.start": "Início",
    "common.hydration": "Hidratação",
    "common.warnings": "Avisos",
    "common.elevation": "Elevação",
    "common.surface": "Piso",
    "common.estimatedPace": "Tempo estimado por pace",
    "common.seeBoarding": "Ver ponto de embarque",
    "common.note": "Nota",
    
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
    "category.italian": "Italiano",
    "category.asian": "Asiático / Japonês",
    "category.brazilian": "Brasileiro / Churrasco",
    "category.burgers": "Hamburguerias",
    "category.healthy": "Saudável / Leve",
    "category.cafes": "Cafés & Doces",
    "category.crepes": "Crepes",
    "category.buffet": "Buffet de Café",
    "category.seafood": "Frutos do Mar",
    "category.pharmacies": "Farmácias",
    "category.supermarkets": "Supermercados & Hortifruti",
    "category.variety": "Variedades & Conveniência",
    "category.bakeries": "Padarias & Confeitarias",
    "category.petshops": "Pet Shops",
    
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
    
    // Weather
    "weather.title": "Clima em Cabo Frio",
    "weather.humidity": "Umidade",
    "weather.wind": "Vento",
    "weather.forecast": "Previsão 5 dias",
    "weather.error": "Erro ao carregar clima",
    "weather.tipRain": "☔ Leve guarda-chuva! Bom dia para museus e restaurantes.",
    "weather.tipHot": "🌡️ Dia quente! Hidrate-se e use protetor solar.",
    "weather.tipNice": "☀️ Tempo agradável para passeios ao ar livre!",
    
    // Events
    "events.title": "Eventos & Festivais",
    "events.subtitle": "Calendário de eventos da região",
    "events.recurring": "Anual",
    "events.showMore": "Ver todos",
    "events.showLess": "Ver menos",
    "events.tip": "💡 Dica: Reserve hospedagem com antecedência para eventos grandes como Carnaval e Réveillon!",
    
    // Welcome section
    "welcome.whatYouFind": "📍 O que você encontra neste guia",
    "welcome.whatYouFindDesc": "Além de praias, restaurantes, utilidades, Arraial do Cabo e Búzios, preparamos seções especiais para você explorar a região:",
    "welcome.trailsDesc": "Percursos com níveis de dificuldade, tempo estimado e dicas práticas",
    "welcome.photospotsDesc": "Melhores locais e horários para fotos incríveis da região",
    "welcome.routesDesc": "Circuitos mapeados com distâncias, altimetria e pontos de hidratação",
    "welcome.buildItinerary": "Montar meu roteiro",
    "welcome.buildItineraryDesc": "Clique no botão flutuante no canto inferior direito para criar seu roteiro personalizado. Selecione lugares, organize por blocos do dia e veja os tempos de deslocamento.",
    "welcome.calcDistances": "Calcular distâncias",
    "welcome.calcDistancesDesc": "Digite um endereço ou use \"Minha localização\" para ver o tempo estimado a pé e de carro até cada lugar.",
    "welcome.bestTimeTitle": "Melhor horário",
    "welcome.bestTimeDesc": "Praias ficam mais tranquilas pela manhã (até 11h). Evite o sol forte entre 11h-15h.",
    "welcome.contactsTitle": "Contatos",
    "welcome.contactsDesc": "Links com ☎️ abrem WhatsApp. 📍 levam ao Google Maps.",
    "welcome.offlineTitle": "Offline",
    "welcome.offlineDesc": "Salve este guia no celular para consultar sem internet.",
    "welcome.costTitle": "💵 Custo",
    "welcome.costDesc": "$ = econômico, $$ = médio, $$$ = alto",
    
    // Intro (RiosIntro)
    "intro.p1": "Somos a Rios, de Cabo Frio, liderada por Paulo Rios e Thais Rios. A gente transforma imóveis em lugares acolhedores e facilita sua estadia do começo ao fim, com informação clara, manutenção em dia e aquele cuidado de quem vive a cidade.",
    "intro.p2": "Criamos este Guia da Região dos Lagos para você aproveitar melhor o tempo: praias e pontos clássicos, restaurantes certeiros, utilidades por bairro e ferramentas práticas como tempo a pé/🚗 e roteiros prontos. É um guia vivo, atualizado em tempo real com o que a gente realmente usa e recomenda.",
    "intro.p3": "Nossa promessa é simples: menos atrito, mais memórias. Se este guia te ajudar a curtir mais Cabo Frio, Arraial e Búzios, a missão está cumprida. Boa viagem! 🌊",
    
    // Utilities section
    "utilities.intro": "Estabelecimentos selecionados nos bairros principais. Sempre confirme horários antes de ir.",
    
    // Shopping
    "shopping.intro": "O principal shopping de Cabo Frio, com lojas, restaurantes, cinema e serviços essenciais para o visitante.",
    "shopping.address": "Endereço",
    "shopping.hours": "Horários",
    "shopping.stores": "Lojas: Seg-Sáb 10h-22h, Dom 14h-20h",
    "shopping.foodCourt": "Praça de alimentação: 10h-22h todos os dias",
    "shopping.cinema": "Cinema: conforme programação",
    "shopping.whatResolves": "O que resolve aqui:",
    "shopping.whatResolvesDesc": "Farmácia 24h, supermercado, bancos/caixas eletrônicos, lojas de conveniência, livraria, fast-food e restaurantes diversos.",
    
    // Gastronomy
    "gastronomy.intro": "Nossas indicações favoritas, testadas e aprovadas. Horários podem variar — sempre confirme no link ou telefone.",
    
    // Arraial
    "arraial.subtitle": "Águas claras, trilhas e mirantes — o Caribe brasileiro na nossa vizinhança",
    "arraial.intro": "A apenas 30 minutos de Cabo Frio, Arraial do Cabo é famoso por suas águas cristalinas e praias paradisíacas. Confira os principais pontos turísticos.",
    "arraial.beachesTitle": "Praias & Pontos Turísticos",
    "arraial.gastroTitle": "Destaque Gastronômico",
    "arraial.itinerariesTitle": "Roteiros em 1 Clique",
    "arraial.classicVisual": "Clássico Visual",
    "arraial.cv.morning": "Manhã: Mirante Pontal do Atalaia",
    "arraial.cv.afternoon": "Tarde: Prainhas do Atalaia",
    "arraial.cv.lateAfternoon": "Fim de tarde: Pôr do sol na Praia Grande",
    "arraial.cv.night": "Noite: Jantar no centro",
    "arraial.seaTrail": "Mar & Trilha",
    "arraial.st.morning": "Manhã: Trilha para Praia do Forno",
    "arraial.st.noon": "Meio-dia: Snorkel na Praia do Forno",
    "arraial.st.afternoon": "Tarde: Passeio de barco (Gruta Azul + Ilha do Farol)",
    "arraial.fixiNote": "Existe também o Fixi Kaiseki na Passagem (Cabo Frio) — veja mais na seção de Gastronomia de Cabo Frio acima.",
    
    // Búzios
    "buzios.subtitle": "Mais de 20 praias, noites animadas e pôr do sol inesquecível",
    "buzios.intro": "A cerca de 40km de Cabo Frio, Búzios é o destino sofisticado da Região dos Lagos, com praias paradisíacas, gastronomia internacional e vida noturna vibrante.",
    "buzios.beachesTitle": "Praias & Pontos Turísticos",
    "buzios.gastroTitle": "Centros Gastronômicos",
    "buzios.itinerariesTitle": "Roteiros em 1 Clique",
    "buzios.portoBarra": "Complexo à beira-mar em Manguinhos com vários restaurantes. Famoso pelo pôr do sol com vista para a Praia de Geribá.",
    "buzios.portoBarra.arrive": "Chegue 1h antes do pôr do sol",
    "buzios.portoBarra.reserve": "Reserve com antecedência aos finais de semana",
    "buzios.ruaDasPedras": "Principal eixo gastronômico de Búzios. Restaurantes, bares e lojas em rua de pedras charmosa. Noite movimentada e animada.",
    "buzios.rdp.profiles": "3 perfis: rápido/econômico ($$), família ($$), autoral ($$$)",
    "buzios.rdp.crowded": "Fica lotada à noite — reserve mesa",
    "buzios.classicPostcard": "Clássico de Cartões-Postais",
    "buzios.cp.morning": "Manhã: Praia Azeda & Azedinha (escadaria)",
    "buzios.cp.afternoon": "Tarde: Passeio pela Orla Bardot",
    "buzios.cp.night": "Noite: Jantar na Rua das Pedras",
    "buzios.sunsetManguinhos": "Pôr do Sol em Manguinhos",
    "buzios.sm.morning": "Manhã/Meio-dia: Geribá ou Ferradurinha",
    "buzios.sm.afternoon": "Fim de tarde: Pôr do sol no Porto da Barra",
    "buzios.sm.night": "Noite: Jantar no Porto da Barra",
    
    // Trails
    "trails.intro": "Descubra as melhores trilhas de Cabo Frio, Arraial do Cabo e Búzios. Mirantes, dunas, costões e praias selvagens esperam por você.",
    "trails.farolTitle": "Praia do Farol (Ilha do Farol) - Acesso apenas por barco",
    "trails.farolDesc": "A famosa Praia do Farol não possui acesso terrestre. A visita é controlada pela Marinha e feita exclusivamente por passeios de barco autorizados que saem da Marina dos Anjos.",
    
    // Photo spots
    "photospots.intro": "Capture os melhores momentos da Região dos Lagos. Descubra pontos fotogênicos, janelas de luz ideais e dicas de composição para fotos incríveis.",
    "photospots.goldenSunrise": "Golden Hour — Amanhecer",
    "photospots.goldenSunset": "Golden Hour — Entardecer",
    "photospots.blueHour": "Blue Hour",
    "photospots.goldenMorning": "Golden Hour — Manhã",
    
    // Routes
    "routes.intro": "Circuitos seguros para corrida e ciclismo em Cabo Frio, com extensões para Arraial e Búzios. Explore a orla, lagoas e paisagens da região de forma ativa e saudável.",
    "routes.mainRoutes": "Cabo Frio — Rotas Principais",
    "routes.extensions": "Extensões — Arraial do Cabo & Búzios",
    
    // About
    "about.description": "A Rios cuida de imóveis e pessoas em Cabo Frio e Região dos Lagos. Oferecemos hospedagens exclusivas com todo o conforto e charme que você merece.",
    
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
    "section.beaches": "Beaches & Classic Spots",
    "section.utilities": "Neighborhood Essentials — Utilities",
    "section.gastronomy": "Dining — Rios Selection",
    "section.arraial": "Arraial do Cabo",
    "section.buzios": "Búzios",
    "section.trails": "Trails of the Lakes Region",
    "section.photospots": "Photo Spots & Golden Hour",
    "section.routes": "Running & Cycling Routes",
    "section.about": "About Us",
    "section.shopping": "Shopping Park Lagos",
    
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
    "common.howToGet": "How to get there",
    "common.seeProperties": "See Our Properties",
    "common.seeOnAirbnb": "See Properties on Airbnb",
    "common.downloadPDF": "Download Trails PDF",
    "common.showMap": "Show map",
    "common.hideMap": "Hide map",
    "common.buildItinerary": "Build my itinerary",
    "common.filterTrails": "Filter trails",
    "common.allCities": "All cities",
    "common.allLevels": "All levels",
    "common.allDurations": "All durations",
    "common.allViews": "All views",
    "common.reward": "Reward",
    "common.alerts": "Warning",
    "common.angle": "Angle",
    "common.tip": "Tip",
    "common.time": "Time",
    "common.start": "Start",
    "common.hydration": "Hydration",
    "common.warnings": "Warnings",
    "common.elevation": "Elevation",
    "common.surface": "Surface",
    "common.estimatedPace": "Estimated time by pace",
    "common.seeBoarding": "See boarding point",
    "common.note": "Note",
    
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
    "category.italian": "Italian",
    "category.asian": "Asian / Japanese",
    "category.brazilian": "Brazilian / BBQ",
    "category.burgers": "Burger Joints",
    "category.healthy": "Healthy / Light",
    "category.cafes": "Cafés & Sweets",
    "category.crepes": "Crepes",
    "category.buffet": "Breakfast Buffet",
    "category.seafood": "Seafood",
    "category.pharmacies": "Pharmacies",
    "category.supermarkets": "Supermarkets & Produce",
    "category.variety": "Variety & Convenience",
    "category.bakeries": "Bakeries & Pastry Shops",
    "category.petshops": "Pet Shops",
    
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
    
    // Weather
    "weather.title": "Weather in Cabo Frio",
    "weather.humidity": "Humidity",
    "weather.wind": "Wind",
    "weather.forecast": "5-day forecast",
    "weather.error": "Failed to load weather",
    "weather.tipRain": "☔ Bring an umbrella! Good day for museums and restaurants.",
    "weather.tipHot": "🌡️ Hot day! Stay hydrated and use sunscreen.",
    "weather.tipNice": "☀️ Nice weather for outdoor activities!",
    
    // Events
    "events.title": "Events & Festivals",
    "events.subtitle": "Regional events calendar",
    "events.recurring": "Annual",
    "events.showMore": "Show all",
    "events.showLess": "Show less",
    "events.tip": "💡 Tip: Book accommodations in advance for major events like Carnival and New Year's Eve!",
    
    // Welcome section
    "welcome.whatYouFind": "📍 What you'll find in this guide",
    "welcome.whatYouFindDesc": "In addition to beaches, restaurants, utilities, Arraial do Cabo and Búzios, we've prepared special sections for you to explore the region:",
    "welcome.trailsDesc": "Trails with difficulty levels, estimated time and practical tips",
    "welcome.photospotsDesc": "Best spots and times for incredible photos of the region",
    "welcome.routesDesc": "Mapped circuits with distances, elevation and hydration points",
    "welcome.buildItinerary": "Build my itinerary",
    "welcome.buildItineraryDesc": "Click the floating button in the bottom right corner to create your custom itinerary. Select places, organize by time of day, and see travel times.",
    "welcome.calcDistances": "Calculate distances",
    "welcome.calcDistancesDesc": "Enter an address or use \"My location\" to see estimated walking and driving time to each place.",
    "welcome.bestTimeTitle": "Best time",
    "welcome.bestTimeDesc": "Beaches are quieter in the morning (until 11am). Avoid strong sun between 11am-3pm.",
    "welcome.contactsTitle": "Contacts",
    "welcome.contactsDesc": "Links with ☎️ open WhatsApp. 📍 links go to Google Maps.",
    "welcome.offlineTitle": "Offline",
    "welcome.offlineDesc": "Save this guide on your phone to access without internet.",
    "welcome.costTitle": "💵 Cost",
    "welcome.costDesc": "$ = budget, $$ = mid-range, $$$ = high-end",
    
    // Intro (RiosIntro)
    "intro.p1": "We are Rios, from Cabo Frio, led by Paulo Rios and Thais Rios. We transform properties into welcoming places and make your stay easy from start to finish, with clear information, proper maintenance and the care of people who truly live the city.",
    "intro.p2": "We created this Lakes Region Guide so you can make the most of your time: classic beaches and spots, curated restaurants, neighborhood utilities and practical tools like walking/🚗 times and ready-made itineraries. It's a living guide, updated in real time with what we actually use and recommend.",
    "intro.p3": "Our promise is simple: less hassle, more memories. If this guide helps you enjoy Cabo Frio, Arraial and Búzios more, mission accomplished. Have a great trip! 🌊",
    
    // Utilities section
    "utilities.intro": "Selected businesses in the main neighborhoods. Always confirm hours before visiting.",
    
    // Shopping
    "shopping.intro": "The main shopping mall of Cabo Frio, with stores, restaurants, cinema and essential services for visitors.",
    "shopping.address": "Address",
    "shopping.hours": "Hours",
    "shopping.stores": "Stores: Mon-Sat 10am-10pm, Sun 2pm-8pm",
    "shopping.foodCourt": "Food court: 10am-10pm every day",
    "shopping.cinema": "Cinema: check schedule",
    "shopping.whatResolves": "What you can find here:",
    "shopping.whatResolvesDesc": "24h pharmacy, supermarket, ATMs, convenience stores, bookstore, fast-food and various restaurants.",
    
    // Gastronomy
    "gastronomy.intro": "Our favorite picks, tested and approved. Hours may vary — always confirm via link or phone.",
    
    // Arraial
    "arraial.subtitle": "Crystal clear waters, trails and viewpoints — the Brazilian Caribbean in our neighborhood",
    "arraial.intro": "Just 30 minutes from Cabo Frio, Arraial do Cabo is famous for its crystal-clear waters and paradise beaches. Check out the main tourist spots.",
    "arraial.beachesTitle": "Beaches & Tourist Spots",
    "arraial.gastroTitle": "Dining Highlight",
    "arraial.itinerariesTitle": "One-Click Itineraries",
    "arraial.classicVisual": "Classic Views",
    "arraial.cv.morning": "Morning: Pontal do Atalaia Viewpoint",
    "arraial.cv.afternoon": "Afternoon: Prainhas do Atalaia",
    "arraial.cv.lateAfternoon": "Late afternoon: Sunset at Praia Grande",
    "arraial.cv.night": "Evening: Dinner downtown",
    "arraial.seaTrail": "Sea & Trail",
    "arraial.st.morning": "Morning: Hike to Praia do Forno",
    "arraial.st.noon": "Noon: Snorkeling at Praia do Forno",
    "arraial.st.afternoon": "Afternoon: Boat tour (Blue Grotto + Farol Island)",
    "arraial.fixiNote": "There's also Fixi Kaiseki in Passagem (Cabo Frio) — see more in the Cabo Frio Dining section above.",
    
    // Búzios
    "buzios.subtitle": "Over 20 beaches, lively nights and unforgettable sunsets",
    "buzios.intro": "About 40km from Cabo Frio, Búzios is the sophisticated destination of the Lakes Region, with paradise beaches, international cuisine and vibrant nightlife.",
    "buzios.beachesTitle": "Beaches & Tourist Spots",
    "buzios.gastroTitle": "Dining Hubs",
    "buzios.itinerariesTitle": "One-Click Itineraries",
    "buzios.portoBarra": "Waterfront complex in Manguinhos with several restaurants. Famous for the sunset with views of Geribá Beach.",
    "buzios.portoBarra.arrive": "Arrive 1h before sunset",
    "buzios.portoBarra.reserve": "Book in advance on weekends",
    "buzios.ruaDasPedras": "Main dining hub of Búzios. Restaurants, bars and shops on a charming cobblestone street. Lively at night.",
    "buzios.rdp.profiles": "3 profiles: quick/budget ($$), family ($$), creative ($$$)",
    "buzios.rdp.crowded": "Gets crowded at night — reserve a table",
    "buzios.classicPostcard": "Classic Postcards",
    "buzios.cp.morning": "Morning: Azeda & Azedinha Beach (stairway)",
    "buzios.cp.afternoon": "Afternoon: Walk along Orla Bardot",
    "buzios.cp.night": "Evening: Dinner at Rua das Pedras",
    "buzios.sunsetManguinhos": "Manguinhos Sunset",
    "buzios.sm.morning": "Morning/Noon: Geribá or Ferradurinha",
    "buzios.sm.afternoon": "Late afternoon: Sunset at Porto da Barra",
    "buzios.sm.night": "Evening: Dinner at Porto da Barra",
    
    // Trails
    "trails.intro": "Discover the best trails in Cabo Frio, Arraial do Cabo and Búzios. Viewpoints, dunes, cliffs and wild beaches await you.",
    "trails.farolTitle": "Praia do Farol (Farol Island) - Boat access only",
    "trails.farolDesc": "The famous Praia do Farol has no land access. Visits are controlled by the Navy and made exclusively by authorized boat tours departing from Marina dos Anjos.",
    
    // Photo spots
    "photospots.intro": "Capture the best moments of the Lakes Region. Discover photogenic spots, ideal light windows and composition tips for incredible photos.",
    "photospots.goldenSunrise": "Golden Hour — Sunrise",
    "photospots.goldenSunset": "Golden Hour — Sunset",
    "photospots.blueHour": "Blue Hour",
    "photospots.goldenMorning": "Golden Hour — Morning",
    
    // Routes
    "routes.intro": "Safe circuits for running and cycling in Cabo Frio, with extensions to Arraial and Búzios. Explore the waterfront, lagoons and landscapes in an active and healthy way.",
    "routes.mainRoutes": "Cabo Frio — Main Routes",
    "routes.extensions": "Extensions — Arraial do Cabo & Búzios",
    
    // About
    "about.description": "Rios takes care of properties and people in Cabo Frio and the Lakes Region. We offer exclusive accommodations with all the comfort and charm you deserve.",
    
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
    "section.beaches": "Playas & Puntos Clásicos",
    "section.utilities": "Esenciales por Barrio — Utilidades",
    "section.gastronomy": "Gastronomía — Selección Rios",
    "section.arraial": "Arraial do Cabo",
    "section.buzios": "Búzios",
    "section.trails": "Senderos de la Región de los Lagos",
    "section.photospots": "Foto-spots & Hora Dorada",
    "section.routes": "Rutas para Correr/Pedalear",
    "section.about": "Sobre Nosotros",
    "section.shopping": "Shopping Park Lagos",
    
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
    "common.howToGet": "Cómo llegar",
    "common.seeProperties": "Ver Nuestras Propiedades",
    "common.seeOnAirbnb": "Ver Propiedades en Airbnb",
    "common.downloadPDF": "Descargar PDF de Senderos",
    "common.showMap": "Mostrar mapa",
    "common.hideMap": "Ocultar mapa",
    "common.buildItinerary": "Crear mi itinerario",
    "common.filterTrails": "Filtrar senderos",
    "common.allCities": "Todas las ciudades",
    "common.allLevels": "Todos los niveles",
    "common.allDurations": "Todas las duraciones",
    "common.allViews": "Todas las vistas",
    "common.reward": "Recompensa",
    "common.alerts": "Atención",
    "common.angle": "Ángulo",
    "common.tip": "Consejo",
    "common.time": "Horario",
    "common.start": "Inicio",
    "common.hydration": "Hidratación",
    "common.warnings": "Avisos",
    "common.elevation": "Elevación",
    "common.surface": "Superficie",
    "common.estimatedPace": "Tiempo estimado por ritmo",
    "common.seeBoarding": "Ver punto de embarque",
    "common.note": "Nota",
    
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
    "category.italian": "Italiano",
    "category.asian": "Asiático / Japonés",
    "category.brazilian": "Brasileño / Parrilla",
    "category.burgers": "Hamburgueserías",
    "category.healthy": "Saludable / Ligero",
    "category.cafes": "Cafés & Dulces",
    "category.crepes": "Crepes",
    "category.buffet": "Buffet de Café",
    "category.seafood": "Frutos del Mar",
    "category.pharmacies": "Farmacias",
    "category.supermarkets": "Supermercados & Verdulería",
    "category.variety": "Variedades & Conveniencia",
    "category.bakeries": "Panaderías & Confiterías",
    "category.petshops": "Pet Shops",
    
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
    
    // Weather
    "weather.title": "Clima en Cabo Frio",
    "weather.humidity": "Humedad",
    "weather.wind": "Viento",
    "weather.forecast": "Pronóstico 5 días",
    "weather.error": "Error al cargar clima",
    "weather.tipRain": "☔ ¡Lleva paraguas! Buen día para museos y restaurantes.",
    "weather.tipHot": "🌡️ ¡Día caluroso! Hidrátate y usa protector solar.",
    "weather.tipNice": "☀️ ¡Clima agradable para actividades al aire libre!",
    
    // Events
    "events.title": "Eventos y Festivales",
    "events.subtitle": "Calendario de eventos de la región",
    "events.recurring": "Anual",
    "events.showMore": "Ver todos",
    "events.showLess": "Ver menos",
    "events.tip": "💡 Consejo: ¡Reserva hospedaje con anticipación para eventos grandes como Carnaval y Año Nuevo!",
    
    // Welcome section
    "welcome.whatYouFind": "📍 Qué encontrarás en esta guía",
    "welcome.whatYouFindDesc": "Además de playas, restaurantes, utilidades, Arraial do Cabo y Búzios, preparamos secciones especiales para que explores la región:",
    "welcome.trailsDesc": "Senderos con niveles de dificultad, tiempo estimado y consejos prácticos",
    "welcome.photospotsDesc": "Mejores lugares y horarios para fotos increíbles de la región",
    "welcome.routesDesc": "Circuitos mapeados con distancias, altimetría y puntos de hidratación",
    "welcome.buildItinerary": "Crear mi itinerario",
    "welcome.buildItineraryDesc": "Haz clic en el botón flotante en la esquina inferior derecha para crear tu itinerario personalizado. Selecciona lugares, organiza por bloques del día y ve los tiempos de desplazamiento.",
    "welcome.calcDistances": "Calcular distancias",
    "welcome.calcDistancesDesc": "Ingresa una dirección o usa \"Mi ubicación\" para ver el tiempo estimado caminando y en auto hasta cada lugar.",
    "welcome.bestTimeTitle": "Mejor horario",
    "welcome.bestTimeDesc": "Las playas están más tranquilas por la mañana (hasta las 11h). Evita el sol fuerte entre 11h-15h.",
    "welcome.contactsTitle": "Contactos",
    "welcome.contactsDesc": "Los enlaces con ☎️ abren WhatsApp. 📍 llevan a Google Maps.",
    "welcome.offlineTitle": "Sin conexión",
    "welcome.offlineDesc": "Guarda esta guía en tu celular para consultar sin internet.",
    "welcome.costTitle": "💵 Costo",
    "welcome.costDesc": "$ = económico, $$ = medio, $$$ = alto",
    
    // Intro (RiosIntro)
    "intro.p1": "Somos Rios, de Cabo Frio, liderada por Paulo Rios y Thais Rios. Transformamos inmuebles en lugares acogedores y facilitamos tu estadía de principio a fin, con información clara, mantenimiento al día y el cuidado de quienes viven la ciudad.",
    "intro.p2": "Creamos esta Guía de la Región de los Lagos para que aproveches mejor tu tiempo: playas y puntos clásicos, restaurantes certeros, utilidades por barrio y herramientas prácticas como tiempo a pie/🚗 e itinerarios listos. Es una guía viva, actualizada en tiempo real con lo que realmente usamos y recomendamos.",
    "intro.p3": "Nuestra promesa es simple: menos fricción, más recuerdos. Si esta guía te ayuda a disfrutar más de Cabo Frio, Arraial y Búzios, misión cumplida. ¡Buen viaje! 🌊",
    
    // Utilities section
    "utilities.intro": "Establecimientos seleccionados en los barrios principales. Siempre confirma horarios antes de ir.",
    
    // Shopping
    "shopping.intro": "El principal shopping de Cabo Frio, con tiendas, restaurantes, cine y servicios esenciales para el visitante.",
    "shopping.address": "Dirección",
    "shopping.hours": "Horarios",
    "shopping.stores": "Tiendas: Lun-Sáb 10h-22h, Dom 14h-20h",
    "shopping.foodCourt": "Patio de comidas: 10h-22h todos los días",
    "shopping.cinema": "Cine: según programación",
    "shopping.whatResolves": "Qué encuentras aquí:",
    "shopping.whatResolvesDesc": "Farmacia 24h, supermercado, cajeros automáticos, tiendas de conveniencia, librería, comida rápida y restaurantes variados.",
    
    // Gastronomy
    "gastronomy.intro": "Nuestras recomendaciones favoritas, probadas y aprobadas. Los horarios pueden variar — siempre confirma por enlace o teléfono.",
    
    // Arraial
    "arraial.subtitle": "Aguas cristalinas, senderos y miradores — el Caribe brasileño en nuestra vecindad",
    "arraial.intro": "A solo 30 minutos de Cabo Frio, Arraial do Cabo es famoso por sus aguas cristalinas y playas paradisíacas. Descubre los principales puntos turísticos.",
    "arraial.beachesTitle": "Playas & Puntos Turísticos",
    "arraial.gastroTitle": "Destacado Gastronómico",
    "arraial.itinerariesTitle": "Itinerarios en 1 Clic",
    "arraial.classicVisual": "Clásico Visual",
    "arraial.cv.morning": "Mañana: Mirador Pontal do Atalaia",
    "arraial.cv.afternoon": "Tarde: Prainhas do Atalaia",
    "arraial.cv.lateAfternoon": "Atardecer: Puesta de sol en Praia Grande",
    "arraial.cv.night": "Noche: Cena en el centro",
    "arraial.seaTrail": "Mar & Sendero",
    "arraial.st.morning": "Mañana: Caminata a Praia do Forno",
    "arraial.st.noon": "Mediodía: Snorkel en Praia do Forno",
    "arraial.st.afternoon": "Tarde: Paseo en barco (Gruta Azul + Isla do Farol)",
    "arraial.fixiNote": "También está Fixi Kaiseki en Passagem (Cabo Frio) — ver más en la sección de Gastronomía de Cabo Frio arriba.",
    
    // Búzios
    "buzios.subtitle": "Más de 20 playas, noches animadas y atardeceres inolvidables",
    "buzios.intro": "A unos 40km de Cabo Frio, Búzios es el destino sofisticado de la Región de los Lagos, con playas paradisíacas, gastronomía internacional y vida nocturna vibrante.",
    "buzios.beachesTitle": "Playas & Puntos Turísticos",
    "buzios.gastroTitle": "Centros Gastronómicos",
    "buzios.itinerariesTitle": "Itinerarios en 1 Clic",
    "buzios.portoBarra": "Complejo frente al mar en Manguinhos con varios restaurantes. Famoso por la puesta de sol con vista a la Playa de Geribá.",
    "buzios.portoBarra.arrive": "Llega 1h antes de la puesta de sol",
    "buzios.portoBarra.reserve": "Reserva con anticipación los fines de semana",
    "buzios.ruaDasPedras": "Principal eje gastronómico de Búzios. Restaurantes, bares y tiendas en una calle empedrada con encanto. Animada por la noche.",
    "buzios.rdp.profiles": "3 perfiles: rápido/económico ($$), familia ($$), autor ($$$)",
    "buzios.rdp.crowded": "Se llena por la noche — reserva mesa",
    "buzios.classicPostcard": "Clásico de Postales",
    "buzios.cp.morning": "Mañana: Playa Azeda & Azedinha (escalera)",
    "buzios.cp.afternoon": "Tarde: Paseo por la Orla Bardot",
    "buzios.cp.night": "Noche: Cena en Rua das Pedras",
    "buzios.sunsetManguinhos": "Atardecer en Manguinhos",
    "buzios.sm.morning": "Mañana/Mediodía: Geribá o Ferradurinha",
    "buzios.sm.afternoon": "Atardecer: Puesta de sol en Porto da Barra",
    "buzios.sm.night": "Noche: Cena en Porto da Barra",
    
    // Trails
    "trails.intro": "Descubre los mejores senderos de Cabo Frio, Arraial do Cabo y Búzios. Miradores, dunas, costones y playas salvajes te esperan.",
    "trails.farolTitle": "Praia do Farol (Isla do Farol) - Acceso solo por barco",
    "trails.farolDesc": "La famosa Praia do Farol no tiene acceso terrestre. La visita es controlada por la Marina y se realiza exclusivamente por paseos en barco autorizados que salen de Marina dos Anjos.",
    
    // Photo spots
    "photospots.intro": "Captura los mejores momentos de la Región de los Lagos. Descubre puntos fotogénicos, ventanas de luz ideales y consejos de composición para fotos increíbles.",
    "photospots.goldenSunrise": "Hora Dorada — Amanecer",
    "photospots.goldenSunset": "Hora Dorada — Atardecer",
    "photospots.blueHour": "Hora Azul",
    "photospots.goldenMorning": "Hora Dorada — Mañana",
    
    // Routes
    "routes.intro": "Circuitos seguros para correr y pedalear en Cabo Frio, con extensiones a Arraial y Búzios. Explora la costa, lagunas y paisajes de forma activa y saludable.",
    "routes.mainRoutes": "Cabo Frio — Rutas Principales",
    "routes.extensions": "Extensiones — Arraial do Cabo & Búzios",
    
    // About
    "about.description": "Rios cuida inmuebles y personas en Cabo Frio y la Región de los Lagos. Ofrecemos hospedajes exclusivos con todo el confort y encanto que mereces.",
    
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
