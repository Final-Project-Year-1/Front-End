const getAllVacationsUrl = "http://localhost:3000/api/vacations";
const getVacationImg = "http://localhost:3000/api/vacations/images/";

//static delete later
// document.addEventListener('DOMContentLoaded', function() {
//     fetch('/vacations')
//         .then(response => response.json())
//         .then(data => createCards(data));
// });

//Auth
if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
  document.querySelector(".logout").style.display = "block";
  document.querySelector(".login").style.display = "none";
}

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () =>{
  localStorage.setItem("token", "");
  window.location.href = "../Auth/Login/login.html";
});

let vacations = [];

document.addEventListener("DOMContentLoaded", async function () {
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
});

const fetchVacationImg = async (vacation) => {
  try {
      const response = await axios.get(getVacationImg + vacation?.imageName , { responseType: 'blob' });
      const imageUrl = URL.createObjectURL(response.data);
      return imageUrl;
  } catch (error) {
      console.error("Error fetching image:", error);
      return null;
  }
}

async function createVacationCard(vacation) {
  const cardsContainer = document.getElementById("cards-container");

  const card = document.createElement("div");
  card.classList.add("card");

  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");

  const imageSlider = document.createElement("div");
  imageSlider.classList.add("image-slider");

  //Im changing here for now so it will work with one Img -- shir
  const vacationImg = document.createElement("img");
  vacationImg.classList.add("vacation-image");
  const imgSrc = await fetchVacationImg(vacation);
  if (imgSrc) {
    vacationImg.src = imgSrc; 
  } else {
    vacationImg.alt = "Image not available"; 
  }
  cardHeader.appendChild(vacationImg);

//   vacation.images.forEach((image, index) => {
//     const img = document.createElement("img");
//     img.src = image;
//     img.classList.add("slide-image");
//     if (index !== 0) img.style.display = "none";
//     imageSlider.appendChild(img);
//   });

  // const prevBtn = document.createElement("button");
  // prevBtn.classList.add("prev-btn");
  // prevBtn.textContent = "❮";

  // const nextBtn = document.createElement("button");
  // nextBtn.classList.add("next-btn");
  // nextBtn.textContent = "❯";

  // imageSlider.appendChild(prevBtn);
  // imageSlider.appendChild(nextBtn);
  // cardHeader.appendChild(imageSlider);
  card.appendChild(cardHeader);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const title = document.createElement("div");
  title.classList.add("title");
  const titleLink = document.createElement("a");
  titleLink.href = "#";
  titleLink.textContent = vacation?.destination;
  title.appendChild(titleLink);
  cardBody.appendChild(title);

  const rating = document.createElement("div");
  rating.classList.add("rating");
  rating.textContent = `${vacation.rating} / 10` ; 
  cardBody.appendChild(rating);

  const info = document.createElement("div");
  info.classList.add("info");
  info.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-calendar" viewBox="0 0 16 16">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
            </svg> ${getDate(vacation?.startDate)} - ${getDate(
    vacation?.endDate
  )} ·
            <br/>
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" class="bi bi-airplane" viewBox="0 0 16 16">
                <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849m.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1s-.458.158-.678.599"/>
            </svg> · ${calculateDaysDifference(
              vacation?.startDate,
              vacation?.endDate
            )} days ·
            <br/>
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" class="bi bi-globe-asia-australia" viewBox="0 0 16 16">
                <path d="m10.495 6.92 1.278-.619a.483.483 0 0 0 .126-.782c-.252-.244-.682-.139-.932.107-.23.226-.513.373-.816.53l-.102.054c-.338.178-.264.626.1.736a.48.48 0 0 0 .346-.027ZM7.741 9.808V9.78a.413.413 0 1 1 .783.183l-.22.443a.6.6 0 0 1-.12.167l-.193.185a.36.36 0 1 1-.5-.516l.112-.108a.45.45 0 0 0 .138-.326M5.672 12.5l.482.233A.386.386 0 1 0 6.32 12h-.416a.7.7 0 0 1-.419-.139l-.277-.206a.302.302 0 1 0-.298.52z"/>
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1.612 10.867l.756-1.288a1 1 0 0 1 1.545-.225l1.074 1.005a.986.986 0 0 0 1.36-.011l.038-.037a.88.88 0 0 0 .26-.755c-.075-.548.37-1.033.92-1.099.728-.086 1.587-.324 1.728-.957.086-.386-.114-.83-.361-1.2-.207-.312 0-.8.374-.8.123 0 .24-.055.318-.15l.393-.474c.196-.237.491-.368.797-.403.554-.064 1.407-.277 1.583-.973.098-.391-.192-.634-.484-.88-.254-.212-.51-.426-.515-.741a7 7 0 0 1 3.425 7.692 1 1 0 0 0-.087-.063l-.316-.204a1 1 0 0 0-.977-.06l-.169.082a1 1 0 0 1-.741.051l-1.021-.329A1 1 0 0 0 11.205 9h-.165a1 1 0 0 0-.945.674l-.172.499a1 1 0 0 1-.404.514l-.802.518a1 1 0 0 0-.458.84v.455a1 1 0 0 0 1 1h.257a1 1 0 0 1 .542.16l.762.49a1 1 0 0 0 .283.126 7 7 0 0 1-9.49-3.409Z"/>
            </svg> ${vacation?.companyName.company} ·
            <br/>
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" class="bi bi-suitcase-lg-fill" viewBox="0 0 16 16">
                <path d="M7 0a2 2 0 0 0-2 2H1.5A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14H2a.5.5 0 0 0 1 0h10a.5.5 0 0 0 1 0h.5a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2H11a2 2 0 0 0-2-2zM6 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1zM3 13V3h1v10zm9 0V3h1v10z"/>
            </svg> ${vacation?.vacationType} ·
        `;
  cardBody.appendChild(info);

  const description = document.createElement("p");
  description.classList.add("description");
  description.textContent = vacation?.description;
  cardBody.appendChild(description);

  card.appendChild(cardBody);

  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer");

  const price = document.createElement("div");
  price.classList.add("price");

  const newPrice = document.createElement("div");
  newPrice.classList.add("new-price");
  newPrice.innerHTML = `<span id="new">${vacation.price}$<br><div class="per">per person</div></span>`;
  price.appendChild(newPrice);

  cardFooter.appendChild(price);
  card.appendChild(cardFooter);

  cardsContainer.appendChild(card);

  // Add image slider functionality for each card
  // const sliderImages = card.querySelectorAll(".slide-image");
  // let currentImage = 0;

//   function showImage(index) {
//     sliderImages.forEach((img) => {
//       img.style.display = "none";
//     });
//     sliderImages[index].style.display = "block";
//   }

//   card.querySelector(".prev-btn").addEventListener("click", () => {
//     currentImage =
//       currentImage > 0 ? currentImage - 1 : sliderImages.length - 1;
//     showImage(currentImage);
//   });

//   card.querySelector(".next-btn").addEventListener("click", () => {
//     currentImage =
//       currentImage < sliderImages.length - 1 ? currentImage + 1 : 0;
//     showImage(currentImage);
//   });

//   showImage(currentImage);
}


flatpickr("#start", {
  // Configuration options
});

flatpickr("#end", {
  // Configuration options
});

const getDate = (dateString) => {
    const date = new Date(dateString);
  
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
  
    const normalDateString = `${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year}`;
  
    return normalDateString;
};

const calculateDaysDifference = (startDateString, endDateString) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
  
    const difference = endDate.getTime() - startDate.getTime();
    const daysDifference = difference / (1000 * 3600 * 24);
    return Math.round(daysDifference);
};

//Vacation Search Query
const countriesListUrl = "http://localhost:3000/api/vacations/destinations/countries/";

const fetchCountriesList = async () => {
  try {
    const response = await axios.get(countriesListUrl);
    const destinations = response.data.destinations;
    return destinations;
  }
  catch(error) {
    console.error("Error fetching countries list:", error);
    return [];
  }
}
fetchCountriesList();

const input = document.getElementById("destination");
const dropdown = document.getElementById("destination-dropdown");

function populateDropdown(dropdown, destinations, query) {
  dropdown.innerHTML = ""; // Clear previous options
  const filteredDestinations = destinations.filter(destination =>
    destination.toLowerCase().includes(query.toLowerCase())
  );
  filteredDestinations.forEach(destination => {
    const option = document.createElement("div");
    option.className = "dropdown-item";
    option.textContent = destination;
    option.addEventListener("click", () => {
      document.getElementById("destination").value = destination;
      dropdown.style.display = "none"; // Hide dropdown after selection
    });
    dropdown.appendChild(option);
  });
}

function setupInputListener(input, dropdown, destinations) {
  input.addEventListener("input", () => {
    const query = input.value;
    if (query) {
      dropdown.style.display = "block"; // Show dropdown
      populateDropdown(dropdown, destinations, query);
    } else {
      dropdown.style.display = "none"; // Hide dropdown if input is empty
    }
  });
}

function setupClickOutsideListener(dropdown) {
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".menu-item")) {
      dropdown.style.display = "none"; // Hide dropdown if clicked outside
    }
  });
}

async function initialize() {
  const getAllDestinationsUrl = "your-api-url"; // Replace with your actual URL
  const destinations = await fetchCountriesList(getAllDestinationsUrl);

  const input = document.getElementById("destination");
  const dropdown = document.getElementById("destination-dropdown");

  setupInputListener(input, dropdown, destinations);
  setupClickOutsideListener(dropdown);
}

// Initialize the script when the document is ready
initialize();



//filtering section
let currentCategory = "All";
let currentDuration = "All";
let currentPrice = "All";
let currentAccommodationTypes = [];

const  displayVacations = (filteredVacations) => {
  const vacationCards = document.getElementById("cards-container");
  vacationCards.innerHTML = ""; 

  if (filteredVacations.length === 0) {
    const message = document.createElement("div");
    message.className = "no-vacations-message";
    message.textContent = "Sorry, no vacations found...";
    vacationCards.appendChild(message);
  } else {
    filteredVacations.forEach(vacation => createVacationCard(vacation));
  }
}

const filterVacations = (category) => {
  currentCategory = category;
  applyFilters();
}

const filterVacationsByDuration = (duration) => {
  currentDuration = duration;
  applyFilters();
}

const filterVacationsByPrice = (price) => {
  currentPrice = price;
  applyFilters();
}

const filterVacationsByAccommodationType = () => {
  currentAccommodationTypes = Array.from(document.querySelectorAll('.accommodationType input:checked')).map(input => input.getAttribute('data-type'));
  applyFilters();
}

const applyFilters = () => {
  let filteredVacations = vacations;

  // Filter by category
  if (currentCategory !== "All") {
    filteredVacations = filteredVacations.filter(
      (vacation) => vacation?.tripCategory?.category === currentCategory
    );
  }

  // Filter by duration
  switch (currentDuration) {
    case "less-than-week":
      filteredVacations = filteredVacations.filter(
        (vacation) =>
          calculateDaysDifference(vacation.startDate, vacation.endDate) <= 7
      );
      break;
    case "over-week":
      filteredVacations = filteredVacations.filter(
        (vacation) =>
          calculateDaysDifference(vacation.startDate, vacation.endDate) > 7
      );
      break;
    case "over-two-weeks":
      filteredVacations = filteredVacations.filter(
        (vacation) =>
          calculateDaysDifference(vacation.startDate, vacation.endDate) > 14
      );
      break;
    case "over-three-weeks":
      filteredVacations = filteredVacations.filter(
        (vacation) =>
          calculateDaysDifference(vacation.startDate, vacation.endDate) > 21
      );
      break;
    case "over-month":
      filteredVacations = filteredVacations.filter(
        (vacation) =>
          calculateDaysDifference(vacation.startDate, vacation.endDate) > 30
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
}

document.querySelectorAll(".number-btn-category").forEach(button => {
  button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");
      filterVacations(category);
  });
});

document.querySelectorAll(".number-btn-duration").forEach(button => {
  button.addEventListener("click", () => {
    const duration = button.getAttribute("data-duration");
    filterVacationsByDuration(duration);
  });
});

document.querySelectorAll(".number-btn-price").forEach(button => {
  button.addEventListener("click", () => {
    const price = button.getAttribute("data-price");
    filterVacationsByPrice(price);
  });
});

document.querySelectorAll(".accommodationType input").forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    filterVacationsByAccommodationType();
  });
});

document.querySelector('.accommodationType .action-btn').addEventListener('click', () => {
  document.querySelectorAll('.accommodationType input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  currentAccommodationTypes = [];
  applyFilters();
});