import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';

import '@/styles/globals.css';

import { WeatherProvider } from '@/contexts/WeatherContext';

// Log that the provider is loaded to help with debugging
console.log('WeatherProvider loaded from @/contexts/WeatherContext');

/**
 * Custom App component
 * Provides global configuration for the application
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: false
      }}
    >
      <WeatherProvider>
        <Component {...pageProps} />
      </WeatherProvider>
    </SWRConfig>
  );
}
