const API_KEY = 'd92eced4f070a72612c2186a9ea527d8';
const searchButton = $('#weather-search-submit');

const fetchCurrentWeather = async (search) => {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_KEY}&units=metric`;
  try {
    const response = await fetch(currentWeatherUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching current weather data:', error);
    throw error;
  }
};

const fetchOneCallData = async (lat, lon) => {
  const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  try {
    const response = await fetch(oneCallUrl);
    return await response.json();
  } catch (error) {
    console.log('Error fetching one-call data:', error);
    throw error;
  }
};

const renderCurrentWeather = (data, oneCallData) => {
  const currentWeatherHTML = `
    <h2 class="current-weather__city">${data.name}, ${data.sys.country}</h2>
    <i class="wi wi-day-sunny current-weather__icon"></i>
    <div class="current-weather__temp">${data.main.temp}°</div>
    <div class="current-weather__condition">${oneCallData.current.weather[0].main}</div>
    <!-- detailed weather stats for current weather -->
    <h2 class="weather-stats-title">Detailed Statistics</h2>
    <div class="weather-stats">
      <div class="weather-stats__item">
        <i class="wi wi-hot weather-stats__icon"></i>
        <h3 class="weather-stats__title">UV Index</h3>
        <p class="weather-stats__value">${oneCallData.current.uvi}</p>
      </div>
      <div class="weather-stats__item">
        <i class="wi wi-fog weather-stats__icon"></i>
        <h3 class="weather-stats__title">Visibility</h3>
        <p class="weather-stats__value">${data.visibility}m</p>
      </div>
      <div class="weather-stats__item">
        <i class="wi wi-humidity weather-stats__icon"></i>
        <h3 class="weather-stats__title">Humidity</h3>
        <p class="weather-stats__value">${data.main.humidity}%</p>
      </div>
      <div class="weather-stats__item">
        <i class="wi wi-strong-wind weather-stats__icon"></i>
        <h3 class="weather-stats__title">Wind Speed</h3>
        <p class="weather-stats__value">${data.wind.speed}ms/h</p>
      </div>
    </div>
  `;
  return currentWeatherHTML;
};

const renderForecast = (oneCallData, isHourly) => {
  if (isHourly) {
    const hourlyWeatherHTML = oneCallData.hourly
      .slice(0, 10)
      .map((hour) => {
        const date = new Date(hour.dt * 1000);
        const hourString = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true,
        });
        const iconUrl = `http://openweathermap.org/img/wn/${hour.weather[0].icon}@4x.png`;

        return `
          <div class="weather-forecast__day">
            <div class="weather-forecast__date">${hourString}</div>
            <img src="${iconUrl}" alt="Weather Icon" class="weather-forecast__icon"/>
            <div class="weather-forecast__temp">${hour.temp.toFixed(1)}°</div>
          </div>`;
      })
      .join('');

    return `<div class="weather-forecast">${hourlyWeatherHTML}</div>`;
  } else {
    const dailyWeatherHTML = oneCallData.daily
      .slice(1, 8)
      .map((day) => {
        const date = new Date(day.dt * 1000);
        const readableDate = date.toLocaleDateString('en-US', {
          weekday: 'long',
        });
        const iconUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`;

        return `
          <div class="weather-forecast__day">
            <div class="weather-forecast__date">${readableDate}</div>
            <img src="${iconUrl}" alt="Weather Icon" class="weather-forecast__icon"/>
            <div class="weather-forecast__temp">${day.temp.day.toFixed(
              1
            )}°</div>
          </div>`;
      })
      .join('');

    return `<div class="weather-forecast">${dailyWeatherHTML}</div>`;
  }
};

const updateForecastButtons = (isHourly) => {
  const $sevenDayButton = $('#sevenDayButton');
  const $hourlyButton = $('#hourlyButton');

  $sevenDayButton.toggleClass('chosen', !isHourly);
  $hourlyButton.toggleClass('chosen', isHourly);
};

const HandleSearch = async (event, isHourly = false) => {
  const search = $('#search-input').val() || 'London';

  try {
    const currentWeatherData = await fetchCurrentWeather(search);

    if (currentWeatherData && currentWeatherData.coord) {
      const oneCallData = await fetchOneCallData(
        currentWeatherData.coord.lat,
        currentWeatherData.coord.lon
      );

      const currentWeatherHTML = renderCurrentWeather(
        currentWeatherData,
        oneCallData
      );

      const forecastHTML = renderForecast(oneCallData, isHourly);

      const weatherButtons = $(`<div class="forecast-buttons">
        <div class="forecast-button" id="sevenDayButton"><span>7 Day Forecast</span></div>
        <div class="forecast-button" id="hourlyButton"><span>Hourly Forecast</span></div>
      </div>`);

      const $weatherSection = $('#weather-section');
      const $weatherButtons = weatherButtons.clone();

      $weatherSection
        .empty()
        .append(
          $('<div id="current-weather" class="current-weather"></div>').append(
            currentWeatherHTML
          ),
          $weatherButtons
        );

      updateForecastButtons(isHourly);

      $weatherButtons.on('click', '#sevenDayButton', (event) => {
        HandleSearch(event, false);
        updateForecastButtons(false);
      });

      $weatherButtons.on('click', '#hourlyButton', (event) => {
        HandleSearch(event, true);
        updateForecastButtons(true);
      });

      $weatherSection.append(
        $('<div class="weather-forecast-wrapper"></div>').append(forecastHTML)
      );

      console.log(oneCallData);
    }
  } catch (error) {
    console.log('Error handling search:', error);
  }

  event.preventDefault();
};

HandleSearch({ preventDefault: () => {} });

searchButton.on('click', (event) => HandleSearch(event, false));
