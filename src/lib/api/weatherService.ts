import axios from 'axios';

import { API_CONFIG, ENDPOINTS, OPENWEATHER_BASE_URL } from '@/constant/api';
import { OPENWEATHER_API_KEY } from '@/constant/env';

import { retryWithBackoff } from './utils';

import { ForecastData, WeatherData } from '@/types/weather';

// Create a base Axios instance for OpenWeatherMap API
const api = axios.create({
  baseURL: OPENWEATHER_BASE_URL,
});

// Fetch current weather data for a city
export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  try {
    return await retryWithBackoff(async () => {
      const response = await api.get(ENDPOINTS.CURRENT_WEATHER, {
        params: {
          q: city,
          appid: OPENWEATHER_API_KEY,
          units: API_CONFIG.DEFAULT_UNITS,
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
    return await retryWithBackoff(async () => {
      const response = await api.get(ENDPOINTS.FORECAST, {
        params: {
          q: city,
          appid: OPENWEATHER_API_KEY,
          units: API_CONFIG.DEFAULT_UNITS,
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