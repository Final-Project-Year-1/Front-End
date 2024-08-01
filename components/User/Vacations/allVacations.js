const getAllVacationsUrl = "http://localhost:3000/api/Allvacations";
window.authVerificationAdjustments();

//Auth
if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
  $(".logout").show();
  $(".login").hide();
  $(".previous-orders").show();
}

const $logoutButton = $("#logout");
$logoutButton.on("click", function() {
  localStorage.setItem("token", "");
});

let vacations = [];

const fetchCountries = async () => {
  try{

    const tripCategory = localStorage.getItem("tripCategory");
    const response = await axios.get(getAllVacationsUrl);
    vacations = response.data;

    vacations.forEach((vacation) => {
      if(tripCategory === '')
        createVacationCard(vacation);
      else if (tripCategory === vacation?.tripCategory?.category)
        createVacationCard(vacation);
    });

  } catch (error) {
    console.error("Error fetching data:", error);
  } 
}

// $(window).on("load", function() {
//   const token = localStorage.getItem("token");
//   if (token) {
//     window.interceptorsService.setToken(token);
//   }
// });
fetchCountries();

async function createVacationCard(vacation) {
  const $cardsContainer = $("#cards-container");

  const $card = $("<div>").addClass("card");

  const $cardHeader = $("<div>").addClass("card-header");

  const $vacationImg = $("<img>").addClass("vacation-image");
  const imgSrc = await window.fetchVacationImg(vacation);
  if (imgSrc) {
    $vacationImg.attr("src", imgSrc).css("cursor", "pointer");

    const $link = $("<a>").attr("href", `/components/vacationPage/vacationPage.html?id=${vacation._id}`).append($vacationImg);
    $cardHeader.append($link);
  } else {
    $vacationImg.attr("alt", "Image not available");
    $cardHeader.append($vacationImg);
  }

  $card.append($cardHeader);

  const $cardBody = $("<div>").addClass("card-body");

  const $title = $("<div>").addClass("title");
  const $titleLink = $("<a>").attr("href", "#").text(vacation?.destination);
  $title.append($titleLink);
  $cardBody.append($title);

  const $rating = $("<div>").addClass("rating").text(`${vacation.rating} / 10`);
  $cardBody.append($rating);

  const $info = $("<div>").addClass("info").html(`
     <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-calendar" viewBox="0 0 16 16">
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
     </svg> ${window.getDate(vacation?.startDate)} - ${window.getDate(vacation?.endDate)} ·
    <br/>
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" class="bi bi-airplane" viewBox="0 0 16 16">
          <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849m.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1s-.458.158-.678.599"/>
    </svg> · ${window.calculateDaysDifference(vacation?.startDate,vacation?.endDate)} days ·
    <br/>
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" class="bi bi-globe-asia-australia" viewBox="0 0 16 16">
          <path d="m10.495 6.92 1.278-.619a.483.483 0 0 0 .126-.782c-.252-.244-.682-.139-.932.107-.23.226-.513.373-.816.53l-.102.054c-.338.178-.264.626.1.736a.48.48 0 0 0 .346-.027ZM7.741 9.808V9.78a.413.413 0 1 1 .783.183l-.22.443a.6.6 0 0 1-.12.167l-.193.185a.36.36 0 1 1-.5-.516l.112-.108a.45.45 0 0 0 .138-.326M5.672 12.5l.482.233A.386.386 0 1 0 6.32 12h-.416a.7.7 0 0 1-.419-.139l-.277-.206a.302.302 0 1 0-.298.52z"/>
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1.612 10.867l.756-1.288a1 1 0 0 1 1.545-.225l1.074 1.005a.986.986 0 0 0 1.36-.011l.038-.037a.88.88 0 0 0 .26-.755c-.075-.548.37-1.033.92-1.099.728-.086 1.587-.324 1.728-.957.086-.386-.114-.83-.361-1.2-.207-.312 0-.8.374-.8.123 0 .24-.055.318-.15l.393-.474c.196-.237.491-.368.797-.403.554-.064 1.407-.277 1.583-.973.098-.391-.192-.634-.484-.88-.254-.212-.51-.426-.515-.741a7 7 0 0 1 3.425 7.692 1 1 0 0 0-.087-.063l-.316-.204a1 1 0 0 0-.977-.06l-.169.082a1 1 0 0 1-.741.051l-1.021-.329A1 1 0 0 0 11.205 9h-.165a1 1 0 0 0-.945.674l-.172.499a1 1 0 0 1-.404.514l-.802.518a1 1 0 0 0-.458.84v.455a1 1 0 0 0 1 1h.257a1 1 0 0 1 .542.16l.762.49a1 1 0 0 0 .283.126 7 7 0 0 1-9.49-3.409Z"/>
    </svg> ${vacation?.companyName.company} ·
    <br/>
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" class="bi bi-suitcase-lg-fill" viewBox="0 0 16 16">
      <path d="M7 0a2 2 0 0 0-2 2H1.5A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14H2a.5.5 0 0 0 1 0h10a.5.5 0 0 0 1 0h.5a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2H11a2 2 0 0 0-2-2zM6 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1zM3 13V3h1v10zm9 0V3h1v10z"/>
    </svg> ${vacation?.vacationType} ·
  `);
  $cardBody.append($info);

  const $description = $("<p>").addClass("description").text(vacation?.description);
  $cardBody.append($description);

  $card.append($cardBody);

  const $cardFooter = $("<div>").addClass("card-footer");

  const $price = $("<div>").addClass("price");
  const $newPrice = $("<div>").addClass("new-price").html(`<span id="new">${vacation.price}$<br><div class="per">per person</div></span>`);
  $price.append($newPrice);

  $cardFooter.append($price);
  $card.append($cardFooter);

  $cardsContainer.append($card);
}

