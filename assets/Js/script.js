'use strict';
import {fetchData , url} from './api.js'
import * as module from './module.js';
/*  ------------------------------------------------------------
            Initial Variables
    ------------------------------------------------------------
*/
const logoImage = document.querySelector(".logo");
const searchAndCloseView  = Array.from(document.querySelectorAll(".mat-icon-btn"));
const searchResults = document.querySelector(".search-results");
const searchView = document.querySelector("[data-search-view]");
const searchField = document.querySelector(".search-field");
const resultsView = document.querySelector(".results-view");
const main = document.querySelector("main");
const footer = document.querySelector("footer");


const currentWeatherCard = document.querySelector("[data-current-weeather-card]");
const forecastList5Days = document.querySelector("[data-forecast-data-list]");
const todayHighlightList = document.querySelector("[data-today-highlights]");
const loadingView = document.querySelector(".loading");
const tempDataSlider = document.querySelector("[data-temperature]");
const windDataSlider = document.querySelector("[data-wind]");

function addEventOnElements(elements , eventType , Callback){
    elements.forEach(e => {
        e.addEventListener(eventType , Callback);
    });
}


let defaultLocation = {
    defaultlat:"28.6517178",
    defaultlon:"77.2219388"
}
updateWeatherScreen(defaultLocation.defaultlat , defaultLocation.defaultlon);


/*  ------------------------------------------------------------
For Smaller device for search function toggling
    ------------------------------------------------------------
*/
const searchScreenToggler = ()=>{
    console.log(`button is clicked`);
    logoImage.classList.toggle("none");
    searchView.classList.toggle("active");
    searchResults.classList.toggle("none");
    searchResults.classList.toggle("active");//_-------------------------------->
    main.classList.toggle("none");
    footer.classList.toggle("none");
}

addEventOnElements(searchAndCloseView , "click" ,searchScreenToggler);


/*  ------------------------------------------------------------
    For Bigger device for search function toggling
    ------------------------------------------------------------
*/
// Applied click event listner on whole documents
document.addEventListener("click",(event)=>{
    if(searchField.contains(event.target)){//It checks whether the click element is searchField
        if(!searchResults.classList.contains("active")){
            searchResults.classList.toggle("active");
        }
        if (searchResults.classList.contains("none")) {
            searchResults.classList.toggle("none");
        }
        console.log(`clicked on search field`);
    }else{
        if(searchResults.classList.contains("active")){
            searchResults.classList.toggle("active");
        }
        if (!searchResults.classList.contains("none")) {
            searchResults.classList.toggle("none");
        }
    }
});



// Function to get the query parameters -> (lat & lon) from given url
/**
 * Creates a user object.
 * @param {string} url - The url with parameter containing lat & lon.
 * @param {number} age - The user's age.
 * @returns {{lat: string, lon: string}} The user object.
 */


function getLatLon(url){
    var latLon = url.split("&");
    return{
        lat: latLon[0].split("=")[1],
        lon: latLon[1].split("=")[1]
    }
}



// Dynamic loading for search results
let searchTimeout = null;
const searchTimeoutDuration =500; //after each 500ms api is toggled when something is types in search fieeld
searchField.addEventListener("input",()=>{
    searchTimeout ?? clearTimeout(setTimeout);

    if(searchField.value){//if search field contains any value
        console.log(`something is typed in search field: ${searchField.value}`);
        searchTimeout = setTimeout(() => { // search using api after each "searchTimeoutDuration"'s value.
            fetchData(url.geo(searchField.value),(locations)=>{
                const items=[];
                resultsView.innerHTML="";
                for(const{name,lat,lon,country,state}of locations){
                    console.log(name,lat,lon,country,state);
                    const searchlistItem = document.createElement("li")
                    searchlistItem.classList.add("result-items");
                    searchlistItem.innerHTML = `
                        <span class="material-icon">location_on</span>
                        <div>
                            <p class="loc-title">${name}</p>
                            <p class="label-2 subtitle-text">${country}, ${state} </p>
                        </div>
                        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" data-search-toggler></a>
                    `;
                    resultsView.appendChild(searchlistItem);
                    items.push(searchlistItem);
                }


                items.forEach(item =>{
                    item.addEventListener("click",()=>{
                        searchResults.classList.remove("none");
                        searchResults.classList.remove("active");
                        searchField.value = null;
                        resultsView.innerHTML="";
                        searchView.classList.remove("active");
                        if (main.classList.contains("none")) {
                            main.classList.remove("none");
                            footer.classList.remove("none");  
                            logoImage.classList.remove("none");                      
                        }

                        var selectedLocation = (item.querySelector("[data-search-toggler]")).toString();
                        const {lat,lon} = getLatLon(selectedLocation);
                        console.log(`lat : ${lat}  And lon : ${lon}`);
                        updateWeatherScreen(lat , lon);
                        // loading.classList.toggle("none");
                        // footer.classList.toggle("none");
                    })
                });
            });
        }, searchTimeoutDuration);
    }else{
        resultsView.innerHTML="";
    }
});


