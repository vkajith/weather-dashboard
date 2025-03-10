/**
 * Environment variables and configuration
 */

// Environment detection
export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

// Feature flags
export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true';

// API Keys
export const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';

// Application configuration
export const DEFAULT_LOCATION = 'London';
export const MAX_SAVED_CITIES = 10;

// SEO and site configuration
export const SITE_URL = isProd ? 'https://weather-dashboard.example.com' : 'http://localhost:3000';
export const SITE_NAME = 'Weather Dashboard';
export const SITE_DESCRIPTION = 'A modern weather dashboard application';
