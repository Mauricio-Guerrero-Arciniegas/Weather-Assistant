import { useEffect, useState } from 'react'
import { useWeather } from './hooks/useWeather'
import { useGeoLocation } from './hooks/useGeoLocation'
import { useForecast } from './hooks/useForecast'
import { getWeatherClass } from './utils/getWeatherClass'

import Loader from './components/Loader/Loader'
import SearchBar from './components/SearchBar/SearchBar'
import ToggleTheme from './components/ToggleTheme/ToggleTheme'
import WeatherInfo from './components/WeatherInfo/WeatherInfo'
import Thermometer from './components/Thermometer/Thermometer'
import PressureInfo from './components/PressureInfo/PressureInfo'
import ForecastBox from './components/ForecastBox/ForecastBox'
import UnitToggleButton from './components/UnitToggleButton/UnitToggleButton'

import './styles/globals.scss'
import './styles/weatherBackgrounds.scss'

function App() {
  const [city, setCity] = useState('')
  const [units, setUnits] = useState('metric')
  const isCelsius = units === 'metric'
  const [animationKey, setAnimationKey] = useState(0)
  const [showLoader, setShowLoader] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  )

  const { location, error: geoError } = useGeoLocation()
  const { data, loading, error, getWeatherByCity, getWeatherByCoords } = useWeather()
  const { forecast, getForecastByCoords, getForecastByCity } = useForecast()

  useEffect(() => {
    const timeout = setTimeout(() => setShowLoader(false), 3500)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    if (location) {
      getWeatherByCoords(location.lat, location.lon, units)
      getForecastByCoords(location.lat, location.lon, units)
    }
  }, [location, units])

  useEffect(() => {
    if (data) {
      setAnimationKey(prev => prev + 1)
    }
  }, [data])

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

  if (showLoader) return <Loader />

  const mainWeather = data?.weather?.[0]?.main || ''
  const iconCode = data?.weather?.[0]?.icon || ''
  const weatherClass = data ? getWeatherClass(mainWeather, iconCode) : 'default-bg'
  const tempC = Math.round(
    isCelsius ? data?.main?.temp : (data?.main?.temp - 32) * 5 / 9
  )
  const tempColorClass = tempC <= 12 ? 'cold' : tempC <= 25 ? 'warm' : 'hot'

  return (
    <main className={weatherClass}>
      <ToggleTheme isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <div className="app-container">
        <section className="content">
          <h1>Asistente del Clima</h1>

          <SearchBar city={city} setCity={setCity} onSearch={handleSearch} />
          <UnitToggleButton isCelsius={isCelsius} onToggle={handleToggleUnits} />

          {geoError && <p>{geoError}</p>}
          {loading && <p>Cargando...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {data && (
            <>
              <div className="weather-box">
                <WeatherInfo data={data} isCelsius={isCelsius} />
                <Thermometer
                  iconCode={iconCode}
                  tempC={tempC}
                  animationKey={animationKey}
                  tempColorClass={tempColorClass}
                />
              </div>

              <PressureInfo />
              <ForecastBox forecast={forecast} isCelsius={isCelsius} />
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default App