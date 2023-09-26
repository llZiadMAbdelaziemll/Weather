import { DateTime } from "luxon";

const API_KEY = '67c3523c5cfccf2eb73ef0e987783bcc';


const BASE_API = 'https://api.openweathermap.org/data/2.5';
export const weekDayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
];

export const monthNames = [
    "Jan", "Feb", "Mar", "Jun", "Jul",
    "Aug", "Sep", "Oct", "Nov" , "Dec"
]

export const aqiText = {
    1 : "Good",
    2 : "Fair",
    3 : "Moderate",
    4 : "Poor",
    5 : "Very Poor"
}

export const getDate = function(dateUnix, timezone){
    
    const date = new Date((dateUnix + timezone) * 1000);
    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];

    return `${weekDayName} ${date.getUTCDate()}, ${monthName}`
}

export const getTime = function(timeUnix, timezone){
    
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    return `${hours % 12 || 12}:${minutes} ${period}`
}

const getWeatherData = (infoType,searchParams)=>{

    const url = new URL(BASE_API + '/' + infoType);
    url.search = new URLSearchParams({...searchParams, appid: API_KEY , units: 'metric'});
    
    return fetch(url).then((res) => res.json());
}

const formatCurrentWeather = (data) => {
   
    const {
        coord: {lat, lon},
        main: {temp, feels_like, temp_min, temp_max, humidity,pressure},
        name,
        dt,
        sys: {country, sunrise, sunset},
        weather,
        visibility,
        wind: {speed},
        timezone
    } = data;
    
    const {main: description, icon} = weather[0];
    const riseTime = getTime(sunrise, timezone);
    const setTime = getTime(sunset, timezone);
    const  title = getDate(dt , timezone);
    // formatToLocalTime(dt, timezone, 'cccc, dd LLL yyyy' )
    return {lat, lon, temp, feels_like, temp_min, temp_max, humidity,
        pressure,name, dt, country, sunrise, sunset, description, icon,
        timezone,visibility, speed, title, riseTime,setTime}

}

const formatForecastDailyWeather = (data) => {
    let {
        city: timezone,
        list
    }=data
    console.log(data)
    list = list.slice(1,6).map((day) => {
        return {
            title: formatToLocalTime(day.dt, timezone, 'ccc'),
            sunrise: day.sunrise,
            sunset: day.sunset,
            temp: day.temp.day,
            pressure: day.pressure,
            humidity: day.humidity,
            icon: day.weather[0].icon,
        }
    })
    return {timezone , list}
}

const formatForecastHourlyWeather = (data) => {
    let {
        list,timezone
    }=data
    
    let hourList = list.slice(0,8).map((hour) => {
        let date = new Date(hour.dt_txt);
        return {
            title : formatToLocalTime(hour.dt, timezone, 'hh:mm' ),
            wind: hour.wind.speed.toFixed(),
            wind_direction: hour.wind.deg-180,
            temp: hour.main.temp.toFixed(),
            temp_max: hour.main.temp_max.toFixed(),
            feelsLike: hour.main.feels_like,
            visibility: hour.visibility,
            pressure: hour.main.pressure,
            humidity: hour.main.humidity,
            icon: hour.weather[0].icon,
            day_hour: hour.dt_txt.slice(11,13).charAt(0)== "0" ? hour.dt_txt.slice(12,13) : hour.dt_txt.slice(11,13),
            dt_txt : hour.dt_txt,
            date
        }
    })

    let allHourList = list.map((hour) => {
        let date = new Date(hour.dt_txt);
        return {
            title : formatToLocalTime(hour.dt, timezone, 'hh:mm' ),
            wind: hour.wind.speed.toFixed(),
            wind_direction: hour.wind.deg-180,
            temp: hour.main.temp.toFixed(),
            temp_max: hour.main.temp_max.toFixed(),
            feelsLike: hour.main.feels_like,
            visibility: hour.visibility,
            pressure: hour.main.pressure,
            humidity: hour.main.humidity,
            icon: hour.weather[0].icon,
            day_hour: hour.dt_txt.slice(11,13),
            dt_txt : hour.dt_txt,
            date
        }
    })

    

    return {hourList,allHourList}
}

const formatAirWeather = (data) => {
    let {list} = data;
   
    let airList = {
        aqi: list[0].main.aqi,
        o3: list[0].components.o3.toFixed(),
        no2 : list[0].components.no2.toFixed(),
        so2 : list[0].components.so2.toFixed(),
        pm2_5: list[0].components.pm2_5.toFixed()

    }

    return {airList}
    
}

const formatForecastWeather = (data)=>{
       let {timezone, daily, hourly} = data;
        daily = daily.slice(1,6).map(day =>
        {
           return {
            title: formatToLocalTime(day.dt, timezone, 'ccc'),
            temp: day.temp.day,
            icon: day.weather[0].icon
           }
        }
        );
     
        hourly = hourly.slice(1,6).map(hour =>
            {
               return {
                title: formatToLocalTime(hour.dt, timezone, 'hh:mm a'),
                temp: hour.temp,
                icon: hour.weather[0].icon
               }
            }
            );

        return {timezone, daily, hourly};

}

const getFormattedWeatherData = async(searchParams)=>{
    const formattedCurrentWeather = await getWeatherData('weather', searchParams)
    .then(formatCurrentWeather);
    
    let {lat, lon} = formattedCurrentWeather;

    // const formattedForecastDailyWeather = await getWeatherData("forecast/daily",{
    //     lat,
    //     lon,
    //     cnt : 7
    // }).then((data) => formatForecastDailyWeather(data));
    
    const formattedForecastHourlyWeather = await getWeatherData('forecast', {
        lat,
        lon
    })
    .then(formatForecastHourlyWeather);

    const formattedAirWeather = await getWeatherData('air_pollution', {
        lat,
        lon
    })
    .then(formatAirWeather);

    return {...formattedCurrentWeather, ...formattedForecastHourlyWeather, ...formattedAirWeather};
};

const formatToLocalTime = (
    secs,
    zone,
    format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export{formatToLocalTime, iconUrlFromCode};