import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useLocalStorage } from '@/hooks';

import { WeatherContextProps, WeatherProviderProps } from './types';

import { City } from '@/types/weather';

// Create the context with undefined as default value
const WeatherContext = createContext<WeatherContextProps | undefined>(undefined);

/**
 * Weather Provider component
 * Manages the state of cities and selected city
 */
export function WeatherProvider({ children }: WeatherProviderProps) {
  const [cities, setCities] = useLocalStorage<City[]>('weatherDashboard-cities', []);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoize functions to avoid recreating them on every render
  const getNextOrder = useCallback(() => {
    if (cities.length === 0) return 0;
    return Math.max(...cities.map(city => city.order)) + 1;
  }, [cities]);

  const addCity = useCallback((cityName: string, lat: number, lon: number) => {
    // Check if city already exists
    const cityExists = cities.some(
      (city: City) => city.name.toLowerCase() === cityName.toLowerCase()
    );

    if (cityExists) {
      return;
    }

    const newCity: City = {
      id: uuidv4(),
      name: cityName,
      lat,
      lon,
      order: getNextOrder(),
    };

    const updatedCities = [...cities, newCity];
    setCities(updatedCities);

    // Select newly added city if it's the first one
    if (updatedCities.length === 1 || !selectedCity) {
      setSelectedCity(newCity.id);
    }
  }, [cities, getNextOrder, selectedCity, setCities]);

  const removeCity = useCallback((cityId: string) => {
    const updatedCities = cities.filter((city: City) => city.id !== cityId);
    setCities(updatedCities);

    // Update selected city if it was removed
    if (selectedCity === cityId) {
      setSelectedCity(updatedCities.length > 0 ? updatedCities[0].id : null);
    }
  }, [cities, selectedCity, setCities]);

  const reorderCities = useCallback((startIndex: number, endIndex: number) => {
    const result = Array.from(cities);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    // Update order values
    const reordered = result.map((city: City, index: number) => ({
      ...city,
      order: index,
    }));

    setCities(reordered);
  }, [cities, setCities]);

  // Initialize with a default city only on client-side to avoid hydration mismatch
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized) {
      return;
    }

    // Wait a tick to ensure local storage has been loaded
    const timer = setTimeout(() => {
      if (cities.length === 0) {
        addCity('London', 51.5074, -0.1278);
      } else if (!selectedCity && cities.length > 0) {
        setSelectedCity(cities[0].id);
      }
      setIsInitialized(true);
    }, 0);

    return () => clearTimeout(timer);
  }, [cities, selectedCity, addCity, isInitialized]);

  // Create the context value object
  const contextValue: WeatherContextProps = {
    cities,
    addCity,
    removeCity,
    reorderCities,
    getNextOrder,
    selectedCity,
    setSelectedCity,
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  );
}

/**
 * Custom hook to use the Weather context
 * @returns The Weather context
 * @throws Error if used outside of a WeatherProvider
 */
export function useWeather(): WeatherContextProps {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
} 