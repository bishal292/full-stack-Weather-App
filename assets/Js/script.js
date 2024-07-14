
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
    
})
