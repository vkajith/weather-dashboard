/**
 * API Constants for the Weather Dashboard
 */

// OpenWeatherMap API Base URLs
export const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
export const OPENWEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// OpenWeatherMap API Endpoints
export const ENDPOINTS = {
  CURRENT_WEATHER: '/weather',
  FORECAST: '/forecast',
  GEO_DIRECT: '/direct',
};

// OpenWeatherMap Icon URL
export const OPENWEATHER_ICON_URL = 'https://openweathermap.org/img/wn';

// Map Tile URLs
export const MAP_TILES = {
  DARK: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};

// Map Marker Icons
export const MAP_MARKERS = {
  DEFAULT_ICON: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  DEFAULT_SHADOW: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  BLUE_ICON: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  SHADOW: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
};

// API Request Configuration
export const API_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000,
  DEFAULT_UNITS: 'metric',
}; 