const userObj = window.getUserFromToken();
window.authVerificationAdjustments();

// Top rated vacations
const topRatedVacationsUrl = "http://localhost:3000/api/top-rated-vacations";
const getVacationImg = "http://localhost:3000/api/vacations/images/";

$(document).ready(async function () {
  try {
    const response = await axios.get(topRatedVacationsUrl);
    const vacations = response.data;
    vacations.slice(0, 4).forEach(async (vacation) => await createVacationCard(vacation));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const fetchVacationImg = async (vacation) => {
  try {
    const response = await axios.get(getVacationImg + vacation?.imageName, { responseType: 'blob' });
    const imageUrl = URL.createObjectURL(response.data);
    return imageUrl;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}

async function createVacationCard(vacation) {
  const $vacationCard = $("<div>").addClass("card-vacations");

  const $vacationImg = $("<img>").addClass("vacation-image");
  const imgSrc = await fetchVacationImg(vacation);
  if (imgSrc) {
    $vacationImg.attr("src", imgSrc);
    $vacationImg.css("cursor", "pointer");
    const $link = $("<a>").attr("href", `/components/vacationPage/vacationPage.html?id=${vacation._id}`).append($vacationImg);
    $vacationCard.append($link);
  } else {
    $vacationImg.attr("alt", "Image not available");
    $vacationCard.append($vacationImg);
  }

  const $detailsDiv = $("<div>").addClass("vacation-details");

  const $destinationDiv = $("<button>").addClass("destination").html(vacation.destination);
  $detailsDiv.append($destinationDiv);

  const $ratingDiv = $("<span>").addClass("rating").html(`${vacation.rating}/10`);
  $detailsDiv.append($ratingDiv);

  $vacationCard.append($detailsDiv);
  const $cardsSection = $("#cards");
  if ($cardsSection.length) {
    $cardsSection.append($vacationCard);
  } else {
    console.error("Element with id 'cards' not found.");
  }
}

// End of fetching vacations

const $slider = $(".slider");
const $slides = $(".slide");
const $prevButton = $("#prev-slide");
const $nextButton = $("#next-slide");

let currentIndex = 0;
const slidesToShow = 4;
const totalSlides = $slides.length;
const slideWidth = $slides.first().outerWidth();

function updateSlider() {
  const offset = -currentIndex * slideWidth;
  $slider.css("transform", `translateX(${offset}px)`);
  $prevButton.css("display", currentIndex > 0 ? "block" : "none");
  $nextButton.css("display", currentIndex < totalSlides - slidesToShow ? "block" : "none");
}

$prevButton.on("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
});

$nextButton.on("click", () => {
  if (currentIndex < totalSlides - slidesToShow) {
    currentIndex++;
    updateSlider();
  }
});

updateSlider();

$(".vacation-inspired").on("click", function () {
  const span = $(this).find(".button-text-2").text();
  localStorage.setItem("tripCategory", span);
  window.location.href = "../User/Vacations/allVacations.html";
});

$(".all-vacations").on("click", () => localStorage.setItem("tripCategory", ''));

$(document).ready(async function () {
  async function fetchNews() {
    const apiKey = 'f426634050554b5cbd014eff25f76a2d';
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }
      const data = await response.json();
      const newsData = JSON.parse(data.contents);
      displayNews(newsData.articles.slice(0, 3)); // Display only 3 articles
    } catch (error) {
      console.error('Error fetching news:', error);
      $('#news-container').html(`<p>Failed to load news: ${error.message}</p>`);
    }
  }

  function displayNews(articles) {
    const $newsContainer = $('#news-container');
    $newsContainer.empty(); // Clear any existing content

    if (articles.length === 0) {
      $newsContainer.html('<p>No news available.</p>');
      return;
    }

    articles.forEach(article => {
      const $articleElement = $("<div>").addClass("news-article").html(`
        <h3>${article.title}</h3>
        <p>${article.description}</p>
        <a href="${article.url}" target="_blank">Read more</a>
      `);
      $newsContainer.append($articleElement);
    });
  }

  await fetchNews();
});
