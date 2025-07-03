import { useState } from 'react'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export function useWeather() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getWeatherByCity = async (city, units = 'metric') => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units,
          lang: 'es',
        },
      })
      setData(response.data)
    } catch (err) {
      setError('Ciudad no encontrada o error en la API')
    } finally {
      setLoading(false)
    }
  }

  const getWeatherByCoords = async (lat, lon, units = 'metric') => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units,
          lang: 'es',
        },
      })
      setData(response.data)
    } catch (err) {
      setError('No se pudo obtener el clima por ubicación.')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, getWeatherByCity, getWeatherByCoords }
}