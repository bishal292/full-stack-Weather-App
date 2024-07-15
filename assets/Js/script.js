'use strict';
import {fetchData , url} from './api.js'
import * as module from './module.js';
/*  ------------------------------------------------------------
            Initial Variables
    ------------------------------------------------------------
*/
const openSearchBtn = document.querySelector(".open-search");
const logoImage = document.querySelector(".logo");
const searchAndCloseView  = Array.from(document.querySelectorAll(".mat-icon-btn"));
const searchResults = document.querySelector(".search-results");
const searchView = document.querySelector("[data-search-view]");
const searchField = document.querySelector(".search-field");
const resultsView = document.querySelector(".results-view");



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
    document.querySelector("main").classList.toggle("none");
    document.querySelector("footer").classList.toggle("none");
}

addEventOnElements(searchAndCloseView , "click" ,searchScreenToggler);


/*  ------------------------------------------------------------
    For Bigger device for search function toggling
    ------------------------------------------------------------
*/
// Applied click event listner on whole documents
searchField.addEventListener("click",()=>{
    if(!searchResults.classList.contains("active")){
        searchResults.classList.toggle("active");
    }
    if (searchResults.classList.contains("none")) {
        searchResults.classList.toggle("none");
    }
    console.log(`clicked on search field`);
});



// Function to get the query params(lat & lon) from given url
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
                        searchResults.classList.toggle("none");
                        searchField.value = null;
                        var selectedLocation = (item.querySelector("[data-search-toggler]")).toString();
                        const {lat,lon} = getLatLon(selectedLocation);
                        console.log(`lat : ${lat}  And lon : ${lon}`);

                    })
                });
            });
        }, searchTimeoutDuration);
    }
});
