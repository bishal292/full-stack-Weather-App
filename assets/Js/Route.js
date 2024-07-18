import{updateWeatherScreen , toggleerror404} from './script.js'

function handleRouting(){
    const urlHash = window.location.hash;
    if(urlHash.startsWith("#/weather")){
        const urlParams = new URLSearchParams(urlHash.split("?")[1]);// Returns the portion after "?"
        const lat = urlParams.get('lat');
        const lon = urlParams.get('lon');

        if (lat && lon) {
            updateWeatherScreen(lat,lon);
        }else{
            toggleerror404();
        }
    }else{
        toggleerror404();
    }
}
handleRouting();    // load each time data if lat & lon is present in the site link/domain/hash.
window.addEventListener('hashchange',()=>{
    handleRouting();
})