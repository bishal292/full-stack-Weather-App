// Functions and objects to handle basic functionality for the page like converting dt(special date text) to normal

const weekDaysNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]
const monthNames =[
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
]

const getDate = (dateUnix , timeZone)=>{
    const date = new Date((dateUnix + timeZone)*1000);
    const dayName = weekDaysNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];

    return `${dayName} ${date.getUTCDay()}, ${monthName}`
}

const getTime = (timeUnix , timeZone)=>{
    const date1 = new Date((timeUnix + timeZone)* 1000);
    const hour = date1.getUTCHours();
    const minute = date1.getUTCMinutes();
    const period = hour >= 12?"PM" : "AM";

    return `${hour % 12 || 12}:${minute} ${period}`;
}

const getHours = (timeUnix , timeZone)=>{
    const date2 = new Date((timeUnix + timeZone)* 1000);
    const hours = date2.getUTCHours();
    const period1 = hours >= 12?"PM" : "AM";

    return `${hours % 12 || 12} ${period1}`;
}

const MpSec_to_KMpH = (mps) =>{
    return (mps * 3600)/1000;
}

const aqiText ={
     1:{
        level: "Good",
        message: "Air quality is considered satisfactory, and air pollution poses little or no risk"
     },
     2:{
        level: "Fair",
        message: "Air quality is acceptable; However, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution."
     },
     3:{
        level: "Moderate",
        message: "Members of sensitive groups may experience health effects. The general public is not likely to be affected"
     },
     4:{
        level: "Poor",
        message: "Everyone may begin to experince health effects; members of sensitive groups may experience more serious health effects."
     },
     5:{
        level: "Very Poor",
        message: "Health warnings of emergency conditions. The entire population is more likely to be affected."
     }
};

function kelvinToCelsius(kelvin) {
    return parseInt(kelvin - 273.15) ;
}

export {weekDaysNames, monthNames ,getDate ,getTime ,getHours, MpSec_to_KMpH , aqiText , kelvinToCelsius};