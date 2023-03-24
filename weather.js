const key = "89XO2RJrkFMKgxEApLsB7joszD83waZd";

const getCurrWeather = async (id) => {
  const base = "https://dataservice.accuweather.com/currentconditions/v1/";
  const query = `${id}?apikey=${key}&details=true`;
  const response = await fetch(base + query);
  const data = await response.json();
  return data[0];
};

const getHrForecastWeather = async (id) => {
  const base =
    "https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/";
  const query = `${id}?apikey=${key}&metric=true`;
  const response = await fetch(base + query);
  const data = await response.json();
  return data;
};

const getDailyForecastWeather = async (id) => {
  const base = "https://dataservice.accuweather.com/forecasts/v1/daily/5day/";
  const query = `${id}?apikey=${key}&metric=true`;
  const response = await fetch(base + query);
  const data = await response.json();
  return data;
};

const getCity = async (city, province, country) => {
  const base = "https://dataservice.accuweather.com/locations/v1/cities/search";
  const search = `${city}%20${province}%20${country}`;
  const query = `?apikey=${key}&q=${search}`;
  // const query = `?apikey=${key}&q=${search}`;
  const response = await fetch(base + query);
  const data = await response.json();
  return data[0];
};
