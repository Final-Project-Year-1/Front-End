const userObj = window.getUserFromToken();
window.authVerificationAdjustments();

var $dropdown = $(".dropdown");
var $dropdownContent = $(".dropdown-content");

$dropdown.on("click", function () {
  if ($dropdownContent.css("display") === "block") {
    $dropdownContent.css("display", "none");
  } else {
    $dropdownContent.css("display", "block");
  }
});

const tips = [
  "Pack light to make your travel experience easier.",
  "Always carry a reusable water bottle.",
  "Learn a few phrases in the local language.",
  "Keep digital and physical copies of important documents.",
  "Try local food for a more authentic experience.",
  "Take travel insurance for peace of mind.",
  "Always have a backup plan for your itinerary.",
  "Respect the local culture and customs.",
  "Stay aware of your surroundings to ensure safety.",
  "Make copies of your passport and keep them separate from the original.",
];

const $tipElement = $("#tip");
const randomTip = tips[Math.floor(Math.random() * tips.length)];
$tipElement.text(randomTip);

// Weather forecast

let apiKeyWeather;

async function getApiKey() {
  const response = await fetch('http://localhost:3000/api/api-key/weather')
  const data = await response.json()

  apiKeyWeather = data;
}
(async () => { await getApiKey(); console.log(apiKeyWeather); })();



async function getWeather() {
  const city = $("#city").val().trim();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyWeather}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Invalid API key");
      }
      throw new Error("City not found");
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    $("#weather-info").html(`<p>${error.message}</p>`);
  }
}

function displayWeather(data) {
  const weatherInfo = `
        <p><strong>City:</strong> ${data.name}</p>
        <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity} %</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
  $("#weather-info").html(weatherInfo);
}
