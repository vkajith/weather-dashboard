import React from 'react';
import useSWR from 'swr';

import { fetchForecastData } from '@/lib/api/weatherService';

import { Card, Spinner } from '@/components/ui';

import { OPENWEATHER_ICON_URL } from '@/constant/api';

import { ForecastData, ForecastItem } from '@/types/weather';

interface ForecastListProps {
  city: string;
}

/**
 * Component to display 5-day weather forecast with modern styling
 */
const ForecastList: React.FC<ForecastListProps> = ({ city }) => {
  // Fetch forecast data with SWR
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
      <Card title={<span className="gradient-text text-2xl font-bold">5-Day Forecast</span>}>
        <div className="flex justify-center items-center h-32">
          <Spinner size="md" color="white" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title={<span className="gradient-text text-2xl font-bold">5-Day Forecast</span>}>
        <div className="bg-red-500/10 backdrop-blur-md rounded-xl px-4 py-3 text-red-200">
          <div className="flex items-center">
            <div className="relative mr-2 flex-shrink-0">
              <div className="absolute inset-0 bg-red-500/30 rounded-full blur-sm"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span>{error instanceof Error ? error.message : 'Failed to load forecast data'}</span>
          </div>
        </div>
      </Card>
    );
  }

  if (!data || data.forecast.length === 0) {
    return (
      <Card title={<span className="gradient-text text-2xl font-bold">5-Day Forecast</span>}>
        <div className="text-center py-8">
          <p className="text-blue-200/80">No forecast data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={<span className="gradient-text text-2xl font-bold">5-Day Forecast</span>}>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {data.forecast.map((item: ForecastItem, index: number) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md rounded-xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 group"
          >
            <div className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-2">{formatDate(item.date)}</div>
            <div className="weather-icon-container mb-2 relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src={`${OPENWEATHER_ICON_URL}/${item.conditionIcon}.png`}
                alt={item.condition}
                className="w-12 h-12 mx-auto relative z-10 drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="text-sm text-blue-300 mb-3 font-medium">{item.condition}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white/5 backdrop-blur-md rounded-lg p-2 transition-all duration-300 group-hover:bg-white/10">
                <div className="text-blue-200/60 text-xs mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  Min
                </div>
                <div className="text-white font-medium">{Math.round(item.minTemp)}°</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-lg p-2 transition-all duration-300 group-hover:bg-white/10">
                <div className="text-blue-200/60 text-xs mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Max
                </div>
                <div className="text-white font-medium">{Math.round(item.maxTemp)}°</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ForecastList; 