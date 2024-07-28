//Auth
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
}

if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const userObj = getUserFromToken();
    document.querySelector(".top-button-logged-in").style.display = "block";
    document.querySelector(".top-button").style.display = "none";
    document.getElementById("hello-user").textContent = `Hello ${userObj.user.firstName} ${userObj.user.lastName}`
}

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () =>{
    localStorage.setItem("token", "");
    window.location.href = "../Auth/Login/login.html";
});

document.getElementById('search-id').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchBooking();
    }
});

// נתונים סטטיים
const mockBookings = [
    {
        OrderNumber: '12345',
        vacationId: '5f8d0d55b54764421b7156d9',
        userId: '5f8d0d55b54764421b7156e0',
        bookingDate: '2024-11-23T00:00:00.000Z',
        Passengers: 1,
        status: 'pending',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        companyName: 'TravelCorp'
    },
    {
        OrderNumber: '67890',
        vacationId: '5f8d0d55b54764421b7156e1',
        userId: '5f8d0d55b54764421b7156e2',
        bookingDate: '2024-12-01T00:00:00.000Z',
        Passengers: 2,
        status: 'confirmed',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        companyName: 'HolidayInc'
    },
    {
        OrderNumber: '11223',
        vacationId: '5f8d0d55b54764421b7156e3',
        userId: '5f8d0d55b54764421b7156e4',
        bookingDate: '2024-10-15T00:00:00.000Z',
        Passengers: 3,
        status: 'cancelled',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        companyName: 'GetawayLtd'
    }
];

// הוספת עוד הזמנות לדוגמה
for (let i = 4; i <= 40; i++) {
    mockBookings.push({
        OrderNumber: `${10000 + i}`,
        vacationId: `5f8d0d55b54764421b7156d${i}`,
        userId: `5f8d0d55b54764421b7156e${i}`,
        bookingDate: '2024-10-15T00:00:00.000Z',
        Passengers: i % 5,
        status: i % 2 === 0 ? 'confirmed' : 'pending',
        firstName: `First${i}`,
        lastName: `Last${i}`,
        email: `user${i}@example.com`,
        companyName: `Company${i}`
    });
}

document.querySelectorAll('.dropdown-content a').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector('.dropbtn').textContent = this.textContent;
        document.querySelector('.dropbtn').dataset.value = this.dataset.value;
    });
});

// חיפוש הזמנות
function searchBooking() {
    const searchId = document.getElementById('search-id').value;
    const searchCriteria = document.querySelector('.dropbtn').dataset.value;

    // נתונים סטטיים
    let bookings = [];

    if (searchCriteria === 'OrderNumber') {
        bookings = mockBookings.filter(b => b.OrderNumber.includes(searchId));
    } else if (searchCriteria === 'vacationId') {
        bookings = mockBookings.filter(b => b.vacationId.includes(searchId));
    } else if (searchCriteria === 'status') {
        bookings = mockBookings.filter(b => b.status.toLowerCase().includes(searchId.toLowerCase()));
    } else if (searchCriteria === 'userId') {
        bookings = mockBookings.filter(b => b.userId.includes(searchId));
    } else if (searchCriteria === 'companyName') {
        bookings = mockBookings.filter(b => b.companyName.toLowerCase().includes(searchId.toLowerCase()));
    }
    currentIndex = 0; // לאתחל את האינדקס לחיפוש חדש
    displayBookings(bookings, searchCriteria, searchId);
}

// ניקוי חיפוש
function clearSearch() {
    document.getElementById('search-id').value = '';
    document.querySelector('.dropbtn').textContent = 'Select Search Criteria';
    currentIndex = 0; // לאתחל את האינדקס לניקוי חיפוש
    displayBookings(mockBookings);
}

// הצגת כרטיסי הזמנות
let currentIndex = 0;
const ITEMS_PER_PAGE = 9;
let currentBookings = [];

function displayBookings(bookings, searchCriteria = '', searchId = '') {
    currentBookings = bookings;
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = '';

    if (bookings.length === 0) {
        cardsContainer.innerHTML = `<p class="no-results">Oops!<br>No orders with this ${searchCriteria}: ${searchId}</p>`;
        const showMoreContainer = document.querySelector('.show-more-container');
        showMoreContainer.style.display = 'none';
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
                    <p><strong>Vacation ID:</strong> ${booking.vacationId}</p>
                    <p><strong>User ID:</strong> ${booking.userId}</p>
                    <p><strong>User Name:</strong> ${booking.firstName} ${booking.lastName}</p>
                    <p><strong>Email:</strong> ${booking.email}</p>
                    <p><strong>Company Name:</strong> ${booking.companyName}</p>
                    <p><strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
                    <p><strong>Passengers:</strong> ${booking.Passengers}</p>
                    <p><strong>Status:</strong> ${booking.status}</p>
                </div>
            </div>
        `;
        cardsContainer.appendChild(card);
    });

    // Add "Show More" button if there are more items to show
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

// הצגת כל ההזמנות (סטטי)
displayBookings(mockBookings);

// הצגת כל ההזמנות (דינאמי)
// document.addEventListener('DOMContentLoaded', () => {
//     fetchBookings().then(displayBookings);
// });
