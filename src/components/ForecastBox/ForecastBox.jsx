function ForecastBox({ forecast, isCelsius }) {
  return (
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
  )
}

export default ForecastBox