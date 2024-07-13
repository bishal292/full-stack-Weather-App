
/*  ------------------------------------------------------------
            Initial Variables
    ------------------------------------------------------------
*/
const openSearchBtn = document.querySelector(".open-search");
const logoImage = document.querySelector(".logo");
const searchAndCloseView  = Array.from(document.querySelectorAll(".mat-icon-btn"));
const searchResults = document.querySelector(".search-results");
const searchView = document.querySelector("[data-search-view]");



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
    searchResults.classList.toggle("active");
    document.querySelector("main").classList.toggle("none");
    document.querySelector("footer").classList.toggle("none");
}

addEventOnElements(searchAndCloseView , "click" ,searchScreenToggler);