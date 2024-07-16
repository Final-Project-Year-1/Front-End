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

document.addEventListener("DOMContentLoaded", () => {
  console.log("Attempting to fetch JSON data");

  fetch("home.json")
    .then((response) => {
      console.log("Fetch response received");
      return response.json();
    })
    .then((data) => {
      console.log("JSON data parsed:", data); // לבדוק את הנתונים המתקבלים
      const topVacationsContainer = document.querySelector(".cards");
      topVacationsContainer.innerHTML = "";

      // Sort the data by rating in descending order and take the top 4
      const topVacations = data.sort((a, b) => b.rating - a.rating).slice(0, 4);

      console.log("Sorted data:", topVacations); // לבדוק את הנתונים אחרי המיון
      topVacations.forEach((vacation) => {
        const vacationCard = createVacation(vacation);
        topVacationsContainer.appendChild(vacationCard);
      });
    })
    .catch((error) => console.error("Error fetching vacation data:", error));
});

function createVacation(vacation) {
  const vacationCard = document.createElement("div");
  vacationCard.classList.add("card-vacations");
  vacationCard.style.fontSize = "15px";
  vacationCard.style.width = "300px";

  const vacationButton = document.createElement("button");
  vacationButton.classList.add("no-back");

  const vacationImg = document.createElement("img");
  vacationImg.src = vacation.image;
  vacationImg.style.width = "100%";
  vacationImg.style.height = "auto";
  vacationImg.style.borderRadius = "10px";

  vacationButton.appendChild(vacationImg);
  vacationCard.appendChild(vacationButton);

  const descriptionDiv = document.createElement("div");
  descriptionDiv.classList.add("tmp");
  descriptionDiv.style.width = "100%";
  descriptionDiv.style.marginLeft = "0";
  descriptionDiv.innerHTML = `<span class="space">${vacation.description}<br><br></span>`;
  vacationCard.appendChild(descriptionDiv);

  const locationDiv = document.createElement("div");
  locationDiv.classList.add("tmp");
  locationDiv.style.width = "100%";
  locationDiv.style.marginLeft = "0";
  locationDiv.innerHTML = `<span class="space space2" style="text-decoration: underline; padding-top: 10px; font-weight: bold; font-size: 18px;"><a href="">${vacation.location}</a><br><br></span>`;
  vacationCard.appendChild(locationDiv);

  const ratingDiv = document.createElement("div");
  ratingDiv.classList.add("tmp");
  ratingDiv.style.width = "100%";
  ratingDiv.style.marginLeft = "0";
  ratingDiv.innerHTML = `<span class="space space3" style="font-size: 14px;">${vacation.rating}/10 Exceptional (${vacation.reviews} reviews)</span>`;
  vacationCard.appendChild(ratingDiv);

  return vacationCard;
}
document.querySelector(".all-vacations").addEventListener("click", function () {
  window.location.href = "vacations.html";
});
