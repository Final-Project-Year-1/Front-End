const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const _id = params.get('id');
if (!_id) {
    console.error('No vacation id found in URL');
}
let vacation;
window.authVerificationAdjustments();

const fetchVacation = async (vacationId) => {
    const fetchVacationUrl = `http://localhost:3000/api/vacations/${vacationId}`;
    try {
        const response = await axios.get(fetchVacationUrl);
        vacation = response.data;
        matchVacationContent();
        currentMonth = new Date(vacation.startDate).getMonth();
        currentYear = new Date(vacation.startDate).getFullYear();
        renderStaticCalendar(currentMonth, currentYear);
        fetchReviewsByVacationId(vacationId);
    } catch (error) {
        console.log(error);
    }
}
fetchVacation(_id);

const matchVacationContent = async () => {
    document.getElementById("vacationSumH3").textContent = `Vacation in ${vacation?.destination}`;
    document.getElementById("vacationSumLiGroupOf").innerHTML = `<img src="../assets/home-images/img/persons.png" alt="icon"> ${vacation?.groupOf} people`;
    document.getElementById("vacationSumLiVacationCategory").innerHTML = `<img src="../assets/home-images/img/bed.png" alt="icon"> ${vacation?.tripCategory.category}`;
    const formattedDateStart = window.getDate(vacation?.startDate);
    const formattedDateEnd = window.getDate(vacation?.endDate);
    document.getElementById("startingDateLi").textContent = `Starting at ${formattedDateStart}`;
    document.getElementById("endingDateLi").textContent = `Ending at ${formattedDateEnd}`;
    document.getElementById("vacationTypeLi").innerHTML = `<img src="../assets/home-images/img/breakfast.png" alt="icon"> ${vacation.vacationType}`;
    document.getElementById("vacationSumPriceP").textContent = `${vacation?.price}$`;
    document.getElementById("vacationSumPriceSpan").textContent = `${vacation?.price}$ per person`;

    const mainImageDiv = document.querySelector(".main-image");
    const vacationImg = document.createElement("img");
    vacationImg.classList.add("slides", "active");

    try {
        const imgSrc = await window.fetchVacationImg(vacation);
        if (imgSrc) {
            vacationImg.src = imgSrc;
        } else {
            vacationImg.alt = "Image not available";
        }
        mainImageDiv.appendChild(vacationImg);
    } catch (error) {
        console.error("Error fetching and displaying image:", error);
    }

    document.getElementById("destinationH2").textContent = `${vacation?.destination}`;
    document.getElementById("ratingDiv").textContent = `${vacation?.rating} / 10`;
    document.getElementById("vacationTypeSpan").textContent = `${vacation?.vacationType}`;
    document.getElementById("descriptionP").textContent = `${vacation?.description}`;
    document.getElementById("spotsTakenDiv").textContent = `${vacation?.spotsLeft} Spots Left !`;
}

let currentMonth;
let currentYear;

