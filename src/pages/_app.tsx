import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Weather Dashboard</title>
      </Head>
      <SWRConfig
        value={{
          onError: (error) => {
            console.error('SWR Error:', error);
          },
          shouldRetryOnError: true,
          revalidateOnFocus: false,
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}
