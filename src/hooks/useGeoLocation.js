import { useEffect, useState } from 'react'

export function useGeoLocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      () => {
        setError('No se pudo obtener la ubicación.')
      }
    )
  }, [])

  return { location, error }
}