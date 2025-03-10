import { API_CONFIG } from '@/constant/api';

/**
 * Sleep utility for implementing delays
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry a function with exponential backoff
 * @param fetchFn The function to retry
 * @param maxRetries Maximum number of retries
 * @param initialDelay Initial delay in milliseconds
 * @returns The result of the function
 */
export const retryWithBackoff = async <T>(
  fetchFn: () => Promise<T>,
  maxRetries = API_CONFIG.MAX_RETRIES,
  initialDelay = API_CONFIG.INITIAL_DELAY
): Promise<T> => {
  let retries = 0;
  let lastError: Error | null = null;

  while (retries < maxRetries) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error as Error;

      // Check if we should retry
      if (retries < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, retries);
        console.log(`API request failed, retrying in ${delay}ms...`);
        await sleep(delay);
        retries++;
      } else {
        break;
      }
    }
  }

  throw lastError;
}; 