const $startInput = $("#start");
const $endInput = $("#end");

const startPicker = flatpickr($startInput[0], {
  dateFormat: "Y-m-d",
  onChange: function (selectedDates, dateStr, instance) {
    endPicker.set("minDate", dateStr);
  },
});
const endPicker = flatpickr($endInput[0]);


//Vacation Search Query ---------------------------------------------------------------------------------------------------
const countriesListUrl = "http://localhost:3000/api/vacations/destinations/countries/";

const fetchCountriesList = async () => {
  try {
    const response = await axios.get(countriesListUrl);
    return response.data.destinations;
  }
  catch(error) {
    console.error("Error fetching countries list:", error);
    return [];
  }
}

const $inputDestination = $("#destination");
const $dropdownDestination = $("#destination-dropdown");

let vacationSearchQueryDestination;
let vacationSearchQueryMonth;
let vacationSearchQueryNumOfPeople;

function populateDropdown(dropdown, destinations, query) {
  dropdown.empty(); 
  const filteredDestinations = destinations.filter(destination =>
    destination.toLowerCase().includes(query.toLowerCase())
  );
  filteredDestinations.forEach(destination => {
    const $option = $("<div>")
      .addClass("dropdown-item")
      .text(destination)
      .on("click", () => {
        $inputDestination.val(destination);
        vacationSearchQueryDestination = $inputDestination.val();
        dropdown.hide(); 
        validateForm();
      });
    dropdown.append($option);
  });
}

function setupInputListener(input, destinations) {
  input.on("input", () => {
    const query = input.val();
    if (query) {
      $dropdownDestination.show();
      populateDropdown($dropdownDestination, destinations, query);
    } else {
      $dropdownDestination.hide(); 
    }
  });
}

function setupClickOutsideListener(dropdown) {
  $(document).on("click", (event) => {
    if (!$(event.target).closest(".menu-item").length) {
      dropdown.hide(); 
    }
  });
}

async function initialize() {
  const destinations = await fetchCountriesList();
  setupInputListener($inputDestination, destinations);
  setupClickOutsideListener($dropdownDestination);
}

initialize();
// end of drop down countries list

// get month
function extractMonth(inputElement) {
  const date = new Date($(inputElement).val());
  if (!isNaN(date)) {
    return date.getMonth() + 1;
  }
  return null;
}

$("#start").on("change", function() {
  vacationSearchQueryMonth = extractMonth(this);
  validateForm();
});

//get number of people
const $numOfPeople = $("#num-of-people");
const $searchFormButton = $("#searchFormButton");
const $searchForm = $("#searchForm");

function validateForm() {
  if (vacationSearchQueryDestination && vacationSearchQueryMonth && vacationSearchQueryNumOfPeople) {
    $searchFormButton.prop("disabled", false);
  } else {
    $searchFormButton.prop("disabled", true);
  }
}

$searchFormButton.prop("disabled", true);

