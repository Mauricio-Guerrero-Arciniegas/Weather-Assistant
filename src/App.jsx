import { useEffect, useState } from 'react'
import { useWeather } from './hooks/useWeather'
import { useGeoLocation } from './hooks/useGeoLocation'
import { getWeatherClass } from './utils/getWeatherClass'

import SearchBar from './components/SearchBar/SearchBar'
import ToggleTheme from './components/ToggleTheme/ToggleTheme'

import './styles/globals.scss'
import './styles/weatherBackgrounds.scss'

function App() {
  const [city, setCity] = useState('')
  const [units, setUnits] = useState('metric') // 'metric' = °C, 'imperial' = °F
  const isCelsius = units === 'metric'

  const { location, error: geoError } = useGeoLocation()
  const {
    data,
    loading,
    error,
    getWeatherByCity,
    getWeatherByCoords,
  } = useWeather()

  const [isDarkMode, setIsDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  )

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const handleSearch = (e) => {
    e.preventDefault()
    if (city.trim()) getWeatherByCity(city, units)
  }

  const handleToggleUnits = () => {
    const newUnits = isCelsius ? 'imperial' : 'metric'
    setUnits(newUnits)
    if (city.trim()) {
      getWeatherByCity(city, newUnits)
    } else if (location) {
      getWeatherByCoords(location.lat, location.lon, newUnits)
    }
  }

  useEffect(() => {
    if (location) {
      getWeatherByCoords(location.lat, location.lon, units)
    }
  }, [location])

  const mainWeather = data?.weather?.[0]?.main || ''
  const iconCode = data?.weather?.[0]?.icon || ''
  const weatherClass = data
    ? getWeatherClass(mainWeather, iconCode)
    : 'default-bg'

  return (
    <main className={weatherClass}>
      <ToggleTheme isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="app-container">
        <section className="content">
          <h1>Clima en tu ciudad</h1>
          <SearchBar city={city} setCity={setCity} onSearch={handleSearch} />

          <button onClick={handleToggleUnits} className="unit-toggle">
            Cambiar a °{isCelsius ? 'F' : 'C'}
          </button>

          {geoError && <p>{geoError}</p>}
          {loading && <p>Cargando...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {data && (() => {
            const roundedTemp = Math.round(data.main.temp)
            return (
              <div className="weather-box">
                <div className="weather-left">
                  <img
                    src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
                    alt="Icono del clima"
                    className="weather-icon"
                  />
                </div>

                <div className="weather-right">
                  <h2>🌆 {data.name}, {data.sys.country}</h2>
                  <p>🌡️ Temperatura: {roundedTemp}°{isCelsius ? 'C' : 'F'}</p>
                  <p>🌦️ Condición: {data.weather[0].description}</p>
                  <p>🌬️ Viento: {data.wind.speed} {isCelsius ? 'm/s' : 'mph'}</p>
                  <p>☁️ Nubosidad: {data.clouds.all}%</p>
                  <p>🧭 Presión: {data.main.pressure} hPa</p>
                </div>
              </div>
            )
          })()}
        </section>
      </div>
    </main>
  )
}

export default App