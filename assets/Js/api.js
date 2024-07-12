// These api are powered by OpenWeather which provide some api for free to use 
const websiteLink ="https://openweathermap.org/";
console.log(`This website is Powered by ${websiteLink}`);
// Images/Weather-Icons for the weather conditions are taken from the website of OpenWeatherMap.
const imgDownloadLink = "https://openweathermap.org/weather-conditions#Icon-list";
console.log(`The weather Icons for the Project is taken from the site: ${imgDownloadLink}`);



const currentWeatherApi = "https://api.openweathermap.org/data/2.5/weather?lat=51.5073219&lon=-0.1276474&appid=<API_KEY_HERE>";

// This above Api will give the current weather data for the given Longitude and Latitude

const forecastApi = "https://api.openweathermap.org/data/2.5/forecast?lat=51.5073219&lon=-0.1276474&appid=<API_KEY_HERE>";

// This above Api will give weather forecast data for 5 days for the given Longitude and Latitude

const airPollutionApi ="https://api.openweathermap.org/data/2.5/air_pollution?lat=51.5073219&lon=-0.1276474&appid=<API_KEY_HERE>"

// This above Api will give the Air-Pollution data for the given Longitude and Latitude

const reverseGeoApi ="https://api.openweathermap.org/geo/1.0/reverse?lat=51.5073219&lon=-0.1276474&appid=<API_KEY_HERE>"

// This above Api will give the location details data like{Name, Country , State, Local_names} for the given Longitude and Latitude

const geoApi ="https://api.openweathermap.org/geo/1.0/direct?q=london&appid=<API_KEY_HERE>"

// This above Api will give the location details data like{Name, Country , State, Local_names} for the given place name if it is recognized globally.