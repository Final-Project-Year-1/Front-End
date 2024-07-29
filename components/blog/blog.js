document.addEventListener('DOMContentLoaded', function() {
    const getUserFromToken = () => {
        let user = null;
        const token = localStorage.getItem('token');

        if (token) {
            const encodedObject = jwt_decode(token);
            user = encodedObject.user;
        }

        return {
            user: user,
            token: token
        };
    };

    if (localStorage.getItem('token') !== '') {
        const userObj = getUserFromToken();
        document.querySelector('.top-button-logged-in').style.display = 'block';
        document.querySelector('.top-button').style.display = 'none';
        document.getElementById('hello-user').textContent = `Hello ${userObj.user.firstName} ${userObj.user.lastName}`;

       
        if (userObj.token) {
            const decodedToken = jwt_decode(userObj.token);
            if (decodedToken.scopes && decodedToken.scopes.includes('pages_manage_metadata')) {
                document.getElementById('admin-section').style.display = 'block';
            }
        }
    }

    const logoutButton = document.getElementById('logout');
    logoutButton.addEventListener('click', () => {
        localStorage.setItem('token', '');
        window.location.href = '../Auth/Login/login.html';
    });

   
    var dropdown = document.querySelector('.dropdown');
    var dropdownContent = document.querySelector('.dropdown-content');

    dropdown.addEventListener('click', function() {
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
        } else {
            dropdownContent.style.display = 'block';
        }
    });

   
    const tips = [
        'Pack light to make your travel experience easier.',
        'Always carry a reusable water bottle.',
        'Learn a few phrases in the local language.',
        'Keep digital and physical copies of important documents.',
        'Try local food for a more authentic experience.',
        'Take travel insurance for peace of mind.',
        'Always have a backup plan for your itinerary.',
        'Respect the local culture and customs.',
        'Stay aware of your surroundings to ensure safety.',
        'Make copies of your passport and keep them separate from the original.'
    ];

    const tipElement = document.getElementById('tip');
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    tipElement.textContent = randomTip;
});

// Weather forecast
async function getWeather() {
    const city = document.getElementById('city').value.trim();
    const apiKey = '852035eefd087a5e214c33deadcb451b';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized: Invalid API key');
            }
            throw new Error('City not found');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.getElementById('weather-info').innerHTML = `<p>${error.message}</p>`;
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
    document.getElementById('weather-info').innerHTML = weatherInfo;
}
