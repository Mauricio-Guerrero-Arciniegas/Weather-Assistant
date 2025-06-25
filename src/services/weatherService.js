const API_KEY = '84a5820e3b2a0c9f77e35baa853e8766'; 

const getWeatherByCity = async (city) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
  );
  if (!res.ok) throw new Error('Ciudad no encontrada');
  return await res.json();
};

const getWeatherByCoords = async (lat, lon) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
  );
  if (!res.ok) throw new Error('Ubicación no encontrada');
  return await res.json();
};

export default getWeatherByCity;
export { getWeatherByCoords };