function updateWeatherScreen(lat , lon){
    // Make loading screen visible
    loadingView.classList.toggle("none");
    footer.classList.toggle("none");
    document.body.style.overflowY = "hidden";
    loadingView.style.top = `${document.querySelector("header").offsetHeight}px`;
    loadingView.style.height = `${window.innerHeight - document.querySelector("header").offsetHeight}px`;

    // clearing all the inner htmls of the documents which are going to be inserted dynamically.
    currentWeatherCard.innerHTML ="";
    forecastList5Days.innerHTML ="";
    todayHighlightList.innerHTML ="";
    tempDataSlider.innerHTML="";
    windDataSlider.innerHTML="";

    fetchData(url.currentWeather(lat , lon), (apiResponseData)=>{
        const {
            weather:[{description,icon}],
            main:{temp ,feels_like,pressure,humidity},
            visibility,
            dt: dateUnix,
            sys:{ sunrise , sunset},
            timezone,
        } = apiResponseData;

        fetchData(url.reverseGeo(lat , lon),([{ name , country}])=>{
//      Updating Current Weather list
            currentWeatherCard.innerHTML =`
            <h2 class="title-2">Now</h2>

            <div class="weather-wrapper">
                <p class="heading">${module.kelvinToCelsius(temp)}&deg;C</p>
                <img class="weather-icon" src="./assets/Images/Icons/${icon}.png" alt="Weather Icon">
            </div>

            <p class="body-3">${description}</p>

            <ul class="data-list">
                <li class="data-item">
                    <span class="material-icon">calendar_today</span>
                    <p class="title-3 data-text">${module.getDate(dateUnix ,timezone)}</p>
                </li>

                <li class="data-item">
                    <span class="material-icon">location_on</span>
                    <p class="title-3 data-text">${name}, ${country}</p>
                </li>
            </ul>
        `;

        });
        fetchData(url.airpollution(lat , lon),(airpollution)=>{
            const {
                list:[{
                    main:{aqi},
                    components:{no2 , o3 , so2 ,pm2_5}
                }]
            }=airpollution;
//      updating Today's Highlight list
            todayHighlightList.innerHTML=`
                    <div class="card highlight-card one">
                    <h3 class="title-3">Air Quality Index</h3>

                    <div class="highlight-wrapper">

                        <span class="material-icon">air</span><!--255-->
                        <ul class="card-list">

                            <li class="card-item">
                                <p class="title-1">${no2}</p>
                                <p class="label-1">NO<sub>2</sub></p>
                            </li>

                            <li class="card-item">
                                <p class="title-1">${o3}</p>
                                <p class="label-1">O<sub>3</sub></p>
                            </li>

                            <li class="card-item">
                                <p class="title-1">${so2}</p>
                                <p class="label-1">SO<sub>2</sub></p>
                            </li>

                            <li class="card-item">
                                <p class="title-1">${pm2_5}</p>
                                <p class="label-1">PM<sub>2.5</sub></p>
                            </li>

                        </ul>
                    </div>

                    <span class="badge aqi-${aqi} label-1" title="${module.aqiText[aqi].message}">${module.aqiText[aqi].level}</span>
                </div>

                <div class="card highlight-card two">
                    <h3 class="title-3">Sunrise & Sunset</h3>
                    <div class="card-list">
                        
                        <div class="card-item">
                            <span class="material-icon">clear_day</span>
                            <div>
                                <p class="label-1">Sunrise</p>
                                <p class="title-1">${module.getTime(sunrise , timezone)}</p>
                            </div>
                        </div>

                        <div class="card-item">
                            <span class="material-icon">clear_night</span>
                            <div>
                                <p class="label-1">Sunset</p>
                                <p class="title-1">${module.getTime(sunset , timezone)}</p>
                            </div>
                        </div>


                    </div>

                </div>

                <div class="card highlight-card">
                    <h3 class="title-3">Humidity</h3>

                    <div class="highlight-wrapper">
                        <span class="material-icon">humidity_percentage</span>
                        <p class="title-1">${humidity}<sub>%</sub></p>
                    </div>
                </div>

                <div class="card card-sm highlight-card">
                    <h3 class="title-3">Pressure</h3>

                    <div class="highlight-wrapper">
                        <span class="material-icon">airwave</span>
                        <p class="title-1">${pressure}<sub>hPa</sub></p>
                    </div>
                </div>

                <div class="card card-sm highlight-card">
                    <h3 class="title-3">Visibility</h3>

                    <div class="highlight-wrapper">
                        <span class="material-icon">visibility</span>
                        <p class="title-1">${visibility / 1000}<sub>KM</sub></p>
                    </div>
                </div>

                <div class="card card-sm highlight-card">
                    <h3 class="title-3">Feels Like</h3>

                    <div class="highlight-wrapper">
                        <span class="material-icon">thermostat</span>
                        <p class="title-1">${module.kelvinToCelsius(feels_like)}&deg;<sup>C</sup></p>
                    </div>
                </div>
            `;
        });
        fetchData(url.forecast(lat ,lon),(forecastApiResponse)=>{
            const {
                list: forecastList,
                city:{timezone}
            } =forecastApiResponse;

//          Updating Temparature and wind Data slider list for next 24 hour

            for(let i=0 ; i<12 ;i++){
                const {
                    dt,
                    main:{temp},
                    weather:[{description , icon}],
                    wind:{speed , deg},
                }= forecastList[i];

                const templi = document.createElement("li");
                templi.classList.add("slider-item");

//          Updating Temparature Data slider list
                templi.innerHTML=`
                        <div class="card card-sm slider-card">
                            <p class="body-3">${module.getTime(dt, timezone)}</p>

                            <img src="./assets/Images/Icons/${icon}.png" width="48"  loading="lazy" alt="${description}" class="weather-icon">
                            <p class="body-3">${module.kelvinToCelsius(temp)}&deg;</p>
                        </div>
                `
                tempDataSlider.appendChild(templi);

                const windli = document.createElement("li");
                windli.classList.add("slider-item");

//          Updating Wind Data slider list

                windli.innerHTML=`
                        <div class="card card-sm slider-card">
                            <p class="body-3">${module.getTime(dt, timezone)}</p>

                            <img src="./assets/Images/Icons/direction.png" width="48"  loading="lazy" alt="" class="weather-icon" style="transform: rotate(${deg}deg);">
                            <p class="body-3">${module.MpSec_to_KMpH(speed)} km/h</p>
                        </div>
                `;
                windDataSlider.appendChild(windli);
            };
            for(let i=7; i<= forecastList.length; i+=8){
                const {
                    dt,
                    main:{temp_min ,temp_max},
                    weather:[{description , icon}]
                }=forecastList[i];
                const dailyLi = document.createElement("li");
                dailyLi.classList.add("forecast-data-item");
                const date= new Date((dt+ timezone)*1000);
                dailyLi.innerHTML=`
                <div class="icon-wrapper">
                    <img src="./assets/Images/Icons/${icon}.png" width="60" alt="${description}">
                    <p class="title-2">${module.kelvinToCelsius(temp_max)}&deg<sub>C</sub></p>
                </div>
                <p class="label-1 data-text">${date.getUTCDate()} ${module.monthNames[date.getUTCMonth()]}</p>
                <p class="label-1 data-text">${module.weekDaysNames[date.getUTCDay()].slice(0,3)}</p>
                `;
                forecastList5Days.appendChild(dailyLi);

            }
        });
        loadingView.classList.toggle("none");
        footer.classList.toggle("none");
        document.body.style.overflowY = "auto";
    });
}

document.querySelector("[data-current-location]").addEventListener("click",()=>{
    window.navigator.geolocation.getCurrentPosition(res=>{
        const {latitude , longitude } = res.coords;
        updateWeatherScreen(latitude , longitude);
        console.log(`your current location lat : ${latitude} lon :  ${longitude}`);
    },err=>{
        console.log(`Some error occured ${err}`);
    })
});