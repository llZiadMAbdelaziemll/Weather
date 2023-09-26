import axios from "axios"
import { useEffect, useState } from "react";
import {AiOutlineSearch,AiOutlineCalendar} from 'react-icons/ai';
import {BiCurrentLocation,BiArrowBack} from 'react-icons/bi';
import {CiLocationOn} from 'react-icons/ci';
import {MdOutlineAir,MdOutlineLocationOn} from 'react-icons/md';
import {BsSunrise,BsSunset} from 'react-icons/bs';
import {WiHumidity} from 'react-icons/wi';
import {MdOutlineVisibility} from 'react-icons/md';
import {GiPressureCooker} from 'react-icons/gi';
import {FaTemperatureLow} from 'react-icons/fa';
import getFormattedWeatherData, { formatToLocalTime, iconUrlFromCode, weekDayNames, monthNames, aqiText, getTime } from "./Sercvices";
const Content = () => { 
    const [query, setQuery] = useState({q:"london"});
    // const [units, setUnits] = useState("metric");
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState("");

    const renderedItems = [];

    const handleSearchClick = ()=>{
      if(city !== '') setQuery({q: city})
    }
    
    const handleInputClick = (event) => {
      if(event.key === 'Enter'){
        if(city !== '') setQuery({q: city})
      }
    }

    const handleLocationClick = ()=>{
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) => {
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;

          setQuery({
            lat,
            lon,
          })
        })
      }
    }

    useEffect(()=>{
      const fetchWeather = async () => {
        await getFormattedWeatherData({...query}).then(
          (data) => {
            setWeather(data);
          }
        )
      }
      fetchWeather();
      // console.log(weather.hourList)
    }, [query])
     
    for(let i = 7 , len = weather.allHourList.length; i<len ; i+=8){
              renderedItems.push(
                 <li className="card-item">
                   <div className="icon-wrapper">
                     <img src={iconUrlFromCode(weather.allHourList[i].icon)} width="36" height="36" className="weather-icon" alt="" />
                     
                     <span className="span">
                       <p className="title-2">{weather.allHourList[i].temp_max}</p>
                     </span>
                   </div>
 
                   <p className="label-1">{weather.allHourList[i].date.getDate()}&nbsp;{monthNames[weather.allHourList[i].date.getUTCMonth()]}</p>
                   <p className="label-1">{weekDayNames[weather.allHourList[i].date.getUTCDay()]}</p>
                 </li> 
              )      
    }
    

  return (
    <>

       {/* HEADER */}

       <header className="header">
           <div className="container">
             <a href="#" className="logo">

              <img src="./images/logo.jpg" width="300" height="10" alt="logo"  />
             </a>

             <div className="search-view" data-search-view>

              <div className="search-wrapper">

                <input type="search" 
                 onChange={(event)=>{setCity(event.currentTarget.value)}}
                 onKeyDown={handleInputClick}
                 name="search" placeholder="Search city..." 
                 autoComplete="off" className="search-field" 
                 data-search-field/>

                <AiOutlineSearch className="m-icon" onClick={handleSearchClick}/>

                <button className="icon-btn leading-icon has-state" aria-label="close search" data-search-toggler>
                  <BiArrowBack className="m-icon" />
                </button>
              </div>

              <div className="search-result" data-search-result>
                 <ul className="view-list" data-search-list>

                  <li className="view-item">
                     <MdOutlineLocationOn className="m-icon"/>

                     <div>
                      <p className="item-title">London</p>

                      <p className="label-2 item-subtitle">State of London, GB</p>
                     </div>

                     <a href="#" className="item-link has-state" data-search-toggler></a>
                  </li>
                  
                   
                 </ul>
               </div>

             </div>

             <div className="header-actions">
              <button className="icon-btn has-state" aria-label="open search" data-search-toggler>
                <AiOutlineSearch className="m-icon icon"/>

              </button>
              
                <button className="btn-primary has-state"  onClick={handleLocationClick} >
                 
                  <BiCurrentLocation className="m-icon "/>
                  <p>Current Location</p>

                </button>
              
             </div>

           </div>
           
       </header>
    
    
         <main>
         <article className="container">
           <div className="content-left">
          
          {/* CURRENT WEATHER */}

           <section className="section current-weather" aria-label='current weather' data-current-weather>
            <div className="card card-lg current-weather-card">
             <h2 className="title-2 card-title">{weather.name}</h2>
             <div className="weapper">
                 <p className="heading">{weather.temp.toFixed()}&deg;<sup>c</sup></p>
                 <img src={iconUrlFromCode(weather.icon)} alt="not" width="64" height="64" className="weather-icon" />
   
             </div>
             <p className="body-3">{weather.description}</p>
 
             <ul className="meta-list">
               <li className="meta-item">
                 <AiOutlineCalendar />
                 <p className="title-3 meta-text mb-0">{weather.title}</p>
               </li>
 
                 <li className="meta-item">
                  <CiLocationOn />
                   <p className="title-3 meta-text mb-0">{weather.name}, {weather.country}</p>
                 </li>
                 
               </ul>
             </div>
           </section>
 
               {/* FORECAST */}
 
               <section className="section forecast" aria-labelledby="forecast-label" data-5-day-forecast>
             <h2 className="title-2" id="forecast-label">5 Days Forecast</h2>
 
             <div className="card card-lg forecast-card">

               <ul>
                 {renderedItems}
               </ul>

             </div>
               </section>

           </div>
 
 
           <div className="content-right">
               {/* HIGHLIGHTS */}
 
               <section className="section highlights" 
               aria-labelledby="highlights-label" data-highlights>
                  <div className="card card-lg">
                   <h2 className="title-2" id="highlights-label">Todays Highlights</h2>
 
                   <div className="highlights-list">

                     <div className="card card-sm highlight-card one">
                       <h3 className="title-3">Air Quality Index</h3>
 
                       <div className="wrapper">
                           <MdOutlineAir className="m-icon"/>
                           <ul className="card-list">
 
                             <li className="card-item">
                               <p className="title-1">{weather.airList.pm2_5}</p>
 
                               <p className="label-1">PM<sub>2.5</sub></p>
                             </li>
 
                             <li className="card-item">
                               <p className="title-1">{weather.airList.no2}</p>
 
                               <p className="label-1">o3<sub>2.5</sub></p>
                             </li>
 
                             <li className="card-item">
                               <p className="title-1">{weather.airList.o3}</p>
 
                               <p className="label-1">no2<sub>2.5</sub></p>
                             </li>
 
                             <li className="card-item">
                               <p className="title-1">{weather.airList.so2}</p>
 
                               <p className="label-1">so2<sub>2.5</sub></p>
                             </li>
 
                           </ul>
                       </div>
                       
                       <span className="badge aqi-1 label-1" title="aqi message">
                         {aqiText[weather.airList.aqi]}
                       </span>
 
                     </div>
 
                     <div className="card card-sm highlight-card two">
                       <h3 className="title-3">Sunrise & Sunset</h3>
 
                           <div className="card-list">
 
                             <div className="card-item">
                               <div>
                                <BsSunrise className="m-icon"/>
                               <p className="label-1">Sunrise</p>
 
                               <p className="title-1">{weather.riseTime}</p>
                               </div>
                             </div>
 
                             <div className="card-item">
                               <div>
                                <BsSunset className="m-icon"/>
                               <p className="label-1">Sunset</p>
 
                               <p className="title-1">{weather.setTime}</p>
                               </div>
                             </div>
 
                           </div>
 
                     </div>

                     <div className="card card-sm highlight-card">
                       <h3 className="title-3">Humidity</h3>
 
                       <div className="wrapper">
                           <WiHumidity className="m-icon"/>
                           <p className="title-1">{weather.humidity}<sub>%</sub></p>
 
                       </div>
                
                     </div>

                     <div className="card card-sm highlight-card">
                       <h3 className="title-3">Pressure</h3>
 
                       <div className="wrapper">
                           <GiPressureCooker className="m-icon" />
                           <p className="title-1">{weather.pressure}<sub>hPa</sub></p>
 
                       </div>
 
                     </div>

                     <div className="card card-sm highlight-card">
                       <h3 className="title-3">Visibility</h3>
 
                       <div className="wrapper">
                           <MdOutlineVisibility className="m-icon"/>
                           <p className="title-1">{(weather.visibility)/1000}<sub>km</sub></p>
 
                       </div>
 
                     </div>

                     <div className="card card-sm highlight-card">
                       <h3 className="title-3">Feels Like</h3>
 
                       <div className="wrapper">
                           <FaTemperatureLow className="m-icon"/>
                           <p className="title-1">{weather.feels_like.toFixed()}&deg;<sup>c</sup></p>
 
                       </div>
                   
                     </div>

                   </div>
                  </div>
               </section>
 
 
               {/* HOURLY FORECAST */}
               
               <section className="section hourly-forecast" aria-labelledby="hourly forecast" data-hourly-forecast>
 
                 <h2 className="title-2">Today at</h2>
 
                 <div className="slider-container">
                   <ul className="slider-list" data-temp>
 
                      
                         <li className="slider-item">
                            <div className="card card-sm slider-card">

                              <p className="body-3">{weather.hourList[0].day_hour}</p>

                              <img src={iconUrlFromCode(weather.hourList[0].icon)}
                              width="48" height="48" loading="lazy" 
                              className="weather-icon" title=""/>

                              <p className="body-3">{weather.hourList[0].temp}&deg;</p>

                            </div>
                          </li>

                          <li className="slider-item">
                            <div className="card card-sm slider-card">

                              <p className="body-3">{weather.hourList[1].day_hour}</p>

                              <img src={iconUrlFromCode(weather.hourList[1].icon)}
                              width="48" height="48" loading="lazy" 
                              className="weather-icon" title=""/>

                              <p className="body-3">{weather.hourList[1].temp}&deg;</p>

                            </div>
                          </li>

                          <li className="slider-item">
                            <div className="card card-sm slider-card">

                              <p className="body-3">{weather.hourList[2].day_hour}</p>

                              <img src={iconUrlFromCode(weather.hourList[2].icon)}
                              width="48" height="48" loading="lazy" 
                              className="weather-icon" title=""/>

                              <p className="body-3">{weather.hourList[2].temp}&deg;</p>

                            </div>
                          </li>

                          <li className="slider-item">
                            <div className="card card-sm slider-card">

                              <p className="body-3">{weather.hourList[3].day_hour}</p>

                              <img src={iconUrlFromCode(weather.hourList[3].icon)}
                              width="48" height="48" loading="lazy" 
                              className="weather-icon" title=""/>

                              <p className="body-3">{weather.hourList[3].temp}&deg;</p>

                            </div>
                          </li>
                          
                          <li className="slider-item">
                            <div className="card card-sm slider-card">

                              <p className="body-3">{weather.hourList[4].day_hour}</p>

                              <img src={iconUrlFromCode(weather.hourList[4].icon)}
                              width="48" height="48" loading="lazy" 
                              className="weather-icon" title=""/>

                              <p className="body-3">{weather.hourList[4].temp}&deg;</p>

                            </div>
                          </li>

                          <li className="slider-item">
                            <div className="card card-sm slider-card">

                              <p className="body-3">{weather.hourList[5].day_hour}</p>

                              <img src={iconUrlFromCode(weather.hourList[5].icon)}
                              width="48" height="48" loading="lazy" 
                              className="weather-icon" title=""/>

                              <p className="body-3">{weather.hourList[5].temp}&deg;</p>

                            </div>
                          </li>

                          <li className="slider-item">
                            <div className="card card-sm slider-card">

                              <p className="body-3">{weather.hourList[6].day_hour}</p>

                              <img src={iconUrlFromCode(weather.hourList[6].icon)}
                              width="48" height="48" loading="lazy" 
                              className="weather-icon" title=""/>

                              <p className="body-3">{weather.hourList[6].temp}&deg;</p>

                            </div>
                          </li>

                          <li className="slider-item">
                            <div className="card card-sm slider-card">

                              <p className="body-3">{weather.hourList[7].day_hour}</p>

                              <img src={iconUrlFromCode(weather.hourList[7].icon)}
                              width="48" height="48" loading="lazy" 
                              className="weather-icon" title=""/>

                              <p className="body-3">{weather.hourList[7].temp}&deg;</p>

                            </div>
                          </li>
 
                   </ul>
 
                   <ul className="slider-list" data-wind>
                  

                        <li className="slider-item">
                        <div className="card card-sm slider-card">

                          <p className="body-3">{weather.hourList[0].day_hour}</p>

                          <img src="./images/weather_icons/direction.png"
                          width="48" height="48" loading="lazy" 
                          className="weather-icon" title="" style={{transform: `rotate(${weather.hourList[0].wind_direction}deg)`}}/>

                          <p className="body-3">{weather.hourList[0].wind} km/h</p>

                        </div>
                        </li>
                       
                        
                        <li className="slider-item">
                        <div className="card card-sm slider-card">

                          <p className="body-3">{weather.hourList[1].day_hour}</p>

                          <img src="./images/weather_icons/direction.png"
                          width="48" height="48" loading="lazy" 
                          className="weather-icon" title="" 
                          style={{transform: `rotate(${weather.hourList[1].wind_direction}deg)`}}/>

                          <p className="body-3">{weather.hourList[1].wind} km/h</p>

                        </div>
                        </li>

                        
                        <li className="slider-item">
                        <div className="card card-sm slider-card">

                          <p className="body-3">{weather.hourList[2].day_hour}</p>

                          <img src="./images/weather_icons/direction.png"
                          width="48" height="48" loading="lazy" 
                          className="weather-icon" title="" 
                          style={{transform: `rotate(${weather.hourList[2].wind_direction}deg)`}}/>

                          <p className="body-3">{weather.hourList[2].wind} km/h</p>

                        </div>
                        </li>

                        
                        <li className="slider-item">
                        <div className="card card-sm slider-card">

                          <p className="body-3">{weather.hourList[3].day_hour}</p>

                          <img src="./images/weather_icons/direction.png"
                          width="48" height="48" loading="lazy" 
                          className="weather-icon" title="" 
                          style={{transform: `rotate(${weather.hourList[3].wind_direction}deg)`}}/>

                          <p className="body-3">{weather.hourList[3].wind} km/h</p>

                        </div>
                        </li>
                        
                        <li className="slider-item">
                        <div className="card card-sm slider-card">

                          <p className="body-3">{weather.hourList[4].day_hour}</p>

                          <img src="./images/weather_icons/direction.png"
                          width="48" height="48" loading="lazy" 
                          className="weather-icon" title="" 
                          style={{transform: `rotate(${weather.hourList[4].wind_direction}deg)`}}/>

                          <p className="body-3">{weather.hourList[4].wind} km/h</p>

                        </div>
                        </li>

                        <li className="slider-item">
                        <div className="card card-sm slider-card">

                          <p className="body-3">{weather.hourList[5].day_hour}</p>

                          <img src="./images/weather_icons/direction.png"
                          width="48" height="48" loading="lazy" 
                          className="weather-icon" title="" 
                          style={{transform: `rotate(${weather.hourList[5].wind_direction}deg)`}}/>

                          <p className="body-3">{weather.hourList[5].wind} km/h</p>

                        </div>
                        </li>

                        <li className="slider-item">
                        <div className="card card-sm slider-card">

                          <p className="body-3">{weather.hourList[6].day_hour}</p>

                          <img src="./images/weather_icons/direction.png"
                          width="48" height="48" loading="lazy" 
                          className="weather-icon" title="" 
                          style={{transform: `rotate(${weather.hourList[6].wind_direction}deg)`}}/>

                          <p className="body-3">{weather.hourList[6].wind} km/h</p>

                        </div>
                        </li>

                        <li className="slider-item">
                        <div className="card card-sm slider-card">

                          <p className="body-3">{weather.hourList[7].day_hour}</p>

                          <img src="./images/weather_icons/direction.png"
                          width="48" height="48" loading="lazy" 
                          className="weather-icon" title="" 
                          style={{transform: `rotate(${weather.hourList[7].wind_direction}deg)`}}/>

                          <p className="body-3">{weather.hourList[7].wind} km/h</p>

                        </div>
                        </li>

                   </ul> 
                 </div> 
               </section> 
 
 
                {/* FOOTER */}
           <footer className="footer">
             <p className="body-3">Copyright&copy; 2023 Mehreb. All Rights Reserved.</p>
             <p className="body-3">Powered By <a href="https://openweathermap.org/api" title="Free OpenWeather Api" rel="noopener">
               <img src="./images/openweather.png" width="150" height="30" loading="lazy" />
               </a></p>
           </footer>
               
           </div>
 
 
          
         </article>
        </main>
       
       
    </>
  )
}

export default Content