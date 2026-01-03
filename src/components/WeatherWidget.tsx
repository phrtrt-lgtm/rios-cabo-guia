import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WeatherData = {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
  };
  daily: {
    date: string;
    tempMax: number;
    tempMin: number;
    weatherCode: number;
  }[];
};

const CABO_FRIO_LAT = -22.8789;
const CABO_FRIO_LNG = -42.0189;

const weatherCodeToIcon = (code: number) => {
  if (code === 0 || code === 1) return <Sun className="h-6 w-6 text-yellow-500" />;
  if (code >= 2 && code <= 3) return <Cloud className="h-6 w-6 text-gray-400" />;
  if (code >= 45 && code <= 48) return <Cloud className="h-6 w-6 text-gray-500" />;
  if (code >= 51 && code <= 67) return <CloudRain className="h-6 w-6 text-blue-400" />;
  if (code >= 71 && code <= 86) return <CloudRain className="h-6 w-6 text-blue-300" />;
  if (code >= 95 && code <= 99) return <CloudRain className="h-6 w-6 text-purple-500" />;
  return <Sun className="h-6 w-6 text-yellow-500" />;
};

const weatherCodeToDescription = (code: number, lang: string): string => {
  const descriptions: Record<string, Record<number, string>> = {
    pt: {
      0: "Céu limpo",
      1: "Predominantemente limpo",
      2: "Parcialmente nublado",
      3: "Nublado",
      45: "Neblina",
      48: "Neblina com geada",
      51: "Chuvisco leve",
      53: "Chuvisco moderado",
      55: "Chuvisco forte",
      61: "Chuva leve",
      63: "Chuva moderada",
      65: "Chuva forte",
      80: "Pancadas leves",
      81: "Pancadas moderadas",
      82: "Pancadas fortes",
      95: "Tempestade",
      96: "Tempestade com granizo",
      99: "Tempestade severa",
    },
    en: {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Light rain",
      63: "Moderate rain",
      65: "Heavy rain",
      80: "Light showers",
      81: "Moderate showers",
      82: "Violent showers",
      95: "Thunderstorm",
      96: "Thunderstorm with hail",
      99: "Severe thunderstorm",
    },
    es: {
      0: "Cielo despejado",
      1: "Principalmente despejado",
      2: "Parcialmente nublado",
      3: "Nublado",
      45: "Niebla",
      48: "Niebla con escarcha",
      51: "Llovizna leve",
      53: "Llovizna moderada",
      55: "Llovizna densa",
      61: "Lluvia leve",
      63: "Lluvia moderada",
      65: "Lluvia fuerte",
      80: "Chubascos leves",
      81: "Chubascos moderados",
      82: "Chubascos violentos",
      95: "Tormenta",
      96: "Tormenta con granizo",
      99: "Tormenta severa",
    },
  };
  
  return descriptions[lang]?.[code] || descriptions.pt[code] || "Desconhecido";
};

const getDayName = (dateStr: string, lang: string): string => {
  const date = new Date(dateStr + "T12:00:00");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return lang === "pt" ? "Hoje" : lang === "en" ? "Today" : "Hoy";
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return lang === "pt" ? "Amanhã" : lang === "en" ? "Tomorrow" : "Mañana";
  }
  
  return date.toLocaleDateString(lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US", {
    weekday: "short",
  });
};

export function WeatherWidget() {
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${CABO_FRIO_LAT}&longitude=${CABO_FRIO_LNG}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America/Sao_Paulo&forecast_days=5`
        );
        
        if (!response.ok) throw new Error("Failed to fetch weather");
        
        const data = await response.json();
        
        setWeather({
          current: {
            temperature: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m),
            weatherCode: data.current.weather_code,
          },
          daily: data.daily.time.map((date: string, i: number) => ({
            date,
            tempMax: Math.round(data.daily.temperature_2m_max[i]),
            tempMin: Math.round(data.daily.temperature_2m_min[i]),
            weatherCode: data.daily.weather_code[i],
          })),
        });
        setError(null);
      } catch (err) {
        setError(t("weather.error", "Erro ao carregar clima"));
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [t]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-sky-500/10 to-blue-600/10 border-sky-200/50">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-200/50">
        <CardContent className="py-6 text-center">
          <p className="text-red-600">{error || t("weather.error", "Erro ao carregar")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-sky-500/10 via-blue-400/5 to-cyan-500/10 border-sky-200/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Current Weather - Compact */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-full">
              {weatherCodeToIcon(weather.current.weatherCode)}
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {weather.current.temperature}°C
              </div>
              <div className="text-xs text-muted-foreground">
                {weatherCodeToDescription(weather.current.weatherCode, language)}
              </div>
            </div>
          </div>
          
          {/* Mini stats */}
          <div className="hidden sm:flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Droplets className="h-3 w-3 text-blue-400" />
              <span>{weather.current.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="h-3 w-3 text-gray-400" />
              <span>{weather.current.windSpeed} km/h</span>
            </div>
          </div>

          {/* 5-Day Forecast - Compact */}
          <div className="flex-1 flex gap-1 justify-end">
            {weather.daily.slice(0, 5).map((day, i) => (
              <div
                key={day.date}
                className={`text-center p-1.5 rounded ${i === 0 ? "bg-sky-100/50" : ""}`}
              >
                <div className="text-[10px] font-medium text-muted-foreground">
                  {getDayName(day.date, language)}
                </div>
                <div className="flex justify-center my-0.5 scale-75">
                  {weatherCodeToIcon(day.weatherCode)}
                </div>
                <div className="text-[10px]">
                  <span className="font-semibold">{day.tempMax}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
