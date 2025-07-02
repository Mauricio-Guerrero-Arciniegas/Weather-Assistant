import { useState, useEffect } from 'react'

export function useGeoLocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no está disponible en este navegador.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lon: longitude })
      },
      () => {
        setError('No se pudo obtener tu ubicación.')
      }
    )
  }, [])

  return { location, error }
}