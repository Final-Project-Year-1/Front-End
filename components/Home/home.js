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

// 
// end of menu

//top rated vacations
const topRatedVacationsUrl = "http://localhost:3000/api/top-rated-vacations";
const getVacationImg = "http://localhost:3000/api/vacations/images/";

document.addEventListener("DOMContentLoaded", async function () {
  try{
    const response = await axios.get(topRatedVacationsUrl);
    const vacations = response.data;
    vacations.slice(0, 4).forEach((vacation) => createVacationCard(vacation));
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
  console.log(vacation);

  const vacationCard = document.createElement("div");
  vacationCard.classList.add("card-vacations");

  const vacationImg = document.createElement("img");
  vacationImg.classList.add("vacation-image");
  const imgSrc = await fetchVacationImg(vacation);
  if (imgSrc) {
    vacationImg.src = imgSrc; 
  } else {
    vacationImg.src = ""; 
    vacationImg.alt = "Image not available"; 
  }

  vacationCard.appendChild(vacationImg);
  
  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("vacation-details");

  const descriptionDiv = document.createElement("span");
  descriptionDiv.classList.add("description");
  descriptionDiv.innerHTML = `${vacation.description}`;
  detailsDiv.appendChild(descriptionDiv);

  const destinationDiv = document.createElement("button");
  destinationDiv.classList.add("destination");
  destinationDiv.innerHTML = `${vacation.destination}`;
  detailsDiv.appendChild(destinationDiv);

  const ratingDiv = document.createElement("span");
  ratingDiv.classList.add("rating");
  ratingDiv.innerHTML = `${vacation.rating}/10`;
  detailsDiv.appendChild(ratingDiv);

  vacationCard.appendChild(detailsDiv);
  const cardsSection = document.getElementById("cards"); // Correct method
  if (cardsSection) {
    cardsSection.appendChild(vacationCard);
  } else {
    console.error("Element with id 'cards' not found.");
  }
}

//
// end of fetching vacations

const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const prevButton = document.getElementById("prev-slide");
const nextButton = document.getElementById("next-slide");

let currentIndex = 0;
const slidesToShow = 4;
const totalSlides = slides.length;
const slideWidth = slides[0].getBoundingClientRect().width;

function updateSlider() {
  const offset = -currentIndex * slideWidth;
  slider.style.transform = `translateX(${offset}px)`;
  prevButton.style.display = currentIndex > 0 ? "block" : "none";
  nextButton.style.display =
    currentIndex < totalSlides - slidesToShow ? "block" : "none";
}

prevButton.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
});

nextButton.addEventListener("click", () => {
  if (currentIndex < totalSlides - slidesToShow) {
    currentIndex++;
    updateSlider();
  }
});

updateSlider();

// document.addEventListener("DOMContentLoaded", () => {
//   console.log("Attempting to fetch JSON data");

//   fetch("home.json")
//     .then((response) => {
//       console.log("Fetch response received");
//       return response.json();
//     })
//     .then((data) => {
//       console.log("JSON data parsed:", data); 
//       const topVacationsContainer = document.querySelector(".cards");
//       topVacationsContainer.innerHTML = "";

//       // Sort the data by rating in descending order and take the top 4
//       const topVacations = data.sort((a, b) => b.rating - a.rating).slice(0, 4);

//       console.log("Sorted data:", topVacations); 
//       topVacations.forEach((vacation) => {
//         const vacationCard = createVacation(vacation);
//         topVacationsContainer.appendChild(vacationCard);
//       });
//     })
//     .catch((error) => console.error("Error fetching vacation data:", error));
// });


