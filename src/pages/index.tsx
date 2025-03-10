import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { Component, ErrorInfo, ReactNode, useEffect, useState } from 'react';

import { Card, Spinner } from '@/components/ui';
import { CityList, CitySelector, ForecastList } from '@/components/weather';

import { useWeather } from '@/contexts/WeatherContext';

// Import Map component dynamically to avoid SSR issues with Leaflet
const WeatherTodayWithMap = dynamic(() => import('@/components/weather/WeatherToday'), {
  ssr: false
});

/**
 * Error Boundary component to catch context errors
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-white">Context Error</h2>
              <p className="text-blue-200/80 mb-4">There was an error with the WeatherContext. Please refresh the page.</p>
              <pre className="bg-gray-800 p-4 rounded text-xs text-left overflow-auto max-w-full">
                {this.state.error?.message || 'Unknown error'}
              </pre>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Dashboard content component with modern styling
 */
const DashboardContent: React.FC = () => {
  // Log that we're trying to use the context hook
  console.log('Attempting to use useWeather from @/contexts/WeatherContext');

  // This will throw if the context is not available
  const { cities, selectedCity } = useWeather();
  const [mounted, setMounted] = useState(false);

  // Use useEffect to handle client-side only logic
  useEffect(() => {
    setMounted(true);
    console.log('DashboardContent mounted, context is working');
  }, []);

  // Get the selected city name (with safeguards for SSR)
  const selectedCityName = mounted
    ? cities.find(city => city.id === selectedCity)?.name || ''
    : '';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Combined Header and Search */}
      <div className="mb-8">
        <Card>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* App Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="weather-icon-container p-3 animate-float">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  <span className="gradient-text">Weather</span>
                  <span className="gradient-text-ocean ml-2">Dashboard</span>
                </h1>
                <p className="text-blue-200/80 text-sm">Real-time weather monitoring</p>
              </div>
            </div>

            {/* City Search Input - Right side with improved styling */}
            <div className="w-full md:w-96 md:ml-auto flex-shrink-0 relative z-10">
              <CitySelector />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column: City List */}
        <div className="lg:col-span-1">
          <CityList />
        </div>

        {/* Middle and right columns: Weather data and map */}
        <div className="lg:col-span-3 space-y-6">
          {mounted ? (
            selectedCityName ? (
              <>
                <ForecastList city={selectedCityName} />
                <WeatherTodayWithMap />
              </>
            ) : (
              <Card>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="weather-icon-container p-4 mb-4 animate-float">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-white">No City Selected</h2>
                  <p className="text-blue-200/80">Select a city from the list or add a new one using the search box</p>
                </div>
              </Card>
            )
          ) : (
            <Card>
              <div className="flex flex-col items-center justify-center py-12">
                <Spinner size="lg" color="white" />
              </div>
            </Card>
          )}
        </div>
      </div>

      <footer className="mt-12 text-center text-blue-200/60 text-sm">
        <p>Powered by OpenWeatherMap • Built with ❤️</p>
      </footer>
    </div>
  );
};

/**
 * Main page component
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>Weather Dashboard</title>
        <meta name="description" content="Modern weather dashboard with real-time updates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ErrorBoundary>
        <DashboardContent />
      </ErrorBoundary>
    </>
  );
}
