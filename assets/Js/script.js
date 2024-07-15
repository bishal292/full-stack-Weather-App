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

function addEventOnElements(elements , eventType , Callback){
    elements.forEach(e => {
        e.addEventListener(eventType , Callback);
    });
}

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
const searchTimeoutDuration =800; //after each 800ms api is toggled when something is types in search fieeld
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

// Current Weather Card.
/* 
{
    <h2 class="title-2">Now</h2>

    <div class="weather-wrapper">
        <p class="heading">25&deg;</p>
        <img class="weather-icon" src="./assets/Images/Icons/01d.png" alt="Weather Icon">
    </div>

    <p class="body-3">OverCastClouds</p>

    <ul class="data-list">
        <li class="data-item">
            <span class="material-icon">calendar_today</span>
            <p class="title-3 data-text">Sunday 30, June</p>
        </li>

        <li class="data-item">
            <span class="material-icon">location_on</span>
            <p class="title-3 data-text">Waghodia, Gujrat</p>
        </li>
    </ul>
}*/

// 5-day forecast list
/*
                        <li class="forecast-data-item">
                            <div class="icon-wrapper">
                                <img src="./assets/Images/Icons/01n.png" width="60" alt="Overcast Clouds">
                                <p class="title-2">25</p>
                            </div>
                            <p class="label-1 data-text">31 June</p>
                            <p class="label-1 data-text">Monday</p>
                        </li>

                        <li class="forecast-data-item">
                            <div class="icon-wrapper">
                                <img src="./assets/Images/Icons/01n.png" width="60" alt="Overcast Clouds">
                                <p class="title-2">25</p>
                            </div>
                            <p class="label-1 data-text">31 June</p>
                            <p class="label-1 data-text">Monday</p>
                        </li>

                        <li class="forecast-data-item">
                            <div class="icon-wrapper">
                                <img src="./assets/Images/Icons/01n.png" width="60" alt="Overcast Clouds">
                                <p class="title-2">25</p>
                            </div>
                            <p class="label-1 data-text">31 June</p>
                            <p class="label-1 data-text">Monday</p>
                        </li>

                        <li class="forecast-data-item">
                            <div class="icon-wrapper">
                                <img src="./assets/Images/Icons/01n.png" width="60" alt="Overcast Clouds">
                                <p class="title-2">25</p>
                            </div>
                            <p class="label-1 data-text">31 June</p>
                            <p class="label-1 data-text">Monday</p>
                        </li>

                        <li class="forecast-data-item">
                            <div class="icon-wrapper">
                                <img src="./assets/Images/Icons/01n.png" width="60" alt="Overcast Clouds">
                                <p class="title-2">25</p>
                            </div>
                            <p class="label-1 data-text">31 June</p>
                            <p class="label-1 data-text">Monday</p>
                        </li>
*/

// Today's Highlight-section Html 
/*
                            <div class="card highlight-card one">
                                <h3 class="title-3">Air Quality Index</h3>

                                <div class="highlight-wrapper">

                                    <span class="material-icon">air</span><!--255-->
                                    <ul class="card-list">

                                        <li class="card-item">
                                            <p class="title-1">23.3</p>
                                            <p class="label-1">PM<sub>2.5</sub></p>
                                        </li>

                                        <li class="card-item">
                                            <p class="title-1">23.3</p>
                                            <p class="label-1">PM<sub>2.5</sub></p>
                                        </li>

                                        <li class="card-item">
                                            <p class="title-1">23.3</p>
                                            <p class="label-1">PM<sub>2.5</sub></p>
                                        </li>

                                        <li class="card-item">
                                            <p class="title-1">23.3</p>
                                            <p class="label-1">PM<sub>2.5</sub></p>
                                        </li>

                                    </ul>
                                </div>

                                <span class="badge aqi-1 label-1" title="aqi message">Good</span>
                            </div>

                            <div class="card highlight-card two">
                                <h3 class="title-3">Sunrise & Sunset</h3>
                                <div class="card-list">
                                    
                                    <div class="card-item">
                                        <span class="material-icon">clear_day</span>
                                        <div>
                                            <p class="label-1">Sunrise</p>
                                            <p class="title-1">6:30 AM</p>
                                        </div>
                                    </div>

                                    <div class="card-item">
                                        <span class="material-icon">clear_night</span>
                                        <div>
                                            <p class="label-1">Sunset</p>
                                            <p class="title-1">5:54 PM</p>
                                        </div>
                                    </div>


                                </div>

                            </div>

                            <div class="card highlight-card">
                                <h3 class="title-3">Humidity</h3>

                                <div class="highlight-wrapper">
                                    <span class="material-icon">humidity_percentage</span>
                                    <p class="title-1">35<sub>%</sub></p>
                                </div>
                            </div>

                            <div class="card card-sm highlight-card">
                                <h3 class="title-3">Pressure</h3>

                                <div class="highlight-wrapper">
                                    <span class="material-icon">airwave</span>
                                    <p class="title-1">105<sub>hPa</sub></p>
                                </div>
                            </div>

                            <div class="card card-sm highlight-card">
                                <h3 class="title-3">Visibility</h3>

                                <div class="highlight-wrapper">
                                    <span class="material-icon">visibility</span>
                                    <p class="title-1">10<sub>KM</sub></p>
                                </div>
                            </div>

                            <div class="card card-sm highlight-card">
                                <h3 class="title-3">Feels Like</h3>

                                <div class="highlight-wrapper">
                                    <span class="material-icon">thermostat</span>
                                    <p class="title-1">25&deg;<sup>C</sup></p>
                                </div>
                            </div>

*/


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
            currentWeatherCard.innerHTML =`
            <h2 class="title-2">Now</h2>

            <div class="weather-wrapper">
                <p class="heading">${parseInt(module.kelvinToCelsius(temp))}&deg;C</p>
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
                    components:{no2 , o3 , so2 ,pm1_5}
                }]
            }=airpollution;
        });
        fetchData(url.forecast(lat ,lon),(forecastApiResponse)=>{
            const {
                list: forecastList,
                city:{sunrise,sunset}
            } =forecastApiResponse;

            loadingView.classList.toggle("none");
            footer.classList.toggle("none");
            document.body.style.overflowY = "hidden";
        });
    });

    

}