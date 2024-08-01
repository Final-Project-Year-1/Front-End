const BookingQueryUrl = 'http://localhost:3000/api/newbooking';

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const _id = params.get('id');
if (!_id) {
    console.error('No vacation id found in URL');
}

let vacation; 

const fetchVacation = async (vacationId) => {
    const fetchVacationUrl = `http://localhost:3000/api/vacations/${vacationId}`
    try {
        const response = await axios.get(fetchVacationUrl);
        vacation = response.data;
        console.log(vacation);
        updateVacationCard(vacation);
    } catch (error) {
        console.log(error);
    }
}
fetchVacation(_id);
const userObj = window.getUserFromToken();
window.authVerificationAdjustments();

const $steps = $(".step");
const $backButton = $("#back-button");
const $nextButton = $("#next-button");
const $contentContainer = $("#content-container");
let currentStep = 0;

const updateVacationCard = (vacation) => {
  $("#destination").text(vacation.destination);
  $("#description").text(vacation.description);
  $("#start-date").text(window.getDate(vacation.startDate));
  $("#end-date").text(window.getDate(vacation.endDate));
  $("#price").text(vacation.price);
  $("#vacation-type").text(vacation.vacationType);
  $("#company-name").text(vacation.companyName?.company || "");
  $("#trip-category").text(vacation.tripCategory?.category || "");
  $("#rating").text(vacation.rating);

  const numPassengers = localStorage.getItem("numPassengers");
  document.getElementById("num-passengers").textContent = numPassengers ? numPassengers : "Not specified";
  
  window.fetchVacationImgWithName(vacation.imageName).then((imageUrl) => {
    $("#vacation-img").attr(
      "src",
      imageUrl || "https://via.placeholder.com/150"
    );
  });
//   sessionStorage.setItem("booking", JSON.stringify(booking));
  
};

// const fetchBookingsForUser = async (userId) => {
//   try {
//     const response = await axios.get(
//       `http://localhost:3000/api/bookings/bookings-by-user/${userId}?populate=true`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     return [];
//   }
// };

// const initializePage = async () => {
//   const userObj = getUserFromToken();
//   const bookings = await fetchBookingsForUser(userObj.user._id);

//   if (bookings.length > 0) {
//     const booking = bookings[0];
//     const vacation = booking.vacationId;

//     updateVacationCard(vacation);
//     $("#num-passengers").text(booking.Passengers);

//     generatePassengerFields(booking.Passengers);

//     sessionStorage.setItem("booking", JSON.stringify(booking));
//   }
// };

const initializePage = async () => {
    // קח את נתוני מספר הנוסעים מהלוקל סטורג
    const numPassengers = localStorage.getItem("numPassengers");
      
    // עדכן את פרטי החופשה בעמוד
    
    // הצג את מספר הנוסעים בעמוד
    if (numPassengers) {
      $("#num-passengers").text(numPassengers);
      generatePassengerFields(numPassengers); // הנחתי שאתה זקוק לפונקציה זו לצורך יצירת שדות נוסעים
    }
  
    // לא שומר נתוני הזמנה ב-sessionStorage
  };
  
