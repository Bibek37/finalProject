import { apiURL, apiKey } from "../services/weatherAPI.js"; // Importing the API URL and key

import { formatDate } from "../utils/formatDate.js"; // Importing the formatDate function

const windSpeed = document.querySelector('.wind_speed');
const iconImg = document.getElementById('weather-icon');
const feelsLikeTemp = document.querySelector('.feelsLike');
const sunriseDOM = document.querySelector('.sunrise');
const forecastContainer = document.querySelector('.weather-cards');

window.addEventListener('load', () => {
    let long;
    let lat;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {

            long = position.coords.longitude;
            lat = position.coords.latitude;
            const base = `${apiURL}weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
            const forecastBase = `${apiURL}forecast?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;

            fetch(base)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    const { temp, feels_like } = data.main;
                    const { icon } = data.weather[0];
                    const { sunrise } = data.sys;
                    const { speed } = data.wind;

                    const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

                    windSpeed.textContent = `${speed} Km/H`;
                    iconImg.src = iconUrl;
                    feelsLikeTemp.textContent = `${feels_like}`;

                    const sunriseGMT = new Date(sunrise * 1000);
                    sunriseDOM.textContent = `${sunriseGMT.toLocaleTimeString()}`;
                });

            fetch(forecastBase)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    const forecasts = data.list.slice(5,35);
                    const uniqueDates = new Set(); 
                    forecasts.forEach((forecast) => {
                        const { dt_txt, main, weather } = forecast;
                        const { temp } = main;
                        const { description, icon } = weather[0];
                        const forecastDate = new Date(dt_txt.replace(/-/g, '/')); 

                        if (!uniqueDates.has(forecastDate.toDateString())) {
                            uniqueDates.add(forecastDate.toDateString()); 

                            const iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;

                            const formattedDate = formatDate(forecastDate);

                            const forecastCard = document.createElement('div');
                            forecastCard.classList.add('forecast-card');

                            const dateDiv = document.createElement('div');
                            dateDiv.classList.add('date');
                            dateDiv.textContent = formattedDate;

                            const iconDiv = document.createElement('div');
                            iconDiv.classList.add('icon');
                            const iconImg = document.createElement('img');
                            iconImg.src = iconUrl;
                            iconImg.alt = description;
                            iconDiv.appendChild(iconImg);

                            const tempCDiv = document.createElement('div');
                            tempCDiv.classList.add('celsius');
                            tempCDiv.textContent = `${temp.toFixed(2)} °C`;

                            const tempFDiv = document.createElement('div');
                            tempFDiv.classList.add('fahrenheit');
                            tempFDiv.textContent = `${((temp * 9) / 5 + 32).toFixed(2)} °F`;

                            const descDiv = document.createElement('div');
                            descDiv.classList.add('description');
                            descDiv.textContent = description;

                            forecastCard.appendChild(dateDiv);
                            forecastCard.appendChild(iconDiv);
                            forecastCard.appendChild(tempCDiv);
                            forecastCard.appendChild(tempFDiv);
                            forecastCard.appendChild(descDiv);

                            forecastContainer.appendChild(forecastCard);
                        }
                    });
                });
        });
    }
});
