import axios from 'axios';

import { ForecastData, WeatherData } from '@/types/weather';

// Create a base Axios instance for OpenWeatherMap API
const api = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
});

// Set OpenWeatherMap API key from environment variables
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';

// Exponential backoff utility function
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async <T>(
  fetchFn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> => {
  let retries = 0;
  let lastError: Error | null = null;

  while (retries < maxRetries) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error as Error;
      // Check if error is due to rate limiting (429 status code)
      const isRateLimit = axios.isAxiosError(error) && error.response?.status === 429;

      if (isRateLimit || (retries < maxRetries - 1)) {
        const delay = initialDelay * Math.pow(2, retries);
        console.log(`API request failed, retrying in ${delay}ms...`);
        await sleep(delay);
        retries++;
      } else {
        break;
      }
    }
  }

  throw lastError;
};

// Fetch current weather data for a city
export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  try {
    return await fetchWithRetry(async () => {
      const response = await api.get('/weather', {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
        },
      });

      const data = response.data;
      return {
        city: data.name,
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        condition: data.weather[0].main,
        conditionIcon: data.weather[0].icon,
        timestamp: data.dt,
      };
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`City "${city}" not found`);
    }
    throw new Error(`Failed to fetch weather data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Fetch 5-day forecast data for a city
export const fetchForecastData = async (city: string): Promise<ForecastData> => {
  try {
    return await fetchWithRetry(async () => {
      const response = await api.get('/forecast', {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
        },
      });

      // OpenWeatherMap's forecast API returns data in 3-hour intervals
      // We need to extract one forecast per day (at noon)
      const forecastMap = new Map<string, any>();

      response.data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];

        if (!forecastMap.has(date) ||
          Math.abs(new Date(item.dt * 1000).getHours() - 12) <
          Math.abs(new Date(forecastMap.get(date).dt * 1000).getHours() - 12)) {
          forecastMap.set(date, item);
        }
      });

      // Convert map to array and format data
      const forecast = Array.from(forecastMap.values())
        .slice(0, 5) // Ensure we only get 5 days
        .map(item => ({
          date: new Date(item.dt * 1000).toISOString().split('T')[0],
          minTemp: item.main.temp_min,
          maxTemp: item.main.temp_max,
          condition: item.weather[0].main,
          conditionIcon: item.weather[0].icon,
        }));

      return {
        city: response.data.city.name,
        forecast,
      };
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`City "${city}" not found`);
    }
    throw new Error(`Failed to fetch forecast data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Fetch coordinates for a city by name
export const fetchCityCoordinates = async (cityName: string): Promise<{ lat: number, lon: number }> => {
  try {
    return await fetchWithRetry(async () => {
      const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
        params: {
          q: cityName,
          limit: 1,
          appid: API_KEY,
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