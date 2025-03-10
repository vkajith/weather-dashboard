export interface City {
  id: string;
  name: string;
  lat: number;
  lon: number;
  order: number;
}

export interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  conditionIcon: string;
  timestamp: number;
}

export interface ForecastItem {
  date: string;
  minTemp: number;
  maxTemp: number;
  condition: string;
  conditionIcon: string;
}

export interface ForecastData {
  city: string;
  forecast: ForecastItem[];
}

export interface WeatherError {
  message: string;
  code?: number;
  retry?: boolean;
} 