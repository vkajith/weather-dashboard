import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import { useWeather } from '@/lib/WeatherContext';

// Create a separate map component that will be dynamically imported
const MapWithNoSSR = dynamic(
  () => import('./MapWithNoSSR'),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

const MapView: React.FC = () => {
  const { cities, selectedCity } = useWeather();
  const [mounted, setMounted] = useState(false);

  // Find the selected city
  const city = cities.find(c => c.id === selectedCity);

  // Make sure component mounted (client-side) before showing content that might cause hydration error
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Map View</h2>
        <div className="h-96 rounded-lg bg-gray-100"></div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Map View</h2>
        <p className="text-gray-500">Select a city to view on the map</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Map View</h2>
      <div className="h-96 rounded-lg overflow-hidden">
        <MapWithNoSSR city={city} />
      </div>
    </div>
  );
};

export default MapView; 