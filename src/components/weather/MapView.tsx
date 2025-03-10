import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import { Card, Spinner } from '@/components/ui';

import { useWeather } from '@/contexts/WeatherContext';

// Create a separate map component that will be dynamically imported
const MapWithNoSSR = dynamic(
  () => import('./MapWithNoSSR'),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 rounded-lg bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-md flex items-center justify-center">
        <Spinner size="md" color="white" />
      </div>
    )
  }
);

/**
 * Component to display a map view of the selected city
 */
const MapView: React.FC = () => {
  const { cities, selectedCity } = useWeather();
  const [mounted, setMounted] = useState(false);

  // Make sure component mounted (client-side) before showing content that might cause hydration error
  useEffect(() => {
    setMounted(true);
  }, []);

  // Find the selected city
  const city = cities.find(c => c.id === selectedCity);

  if (!mounted) {
    return (
      <Card title={<span className="gradient-text-ocean">Location Map</span>}>
        <div className="rounded-lg bg-white bg-opacity-5 h-64"></div>
      </Card>
    );
  }

  if (!city) {
    return (
      <Card title={<span className="gradient-text-ocean">Location Map</span>}>
        <div className="flex items-center justify-center h-64 bg-white/5 backdrop-blur-md rounded-lg">
          <div className="text-center">
            <div className="relative inline-block mb-3">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-blue-100 text-center">Select a city to view its location</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title={
      <div className="flex items-center">
        <div className="relative mr-2">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span className="gradient-text-ocean">Location Map</span>
      </div>
    }>
      <div className="h-64 rounded-lg overflow-hidden">
        <MapWithNoSSR city={city} />
      </div>
    </Card>
  );
};

export default MapView; 