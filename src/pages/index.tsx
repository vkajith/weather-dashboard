import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { useWeather, WeatherProvider } from '@/lib/WeatherContext';

import CityList from '@/components/CityList';
import CitySelector from '@/components/CitySelector';
import ForecastList from '@/components/ForecastList';

// Import Map component dynamically to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow-md p-6 h-[28rem]">
      <h2 className="text-xl font-semibold mb-4">Map View</h2>
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  )
});

// Dashboard content component
const DashboardContent: React.FC = () => {
  const { cities, selectedCity } = useWeather();
  const [mounted, setMounted] = useState(false);

  // Use useEffect to handle client-side only logic
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get the selected city name (with safeguards for SSR)
  const selectedCityName = mounted
    ? cities.find(city => city.id === selectedCity)?.name || ''
    : '';

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Weather Dashboard</h1>
        <p className="text-gray-600">Monitor weather conditions for multiple cities</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: City controls */}
        <div className="space-y-6">
          <CitySelector />
          <CityList />
        </div>

        {/* Middle and right columns: Weather data and map */}
        <div className="lg:col-span-2 space-y-6">
          {mounted && (
            <>
              {selectedCityName ? (
                <>
                  <ForecastList city={selectedCityName} />
                  <MapView />
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <h2 className="text-xl font-semibold mb-2">No City Selected</h2>
                  <p className="text-gray-500">Add a city from the panel on the left to view weather data</p>
                </div>
              )}
            </>
          )}

          {!mounted && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Loading...</h2>
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main page component with provider
export default function Home() {
  return (
    <>
      <Head>
        <title>Weather Dashboard</title>
        <meta name="description" content="Weather dashboard for monitoring multiple cities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WeatherProvider>
        <DashboardContent />
      </WeatherProvider>
    </>
  );
}