function generatePassengerFields(numPassengers) {
  const passengerFields = $("#passenger-fields");
  passengerFields.empty();

  for (let i = 1; i <= numPassengers; i++) {
    passengerFields.append(`
        <div class="passenger-card">
                    <h3>Passenger ${i}</h3>
                    <label for="first-name-${i}">First Name:</label>
                    <input type="text" id="first-name-${i}" required pattern="[A-Za-z ]{2,}" maxlength="30"><br>
                    <span class="error-message" id="error-first-name-${i}"></span>
                    <br>
                    <label for="last-name-${i}">Last Name:</label>
                    <input type="text" id="last-name-${i}" required pattern="[A-Za-z ]{2,}" maxlength="30"><br>
                    <span class="error-message" id="error-last-name-${i}"></span>
                    <br>
                    <label for="email-${i}">Email:</label>
                    <input type="email" id="email-${i}" required placeholder="example@example.com"><br>
                    <span class="error-message" id="error-email-${i}"></span>
                    <br>
                    <label for="dob-${i}">Date of Birth:</label>
                    <input type="date" id="dob-${i}" required><br>
                    <span class="error-message" id="error-dob-${i}"></span>
                    <br>
                    <label for="passport-number-${i}">Passport Number:</label>
                    <input type="text" id="passport-number-${i}" required pattern="\\d{9}" maxlength="9"><br>
                    <span class="error-message" id="error-passport-number-${i}"></span>
                    <br>
                    <label for="passport-expiry-${i}">Passport Expiry Date:</label>
                    <input type="date" id="passport-expiry-${i}" required>
                    <span class="error-message" id="error-passport-expiry-${i}"></span>
                    <br>
        </div>
        <br>
    `);
  }

  addInputValidation();
}

function addInputValidation() {
  const $inputs = $("#content-container input[required]");
  $inputs.each(function () {
    $(this).on("input", function () {
      validateInput(this);
      toggleSubmitButton();
    });
  });
}

