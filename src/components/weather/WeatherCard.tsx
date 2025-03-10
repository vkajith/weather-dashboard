import React from 'react';
import useSWR from 'swr';

import { fetchWeatherData } from '@/lib/api/weatherService';

import { Card, Spinner } from '@/components/ui';

import { OPENWEATHER_ICON_URL } from '@/constant/api';

import { WeatherData } from '@/types/weather';

interface WeatherCardProps {
  city: string;
  onRemove: () => void;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * Component to display current weather for a city with modern styling
 * Shows minimal information since detailed info is in the Weather Today section
 */
const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  onRemove,
  isSelected,
  onClick
}) => {
  // Fetch weather data with SWR
  const { data, error, isLoading } = useSWR<WeatherData>(
    `weather-${city}`,
    () => fetchWeatherData(city),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 300000, // Refresh every 5 minutes
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <div
      className="transform transition-all duration-300 cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      <Card isSelected={isSelected}>
        <div className="relative">
          <button
            onClick={handleRemove}
            className="absolute right-0 top-0 p-1.5 rounded-full text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-200"
            aria-label="Remove city"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <h2 className="gradient-text text-2xl font-bold mb-2">{city}</h2>

          {isLoading && (
            <div className="flex justify-center items-center h-16">
              <Spinner size="sm" color="white" />
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 backdrop-blur-md rounded-xl px-3 py-2 text-red-200 text-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="truncate">Error loading data</span>
              </div>
            </div>
          )}

          {data && !isLoading && !error && (
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-white">
                {Math.round(data.temperature)}°C
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={`${OPENWEATHER_ICON_URL}/${data.conditionIcon}@2x.png`}
                  alt={data.condition}
                  className="w-12 h-12"
                />
                <div className="text-xs text-blue-200/80">{data.condition}</div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default WeatherCard; 