const getAllVacationsUrl = "http://localhost:3000/api/allVacations";
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

document.addEventListener("DOMContentLoaded", async function () {
  try{
    const response = await axios.get(getAllVacationsUrl);
    const vacations = response.data;
    vacations.forEach((vacation) => createVacationCard(vacation));
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
            </svg> ${getDate(vacation?.startDate)} - ${getDate(vacation?.endDate)} ·
            
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" class="bi bi-airplane" viewBox="0 0 16 16">
                <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849m.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1s-.458.158-.678.599"/>
            </svg> · ${calculateDaysDifference(vacation?.startDate, vacation?.endDate)} days ·
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" class="bi bi-globe-asia-australia" viewBox="0 0 16 16">
                <path d="m10.495 6.92 1.278-.619a.483.483 0 0 0 .126-.782c-.252-.244-.682-.139-.932.107-.23.226-.513.373-.816.53l-.102.054c-.338.178-.264.626.1.736a.48.48 0 0 0 .346-.027ZM7.741 9.808V9.78a.413.413 0 1 1 .783.183l-.22.443a.6.6 0 0 1-.12.167l-.193.185a.36.36 0 1 1-.5-.516l.112-.108a.45.45 0 0 0 .138-.326M5.672 12.5l.482.233A.386.386 0 1 0 6.32 12h-.416a.7.7 0 0 1-.419-.139l-.277-.206a.302.302 0 1 0-.298.52z"/>
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1.612 10.867l.756-1.288a1 1 0 0 1 1.545-.225l1.074 1.005a.986.986 0 0 0 1.36-.011l.038-.037a.88.88 0 0 0 .26-.755c-.075-.548.37-1.033.92-1.099.728-.086 1.587-.324 1.728-.957.086-.386-.114-.83-.361-1.2-.207-.312 0-.8.374-.8.123 0 .24-.055.318-.15l.393-.474c.196-.237.491-.368.797-.403.554-.064 1.407-.277 1.583-.973.098-.391-.192-.634-.484-.88-.254-.212-.51-.426-.515-.741a7 7 0 0 1 3.425 7.692 1 1 0 0 0-.087-.063l-.316-.204a1 1 0 0 0-.977-.06l-.169.082a1 1 0 0 1-.741.051l-1.021-.329A1 1 0 0 0 11.205 9h-.165a1 1 0 0 0-.945.674l-.172.499a1 1 0 0 1-.404.514l-.802.518a1 1 0 0 0-.458.84v.455a1 1 0 0 0 1 1h.257a1 1 0 0 1 .542.16l.762.49a1 1 0 0 0 .283.126 7 7 0 0 1-9.49-3.409Z"/>
            </svg> ${vacation?.companyName.company}
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