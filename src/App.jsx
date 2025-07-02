import { useEffect, useState } from 'react'
import { useWeather } from './hooks/useWeather'
import { useGeoLocation } from './hooks/useGeoLocation'
import { useForecast } from './hooks/useForecast'
import { getWeatherClass } from './utils/getWeatherClass'
import Loader from './components/Loader/Loader'

import SearchBar from './components/SearchBar/SearchBar'
import ToggleTheme from './components/ToggleTheme/ToggleTheme'

import './styles/globals.scss'
import './styles/weatherBackgrounds.scss'



function App() {
  const [city, setCity] = useState('')
  const [units, setUnits] = useState('metric')
  const isCelsius = units === 'metric'
  const [animationKey, setAnimationKey] = useState(0)
  const [showLoader, setShowLoader] = useState(true)
  
  const { location, error: geoError } = useGeoLocation()
  const {
    data,
    loading,
    error,
    getWeatherByCity,
    getWeatherByCoords,
  } = useWeather()
  const { forecast, getForecastByCoords, getForecastByCity } = useForecast()
  
  const [isDarkMode, setIsDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
)
useEffect(() => {
  const timeout = setTimeout(() => setShowLoader(false), 3500)
  return () => clearTimeout(timeout)
}, [])

useEffect(() => {
  document.body.classList.toggle('dark', isDarkMode)
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const handleSearch = (e) => {
    e.preventDefault()
    if (city.trim()) {
      getWeatherByCity(city, units)
      getForecastByCity(city, units)
    }
  }

  const handleToggleUnits = () => {
    const newUnits = isCelsius ? 'imperial' : 'metric'
    setUnits(newUnits)
    if (city.trim()) {
      getWeatherByCity(city, newUnits)
      getForecastByCity(city, newUnits)
    } else if (location) {
      getWeatherByCoords(location.lat, location.lon, newUnits)
      getForecastByCoords(location.lat, location.lon, newUnits)
    }
  }

  useEffect(() => {
    if (location) {
      getWeatherByCoords(location.lat, location.lon, units)
      getForecastByCoords(location.lat, location.lon, units)
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

    if (showLoader) return <Loader />
    
  return (
    <main className={weatherClass}>
      <ToggleTheme isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="app-container">
        <section className="content">
          <h1>Asistente del Clima</h1>
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
              tempLabel = 'Clima Frío'
              tempMessage = 'Recomendación: Usar abrigo, bufanda y gorro.'
            } else if (roundedTempC <= 25) {
              tempColorClass = 'warm'
              tempLabel = 'Clima Templado'
              tempMessage = 'Recomendación: Usar camiseta y chaqueta ligera.'
            } else {
              tempColorClass = 'hot'
              tempLabel = 'Clima Cálido'
              tempMessage = 'Recomendación: Usar ropa fresca y gafas de sol.'
            }

            return (
              <>
                <div className="weather-box">
                  <div className="weather-info">
                    <h2>{data.name}, {data.sys.country}</h2>
                    <p>Temperatura: {roundedTemp}°{isCelsius ? 'C' : 'F'}</p>
                    <p className="temp-label">{tempLabel}</p>
                    <p>Precipitación: {data.weather[0].description}</p>
                    <p>Velocidad del Viento: {Math.round(data.wind.speed)} {isCelsius ? 'm/s' : 'mph'}</p>
                    <p>☁️ Nubosidad: {data.clouds.all}%</p>
                    <p>Presión Atmosférica: {data.main.pressure} hPa</p>
                    <p className="temp-message">ℹ️ {tempMessage}</p>
                  </div>

                  <div className="weather-right">
                    <img
                      src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
                      alt="Icono del clima"
                      className="weather-icon"
                    />
                    <div className="thermo-section">
                      <div className="thermo-label">Termometro</div>
                      <div className={`thermometer ${tempColorClass}`}>
                        <div
                          className="thermo-fill"
                          key={animationKey}
                          style={{ '--target-height': `${Math.min(roundedTempC, 50) * 2}%` }}
                        ></div>
                        
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pressure-card">
  <h3>ℹ️ ¿Qué es la presión atmosférica?</h3>
  <p>
    Es el peso del aire sobre la superficie terrestre. Se mide en <strong>hPa</strong> (hectopascales).
    Un valor normal ronda los <strong>1013 hPa</strong>.
  </p>

  <table className="pressure-table">
    <thead>
      <tr>
        <th>Presión</th>
        <th>Interpretación</th>
        <th>Clima Típico</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>&gt; 1020 hPa</td>
        <td>Alta presión</td>
        <td>Tiempo estable ☀️</td>
      </tr>
      <tr>
        <td>1010 - 1020 hPa</td>
        <td>Normal</td>
        <td>Clima equilibrado 🌤️</td>
      </tr>
      <tr>
        <td>&lt; 1010 hPa</td>
        <td>Baja presión</td>
        <td>Lluvias probables 🌧️</td>
      </tr>
      <tr>
        <td>&lt; 1000 hPa</td>
        <td>Muy baja presión</td>
        <td>Tormentas fuertes ⛈️</td>
      </tr>
    </tbody>
  </table>
</div>

                  {forecast.length > 0 && (
                  <div className="forecast-box">
                    <h3>Pronóstico para los próximos días</h3>
                    <div className="forecast-cards">
                      {forecast.map(day => (
                        <div key={day.date} className="forecast-card">
                          <p>{day.date}</p>
                          <img
                            src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                            alt={day.description}
                          />
                          <p>{day.description}</p>
                          <p>{Math.round(day.temp)}°{isCelsius ? 'C' : 'F'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )
          })()}
        </section>
      </div>
    </main>
  )
}

export default App