const getVacationImg = "http://localhost:3000/api/vacations/images/";
const topRatedVacationsUrl = "http://localhost:3000/api/vacations/top-rated";

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

document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    const logoutButton = document.getElementById("logout");

    if (token) {
        const userObj = getUserFromToken();
        const helloUserElement = document.getElementById("hello-user");
        helloUserElement.textContent = `Hello ${userObj.user.firstName} ${userObj.user.lastName}`;
        logoutButton.textContent = "Log out";
        logoutButton.onclick = logout;
    } else {
        logoutButton.textContent = "Log in";
        logoutButton.onclick = () => {
            window.location.href = '../../Auth/login/login.html';
        };
    }

    try {
        const userObj = getUserFromToken();
        const getAllBookingsById = `http://localhost:3000/api/bookings/bookings-by-user/${userObj.user._id}?populate=true`;
        const response = await axios.get(getAllBookingsById);
        const bookings = response.data;
        console.log(bookings);
        categorizeBookings(bookings);
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    try {
        const response = await axios.get(topRatedVacationsUrl);
        const vacations = response.data;

        for (const vacation of vacations.slice(0, 4)) {
            const imageUrl = await fetchVacationImg(vacation.imageName);
            createVacationCard(vacation, imageUrl);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

const fetchVacationImg = async (imageName) => {
    try {
        const response = await axios.get(getVacationImg + imageName, { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(response.data);
        return imageUrl;
    } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
}

const createVacationCard = (vacation, imageUrl) => {
    const card = document.createElement("div");
    card.classList.add("vacation-card");

    const image = document.createElement("img");
    image.src = imageUrl || 'default-image-url.jpg'; // Use fetched image or fallback
    image.alt = vacation.name;
    card.appendChild(image);

    const title = document.createElement("h3");
    title.textContent = vacation.name;
    card.appendChild(title);

    const description = document.createElement("p");
    description.textContent = vacation.description;
    card.appendChild(description);

    document.getElementById("vacation-container").appendChild(card);
}

function categorizeBookings(bookings) {
    const now = new Date();

    const futureTripsSection = document.getElementById("future-trips");
    const futureTripsContainer = document.getElementById("future-trips-container");
    const pastTripsSection = document.getElementById("past-trips");
    const pastTripsContainer = document.getElementById("history-container");
    const cancelledTripsSection = document.getElementById("cancelled-trips");
    const cancelledTripsContainer = document.getElementById("cancelled-trips-container");
    const noTripsContainer = document.getElementById("no-trips");
    const additionalTripsContainer = document.getElementById("additional-trips");

    futureTripsContainer.innerHTML = '';
    pastTripsContainer.innerHTML = '';
    cancelledTripsContainer.innerHTML = '';

    let hasFutureTrips = false;
    let hasPastTrips = false;
    let hasCancelledTrips = false;

    bookings.forEach((booking) => {
        if (!booking.vacationId) {
            console.error("Vacation data missing for booking:", booking);
            return;
        }

        const startDate = new Date(booking.vacationId.startDate);
        const endDate = new Date(booking.vacationId.endDate);

        if (booking.status === 'cancelled') {
            hasCancelledTrips = true;
            createBookingCard(booking, cancelledTripsContainer);
        } else if (endDate >= now) {
            hasFutureTrips = true;
            createBookingCard(booking, futureTripsContainer);
        } else if (endDate < now) {
            hasPastTrips = true;
            createBookingCard(booking, pastTripsContainer);
        }
    });

    if (hasFutureTrips) {
        noTripsContainer.style.display = 'none';
        additionalTripsContainer.style.display = 'flex';
        futureTripsSection.style.display = 'block';
    } else {
        noTripsContainer.style.display = 'flex';
        additionalTripsContainer.style.display = 'none';
        futureTripsSection.style.display = 'none';
    }

    if (hasPastTrips) {
        pastTripsSection.style.display = 'block';
    } else {
        pastTripsSection.style.display = 'none';
    }

    if (hasCancelledTrips) {
        cancelledTripsSection.style.display = 'block';
    } else {
        cancelledTripsSection.style.display = 'none';
    }
}

function startSearching() {
    window.location.href = 'file:///C:/Users/omer3/Desktop/Front-End/components/User/Vacations/allVacations.html';
}

function logout() {
    localStorage.removeItem("token");

    const logoutButton = document.getElementById("logout");
    logoutButton.textContent = "Log in";

    window.location.href = '../../Auth/login/login.html';
}

async function createBookingCard(booking, container) {
    const card = document.createElement("a");
    card.classList.add("card");
    card.href = "javascript:void(0);";

    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");

    const bookingImg = document.createElement("img");
    bookingImg.classList.add("booking-image");

    // Fetch and set the image URL for the booking
    const imageUrl = await fetchVacationImg(booking.vacationId.imageName);
    bookingImg.src = imageUrl || 'default-image-url.jpg'; // Use fetched image or fallback
    cardHeader.appendChild(bookingImg);
    card.appendChild(cardHeader);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = booking.vacationId.destination;
    cardBody.appendChild(title);

    const now = new Date();
    const startDate = new Date(booking.vacationId.startDate);
    const endDate = new Date(booking.vacationId.endDate);

    let statusBadge;
    if (startDate <= now && endDate >= now && booking.status === 'confirmed') {
        statusBadge = document.createElement("span");
        statusBadge.classList.add("active-badge-inline");
        statusBadge.textContent = "Active";
    } else if (booking.status === 'pending') {
        statusBadge = document.createElement("span");
        statusBadge.classList.add("pending-badge-inline");
        statusBadge.textContent = "Pending";
    } else if (booking.status === 'cancelled') {
        statusBadge = document.createElement("span");
        statusBadge.classList.add("cancelled-badge-inline");
        statusBadge.textContent = "Cancelled";
    } else if (startDate > now) {
        statusBadge = document.createElement("span");
        statusBadge.classList.add("status-badge-inline");
        statusBadge.textContent = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
    }

    if (statusBadge) {
        title.appendChild(statusBadge);
    }

    const info = document.createElement("div");
    info.classList.add("info");
    info.innerHTML =
        `${getDate(booking.vacationId.startDate)} - ${getDate(booking.vacationId.endDate)} ·
        ${calculateDaysDifference(booking.vacationId.startDate, booking.vacationId.endDate)} days`;
    cardBody.appendChild(info);

    card.appendChild(cardBody);
    container.appendChild(card);

    card.addEventListener("click", () => {
        openBookingDetailsModal(booking, card);
    });
}

function openBookingDetailsModal(booking, cardElement) {
    const modal = document.getElementById("booking-details-modal");
    const orderNumberElement = document.getElementById("order-number");

    orderNumberElement.textContent = `Order Number: #${booking.OrderNumber}`;

    document.getElementById("modal-booking-date").textContent = getDate(booking.bookingDate);
    document.getElementById("modal-destination").textContent = booking.vacationId.destination;
    document.getElementById("modal-description").textContent = booking.vacationId.description;
    document.getElementById("modal-start-date").textContent = getDate(booking.vacationId.startDate);
    document.getElementById("modal-end-date").textContent = getDate(booking.vacationId.endDate);
    document.getElementById("modal-group").textContent = booking.vacationId.groupOf;
    document.getElementById("modal-type").textContent = booking.vacationId.vacationType;
    document.getElementById("modal-company").textContent = booking.vacationId.companyName.company || '';
    document.getElementById("modal-category").textContent = booking.vacationId.tripCategory.category || '';
    document.getElementById("modal-rating").textContent = booking.vacationId.rating;
    document.getElementById("modal-passengers").textContent = booking.Passengers;
    document.getElementById("modal-price").textContent = `${booking.vacationId.price}$`;

    modal.style.display = "block";

    document.querySelectorAll(".card").forEach(card => card.classList.remove("active"));
    cardElement.classList.add("active");
}

function closeBookingDetailsModal() {
    const modal = document.getElementById("booking-details-modal");
    modal.style.display = "none";

    document.querySelectorAll(".card").forEach(card => card.classList.remove("active"));
}

const closeButton = document.querySelector(".close-button");
closeButton.addEventListener("click", closeBookingDetailsModal);

window.addEventListener("click", (event) => {
    const modal = document.getElementById("booking-details-modal");
    if (event.target === modal) {
        closeBookingDetailsModal();
    }
});

function getDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function calculateDaysDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
}
