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
    if (city.trim()) getWeatherByCity(city)
  }

  useEffect(() => {
    if (location) {
      getWeatherByCoords(location.lat, location.lon)
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

          {geoError && <p>{geoError}</p>}
          {loading && <p>Cargando...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {data && (() => {
            const roundedTemp = Math.round(data.main.temp)
            let tempColorClass = ''
            let tempLabel = ''
            let tempMessage = ''

            if (roundedTemp <= 12) {
              tempColorClass = 'cold'
              tempLabel = 'Frío ❄️'
              tempMessage = '¡Hace frío! Recomendación: abrigo, bufanda y gorro'
            } else if (roundedTemp <= 25) {
              tempColorClass = 'warm'
              tempLabel = 'Templado 🌤️'
              tempMessage = 'Recomendación: camiseta y chaqueta ligera'
            } else {
              tempColorClass = 'hot'
              tempLabel = 'Calor 🔥'
              tempMessage = '¡Hace calor! Recomendación: ropa fresca y gafas de sol'
            }

            return (
              <div className="weather-box">
                <div className="weather-left">
                  <img
                    src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
                    alt="Icono del clima"
                    className="weather-icon"
                  />
                  <div className={`thermometer ${tempColorClass}`}>
                  <div
                    className="thermo-fill"
                    style={{
                      height: `${Math.min(roundedTemp, 50) * 2}%`,
                      '--target-height': `${Math.min(roundedTemp, 50) * 2}%`,
                    }}
                  ></div>
                </div>
                </div>

                <div className="weather-right">
                  <h2>{data.name}</h2>
                  <p>🌡️ Temperatura: {roundedTemp}°C</p>
                  <p className="temp-label">{tempLabel}</p>
                  <p className="temp-message">{tempMessage}</p>
                  <p>Condiciones Actuales: {data.weather[0].description}</p>
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