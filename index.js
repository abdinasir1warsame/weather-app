const API_KEY = 'd92eced4f070a72612c2186a9ea527d8';

const searchButton = $('#weather-search-submit');

const HandleSearch = async (event) => {
  event.preventDefault();
  const search = $('#search-input').val();

  if (search) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(currentWeatherUrl);
      const data = await response.json();
      if ((data, data.coord)) {
        const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${API_KEY}&units=metric`;
        const oneCallResponse = await fetch(oneCallUrl);
        const oneCallData = await oneCallResponse.json();

        const dailyWeather = `       <div class="weather-forecast-wrapper">
        <div class="weather-forecast">
          <div class="weather-forecast__day">
            <div class="weather-forecast__date">Fri</div>
            <i class="wi wi-day-sunny weather-forecast__icon"></i>
            <div class="weather-forecast__temp">30.3°</div>
          </div>
          <div class="weather-forecast__day">
            <div class="weather-forecast__date">Sat</div>
            <i class="wi wi-cloudy weather-forecast__icon"></i>
            <div class="weather-forecast__temp">28.1°</div>
          </div>
          <div class="weather-forecast__day">
            <div class="weather-forecast__date">Sun</div>
            <i class="wi wi-rain weather-forecast__icon"></i>
            <div class="weather-forecast__temp">25.7°</div>
          </div>
          <div class="weather-forecast__day">
            <div class="weather-forecast__date">Mon</div>
            <i class="wi wi-thunderstorm weather-forecast__icon"></i>
            <div class="weather-forecast__temp">26.4°</div>
          </div>
          <div class="weather-forecast__day">
            <div class="weather-forecast__date">Tue</div>
            <i class="wi wi-showers weather-forecast__icon"></i>
            <div class="weather-forecast__temp">27.3°</div>
          </div>
          <div class="weather-forecast__day">
            <div class="weather-forecast__date">Wed</div>
            <i class="wi wi-day-sleet weather-forecast__icon"></i>
            <div class="weather-forecast__temp">24.6°</div>
          </div>
          <div class="weather-forecast__day">
            <div class="weather-forecast__date">Thu</div>
            <i class="wi wi-fog weather-forecast__icon"></i>
            <div class="weather-forecast__temp">23.9°</div>
          </div>
        </div>
      </div>`;

        const currentWeather = ` <div class="current-weather">
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
      </div>`;
        $('#weather-section').append(currentWeather);
        $('#weather-section').append(dailyWeather);
        console.log(oneCallData);
      }
    } catch (error) {
      console.log('Error fetching weather data:', error);
    }
  }
};

searchButton.on('click', HandleSearch);
