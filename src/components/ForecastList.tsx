import React from 'react';
import useSWR from 'swr';

import { fetchForecastData } from '@/lib/api';

import { ForecastData, ForecastItem } from '@/types/weather';

interface ForecastListProps {
  city: string;
}

const ForecastList: React.FC<ForecastListProps> = ({ city }) => {
  const { data, error, isLoading } = useSWR<ForecastData>(
    `forecast-${city}`,
    () => fetchForecastData(city),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 3600000, // Refresh every hour
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  // Format date to display day of week
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
        <div className="text-red-500 text-center py-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{error instanceof Error ? error.message : 'Failed to load forecast data'}</p>
        </div>
      </div>
    );
  }

  if (!data || data.forecast.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
        <p className="text-gray-500 text-center">No forecast data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {data.forecast.map((item: ForecastItem, index: number) => (
          <div key={index} className="p-3 rounded-lg bg-gray-50 text-center">
            <div className="font-medium">{formatDate(item.date)}</div>
            <img
              src={`https://openweathermap.org/img/wn/${item.conditionIcon}.png`}
              alt={item.condition}
              className="w-12 h-12 mx-auto"
            />
            <div className="text-sm">{item.condition}</div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-blue-700">{Math.round(item.minTemp)}°</span>
              <span className="text-red-600">{Math.round(item.maxTemp)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastList; 