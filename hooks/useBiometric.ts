import { useState, useCallback } from 'react';

export const useBiometric = () => {
  const [isAvailable, setIsAvailable] = useState(true); // Simulated availability
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authenticate = useCallback(async (reason: string = 'Autenticação necessária') => {
    // Simulate biometric delay
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        setIsAuthenticated(success);
        resolve(success);
      }, 1000);
    });
  }, []);

  return { isAvailable, isAuthenticated, authenticate };
};
