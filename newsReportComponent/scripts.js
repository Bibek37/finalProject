const headlineElement = document.getElementById('headline');
let headlines = [];
let currentHeadlineIndex = 0;
let intervalId; // Variable to hold the interval ID

// Function to fetch RSS headlines
async function fetchHeadlines() {
  try {
    const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml');
    const data = await response.json();
    headlines = data.items.map(item => item.title);
  } catch (error) {
    console.error('Error fetching headlines:', error);
  }
}

// Function to display headlines
function displayHeadline() {
  headlineElement.textContent = headlines[currentHeadlineIndex];
  currentHeadlineIndex = (currentHeadlineIndex + 1) % headlines.length;
}

// Function to schedule headlines change
function scheduleHeadlines() {
  // Display the first headline immediately
  displayHeadline();
  
  // Clear previous interval to ensure consistency
  clearInterval(intervalId);
  
  // Set a new interval to change headlines every 5 seconds
  intervalId = setInterval(displayHeadline, 6800);
}

// Initiate fetching headlines and scheduling display
fetchHeadlines().then(scheduleHeadlines);

