export function getWeatherClass(main, icon = '') {
  const weather = main.toLowerCase()
  const isNight = icon.includes('n')

  if (weather.includes('clear')) return isNight ? 'clear-night' : 'sunny'
  if (weather.includes('cloud')) return 'cloudy'
  if (weather.includes('rain') || weather.includes('drizzle')) return 'rainy'
  if (weather.includes('thunder')) return 'thunder'
  if (weather.includes('snow')) return 'snowy'

  return 'sunny' // valor por defecto
}