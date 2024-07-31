let currentIndex = 0; // Declare currentIndex at the top
const ITEMS_PER_PAGE = 9;
let currentBookings = [];

const apiUrl = "http://localhost:3000/api/bookings";

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const userObj = getUserFromToken();
    if (userObj && userObj.token) {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${userObj.token}`
        }
      });
      const bookings = response.data;
      displayBookings(bookings);

      const topButtonLoggedIn = document.querySelector(".top-button-logged-in");
      const topButton = document.querySelector(".top-button");

      if (topButtonLoggedIn && topButton) {
        if (userObj.user) {
          topButtonLoggedIn.style.display = "block";
          topButton.style.display = "none";
          document.getElementById("hello-user").textContent = `Hello ${userObj.user.firstName} ${userObj.user.lastName}`;
        }
      }
    } else {
      redirectToLogin();
    }
  } catch (error) {
    handleError(error);
  }
});

const getUserFromToken = () => {
  let user = null;
  const token = localStorage.getItem("token");

  if (token) {
    const encodedObject = jwt_decode(token);
    user = encodedObject.user;
  }

  return {
    user: user,
    token: token
  };
};

const redirectToLogin = () => {
  window.location.href = "../Auth/Login/login.html";
};

document.getElementById('search-id').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchBooking();
  }
});

const fetchBookings = async () => {
  try {
    const userObj = getUserFromToken();
    if (!userObj || !userObj.token) {
      redirectToLogin();
      return [];
    }

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${userObj.token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return [];
  }
};

document.querySelectorAll('.dropdown-content a').forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('.dropbtn').textContent = this.textContent;
    document.querySelector('.dropbtn').dataset.value = this.dataset.value;
  });
});

function searchBooking() {
  const searchId = document.getElementById('search-id').value.toLowerCase();
  const searchCriteria = document.querySelector('.dropbtn').dataset.value;

  fetchBookings().then(bookings => {
    let filteredBookings = [];

    if (searchCriteria === 'OrderNumber') {
      filteredBookings = bookings.filter(b => b.OrderNumber.toLowerCase().includes(searchId));
    } else if (searchCriteria === 'vacationId') {
      filteredBookings = bookings.filter(b => b.vacationId._id.toLowerCase().includes(searchId));
    } else if (searchCriteria === 'status') {
      filteredBookings = bookings.filter(b => b.status.toLowerCase().includes(searchId));
    } else if (searchCriteria === 'email') {
      filteredBookings = bookings.filter(b => b.userId.email && b.userId.email.toLowerCase().includes(searchId));
    } else if (searchCriteria === 'userName') {
      filteredBookings = bookings.filter(b => {
        const fullName = `${b.userId.firstName || ''} ${b.userId.lastName || ''}`.toLowerCase();
        return fullName.includes(searchId);
      });
    } else if (searchCriteria === 'companyName') {
      filteredBookings = bookings.filter(b => b.vacationId.companyName && b.vacationId.companyName.company.toLowerCase().includes(searchId));
    }

    currentIndex = 0; // Reset index for new search
    displayBookings(filteredBookings, searchCriteria, searchId);
  });
}

function clearSearch() {
  document.getElementById('search-id').value = '';
  document.querySelector('.dropbtn').textContent = 'Select Search Criteria';
  currentIndex = 0; // Reset index for cleared search
  fetchBookings().then(displayBookings);
}

function displayBookings(bookings, searchCriteria = '', searchId = '') {
  currentBookings = bookings;
  const cardsContainer = document.getElementById('cards-container');
  cardsContainer.innerHTML = '';

  if (bookings.length === 0) {
    cardsContainer.innerHTML = `<p class="no-results">Oops!<br>No orders with this ${searchCriteria}: ${searchId}</p>`;
    document.querySelector('.show-more-container').style.display = 'none';
    return;
  }

  const displayBookings = bookings.slice(0, currentIndex + ITEMS_PER_PAGE);
  displayBookings.forEach(booking => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-body">
        <div class="order-number">
          Order Number: ${booking.OrderNumber}
        </div>
        <div class="info">
          <p><strong>Vacation ID:</strong> ${booking.vacationId._id}</p>
          <p><strong>User Name:</strong> ${booking.userId.firstName || 'N/A'} ${booking.userId.lastName || 'N/A'}</p>
          <p><strong>Email:</strong> ${booking.userId.email || 'N/A'}</p>
          <p><strong>Company Name:</strong> ${booking.vacationId.companyName ? booking.vacationId.companyName.company : 'N/A'}</p>
          <p><strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
          <p><strong>Passengers:</strong> ${booking.Passengers}</p>
          <p><strong>Status:</strong> ${booking.status}</p>
        </div>
      </div>
    `;
    cardsContainer.appendChild(card);
  });

  const showMoreContainer = document.querySelector('.show-more-container');
  if (bookings.length > currentIndex + ITEMS_PER_PAGE) {
    showMoreContainer.style.display = 'flex';
  } else {
    showMoreContainer.style.display = 'none';
  }
}