$numOfPeople.on("change", function() {
  vacationSearchQueryNumOfPeople = $(this).val();
  validateForm();
});

$searchFormButton.on("click", async (event) => {
  event.preventDefault();

  console.log("hello")
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
      displayVacations([]); 
    } else {
      console.error("Error searching vacations:", error);
    }
  }
});
//-------------------------------------------------------------------------------------------------------------------------
let currentCategory = "All";
let currentDuration = "All";
let currentPrice = "All";
let currentAccommodationTypes = [];

const displayVacations = (filteredVacations) => {
  const $vacationCards = $("#cards-container");
  $vacationCards.empty(); 

  if (filteredVacations.length === 0) {
    const $message = $("<div>").addClass("no-vacations-message").text("Sorry, no vacations found...");
    $vacationCards.append($message);
  } else {
    filteredVacations.forEach(vacation => createVacationCard(vacation));
  }
};

const filterVacations = (category) => {
  currentCategory = category;
  applyFilters();
};

const filterVacationsByDuration = (duration) => {
  currentDuration = duration;
  applyFilters();
};

const filterVacationsByPrice = (price) => {
  currentPrice = price;
  applyFilters();
};

const filterVacationsByAccommodationType = () => {
  currentAccommodationTypes = $(".accommodationType input:checked").map(function() {
    return $(this).data("type");
  }).get();
  applyFilters();
};

const applyFilters = () => {
  let filteredVacations = vacations;

  // Filter by category
  if (currentCategory !== "All") {
    filteredVacations = filteredVacations.filter(
      (vacation) => vacation?.tripCategory?.category === currentCategory
    );
  }

  if(currentCategory === "All"){
    localStorage.setItem("tripCategory", '');
  }

  // Filter by duration
  switch (currentDuration) {
    case "less-than-week":
      filteredVacations = filteredVacations.filter(
        (vacation) =>
          window.calculateDaysDifference(vacation.startDate, vacation.endDate) <= 7
      );
      break;
    case "over-week":
      filteredVacations = filteredVacations.filter(
        (vacation) =>
          window.calculateDaysDifference(vacation.startDate, vacation.endDate) > 7
      );
      break;
    case "over-two-weeks":
      filteredVacations = filteredVacations.filter(
        (vacation) =>
          window.calculateDaysDifference(vacation.startDate, vacation.endDate) > 14
      );
      break;
    case "over-three-weeks":
      filteredVacations = filteredVacations.filter(
        (vacation) =>
          window.calculateDaysDifference(vacation.startDate, vacation.endDate) > 21
      );
      break;
    case "over-month":
      filteredVacations = filteredVacations.filter(
        (vacation) =>
          window.calculateDaysDifference(vacation.startDate, vacation.endDate) > 30
      );
      break;
  }

  // Filter by price
  switch (currentPrice) {
    case "under-1000":
      filteredVacations = filteredVacations.filter(
        (vacation) => vacation.price < 1000
      );
      break;
    case "under-2000":
      filteredVacations = filteredVacations.filter(
        (vacation) => vacation.price < 2000
      );
      break;
    case "under-3000":
      filteredVacations = filteredVacations.filter(
        (vacation) => vacation.price < 3000
      );
      break;
    case "under-4000":
      filteredVacations = filteredVacations.filter(
        (vacation) => vacation.price < 4000
      );
      break;
    case "under-5000":
      filteredVacations = filteredVacations.filter(
        (vacation) => vacation.price < 5000
      );
      break;
  }

  // Filter by accommodation type
  if (currentAccommodationTypes.length > 0) {
    filteredVacations = filteredVacations.filter((vacation) =>
      currentAccommodationTypes.includes(vacation.vacationType)
    );
  }

  displayVacations(filteredVacations);
};

$(".number-btn-category").on("click", function() {
  const category = $(this).data("category");
  filterVacations(category);
});

$(".number-btn-duration").on("click", function() {
  const duration = $(this).data("duration");
  filterVacationsByDuration(duration);
});

$(".number-btn-price").on("click", function() {
  const price = $(this).data("price");
  filterVacationsByPrice(price);
});

$(".accommodationType input").on("change", function() {
  filterVacationsByAccommodationType();
});

$(".accommodationType .action-btn").on("click", function() {
  $(".accommodationType input[type='checkbox']").prop("checked", false);
  currentAccommodationTypes = [];
  applyFilters();
});