function validateInput(input) {
  const $input = $(input);
  const $errorMessage = $(`#error-${input.id}`);

  if (input.validity.patternMismatch) {
    $input.addClass("invalid");
    if (input.id === "card-number") {
      $errorMessage.text("Only Numbers. Card number must be 16 digits.");
    } else if (input.id === "cvv") {
      $errorMessage.text("Only Numbers. CVV must be 3 digits.");
    } else if (input.id.startsWith("passport-number")) {
      $errorMessage.text("Only Numbers. Passport number must be 9 digits.");
    } else if (
      input.id === "contact-first-name" ||
      input.id === "contact-last-name" ||
      input.id === "payment-name" ||
      input.id === "payment-surname" ||
      input.id.startsWith("first-name") ||
      input.id.startsWith("last-name")
    ) {
      if (/[^a-zA-Z ]/.test($input.val())) {
        $errorMessage.text("Only letters are allowed.");
      } else if ($input.val().replace(/\s/g, "").length < 2) {
        $errorMessage.text("Must contain at least 2 letters!");
      } else {
        $errorMessage.text("Invalid input.");
      }
    } else {
      $errorMessage.text("Invalid input.");
    }
  } else if (input.validity.valueMissing) {
    $input.addClass("invalid");
    $errorMessage.text("This field is required.");
  } else if (input.id === "card-number" && $input.val().length < 16) {
    $input.addClass("invalid");
    $errorMessage.text("Card number must be 16 digits.");
  } else if (input.id === "cvv" && $input.val().length < 3) {
    $input.addClass("invalid");
    $errorMessage.text("CVV must be 3 digits.");
  } else if (
    input.id.startsWith("passport-number") &&
    $input.val().length < 9
  ) {
    $input.addClass("invalid");
    $errorMessage.text("Passport number must be 9 digits.");
  } else if (input.type === "email" && !validateEmail($input.val())) {
    $input.addClass("invalid");
    $errorMessage.text("Invalid email address.");
  } else {
    $input.removeClass("invalid");
    $errorMessage.text("");
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validateStep(step) {
  let isValid = true;
  let $inputs;

  if (step === 0) {
    $inputs = $(
      "#order-summary input[required], #contact-card input[required]"
    );
  } else if (step === 1) {
    $inputs = $("#make-payment input[required]");
  } else {
    return true;
  }

  $inputs.each(function () {
    const $input = $(this);
    if ($input.val().trim() === "" || !$input[0].checkValidity()) {
      isValid = false;
      $input.addClass("invalid");
      validateInput(this);
    } else {
      $input.removeClass("invalid");
    }
  });

  return isValid;
}

function displayPassengerSummary() {
  const passengers = JSON.parse(sessionStorage.getItem("passengers"));
  const $passengerSummary = $("#passenger-summary");
  $passengerSummary.html(
    '<h3 class="passenger-details-title">Passengers Details</h3>'
  );
  if (passengers) {
    passengers.forEach((passenger, index) => {
      $passengerSummary.append(`
                <div class="passenger-card">
                    <h4>Passenger ${index + 1}</h4>
                    <p><strong>First Name:</strong> ${passenger.firstName}</p>
                    <p><strong>Last Name:</strong> ${passenger.lastName}</p>
                    <p><strong>Email:</strong> ${passenger.email}</p>
                    <p><strong>Date of Birth:</strong> ${window.getDate(
                      passenger.dob
                    )}</p>
                    <p><strong>Passport Number:</strong> ${
                      passenger.passportNumber
                    }</p>
                    <p><strong>Passport Expiry Date:</strong> ${window.getDate(
                      passenger.passportExpiry
                    )}</p>
                </div>
            `);
    });
  }
}

function clearPaymentFields() {
  const paymentFields = [
    "card-number",
    "expiry-date",
    "cvv",
    "payment-name",
    "payment-surname",
    "payment-email",
  ];
  paymentFields.forEach((fieldId) => {
    const $field = $(`#${fieldId}`);
    if ($field.length) {
      $field.val("");
      $field.removeClass("invalid");
      const $errorMessage = $(`#error-${fieldId}`);
      if ($errorMessage.length) {
        $errorMessage.text("");
      }
    }
  });
  toggleSubmitButton();
}

function toggleNextButton() {
  if (currentStep === 1) {
    $nextButton.prop("disabled", true).css("background-color", "gray");
  } else {
    $nextButton.prop("disabled", false).css("background-color", "");
  }
}

function toggleSubmitButton() {
  const $submitButton = $("#submit-payment");
  const $inputs = $("#make-payment input[required]");
  let allValid = true;

  $inputs.each(function () {
    const $input = $(this);
    if ($input.val().trim() === "" || $input.hasClass("invalid")) {
      allValid = false;
    }
  });

  if (allValid) {
    $submitButton.prop("disabled", false).css("background-color", "green");
  } else {
    $submitButton.prop("disabled", true).css("background-color", "gray");
  }
}

function updateNextButtonText() {
  if (currentStep === 2) {
    $nextButton
      .text("Back To Homepage")
      .off("click")
      .on("click", function () {
        window.location.href = "../../Home/home.html";
      });
  } else {
    $nextButton.text("Continue").off("click").on("click", handleNextClick);
  }
}

function handleNextClick() {
  if (validateStep(currentStep)) {
    if (currentStep < $steps.length - 1) {
      if (currentStep === 0) {
        storePassengerData();
      }
      currentStep++;
      updateSteps();
      $(window).scrollTop(0);
    }
  } else {
    alert("Please fill out all required fields correctly.");
  }
}

function toggleBackButton() {
  if (currentStep === 0) {
    $backButton.prop("disabled", true).css("background-color", "gray");
  } else {
    $backButton.prop("disabled", false).css("background-color", "");
  }

  if (currentStep === 2) {
    $backButton.prop("disabled", true).css("background-color", "gray");
  }
}

$backButton.on("click", function () {
  if (currentStep > 0) {
    currentStep--;
    updateSteps();
    $(window).scrollTop(0);
  }
});

$nextButton.on("click", handleNextClick);

function storePassengerData() {
//   const numPassengers = parseInt($("#num-passengers").text(), 10);
    const numPassengers = localStorage.getItem("numPassengers");
    console.log(numPassengers);
    const passengers = [];

  for (let i = 1; i <= numPassengers; i++) {
    const passenger = {
      firstName: $(`#first-name-${i}`).val(),
      lastName: $(`#last-name-${i}`).val(),
      email: $(`#email-${i}`).val(),
      dob: $(`#dob-${i}`).val(),
      passportNumber: $(`#passport-number-${i}`).val(),
      passportExpiry: $(`#passport-expiry-${i}`).val(),
    };
    passengers.push(passenger);
  }

  const contactDetails = {
    email: $("#contact-email").val(),
    firstName: $("#contact-first-name").val(),
    lastName: $("#contact-last-name").val(),
  };

  sessionStorage.setItem("passengers", JSON.stringify(passengers));
  sessionStorage.setItem("contactDetails", JSON.stringify(contactDetails));
}

function updateFinishSection(vacation) {
  const contactDetails = JSON.parse(sessionStorage.getItem("contactDetails"));
  $("#finish-destination").text(vacation.destination);
  $("#finish-description").text(vacation.description);
  $("#finish-start-date").text(window.getDate(vacation.startDate));
  $("#finish-end-date").text(window.getDate(vacation.endDate));
  $("#finish-price").text(vacation.price);
  $("#finish-num-passengers").text($("#num-passengers").text());
  $("#finish-vacation-type").text(vacation.vacationType);
  $("#finish-company-name").text(vacation.companyName?.company || "");
  $("#finish-trip-category").text(vacation.tripCategory?.category || "");
  $("#finish-rating").text(vacation.rating);
  $("#finish-contact-email").text(contactDetails.email);

  window.fetchVacationImgWithName(vacation.imageName).then((imageUrl) => {
    $("#finish-vacation-img").attr(
      "src",
      imageUrl || "https://via.placeholder.com/150"
    );
  });
}

function updateSteps() {
  $steps.each((index, step) => {
    $(step).toggleClass("active", index === currentStep);
    const $underline = $(step).find(".underline");
    $underline.css("width", index === currentStep ? "100%" : "0");
  });
  loadStepContent();
  if (currentStep !== 1) {
    clearPaymentFields();
  }
  toggleNextButton();
  updateNextButtonText();
  toggleBackButton();
}

function loadStepContent() {
  const $stepContents = $(".step-content");
  $stepContents.each(function (index) {
    $(this).css("display", index === currentStep ? "block" : "none");
  });

  switch (currentStep) {
    case 0:
      const booking = JSON.parse(sessionStorage.getItem("booking"));
      if (booking) {
        generatePassengerFields(booking.Passengers);
      }
      break;
    case 1:
      const $paymentForm = $("#payment-form");
      $paymentForm.off("submit").on("submit", handlePaymentSubmit);
      addInputValidation();
      toggleSubmitButton();
      break;
    case 2:
      const storedBooking = JSON.parse(sessionStorage.getItem("booking"));
    //   const vacation = storedBooking.vacationId;
      updateFinishSection(vacation);
      displayPassengerSummary();
      $("#booking-number").text(storedBooking.OrderNumber);
      $backButton.prop("disabled", true).css("background-color", "gray");
      break;
  }
}

// function handlePaymentSubmit(event) {
//   event.preventDefault();
//   if (validateStep(currentStep)) {
//     alert("Payment processed.");
//     currentStep++;
//     updateSteps();
//     $(window).scrollTop(0);
//   } else {
//     alert("Please fill out all required fields correctly.");
//   }
// }
function handlePaymentSubmit(event) {
    event.preventDefault();
    if (validateStep(currentStep)) {
        createBooking().then((booking) => {
            // עדכון השלב הבא לאחר הצלחה
            currentStep++;
            updateSteps();
            $(window).scrollTop(0);
        }).catch((error) => {
            alert('Failed to create booking. Please try again.');
        });
    } else {
        alert("Please fill out all required fields correctly.");
    }
}
const createBooking = async () => {
    const Passengers = localStorage.getItem("numPassengers");
    const vacationId = _id;
    

    const bookingData = {
        vacationId,
        userId,
        Passengers,
        status:'confirmed',
    };

    const token = localStorage.getItem('authToken'); // הנחה שהטוקן נשמר ב-localStorage

    try {
        const userObj = window.getUserFromToken();
        window.interceptorsService.setToken(userObj.token);
        const response = await axios.post(BookingQueryUrl, bookingData);
        const bookings = response.data;
        const addedBooking = response.data;
        sessionStorage.setItem("booking", JSON.stringify(addedBooking));
        return addedBooking;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};


initializePage();
updateSteps();