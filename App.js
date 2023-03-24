const cityForm = document.querySelector(".search-form");
const cityName = document.querySelector(".first-left-overall h1");
const country = document.querySelector(".country");
const currentTime = document.querySelector(".current-time");
const temparatureL = document.querySelector(".second-left-overall");
const icon = document.querySelector(".right-overall img");
const forecastHr = document.querySelector(".today-forecast-hours");
const chanceOfRain = document.querySelector(".first-left-overall span");
const rain = document.querySelector(".rain");
const feel = document.querySelector(".degree");
const uv = document.querySelector(".uv-index");
const wind = document.querySelector(".wind");
const humid = document.querySelector(".humid");
const visibility = document.querySelector(".visibility");
const forecastDaily = document.querySelector(".forecast-days");
const body = document.querySelector("body");
const error = document.querySelector(".error");

const updateTime = (dateTime) => {
  const date = dateTime.split("T");
  const time = date[1].split("+");
  const timeHrMin = time[0].split(":");
  const hr = timeHrMin[0];
  const min = timeHrMin[1];
  const amOrPm = hr >= 12 ? "PM" : "AM";
  return hr > 12 ? `${hr - 12}:${min} ${amOrPm}` : `${hr}:${min} ${amOrPm}`;
};

const updateUI = (data) => {
  // destructure properties
  const { cityDets, weather, hrForecast, dailyForecast } = data;
  error.classList.add("disabled");

  //Update UI Mode {Light/Dark}
  body.className += weather.IsDayTime ? " light" : "";

  //Update Current Time
  const gmtOffset = cityDets.TimeZone.GmtOffset * 1000;
  const epoch = Date.now() + 3600 * gmtOffset;
  const epochTime = new Date(epoch);
  const newTime = updateTime(epochTime.toJSON());
  currentTime.innerHTML = `Current time: ${epochTime.toDateString()} ${newTime}`;

  //Update City Name
  cityName.innerHTML = cityDets.LocalizedName;

  //Update Country
  country.innerHTML = cityDets.Country.EnglishName;

  //Update Chance of Rain
  const precipitation = hrForecast[0].PrecipitationProbability;
  chanceOfRain.innerHTML = `Chance of Rain: ${precipitation}%`;

  //Update Main Weather Icon
  let iconSrc = `weather-svg/icons/${weather.WeatherIcon}.svg`;
  icon.setAttribute("src", iconSrc);

  const temp = Math.round(weather.Temperature.Metric.Value);
  temparatureL.innerHTML = temp + "&deg;C";

  //Update Hourly Forecast
  let newHourlyForecast = "";
  for (let i = 0; i < 6; i++) {
    const newTime = updateTime(hrForecast[i].DateTime);
    iconSrc = `weather-svg/icons/${hrForecast[i].WeatherIcon}.svg`;
    newHourlyForecast += `<div class="forecast-time">
    <span>${newTime}</span>
    <img class="time-img" src=${iconSrc} alt="${hrForecast[i].IconPhrase}" />
    <p>${Math.round(hrForecast[i].Temperature.Value)}&deg;</p>
  </div>`;
  }
  forecastHr.innerHTML = newHourlyForecast;

  //Update Conditions
  rain.innerHTML = `${precipitation}%`;
  feel.innerHTML = `${Math.round(
    weather.RealFeelTemperature.Metric.Value
  )}&deg;`;
  uv.innerHTML = weather.UVIndex;
  wind.innerHTML = `${weather.Wind.Speed.Metric.Value}km/h`;
  if (weather.RelativeHumidity == null) {
    humid.innerHTML = "0%";
  } else {
    humid.innerHTML = `${weather.RelativeHumidity}%`;
  }
  visibility.innerHTML = `${Math.round(weather.Visibility.Metric.Value)}km`;

  //Update 5-day Forecast
  let daily = dailyForecast.DailyForecasts[0];
  let forecastHTML = `
  <div class="forecast-day">
  <span>Today</span>
  <div class="middle">
    <img
      class="forecast-img"
      src="./weather-svg/icons/${daily.Day.Icon}.svg"
      alt="${daily.Day.IconPhrase}"
    />
    <span>${daily.Day.IconPhrase}</span>
  </div>
  <span>${Math.round(daily.Temperature.Maximum.Value)}&deg;/${Math.round(
    daily.Temperature.Minimum.Value
  )}&deg;</span>
  </div>`;
  for (let i = 1; i < 5; i++) {
    daily = dailyForecast.DailyForecasts[i];
    const date = dailyForecast.DailyForecasts[i].Date.split("T");
    const formalDate = new Date(date[0]);
    const newDate = formalDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });
    forecastHTML += `
    <div class="forecast-day">
    <span>${newDate}</span>
    <div class="middle">
      <img
        class="forecast-img"
        src="./weather-svg/icons/${daily.Day.Icon}.svg"
        alt="${daily.Day.IconPhrase}"
      />
      <span>${daily.Day.IconPhrase}</span>
    </div>
    <span>${Math.round(daily.Temperature.Maximum.Value)}&deg;/${Math.round(
      daily.Temperature.Minimum.Value
    )}&deg;</span>
    </div>`;
  }
  forecastDaily.innerHTML = forecastHTML;
  body.classList.remove("hidden");
};

const updateCity = async (city, province, country) => {
  const cityDets = await getCity(city, province, country);
  const weather = await getCurrWeather(cityDets.Key);
  const hrForecast = await getHrForecastWeather(cityDets.Key);
  const dailyForecast = await getDailyForecastWeather(cityDets.Key);
  return { cityDets, weather, hrForecast, dailyForecast };
};

cityForm.addEventListener("submit", (e) => {
  // prevent default action
  e.preventDefault();
  // get city value
  const city = cityForm.city.value.trim();
  const province = cityForm.province.value.trim();
  const country = cityForm.country.value.trim();
  cityForm.reset();
  if (!body.classList.contains("hidden")) {
    body.classList.add("hidden");
  }
  // update the ui with new city
  updateCity(city, province, country)
    .then((data) => updateUI(data))
    .catch((err) => {
      console.log(err);
      error.classList.remove("disabled");
    });
});

//Default Menu
// updateCity("Victoria", "BC", "Canada")
//   .then((data) => updateUI(data))
//   .catch((err) => console.log(err));
