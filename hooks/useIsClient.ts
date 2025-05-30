import { useState, useEffect } from 'react';

/**
 * Hook to safely determine if code is running on the client side.
 * Returns true only after component has mounted on the client.
 * Crucial for avoiding hydration errors with localStorage, etc.
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}