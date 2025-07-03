function WeatherInfo({ data, isCelsius }) {
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
  )
}

export default WeatherInfo