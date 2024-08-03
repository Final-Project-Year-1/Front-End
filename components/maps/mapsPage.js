const getVacationImg = "http://localhost:3000/api/vacations/images/";

let map;
let geocoder;
let apiKeyWeather;

function loadGoogleMapsApi(apiKey) {
    const existingScript = document.getElementById('google-maps-script');
    if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&language=en`;
        script.async = true;
        document.head.appendChild(script);
    }
}

async function initializeGoogleMaps() {
    const response = await fetch('http://localhost:3000/api/api-key/maps')
    const data = await response.json()
    loadGoogleMapsApi(data);
}

document.addEventListener('DOMContentLoaded', initializeGoogleMaps);

async function fetchVacations() {
    try {
        const response = await fetch('http://localhost:3000/api/Allvacations');
        const vacations = await response.json();
        return vacations;
    } catch (error) {
        console.error('Error fetching vacations:', error);
    }
}

function initMap() {
    const options = {
        zoom: 5,
        center: { lat: 51.1657, lng: 10.4515 },
    }

    map = new google.maps.Map(
        document.getElementById('map'),
        options
    )

    geocoder = new google.maps.Geocoder();
    loadVacations();
}

async function loadVacations() {
    const vacations = await fetchVacations();
    vacations.forEach(vacation => {
        geocodeLocation(vacation.destination, vacation);
    });
}

function addMarker(prop) {
    let marker = new google.maps.Marker({
        position: prop.coordinates,
        map: map
    })

    if (prop.iconImage) {
        marker.setIcon(prop.iconImage)
    }

    if (prop.content) {
        let information = new google.maps.InfoWindow({
            content: prop.content
        })

        marker.addListener("click", function () {
            information.open(map, marker)
        })
    }
}

function geocodeLocation(location, vacation) {
    geocoder.geocode({ 'address': location }, function (results, status) {
        if (status === 'OK') {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            getWeatherData(lat, lng, vacation);
        } else {
            console.error('Geocode was not successful for the following reason: ' + status);
        }
    });
}

async function getWeatherData(lat, lng, vacation) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKeyWeather}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp;
        
        // מחכים שהתמונה תיווצר
        const imgElement = await createVacationImage(vacation);

        const content = `
          <div class="custom-info-window">
            <h4>${vacation.destination}</h4>
            ${imgElement.outerHTML}
            <p>${vacation.description}</p>
            <p>Price: $${vacation.price}</p>
            <p>Weather: ${weatherDescription}</p>
            <p>Temperature: ${temperature}°C</p>
        </div>
        `;

        const prop = {
            coordinates: { lat, lng },
            content: content,
        };
        addMarker(prop);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function getApiKey() {
    const response = await fetch('http://localhost:3000/api/api-key/weather')
    const data = await response.json()

    apiKeyWeather = data;
}
(async () => { await getApiKey(); console.log(apiKeyWeather); })();


const fetchVacationImg = async (vacation) => {
    try {
        const response = await axios.get(getVacationImg + vacation?.imageName , { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(response.data);
        return imageUrl;
    } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
  }

  async function createVacationImage(vacation) {
    const vacationImg = document.createElement("img");
    vacationImg.classList.add("vacation-image");
    const imgSrc = await fetchVacationImg(vacation);
    
    if (imgSrc) {
        vacationImg.src = imgSrc; 

        // צור תגית <a> ועטוף בה את התמונה
        const link = document.createElement("a");
        const baseUrl = window.location.origin + "/Front-End";
        link.href = `${baseUrl}/components/vacationPage/vacationPage.html?id=${vacation._id}`;
        link.appendChild(vacationImg);

        // אפשר גם להוסיף CSS כדי לציין שהתמונה ניתנת ללחיצה
        vacationImg.style.cursor = 'pointer';

        return link; // החזר את תגית <a> עם התמונה בתוכה
    } else {
        const placeholderImg = document.createElement("img");
        placeholderImg.alt = "Image not available";
        return placeholderImg;
    }
}
