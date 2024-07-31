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

        const response = await axios.post('http://localhost:3000/api/bookings/bookings-by-user/${userObj.user._id}', searchQuery, {
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
    cardsContainer.innerHTML = '';

    if (bookings.length === 0) {
        cardsContainer.innerHTML = `<p class="no-results">No bookings found.</p>`;
        document.querySelector('.show-more-container').style.display = 'none';
        return;
    }

    bookings.forEach(booking => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-body">
                <div class="order-number">
                    Order Number: ${booking.orderNumber}
                </div>
                <div class="info">
                    <p><strong>Destination:</strong> ${booking.destination}</p>
                    <p><strong>Description:</strong> ${booking.description}</p>
                    <p><strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
                    <p><strong>Passengers:</strong> ${booking.passengers}</p>
                    <p><strong>Company:</strong> ${booking.Company}</p>
                    <p><strong>Vacation Type:</strong> ${booking.VacationType}</p>
                    <p><strong>Category:</strong> ${booking.Category}</p>
                    <p><strong>Rating:</strong> ${booking.Rating}</p>
                    <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                </div>
            </div>
        `;
        cardsContainer.appendChild(card);
    });

    document.querySelector('.show-more-container').style.display = bookings.length > ITEMS_PER_PAGE ? 'flex' : 'none';
}
