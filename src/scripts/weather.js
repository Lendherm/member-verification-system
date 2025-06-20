export async function initWeather() {
  console.log("🌦️ Ejecutando initWeather");

  const locationElement = document.querySelector('#location');
  const temperatureElement = document.querySelector('#temperature');
  const weatherDescriptionElement = document.querySelector('#weather-description');
  const weatherIconElement = document.querySelector('#weather-icon');
  const weatherCaptionElement = document.querySelector('#weather-caption');

  if (!locationElement || !temperatureElement || !weatherDescriptionElement || !weatherIconElement || !weatherCaptionElement) {
    console.error("Uno o más elementos no existen en el DOM.");
    return;
  }

  const apiKey = '23c5b55d5da420cffada3e9319b79193';
  const city = 'Mexico City';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    console.log(data);
    displayWeather(data);
  } catch (error) {
    console.error("Error al obtener los datos del clima:", error);
    displayError('No se pudo obtener el clima. Intenta más tarde.');
  }

  function displayWeather(data) {
    if (!data || !data.main || !data.weather) {
      console.error("Datos del clima inválidos");
      return;
    }

    locationElement.textContent = `${data.name}, ${data.sys.country}`;
    temperatureElement.textContent = `🌡️ ${Math.round(data.main.temp)}°F`;

    const description = data.weather[0].description;
    weatherDescriptionElement.textContent = `☁️ ${description.charAt(0).toUpperCase() + description.slice(1)}`;

    const iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    weatherIconElement.setAttribute('src', iconUrl);
    weatherIconElement.setAttribute('alt', description);
    weatherCaptionElement.textContent = description;
  }

  function displayError(message) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
  }
}
