import styles from './WeatherCard.module.scss';

function WeatherCard({ data }) {
  return (
    <div className={styles['weather-card']}>
      <h2 className={styles['weather-card__city']}>{data.name}, {data.sys.country}</h2>
      <p className={styles['weather-card__desc']}>{data.weather[0].description}</p>
      <h1 className={styles['weather-card__temp']}>{Math.round(data.main.temp)}°C</h1>
      <img
        className={styles['weather-card__icon']}
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        alt="weather icon"
      />
    </div>
  );
}

export default WeatherCard;