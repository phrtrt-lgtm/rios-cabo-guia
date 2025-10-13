export interface PlaceCoords {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  bairro?: string;
}

export interface ETAResult {
  placeId: string;
  walkingMinutes: number;
  drivingMinutes: number;
  isFallback: boolean;
}

interface CachedETA extends ETAResult {
  timestamp: number;
}

const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 horas
const BATCH_SIZE = 25;
const WALKING_SPEED_KMH = 4.8;
const URBAN_DRIVING_SPEED_KMH = 22;

export class DistanceService {
  private apiKey: string | null = null;
  private cachePrefix = 'rios_eta_';

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('google_maps_api_key', key);
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('google_maps_api_key');
    }
    return this.apiKey;
  }

  // Calcular distância Haversine (em km)
  private haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Fallback: estimar tempo baseado em Haversine
  private calculateHaversineFallback(
    origin: { lat: number; lng: number },
    place: PlaceCoords,
    mode: 'walking' | 'driving'
  ): number {
    const distKm = this.haversineDistance(
      origin.lat,
      origin.lng,
      place.lat,
      place.lng
    );
    const speed = mode === 'walking' ? WALKING_SPEED_KMH : URBAN_DRIVING_SPEED_KMH;
    return Math.ceil((distKm / speed) * 60);
  }

  // Cache
  private getCacheKey(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
  ): string {
    return `${this.cachePrefix}${originLat.toFixed(5)}_${originLng.toFixed(5)}_${destLat.toFixed(5)}_${destLng.toFixed(5)}`;
  }

  private getFromCache(cacheKey: string): CachedETA | null {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const data: CachedETA = JSON.parse(cached);
      const now = Date.now();

      if (now - data.timestamp > CACHE_DURATION_MS) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  private saveToCache(cacheKey: string, data: ETAResult) {
    try {
      const cached: CachedETA = {
        ...data,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cached));
    } catch (e) {
      console.warn('Falha ao salvar cache:', e);
    }
  }

  // Geocodificação
  async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Chave da API do Google Maps não configurada');
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address + ', Cabo Frio, RJ, Brasil'
      )}&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }

      return null;
    } catch (error) {
      console.error('Erro na geocodificação:', error);
      return null;
    }
  }

  // Calcular ETAs para múltiplos destinos
  async batchCalculateETAs(
    origin: { lat: number; lng: number },
    places: PlaceCoords[]
  ): Promise<ETAResult[]> {
    const results: ETAResult[] = [];
    const apiKey = this.getApiKey();

    // Processar em lotes
    for (let i = 0; i < places.length; i += BATCH_SIZE) {
      const batch = places.slice(i, i + BATCH_SIZE);
      const batchResults = await this.processBatch(origin, batch, apiKey);
      results.push(...batchResults);
    }

    return results;
  }

  private async processBatch(
    origin: { lat: number; lng: number },
    batch: PlaceCoords[],
    apiKey: string | null
  ): Promise<ETAResult[]> {
    const results: ETAResult[] = [];

    for (const place of batch) {
      // Verificar cache
      const cacheKey = this.getCacheKey(origin.lat, origin.lng, place.lat, place.lng);
      const cached = this.getFromCache(cacheKey);

      if (cached) {
        results.push(cached);
        continue;
      }

      // Calcular com API ou fallback
      let result: ETAResult;

      if (apiKey) {
        result = await this.calculateWithAPI(origin, place, apiKey);
      } else {
        result = this.calculateFallback(origin, place);
      }

      // Salvar no cache
      this.saveToCache(cacheKey, result);
      results.push(result);

      // Pequeno delay para evitar rate limit
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  private async calculateWithAPI(
    origin: { lat: number; lng: number },
    place: PlaceCoords,
    apiKey: string
  ): Promise<ETAResult> {
    try {
      const origins = `${origin.lat},${origin.lng}`;
      const destinations = `${place.lat},${place.lng}`;

      // Calcular walking
      const walkUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&mode=walking&key=${apiKey}`;
      const walkResponse = await fetch(walkUrl);
      const walkData = await walkResponse.json();

      // Calcular driving
      const driveUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&mode=driving&key=${apiKey}`;
      const driveResponse = await fetch(driveUrl);
      const driveData = await driveResponse.json();

      if (
        walkData.status === 'OK' &&
        driveData.status === 'OK' &&
        walkData.rows[0]?.elements[0]?.status === 'OK' &&
        driveData.rows[0]?.elements[0]?.status === 'OK'
      ) {
        return {
          placeId: place.id,
          walkingMinutes: Math.ceil(walkData.rows[0].elements[0].duration.value / 60),
          drivingMinutes: Math.ceil(driveData.rows[0].elements[0].duration.value / 60),
          isFallback: false,
        };
      }

      // Se API falhou, usar fallback
      return this.calculateFallback(origin, place);
    } catch (error) {
      console.warn(`Erro na API para ${place.name}, usando fallback:`, error);
      return this.calculateFallback(origin, place);
    }
  }

  private calculateFallback(
    origin: { lat: number; lng: number },
    place: PlaceCoords
  ): ETAResult {
    return {
      placeId: place.id,
      walkingMinutes: this.calculateHaversineFallback(origin, place, 'walking'),
      drivingMinutes: this.calculateHaversineFallback(origin, place, 'driving'),
      isFallback: true,
    };
  }
}

export const distanceService = new DistanceService();
