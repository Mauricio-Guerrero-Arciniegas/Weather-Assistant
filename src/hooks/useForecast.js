import { useState } from 'react'
import axios from 'axios'

const API_KEY = 'e92a4cc0b70a7d1be6a0b4639edea54c' 

export function useForecast() {
  const [forecast, setForecast] = useState([])

  const getForecastByCoords = async (lat, lon, units = 'metric') => {
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        params: {
          lat,
          lon,
          units,
          appid: API_KEY,
        },
      })

      const daily = res.data.list.filter(item => item.dt_txt.includes('12:00:00'))
      const formatted = daily.slice(0, 5).map(item => ({
        date: item.dt_txt.split(' ')[0],
        temp: item.main.temp,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      }))
      setForecast(formatted)
    } catch (err) {
      console.error('Error al obtener el pronóstico:', err)
    }
  }

  const getForecastByCity = async (city, units = 'metric') => {
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        params: {
          q: city,
          units,
          appid: API_KEY,
        },
      })

      const daily = res.data.list.filter(item => item.dt_txt.includes('12:00:00'))
      const formatted = daily.slice(0, 5).map(item => ({
        date: item.dt_txt.split(' ')[0],
        temp: item.main.temp,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      }))
      setForecast(formatted)
    } catch (err) {
      console.error('Error al obtener el pronóstico por ciudad:', err)
    }
  }

  return {
    forecast,
    getForecastByCoords,
    getForecastByCity,
  }
}