const renderStaticCalendar = (month, year) => {
    const vacationStartDate = new Date(vacation?.startDate);
    const vacationEndDate = new Date(vacation?.endDate);
    const vacationStartDateWithExtraDay = new Date(vacationStartDate);
    vacationStartDateWithExtraDay.setDate(vacationStartDateWithExtraDay.getDate() - 1);

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

    document.getElementById('month-year').innerText = `${new Date(year, month).toLocaleString('default', { month: 'long' })}, ${year}`;

    let days = '';

    for (let i = 0; i < firstDayOfMonth; i++) {
        days += `<div class="day empty"></div>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        const date = new Date(year, month, i);
        const dateString = `${year}-${month + 1}-${i}`;
        let dayClass = 'day current-month';

        if (date >= vacationStartDateWithExtraDay && date <= vacationEndDate) {
            dayClass += ' vacation-day';
        }

        days += `<div class="${dayClass}" data-date="${dateString}">${i}</div>`;
    }
    const daysContainer = document.getElementById('calendar-days');
    daysContainer.innerHTML = days;
}

document.getElementById('prev-month').addEventListener('click', () => {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    renderStaticCalendar(currentMonth, currentYear);
});

document.getElementById('next-month').addEventListener('click', () => {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    renderStaticCalendar(currentMonth, currentYear);
});

const submitReview = async (event) => {
    event.preventDefault();

    const addReviewUrl = `http://localhost:3000/api/vacation/reviews/`;

    const user = window.getUserFromToken();
    const userId = user.user._id;
    const rating = document.getElementById('review-rating').value;
    const reviewText = document.getElementById('review-text').value;

    const newReview = {
        vacationId: vacation?._id,
        userId: userId,
        rating: parseInt(rating),
        comment: reviewText
    };

    const reviewId = document.getElementById('review-id').value;
    if (reviewId) {
        newReview._id = reviewId;
        await updateReview(newReview);
    } else {
        try {
            await axios.post(addReviewUrl, newReview);
            fetchReviewsByVacationId(vacation?._id);
            document.getElementById('add-review-form').reset();
            document.getElementById('submit-review-button').textContent = "Submit Review";
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    }
};

document.getElementById('add-review-form').addEventListener('submit', submitReview);

const reviewsWrapper = document.getElementById("reviews-wrapper");

const fetchReviewsByVacationId = async (vacationId) => {
    const reviewsByVacationId = `http://localhost:3000/api/vacation/reviews/${vacationId}`;
    try {
        const response = await axios.get(reviewsByVacationId);
        const reviews = response.data;
        reviewsWrapper.innerHTML = ''; // Clear previous reviews
        if (reviews.length === 0) {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = 'Be the first to leave a review!';
            reviewsWrapper.appendChild(messageDiv);
        } else {
            reviews.forEach((review) => createReviewDiv(review));
        }
    } catch (error) {
        console.log(error);
    }
}

const createReviewDiv = (review) => {

    const reviewElement = document.createElement("div");
    reviewElement.classList.add("review");
    reviewElement.id = `review-${review._id}`;

    const reviewName = document.createElement("h3");
    reviewName.textContent = review?.userId?.firstName + " " + review?.userId?.lastName;

    const reviewRating = document.createElement("p");
    const filledStars = '★'.repeat(review.rating);
    const emptyStars = '☆'.repeat(10 - review.rating);
    reviewRating.textContent = filledStars + emptyStars;

    const user = window.getUserFromToken();
    const currentUserId = user.user._id;

    const commentAndDeleteDiv = document.createElement("div");
    commentAndDeleteDiv.classList.add("comment-delete");

    const reviewTextElement = document.createElement("p");
    reviewTextElement.textContent = review?.comment;
    commentAndDeleteDiv.appendChild(reviewTextElement);

    if (currentUserId === review.userId?._id) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => {
            deleteReview(review._id);
            reviewElement.remove();
        });

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.classList.add("update-button");
        updateButton.addEventListener("click", () => {
            populateUpdateForm(review);
        });

        commentAndDeleteDiv.appendChild(deleteButton);
        commentAndDeleteDiv.appendChild(updateButton);
    }

    reviewElement.appendChild(reviewName);
    reviewElement.appendChild(reviewRating);
    reviewElement.appendChild(commentAndDeleteDiv);

    reviewsWrapper.appendChild(reviewElement);
}

const deleteReview = async (_id) => {
    const deleteReviewUrl = `http://localhost:3000/api/vacation/reviews/${_id}`;
    try {
        await axios.delete(deleteReviewUrl);
    } catch (error) {
        console.log(error);
    }
}

const populateUpdateForm = (review) => {
    document.getElementById('review-id').value = review._id;
    document.getElementById('review-rating').value = review.rating;
    document.getElementById('review-text').value = review.comment;
    document.getElementById('submit-review-button').textContent = "Update Review";
}

const updateReview = async (review) => {
    const updateReviewUrl = `http://localhost:3000/api/vacation/reviews/${review._id}`;
    try {
        await axios.put(updateReviewUrl, review);
        fetchReviewsByVacationId(vacation._id); // Refresh reviews after update
    } catch (error) {
        console.log(error);
    }
}

// Booking form
const form = document.getElementById("person-selection-form");
const availabilityMessage = document.getElementById("availability-message");
const spotsTakenDiv = document.getElementById("spotsTakenDiv");
const bookNowButton = document.querySelector(".order-button");
const vacationSumPriceP = document.getElementById("vacationSumPriceP");
const vacationSumPriceSpan = document.getElementById("vacationSumPriceSpan");

vacationSumPriceSpan.textContent = `${vacation?.price}$ per person`;

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const numberOfPersons = parseInt(document.getElementById("number-of-persons").value, 10);

    localStorage.setItem("numPassengers", numberOfPersons);

    if (numberOfPersons <= vacation?.spotsLeft && numberOfPersons > 0) {
        localStorage.setItem("numOfPeople", numberOfPersons);
        availabilityMessage.textContent = `Lucky You! there are enough spots!`;
        availabilityMessage.style.color = 'green';
        bookNowButton.disabled = false;
        bookNowButton.classList.remove('disabled');
        const totalAmount = numberOfPersons * vacation?.price;
        vacationSumPriceP.textContent = `${totalAmount}$`;
    } else {
        availabilityMessage.textContent = "Not enough spots available.";
        availabilityMessage.style.color = 'red';
        bookNowButton.disabled = true;
        bookNowButton.classList.add('disabled');
        const totalAmount = 1 * vacation?.price;
        vacationSumPriceP.textContent = `${totalAmount}$`;
    }
});

const loginMessage = document.querySelector("#login-message");

bookNowButton.addEventListener("click", function (event) {
    const token = localStorage.getItem("token");

    if (!token) {
        loginMessage.textContent = "Please log in before booking.";
        loginMessage.classList.remove("hidden");
        event.preventDefault();
    } else {
        loginMessage.classList.add("hidden");
        window.location.href = `/components/User/Purchases/purchase.html?id=${vacation._id}`;
    }
});