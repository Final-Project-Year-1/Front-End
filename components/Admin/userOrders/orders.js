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
  cardsContainer.innerHTML = ''; // Clear existing content

  if (bookings.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.classList.add('no-results');
    noResultsMessage.textContent = `Oops! No orders with this ${searchCriteria}: ${searchId}`;
    cardsContainer.appendChild(noResultsMessage);
    document.querySelector('.show-more-container').style.display = 'none';
    return;
  }

  const displayBookings = bookings.slice(0, currentIndex + ITEMS_PER_PAGE);

  displayBookings.forEach(booking => {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const orderNumber = document.createElement('div');
    orderNumber.classList.add('order-number');
    orderNumber.textContent = `Order Number: ${booking.OrderNumber}`;

    const info = document.createElement('div');
    info.classList.add('info');
    
    const vacationId = document.createElement('p');
    vacationId.innerHTML = `<strong>Vacation ID:</strong> ${booking.vacationId._id}`;
    
    const userName = document.createElement('p');
    userName.innerHTML = `<strong>User Name:</strong> ${booking.userId.firstName || 'N/A'} ${booking.userId.lastName || 'N/A'}`;
    
    const email = document.createElement('p');
    email.innerHTML = `<strong>Email:</strong> ${booking.userId.email || 'N/A'}`;
    
    const companyName = document.createElement('p');
    companyName.innerHTML = `<strong>Company Name:</strong> ${booking.vacationId.companyName ? booking.vacationId.companyName.company : 'N/A'}`;
    
    const bookingDate = document.createElement('p');
    bookingDate.innerHTML = `<strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}`;
    
    const passengers = document.createElement('p');
    passengers.innerHTML = `<strong>Passengers:</strong> ${booking.Passengers}`;
    
    const status = document.createElement('p');
    status.innerHTML = `<strong>Status:</strong> ${booking.status}`;
    
    info.appendChild(vacationId);
    info.appendChild(userName);
    info.appendChild(email);
    info.appendChild(companyName);
    info.appendChild(bookingDate);
    info.appendChild(passengers);
    info.appendChild(status);
    
    cardBody.appendChild(orderNumber);
    cardBody.appendChild(info);
    
    card.appendChild(cardBody);
    
    cardsContainer.appendChild(card);
  });

  const showMoreContainer = document.querySelector('.show-more-container');
  showMoreContainer.style.display = bookings.length > currentIndex + ITEMS_PER_PAGE ? 'flex' : 'none';
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
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);
    console.error("Response headers:", error.response.headers);
    if (error.response.status === 401) {
      redirectToLogin();
    }
  } else if (error.request) {
    console.error("Request data:", error.request);
  } else {
    console.error("Error message:", error.message);
  }
}

const searchFormButtonBack = document.getElementById('searchFormButtonBack');

searchFormButtonBack.addEventListener('click', async function () {
    const email = document.getElementById('email-back').value;
    const destination = document.getElementById('destination-back').value;
    const month = document.getElementById('month-back').value;

    const searchQuery = {
        email: email,
        destination: destination,
        departureMonth: parseInt(month)
    };

    try {
        const userObj = getUserFromToken();
        if (!userObj || !userObj.token) {
            redirectToLogin();
            return;
        }

        const response = await axios.post('http://localhost:3000/api/user-booking-query', searchQuery, {
            headers: {
                Authorization: `Bearer ${userObj.token}`
            }
        });

        const bookings = response.data;
        displaySearchBackBookings(bookings);

    } catch (error) {
        handleError(error);
    }
});

function displaySearchBackBookings(bookings) {
  const cardsContainer = document.getElementById('cards-container');
  cardsContainer.innerHTML = ''; // Clear existing content

  if (bookings.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.classList.add('no-results');
    noResultsMessage.textContent = 'No bookings found.';
    cardsContainer.appendChild(noResultsMessage);
    document.querySelector('.show-more-container').style.display = 'none';
    return;
  }

  bookings.forEach(booking => {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const orderNumber = document.createElement('div');
    orderNumber.classList.add('order-number');
    orderNumber.textContent = `Order Number: ${booking.orderNumber}`;

    const info = document.createElement('div');
    info.classList.add('info');
    
    const destination = document.createElement('p');
    destination.innerHTML = `<strong>Destination:</strong> ${booking.destination}`;
    
    const description = document.createElement('p');
    description.innerHTML = `<strong>Description:</strong> ${booking.description}`;
    
    const bookingDate = document.createElement('p');
    bookingDate.innerHTML = `<strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}`;
    
    const passengers = document.createElement('p');
    passengers.innerHTML = `<strong>Passengers:</strong> ${booking.passengers}`;
    
    const company = document.createElement('p');
    company.innerHTML = `<strong>Company:</strong> ${booking.Company}`;
    
    const vacationType = document.createElement('p');
    vacationType.innerHTML = `<strong>Vacation Type:</strong> ${booking.VacationType}`;
    
    const category = document.createElement('p');
    category.innerHTML = `<strong>Category:</strong> ${booking.Category}`;
    
    const rating = document.createElement('p');
    rating.innerHTML = `<strong>Rating:</strong> ${booking.Rating}`;
    
    const totalPrice = document.createElement('p');
    totalPrice.innerHTML = `<strong>Total Price:</strong> ${booking.totalPrice}`;
    
    info.appendChild(destination);
    info.appendChild(description);
    info.appendChild(bookingDate);
    info.appendChild(passengers);
    info.appendChild(company);
    info.appendChild(vacationType);
    info.appendChild(category);
    info.appendChild(rating);
    info.appendChild(totalPrice);
    
    cardBody.appendChild(orderNumber);
    cardBody.appendChild(info);
    
    card.appendChild(cardBody);
    
    cardsContainer.appendChild(card);
  });

  document.querySelector('.show-more-container').style.display = bookings.length > ITEMS_PER_PAGE ? 'flex' : 'none';
}
