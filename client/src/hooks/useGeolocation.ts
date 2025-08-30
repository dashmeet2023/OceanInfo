import { useState, useCallback, useRef } from 'react';

interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

interface UseGeolocationReturn {
  location: GeolocationPosition | null;
  error: string | null;
  isLoading: boolean;
  isSupported: boolean;
  getCurrentLocation: () => Promise<GeolocationPosition | null>;
  watchPosition: () => number | null;
  clearWatch: (watchId: number) => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const isSupported = 'geolocation' in navigator;

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    const coords = position.coords;
    const newLocation: GeolocationPosition = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      altitude: coords.altitude || undefined,
      altitudeAccuracy: coords.altitudeAccuracy || undefined,
      heading: coords.heading || undefined,
      speed: coords.speed || undefined,
      timestamp: position.timestamp,
    };
    
    setLocation(newLocation);
    setError(null);
    setIsLoading(false);
    
    return newLocation;
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    let errorMessage = 'An unknown error occurred';
    
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Location access denied by user';
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is unavailable';
        break;
      case err.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
    }
    
    setError(errorMessage);
    setIsLoading(false);
    console.error('Geolocation error:', errorMessage, err);
  }, []);

  const getCurrentLocation = useCallback((): Promise<GeolocationPosition | null> => {
    return new Promise((resolve, reject) => {
      if (!isSupported) {
        const error = 'Geolocation is not supported by this browser';
        setError(error);
        reject(new Error(error));
        return;
      }

      setIsLoading(true);
      setError(null);

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 60000, // 1 minute
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = handleSuccess(position);
          resolve(newLocation);
        },
        (err) => {
          handleError(err);
          reject(err);
        },
        options
      );
    });
  }, [isSupported, handleSuccess, handleError]);

  const watchPosition = useCallback((): number | null => {
    if (!isSupported) {
      setError('Geolocation is not supported by this browser');
      return null;
    }

    // Clear existing watch if any
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000, // 15 seconds for watch
      maximumAge: 30000, // 30 seconds for watch
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    watchIdRef.current = watchId;
    return watchId;
  }, [isSupported, handleSuccess, handleError]);

  const clearWatch = useCallback((watchId: number) => {
    if (isSupported) {
      navigator.geolocation.clearWatch(watchId);
      if (watchIdRef.current === watchId) {
        watchIdRef.current = null;
      }
    }
  }, [isSupported]);

  // Cleanup watch on unmount
  const cleanup = useCallback(() => {
    if (watchIdRef.current !== null) {
      clearWatch(watchIdRef.current);
    }
  }, [clearWatch]);

  // Return cleanup function for use in useEffect
  React.useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    location,
    error,
    isLoading,
    isSupported,
    getCurrentLocation,
    watchPosition,
    clearWatch,
  };
}