function showMoreBookings() {
  currentIndex += ITEMS_PER_PAGE;
  displayBookings(currentBookings);
}

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () => {
  localStorage.setItem("token", "");
  redirectToLogin();
});

function handleError(error) {
  console.error("Error fetching data:", error);
  if (error.response) {
    // The request was made, but the server responded with a status code
    // that falls out of the range of 2xx
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);
    console.error("Response headers:", error.response.headers);
    if (error.response.status === 401) {
      redirectToLogin();
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error("Request data:", error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error message:", error.message);
  }
}
const countriesListUrl = "http://localhost:3000/api/vacations/destinations/countries/";
const inputDestination = document.getElementById("destination");
const dropdownDestination = document.getElementById("destination-dropdown");
const inputMonth = document.getElementById("month");
const dropdownMonth = document.getElementById("month-dropdown");

const fetchCountriesList = async () => {
  try {
    const response = await axios.get(countriesListUrl);
    return response.data.destinations;
  } catch (error) {
    console.error("Error fetching countries list:", error);
    return [];
  }
};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let vacationSearchQueryDestination;
let vacationSearchQueryMonth;
let vacationSearchQueryNumOfPeople;

function populateDropdown(dropdown, items, query) {
  dropdown.innerHTML = "";
  const filteredItems = items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
  filteredItems.forEach(item => {
    const option = document.createElement("div");
    option.className = "dropdown-item";
    option.textContent = item;
    option.addEventListener("click", () => {
      dropdown.previousElementSibling.value = item;
      if (dropdown === dropdownDestination) {
        vacationSearchQueryDestination = item;
      } else if (dropdown === dropdownMonth) {
        vacationSearchQueryMonth = item;
      }
      dropdown.style.display = "none";
      validateForm();
    });
    dropdown.appendChild(option);
  });
}

function setupInputListener(input, dropdown, items) {
  input.addEventListener("input", () => {
    const query = input.value;
    if (query) {
      dropdown.style.display = "block";
      populateDropdown(dropdown, items, query);
    } else {
      dropdown.style.display = "none";
    }
  });
}

function setupClickOutsideListener(dropdown) {
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-form-back")) {
      dropdown.style.display = "none";
    }
  });
}

async function initialize() {
  const destinations = await fetchCountriesList();
  setupInputListener(inputDestination, dropdownDestination, destinations);
  setupInputListener(inputMonth, dropdownMonth, months);
  setupClickOutsideListener(dropdownDestination);
  setupClickOutsideListener(dropdownMonth);
}
initialize();

const validateForm = () => {
  if (vacationSearchQueryDestination && vacationSearchQueryMonth && vacationSearchQueryNumOfPeople) {
    searchFormButton.disabled = false;
  } else {
    searchFormButton.disabled = true;
  }
}

const searchFormButton = document.getElementById("searchFormButton");
searchFormButton.disabled = true;



searchFormButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const searchVacationData = {
    "numOfPassengers": String(vacationSearchQueryNumOfPeople),
    "departureMonth": String(vacationSearchQueryMonth),
    "destination": vacationSearchQueryDestination
  };

  const searchQueryUrl = "http://localhost:3000/api/search-vacations";
  
  try {
    const response = await axios.post(searchQueryUrl, searchVacationData);
    displayVacations(response.data);

  } catch (error) {
    if (error.response && error.response.status === 404) {
      displayVacations([]); // Handle 404 Not Found
    } else {
      console.error("Error searching vacations:", error);
    }
  }
});

const displayVacations = (vacations) => {
  // Implement the display logic for vacations
  console.log(vacations);
}