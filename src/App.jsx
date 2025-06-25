import { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard/WeatherCard';
import useGeolocation from './hooks/useGeolocation';
import getWeatherByCity, { getWeatherByCoords } from './services/weatherService';
import styles from './App.module.scss';

function App() {
  const { location, error: geoError } = useGeolocation();
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);

  // Obtener clima por coordenadas si hay geolocalización
  useEffect(() => {
    if (location) {
      getWeatherByCoords(location.lat, location.lon)
        .then((data) => {
          setWeather(data);
          setCity(data.name);
        })
        .catch(() => setError('No se pudo obtener el clima por ubicación.'));
    }
  }, [location]);

  const handleInput = (e) => setCity(e.target.value);

  const handleSearch = () => {
    if (!city.trim()) return;
    getWeatherByCity(city)
      .then((data) => {
        setWeather(data);
        setError(null);
      })
      .catch(() => setError('Ciudad no encontrada.'));
  };

  return (
    <div className={`${styles.app} ${styles[`app--${weather?.weather[0].main?.toLowerCase()}`]}`}>
      <h1 className={styles['app__title']}>🌤️ Weather Assistant</h1>

      <div className={styles['app__search']}>
        <input
          className={styles['app__input']}
          type="text"
          value={city}
          onChange={handleInput}
          placeholder="Buscar ciudad..."
        />
        <button className={styles['app__button']} onClick={handleSearch}>
          Buscar
        </button>
      </div>

      {geoError && <p className={styles['app__error']}>{geoError}</p>}
      {error && <p className={styles['app__error']}>{error}</p>}

      {weather && <WeatherCard data={weather} />}
    </div>
  );
}

export default App;