import axios from 'axios';

import { retryWithBackoff } from '@/lib/api/utils';

import { ENDPOINTS, OPENWEATHER_GEO_URL } from '@/constant/api';

/**
 * Fetch coordinates for a city by name
 * @param cityName The name of the city to search for
 * @returns The latitude and longitude of the city
 */
export const fetchCityCoordinates = async (cityName: string): Promise<{ lat: number, lon: number }> => {
  try {
    return await retryWithBackoff(async () => {
      const response = await axios.get(`${OPENWEATHER_GEO_URL}${ENDPOINTS.GEO_DIRECT}`, {
        params: {
          q: cityName,
          limit: 1,
          appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '',
        },
      });

      if (response.data && response.data.length > 0) {
        return {
          lat: response.data[0].lat,
          lon: response.data[0].lon,
        };
      }
      throw new Error(`City "${cityName}" not found`);
    });
  } catch (error) {
    throw new Error(`Failed to fetch city coordinates: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Interface for city suggestion results
 */
export interface CitySearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

/**
 * Fetch city suggestions based on user input
 * @param query The search query
 * @param limit Maximum number of results to return
 * @returns Array of city suggestions
 */
export const fetchCitySuggestions = async (query: string, limit = 5): Promise<CitySearchResult[]> => {
  if (!query || query.length < 2) return [];

  try {
    return await retryWithBackoff(async () => {
      const response = await axios.get(`${OPENWEATHER_GEO_URL}${ENDPOINTS.GEO_DIRECT}`, {
        params: {
          q: query,
          limit,
          appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '',
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data.map((city: any) => ({
          name: city.name,
          country: city.country,
          state: city.state,
          lat: city.lat,
          lon: city.lon,
        }));
      }

      return [];
    });
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    return [];
  }
}; 