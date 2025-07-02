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
  const [units, setUnits] = useState('metric')
  const isCelsius = units === 'metric'
  const [animationKey, setAnimationKey] = useState(0)

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

  useEffect(() => {
    if (data) {
      setAnimationKey(prev => prev + 1)
    }
  }, [data])

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
          <h1>Asistente del Clima </h1>
          <SearchBar city={city} setCity={setCity} onSearch={handleSearch} />

          <button onClick={handleToggleUnits} className="unit-toggle">
            Cambiar a °{isCelsius ? 'F' : 'C'}
          </button>

          {geoError && <p>{geoError}</p>}
          {loading && <p>Cargando...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {data && (() => {
            const roundedTemp = Math.round(data.main.temp)
            const roundedTempC = isCelsius
              ? roundedTemp
              : Math.round((roundedTemp - 32) * 5 / 9)

            let tempColorClass = ''
            let tempLabel = ''
            let tempMessage = ''

            if (roundedTempC <= 12) {
              tempColorClass = 'cold'
              tempLabel = 'Clima Frío ❄️'
              tempMessage = 'Recomendación: Usar abrigo, bufanda y gorro'
            } else if (roundedTempC <= 25) {
              tempColorClass = 'warm'
              tempLabel = 'Clima Templado 🌤️'
              tempMessage = 'Recomendación: Usar camiseta y chaqueta ligera'
            } else {
              tempColorClass = 'hot'
              tempLabel = 'Clima Calido 🔥'
              tempMessage = 'Recomendación: Usar ropa fresca y gafas de sol'
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
                      key={animationKey}
                      className="thermo-fill"
                      style={{
                        '--target-height': `${Math.min(roundedTempC, 50) * 2}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="weather-right">
                  <div className="weather-info">
                    <h2>{data.name}, {data.sys.country}</h2>
                    <p>🌡️ {roundedTemp}°{isCelsius ? 'C' : 'F'}</p>
                    <p className="temp-label">{tempLabel}</p>
                    <p className="temp-message">{tempMessage}</p>
                    <p>🌦️ {data.weather[0].description}</p>
                  </div>

                  <div className="weather-stats">
                    <p>🌬️ {data.wind.speed} {isCelsius ? 'm/s' : 'mph'}</p>
                    <p>☁️ {data.clouds.all}% nubosidad</p>
                    <p>🧭 {data.main.pressure} hPa</p>
                  </div>
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