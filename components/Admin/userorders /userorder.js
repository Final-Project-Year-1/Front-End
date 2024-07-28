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

// נתונים דינאמיים מה-backend
// async function fetchBookings() {
//     try {
//         const response = await fetch('http://localhost:8080/api/bookings'); // עדכן את ה-URL לפי הצורך
//         const bookings = await response.json();
//         return bookings;
//     } catch (error) {
//         console.error('Error fetching bookings:', error);
//         return [];
//     }
// }

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

    // הסרת ההערה כדי להשתמש בנתונים סטטיים
  
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
    displayBookings(bookings);
   

    // נתונים דינאמיים
    // fetchBookings().then(bookings => {
    //     if (searchCriteria === 'OrderNumber') {
    //         bookings = bookings.filter(b => b.OrderNumber.includes(searchId));
    //     } else if (searchCriteria === 'vacationId') {
    //         bookings = bookings.filter(b => b.vacationId.includes(searchId));
    //     } else if (searchCriteria === 'status') {
    //         bookings = bookings.filter(b => b.status.toLowerCase().includes(searchId.toLowerCase()));
    //     } else if (searchCriteria === 'userId') {
    //         bookings = bookings.filter(b => b.userId.includes(searchId));
    //     } else if (searchCriteria === 'companyName') {
    //         bookings = bookings.filter(b => b.companyName.toLowerCase().includes(searchId.toLowerCase()));
    //     }
    //     displayBookings(bookings);
    // });
}

// הצגת כרטיסי הזמנות
function displayBookings(bookings) {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = '';
    bookings.forEach(booking => {
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
}

// הצגת כל ההזמנות (סטטי)
displayBookings(mockBookings);

// הצגת כל ההזמנות (דינאמי)
// document.addEventListener('DOMContentLoaded', () => {
//     fetchBookings().then(displayBookings);
// });
