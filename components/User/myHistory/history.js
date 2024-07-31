const userObj = window.getUserFromToken();
window.authVerificationAdjustments();

const fetchBooking = async () => {
  try {
    const getAllBookingsByIdUrl = `http://localhost:3000/api/bookings/bookings-by-user/${userObj?.user?._id}`;
    const response = await $.get(getAllBookingsByIdUrl);
    const bookings = response;
    categorizeBookings(bookings);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

fetchBooking();

const createVacationCard = (vacation, imageUrl) => {
  const card = $("<div>").addClass("vacation-card");

  const image = $("<img>")
    .attr("src", imageUrl || "default-image-url.jpg")
    .attr("alt", vacation.name);
  card.append(image);

  const title = $("<h3>").text(vacation.name);
  card.append(title);

  const description = $("<p>").text(vacation.description);
  card.append(description);

  $("#vacation-container").append(card);
};

function categorizeBookings(bookings) {
  const now = new Date();

  const futureTripsSection = $("#future-trips");
  const futureTripsContainer = $("#future-trips-container");
  const pastTripsSection = $("#past-trips");
  const pastTripsContainer = $("#history-container");
  const cancelledTripsSection = $("#cancelled-trips");
  const cancelledTripsContainer = $("#cancelled-trips-container");
  const noTripsContainer = $("#no-trips");
  const additionalTripsContainer = $("#additional-trips");

  futureTripsContainer.empty();
  pastTripsContainer.empty();
  cancelledTripsContainer.empty();

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

    if (booking.status === "cancelled") {
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
    noTripsContainer.hide();
    additionalTripsContainer.show();
    futureTripsSection.show();
  } else {
    noTripsContainer.show();
    additionalTripsContainer.hide();
    futureTripsSection.hide();
  }

  pastTripsSection.toggle(hasPastTrips);
  cancelledTripsSection.toggle(hasCancelledTrips);
}

function startSearching() {
  window.location.href = "../Vacations/allVacations.html";
}

async function createBookingCard(booking, container) {
  const card = $("<a>").addClass("card").attr("href", "javascript:void(0);");

  const cardHeader = $("<div>").addClass("card-header");

  const bookingImg = $("<img>").addClass("booking-image");

  // Fetch and set the image URL for the booking
  const imageUrl = await window.fetchVacationImgWithName(
    booking.vacationId.imageName
  );
  bookingImg.attr("src", imageUrl || "default-image-url.jpg");
  cardHeader.append(bookingImg);
  card.append(cardHeader);

  const cardBody = $("<div>").addClass("card-body");

  const title = $("<div>")
    .addClass("title")
    .text(booking.vacationId.destination);
  cardBody.append(title);

  const now = new Date();
  const startDate = new Date(booking.vacationId.startDate);
  const endDate = new Date(booking.vacationId.endDate);

  let statusBadge;
  if (startDate <= now && endDate >= now && booking.status === "confirmed") {
    statusBadge = $("<span>").addClass("active-badge-inline").text("Active");
  } else if (booking.status === "pending") {
    statusBadge = $("<span>").addClass("pending-badge-inline").text("Pending");
  } else if (booking.status === "cancelled") {
    statusBadge = $("<span>")
      .addClass("cancelled-badge-inline")
      .text("Cancelled");
  } else if (startDate > now) {
    statusBadge = $("<span>")
      .addClass("status-badge-inline")
      .text(booking.status.charAt(0).toUpperCase() + booking.status.slice(1));
  }

  if (statusBadge) {
    title.append(statusBadge);
  }

  const info = $("<div>").addClass("info").html(`${window.getDate(
    booking.vacationId.startDate
  )} - ${window.getDate(booking.vacationId.endDate)} ·
                ${window.calculateDaysDifference(
                  booking.vacationId.startDate,
                  booking.vacationId.endDate
                )} days`);
  cardBody.append(info);

  card.append(cardBody);
  container.append(card);

  card.on("click", () => {
    openBookingDetailsModal(booking, card);
  });
}

function openBookingDetailsModal(booking, cardElement) {
  const modal = $("#booking-details-modal");
  $("#order-number").text(`Order Number: #${booking.OrderNumber}`);

  $("#modal-booking-date").text(window.getDate(booking.bookingDate));
  $("#modal-destination").text(booking.vacationId.destination);
  $("#modal-description").text(booking.vacationId.description);
  $("#modal-start-date").text(window.getDate(booking.vacationId.startDate));
  $("#modal-end-date").text(window.getDate(booking.vacationId.endDate));
  $("#modal-group").text(booking.vacationId.groupOf);
  $("#modal-type").text(booking.vacationId.vacationType);
  $("#modal-company").text(booking.vacationId.companyName.company || "");
  $("#modal-category").text(booking.vacationId.tripCategory.category || "");
  $("#modal-rating").text(booking.vacationId.rating);
  $("#modal-passengers").text(booking.Passengers);
  $("#modal-price").text(`${booking.vacationId.price}$`);

  modal.show();

  $(".card").removeClass("active");
  cardElement.addClass("active");
}

function closeBookingDetailsModal() {
  const modal = $("#booking-details-modal");
  modal.hide();
  $(".card").removeClass("active");
}

$(".close-button").on("click", closeBookingDetailsModal);

$(window).on("click", (event) => {
  const modal = $("#booking-details-modal");
  if (event.target === modal[0]) {
    closeBookingDetailsModal();
  }
});
