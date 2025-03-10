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
      <div className="h-64 rounded-lg bg-white/5 flex items-center justify-center">
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
        <div className="rounded-lg bg-white/5 h-64"></div>
      </Card>
    );
  }

  if (!city) {
    return (
      <Card title={<span className="gradient-text">Weather Today</span>}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="relative inline-block mb-5 animate-float">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-3 gradient-text">No City Selected</h2>
          <p className="text-blue-200/80 text-base max-w-xs">
            Select a city from the list to view detailed weather information
          </p>
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
    <Card title={<span className="gradient-text">Weather Today</span>}>
      <div className="space-y-8">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" color="white" />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 backdrop-blur-md rounded-xl px-6 py-4 text-red-200">
            <div className="flex items-center">
              <div className="relative mr-3 flex-shrink-0">
                <div className="absolute inset-0 bg-red-500/30 rounded-full blur-sm"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <span>{error instanceof Error ? error.message : 'Failed to load weather data'}</span>
            </div>
          </div>
        )}

        {data && !isLoading && !error && (
          <>
            {/* Header with city name and current date */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold gradient-text">{city.name}</h2>
              <p className="text-blue-200/80 text-sm">{formatDate(data.timestamp)}</p>
            </div>

            {/* Main weather display */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 mb-5 border border-blue-500/10 shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Temperature and condition */}
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="relative mr-4">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md"></div>
                    <img
                      src={`${OPENWEATHER_ICON_URL}/${data.conditionIcon}@4x.png`}
                      alt={data.condition}
                      className="w-20 h-20 relative z-10 drop-shadow-lg"
                    />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white">{Math.round(data.temperature)}°C</div>
                    <div className="text-lg text-blue-200/80">{data.condition}</div>
                  </div>
                </div>

                {/* Weather details */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                    <div className="flex items-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-blue-200/80 text-sm">Feels Like</div>
                    </div>
                    <div className="text-xl font-semibold text-white">{Math.round(data.feelsLike)}°C</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                    <div className="flex items-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      <div className="text-blue-200/80 text-sm">Humidity</div>
                    </div>
                    <div className="text-xl font-semibold text-white">{data.humidity}%</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                    <div className="flex items-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="text-blue-200/80 text-sm">Wind Speed</div>
                    </div>
                    <div className="text-xl font-semibold text-white">{data.windSpeed} m/s</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                    <div className="flex items-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-blue-200/80 text-sm">Updated</div>
                    </div>
                    <div className="text-xl font-semibold text-white">{formatTime(data.timestamp)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map section */}
            <div>
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <h3 className="text-lg font-semibold text-white">Location Map</h3>
              </div>
              <div className="h-64 rounded-xl overflow-hidden border border-blue-500/10 shadow-lg">
                <MapWithNoSSR city={city} />
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default WeatherToday;
