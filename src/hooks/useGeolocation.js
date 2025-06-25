import { useState, useEffect } from 'react';

function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no está disponible.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lon: longitude });
      },
      () => setError('No se pudo obtener tu ubicación.')
    );
  }, []);

  return { location, error };
}

export default useGeolocation;