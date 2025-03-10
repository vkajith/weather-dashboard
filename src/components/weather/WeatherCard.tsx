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
 * Minimal weather card component showing just essential information
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
      className="transform transition-all duration-300 cursor-pointer hover:scale-[1.02] group"
      onClick={onClick}
    >
      <Card isSelected={isSelected} className="p-5 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-3">
          <h2 className="gradient-text text-xl font-bold">{city}</h2>

          <button
            onClick={handleRemove}
            className="p-1.5 rounded-full text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-200"
            aria-label="Remove city"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-16 py-2">
            <Spinner size="sm" color="white" />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 backdrop-blur-md rounded-lg px-3 py-2 text-red-200 text-xs">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 flex-shrink-0 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="truncate">Error</span>
            </div>
          </div>
        )}

        {data && !isLoading && !error && (
          <div className="flex items-center justify-between mt-2">
            <div className="text-3xl font-bold text-white">
              {Math.round(data.temperature)}°
            </div>
            <div className="flex items-center">
              <div className="text-sm text-blue-300 mr-2 font-medium">{data.condition}</div>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src={`${OPENWEATHER_ICON_URL}/${data.conditionIcon}@2x.png`}
                  alt={data.condition}
                  className="w-12 h-12 relative z-10 drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WeatherCard; 