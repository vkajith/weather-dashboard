import React from 'react';
import useSWR from 'swr';

import { fetchWeatherData } from '@/lib/api';

import { WeatherData } from '@/types/weather';

interface WeatherCardProps {
  city: string;
  onRemove: () => void;
  isSelected: boolean;
  onClick: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  onRemove,
  isSelected,
  onClick
}) => {
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
      className={`relative p-6 rounded-lg shadow-md transition-all duration-200 cursor-pointer
        ${isSelected
          ? 'bg-blue-100 border-2 border-blue-500'
          : 'bg-white hover:bg-gray-50 border border-gray-200'
        }`}
      onClick={onClick}
    >
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
        aria-label="Remove city"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      <h2 className="text-xl font-bold mb-4">{city}</h2>

      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{error instanceof Error ? error.message : 'Failed to load weather data'}</p>
        </div>
      )}

      {data && !isLoading && !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{Math.round(data.temperature)}°C</div>
              <div className="text-sm text-gray-500">Feels like: {Math.round(data.feelsLike)}°C</div>
            </div>
            <div className="text-center">
              <img
                src={`https://openweathermap.org/img/wn/${data.conditionIcon}@2x.png`}
                alt={data.condition}
                className="w-16 h-16"
              />
              <div className="text-sm">{data.condition}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
            <div className="text-sm">
              <div className="text-gray-500">Humidity</div>
              <div>{data.humidity}%</div>
            </div>
            <div className="text-sm">
              <div className="text-gray-500">Wind</div>
              <div>{data.windSpeed} m/s</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard; 