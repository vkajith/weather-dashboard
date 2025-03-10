import React, { useCallback, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { z } from 'zod';

import { fetchCitySuggestions } from '@/lib/api/geoService';

import { useWeather } from '@/contexts/WeatherContext';

// Schema for city name validation
const citySchema = z.object({
  cityName: z.string().min(2, 'City name must be at least 2 characters').max(50),
});

// Interface for city option
interface CityOption {
  value: string;
  label: string;
  location: string;
  lat: number;
  lon: number;
}

// Custom option component with icon
const CustomOption = ({ innerProps, data, isFocused }: any) => (
  <div
    {...innerProps}
    className={`flex items-center px-4 py-3 cursor-pointer ${isFocused ? 'bg-blue-500/30' : ''} hover:bg-blue-500/30 transition-colors duration-150 border-b border-blue-500/10 last:border-b-0`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    <div>
      <span className="font-medium">{data.label}</span>
      <span className="text-blue-200/80 text-sm ml-2">
        {data.location}
      </span>
    </div>
  </div>
);

/**
 * Enhanced component for adding new cities to the dashboard with modern styling
 */
const CitySelector: React.FC = () => {
  const { addCity } = useWeather();
  const [error, setError] = useState<string | null>(null);
  const selectRef = useRef<any>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Load options function for AsyncSelect
  const loadOptions = useCallback(async (inputValue: string) => {
    if (!inputValue || inputValue.length < 2) return [];

    try {
      const results = await fetchCitySuggestions(inputValue);

      return results.map(city => ({
        value: `${city.name}-${city.lat}-${city.lon}`,
        label: city.name,
        location: `${city.state ? `${city.state}, ` : ''}${city.country}`,
        lat: city.lat,
        lon: city.lon
      }));
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      return [];
    }
  }, []);

  // Handle selection
  const handleChange = (selectedOption: CityOption | null) => {
    if (selectedOption) {
      addCity(selectedOption.label, selectedOption.lat, selectedOption.lon);

      // Clear the input after selection
      if (selectRef.current) {
        selectRef.current.clearValue();
      }
    }
  };

  return (
    <div className="w-full">
      <div className={`relative rounded-xl bg-white/5 backdrop-blur-md border-2 transition-all duration-300 ${isFocused ? 'border-blue-400/50' : 'border-transparent'}`}>
        {/* Search icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>

        <AsyncSelect<CityOption>
          ref={selectRef}
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for a city..."
          noOptionsMessage={({ inputValue }) =>
            !inputValue
              ? "Type to search for a city"
              : inputValue.length < 2
                ? "Type at least 2 characters"
                : "No cities found"
          }
          loadingMessage={() => "Searching cities..."}
          components={{
            Option: CustomOption,
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null
          }}
          className="city-select-container"
          classNamePrefix="city-select"
          isClearable
          isSearchable
          menuPortalTarget={document.body}
          menuPosition="fixed"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              padding: 0,
              minHeight: 'unset',
              cursor: 'text'
            }),
            valueContainer: (base) => ({
              ...base,
              padding: '0.75rem 0',
              paddingLeft: '3rem'
            }),
            input: (base) => ({
              ...base,
              color: 'white',
              margin: 0,
              padding: 0,
              caretColor: 'white'
            }),
            placeholder: (base) => ({
              ...base,
              color: 'rgba(191, 219, 254, 0.5)',
              marginLeft: '0'
            }),
            singleValue: (base) => ({
              ...base,
              color: 'white',
              marginLeft: '0'
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: 'rgba(31, 41, 55, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
              zIndex: 9999,
              marginTop: '8px'
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: 'transparent',
              color: 'white',
              cursor: 'pointer',
              padding: 0,
              margin: 0
            }),
            noOptionsMessage: (base) => ({
              ...base,
              color: 'rgba(191, 219, 254, 0.8)',
              padding: '0.75rem 1rem'
            }),
            loadingMessage: (base) => ({
              ...base,
              color: 'rgba(191, 219, 254, 0.8)',
              padding: '0.75rem 1rem'
            }),
            clearIndicator: (base) => ({
              ...base,
              color: 'rgba(191, 219, 254, 0.5)',
              padding: '0 8px',
              '&:hover': {
                color: 'rgba(191, 219, 254, 0.8)',
              },
            }),
            container: (base) => ({
              ...base,
              width: '100%',
              '& input:focus': {
                boxShadow: 'none',
                outline: 'none'
              }
            })
          }}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 text-red-300 text-sm flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default CitySelector; 