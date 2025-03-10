import { ReactNode } from 'react';

import { City } from '@/types/weather';

export interface WeatherContextProps {
  cities: City[];
  addCity: (cityName: string, lat: number, lon: number) => void;
  removeCity: (cityId: string) => void;
  reorderCities: (startIndex: number, endIndex: number) => void;
  getNextOrder: () => number;
  selectedCity: string | null;
  setSelectedCity: (cityId: string | null) => void;
}

export interface WeatherProviderProps {
  children: ReactNode;
} 