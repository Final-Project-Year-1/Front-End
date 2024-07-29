
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

function initMap() {
    const options = {
        zoom: 8,
        center: { lat: 31.0461, lng: 34.8516 },
    }

    map = new google.maps.Map(
        document.getElementById('map'),
        options
    )

    geocoder = new google.maps.Geocoder();
    const countries = getCountries();
    for (let i = 0; i < countries.length; i++) {
        geocodeLocation(countries[i]);
    }
    function getCountries() {
        return ['United States', 'Canada', 'Mexico', 'Germany', 'France'];  // דוגמה למערך שמות מדינות
    }

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


function geocodeLocation(location) {
    geocoder.geocode({ 'address': location }, function (results, status) {
        if (status === 'OK') {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            // const prop = {
            //     coordinates: { lat, lng },
            //     content: `<h4>${location}</h4>`//להוסיף מי
            getWeatherData(lat, lng, location);
            // };
            // addMarker(prop);
        } else {
            console.error('Geocode was not successful for the following reason: ' + status);
        }
    });
}
function getWeatherData(lat, lng, location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKeyWeather}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;

            const content = `<h4>${location}</h4><p>Weather: ${weatherDescription}</p><p>Temperature: ${temperature}°C</p>`;

            const prop = {
                coordinates: { lat, lng },
                content: content,
            };
            addMarker(prop);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

async function getApiKey() {
    const response = await fetch('http://localhost:3000/api/api-key/weather')
    const data = await response.json()

    apiKeyWeather = data;
}
(async () => { await getApiKey(); console.log(apiKeyWeather); })();