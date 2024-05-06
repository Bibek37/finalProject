import { countryCode, apiKey } from "../services/holidayAPI.js"; 
import { createHeader } from "../utils/createHeader.js";
import { getFormattedDate } from "../utils/getFormattedDate.js"

const holidaySection = document.getElementById('holidays');
const loadingText = document.getElementById('loading');

const holidayUrl = `https://calendarific.com/api/v2/holidays?&api_key=${apiKey}&country=${countryCode}&year=2024`;



fetch(holidayUrl)
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    loadingText.textContent = '';

    const currentDate = new Date();
    const upcomingHolidays = data.response.holidays.filter(holiday => {
      // console.log(holiday);
      const holidayDate = new Date(holiday.date.datetime.year, holiday.date.datetime.month - 1, holiday.date.datetime.day);
      return holidayDate >= currentDate;
    }).slice(0, 10);

    holidaySection.insertBefore(createHeader(), holidaySection.firstChild);

    const holidayElements = upcomingHolidays.map(({ name, date: { datetime: { day, month, year } }, type }, index) => {
      const holidayDiv = document.createElement('div');
      holidayDiv.classList.add('holiday-item');
      holidayDiv.innerHTML = `
        <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-minus-fill" viewBox="0 0 16 16">
          <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M6 10h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1 0-1"/>
        </svg>
          <div class="holiday-name">${name}</div>
          <div class="holiday-type">(${type})</div>
        </span>
        <div class="holiday-date">${getFormattedDate(month, day)}</div>
      `;
      if (index >= 4) {
        holidayDiv.style.opacity = `${1 - (index - 5) * 0.2}`;
      }
      return holidayDiv;
    });

    holidaySection.append(...holidayElements);
  })
  .catch(error => {
    console.error('Error fetching holidays:', error);
    loadingText.textContent = 'Error loading holidays';
  });

