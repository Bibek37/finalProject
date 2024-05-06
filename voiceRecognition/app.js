// import {showOnly} from"./utils/showMeData"

const btn = document.querySelector('.input');
const content = document.querySelector('.content');
let audioElement;

function speak(text) {
  const text_speak = new SpeechSynthesisUtterance(text);

  text_speak.rate = 1;
  text_speak.volume = 1;
  text_speak.pitch = 1;

  window.speechSynthesis.speak(text_speak);
}

function wishMe() {
  var day = new Date();
  var hour = day.getHours();

  if (hour >= 5 && hour <= 12) {
    speak("Have a Good Morning...")
  } else if (hour > 12 && hour <= 18) {
    speak("Good Afternoon Sir...")
  } else if (hour > 18 && hour <= 21) {
    speak("Good Evening Sir...")
  } else {
    speak("Good night & Have a horror dream")
  }
}

window.addEventListener('load', () => {
  speak("Initializing ...");
  wishMe();
  startListening();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

function startListening() {
  recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
  }
  recognition.start();
}

recognition.onend = () => {
  startListening();
}

function stopMusic() {
  if (audioElement && audioElement.paused === false) {
    audioElement.pause();
    speak("Stopping music...");
  }
}

function showOnly(elementClass) {
  const elements = document.querySelectorAll('.container > *');
  elements.forEach(el => {
    el.classList.add('fade-out');
  });
  document.querySelector(elementClass).classList.remove('fade-out');
  document.querySelector('.footer').classList.add("fade-out");
}

function takeCommand(message) {
  showDataCommand(message);

  if (message.includes('hey') || message.includes('hello') || message.includes('hi')) {
    speak("Hello Sir, How May I Help You?");
  } else if (message.includes("play music")) {
    if (!audioElement) {
      const audioFilePath = "assets/music/Premika.mp3";
      audioElement = new Audio(audioFilePath);
    }
    audioElement.currentTime = 0;
    audioElement.play();
    speak("Playing your favourite music...");
  } else if (message.includes("open youtube")) {
    window.open("https://youtube.com", "_blank");
    speak("Opening Youtube...")
  } else if (message.includes("open facebook")) {
    window.open("https://facebook.com", "_blank");
    speak("Opening Facebook...")
  } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
    window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
    const finalText = "This is what I found on internet regarding " + message;
    speak(finalText);
  } else if (message.includes('wikipedia')) {
    window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
    const finalText = "This is what I found on Wikipedia regarding " + message;
    speak(finalText);
  } else if (message.includes('time')) {
    const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" })
    const finalText = time;
    speak(finalText);
  } else if (message.includes('date')) {
    const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" })
    const finalText = date;
    speak(finalText);
  } else if (message.includes('calculator')) {
    window.open('Calculator:///')
    const finalText = "Opening Calculator";
    speak(finalText);
  } else if (message.includes('stop music') || message.includes('stop')) {
    stopMusic();
  } else if (message.includes("news")) {
    const category = getCategory(message);
    if (category) {
      selectCategoryByVoice(category);
    } else {
      speak("Sorry, I didn't catch the news category. Please try again.");
    }
  }
}

function getCategory(message) {
  const categories = ["general", "entertainment", "health", "science", "sports", "technology"];
  for (const category of categories) {
    if (message.includes(category)) {
      return category;
    }
  }
  return null;
}

function selectCategoryByVoice(category) {
  const options = document.querySelectorAll(".option");
  options.forEach((element) => {
    if (element.innerText.toLowerCase() === category) {
      element.classList.add("active");
    } else {
      element.classList.remove("active");
    }
  });
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`;
  getNews();
}

function showDataCommand(message) {
  if (message.includes("time")) {
    showOnly('.center-side');
  } else if (message.includes("weather")) {
    showOnly('.right-side');
  } else if (message.includes("news")) {
    showNewsOnly('.news-section');
  } else if (message.includes("Holiday list only") || message.includes("holiday")) {
    showOnly('.left-side');
  } else if (message.includes("all") || message.includes("everything")) {
    const finalText = "Showing everything...";
    speak(finalText);
    const elements = document.querySelectorAll('.container > *');
    elements.forEach(el => {
      el.classList.remove('fade-out');
    });
    document.querySelector('.footer').classList.remove("fade-out");
    document.querySelector('.news-section').classList.add("fade-out");
  }
}

function showNewsOnly(elementClass) {
  document.querySelector('.news-section').classList.remove("fade-out");
  const element = document.querySelector('.news-section');
  const elementData = document.querySelectorAll('.container > *');
  elementData.forEach(el => {
    el.classList.add('fade-out');
  });
  document.querySelector('.footer').classList.add("fade-out");
}

const container = document.querySelector(".news-container");
const optionsContainer = document.querySelector(".options-container");
const country = "in";
const options = [
  "general",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];
let apiKey = "b6e6ac4d9100498c866a649bad6dbfc7";

let requestURL;

const generateUI = (articles) => {
  container.innerHTML = ""; // Clear existing content
  const numRows = 3;
  const numColumns = 6;
  const maxCards = numRows * numColumns;

  for (let i = 0; i < maxCards && i < articles.length; i++) {
    let item = articles[i];
    let card = document.createElement("div");
    card.classList.add("news-card");
    card.innerHTML = `<div class="news-image-container">
      <img src="${item.urlToImage || "./newspaper.jpg"}" alt="" />
    </div>
    <div class="news-content">
      <div class="news-title">
        ${item.title}
      </div>
    </div>`;
    container.appendChild(card);
  }
};

const getNews = async () => {
  container.innerHTML = "";
  let response = await fetch(requestURL);
  if (!response.ok) {
    alert("Data unavailable at the moment. Please try again later");
    return false;
  }
  let data = await response.json();
  generateUI(data.articles);
};

const selectCategory = (e, category) => {
  let options = document.querySelectorAll(".option");
  options.forEach((element) => {
    element.classList.remove("active");
  });
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`;
  e.target.classList.add("active");
  getNews();
};

const createOptions = () => {
  for (let i of options) {
    optionsContainer.innerHTML += `<button class="option ${
      i == "general" ? "active" : ""
    }" onclick="selectCategory(event,'${i}')">${i}</button>`;
  }
};

const init = () => {
  optionsContainer.innerHTML = "";
  getNews();
  createOptions();
};

window.onload = () => {
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&category=general&apiKey=${apiKey}`;
  init();
};
