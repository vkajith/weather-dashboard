import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

import { fetchWeatherData } from '@/lib/api/weatherService';

import { Card, Spinner } from '@/components/ui';

import { OPENWEATHER_ICON_URL } from '@/constant/api';
import { useWeather } from '@/contexts/WeatherContext';


// Create a separate map component that will be dynamically imported
const MapWithNoSSR = dynamic(
  () => import('./MapWithNoSSR'),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 rounded-lg bg-white bg-opacity-5 flex items-center justify-center">
        <Spinner size="md" color="white" />
      </div>
    )
  }
);

// Fetcher function for SWR
const weatherFetcher = (cityName: string) => fetchWeatherData(cityName);

/**
 * Component to display detailed weather information for today with a map
 */
const WeatherToday: React.FC = () => {
  const { cities, selectedCity } = useWeather();
  const [mounted, setMounted] = useState(false);

  // Make sure component mounted (client-side) before showing content that might cause hydration error
  useEffect(() => {
    setMounted(true);
  }, []);

  // Find the selected city
  const city = cities.find(c => c.id === selectedCity);

  // Fetch weather data with SWR if we have a selected city
  const { data, error, isLoading } = useSWR(
    city ? `weather-detail-${city.name}` : null,
    city ? () => weatherFetcher(city.name) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 300000, // Refresh every 5 minutes
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  if (!mounted) {
    return (
      <Card title="Weather Today">
        <div className="rounded-lg bg-white bg-opacity-5"></div>
      </Card>
    );
  }

  if (!city) {
    return (
      <Card title="Weather Today">
        <div className="flex items-center justify-center h-64">
          <p className="text-blue-100 text-center">Select a city to view detailed weather</p>
        </div>
      </Card>
    );
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <Card title="Weather Today">
      <div className="space-y-6">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" color="white" />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 backdrop-blur-md rounded-xl px-4 py-3 text-red-200">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error instanceof Error ? error.message : 'Failed to load weather data'}</span>
            </div>
          </div>
        )}

        {data && !isLoading && !error && (
          <>
            {/* Header with city name and current date */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white">{city.name}</h2>
              <p className="text-blue-200/80">{formatDate(data.timestamp)}</p>
            </div>

            {/* Main weather display */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Temperature and condition */}
                <div className="flex items-center mb-4 md:mb-0">
                  <img
                    src={`${OPENWEATHER_ICON_URL}/${data.conditionIcon}@4x.png`}
                    alt={data.condition}
                    className="w-24 h-24 mr-4"
                  />
                  <div>
                    <div className="text-5xl font-bold text-white">{Math.round(data.temperature)}°C</div>
                    <div className="text-xl text-blue-200/80">{data.condition}</div>
                  </div>
                </div>

                {/* Weather details */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-blue-200/80 mb-1">Feels Like</div>
                    <div className="text-2xl font-semibold text-white">{Math.round(data.feelsLike)}°C</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-200/80 mb-1">Humidity</div>
                    <div className="text-2xl font-semibold text-white">{data.humidity}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-200/80 mb-1">Wind Speed</div>
                    <div className="text-2xl font-semibold text-white">{data.windSpeed} m/s</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-200/80 mb-1">Updated</div>
                    <div className="text-2xl font-semibold text-white">{formatTime(data.timestamp)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional weather indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 flex items-center">
                <div className="bg-blue-500/20 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-blue-200/80">Humidity</div>
                  <div className="text-xl font-semibold text-white">{data.humidity}%</div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 flex items-center">
                <div className="bg-blue-500/20 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-blue-200/80">Feels Like</div>
                  <div className="text-xl font-semibold text-white">{Math.round(data.feelsLike)}°C</div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 flex items-center">
                <div className="bg-blue-500/20 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-blue-200/80">Wind Speed</div>
                  <div className="text-xl font-semibold text-white">{data.windSpeed} m/s</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Map section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-4">Location Map</h3>
          <div className="h-64 rounded-lg overflow-hidden">
            <MapWithNoSSR city={city} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherToday; 