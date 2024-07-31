
const _id = '66a11e251eb3f43395f7aeaf'; //fetch dynamically from URL
let vacation;

const fetchVacation = async (vacationId) => {
    const fetchVacationUrl = `http://localhost:3000/api/vacations/${vacationId}`
    try {
        const response = await axios.get(fetchVacationUrl);
        vacation = response.data;
        console.log(vacation);
        matchVacationContent();
        renderStaticCalendar();
        fetchReviewsByVacationId(vacationId);

    } catch (error) {
        console.log(error);
    }
}
fetchVacation(_id);

const matchVacationContent = async () => {
    document.getElementById("vacationSumH3").textContent = `vacation in ${vacation?.destination}`;
    document.getElementById("vacationSumLiGroupOf").innerHTML = `<img src="../assets/home-images/img/persons.png" alt="icon"> ${vacation?.groupOf} people`;
    document.getElementById("vacationSumLiVacationCategory").innerHTML = `<img src="../assets/home-images/img/bed.png" alt="icon"> ${vacation?.tripCategory.category}`;
    const formattedDateStart = window.getDate(vacation?.startDate);
    const formattedDateEnd = window.getDate(vacation?.startDate);
    document.getElementById("startingDateLi").textContent = `Starting at ${formattedDateStart}`;
    document.getElementById("endingDateLi").textContent = `Ending at ${formattedDateEnd}`;
    document.getElementById("vacationTypeLi").innerHTML = `<img src="../assets/home-images/img/breakfast.png" alt="icon"> ${vacation.vacationType}`;
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

function renderStaticCalendar() {
    const vacationStartDate = new Date(window.getDate(vacation?.startDate));
    const vacationEndDate = new Date(window.getDate(vacation?.endDate));

    const month = vacationStartDate.getMonth();
    const year = vacationStartDate.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

    document.getElementById('month-year').innerText = `${vacationStartDate.toLocaleString('default', { month: 'long' })}, ${year}`;

    let days = '';

    for (let i = 0; i < firstDayOfMonth; i++) {
        days += `<div class="day empty"></div>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        const date = new Date(year, month, i);
        const dateString = `${year}-${month + 1}-${i}`;
        let dayClass = 'day current-month';

        if (date >= vacationStartDate && date <= vacationEndDate) {
            dayClass += ' vacation-day';
        }

        days += `<div class="${dayClass}" data-date="${dateString}">${i}</div>`;
    }
    const daysContainer = document.getElementById('calendar-days');
    daysContainer.innerHTML = days;
}



// Reviews Section 
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

document.getElementById('add-review-form').addEventListener('submit', async function(event) {

    const addReviewUrl = `http://localhost:3000/api/vacation/reviews/`;
    event.preventDefault();

    const user = getUserFromToken()
    const userId = user.user._id;
    const rating = document.getElementById('review-rating').value;
    const reviewText = document.getElementById('review-text').value;

    const newReview = {
        vacationId: vacation?._id,
        userId: userId,
        rating: parseInt(rating),
        comment: reviewText
    };

    console.log(newReview);

    try {
        await axios.post(addReviewUrl, newReview);
        fetchReviewsByVacationId(vacation?._id);
        document.getElementById('add-review-form').reset();

    } catch (error) {
        console.error("Error submitting review:", error);
    }
});

const reviewsWrapper = document.getElementById("reviews-wrapper");

const fetchReviewsByVacationId = async (vacationId) => {
    const reviewsByVacationId = `http://localhost:3000/api/vacation/reviews/${vacationId}`
    try {
      const response = await axios.get(reviewsByVacationId);
      const reviews = response.data;
      reviews.forEach((review) => createReviewDiv(review));
    } 
    catch (error) {
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

    const user = getUserFromToken();
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

const deleteReview = async(_id) =>{
    const deleteReviewUrl = `http://localhost:3000/api/vacation/reviews/${_id}`;
    try{
       await axios.delete(deleteReviewUrl);
    }catch(error){
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
        console.log('Review updated successfully');
    } catch (error) {
        console.log(error);
    }
}

document.getElementById('add-review-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const reviewId = document.getElementById('review-id').value;
    const rating = document.getElementById('review-rating').value;
    const comment = document.getElementById('review-text').value;
    const user = getUserFromToken();
    const vacationId = vacation._id;

    if (reviewId) {
        const review = {
            _id: reviewId,
            rating: parseInt(rating),
            comment: comment,
            userId: user.user._id,
            vacationId: vacationId
        };
        await updateReview(review);
    } 

    document.getElementById('review-id').value = '';
    document.getElementById('review-rating').value = '';
    document.getElementById('review-text').value = '';
    document.getElementById('submit-review-button').textContent = "Submit Review";
});


// document.getElementById('person-selection-form').addEventListener('submit', async function(event) {
//     event.preventDefault();
    
//     const numberOfPersons = document.getElementById('number-of-persons').value;
//     const vacationId = '66a11e251eb3f43395f7aeaf'; // Replace with the actual vacation ID
    
//     try {
//         const response = await axios.get('http://localhost:3000/api/vacation/spots-left', {
//             vacationId: vacationId,
//             passengers: parseInt(numberOfPersons)
//         }, {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
        
//         const messageElement = document.getElementById('availability-message');
        
//         if (response.status === 200) {
//             messageElement.textContent = 'Spots are available!';
//             messageElement.style.color = 'green';
//         } else {
//             messageElement.textContent = 'Not enough spots available!';
//             messageElement.style.color = 'red';
//         }
//     } catch (error) {
//         console.error("Error checking spots:", error);
//         const messageElement = document.getElementById('availability-message');
//         messageElement.textContent = 'Error checking availability. Please try again.';
//         messageElement.style.color = 'red';
//     }
// });


// Footer
// if (localStorage.getItem('token') !== '') {
//     const userObj = getUserFromToken();
//     document.querySelector('.top-button-logged-in').style.display = 'block';
//     document.querySelector('.top-button').style.display = 'none';
//     document.getElementById('hello-user').textContent = 'Hello ${userObj.user.firstName} ${userObj.user.lastName}';

//     if (userObj.token) {
//         const decodedToken = jwt_decode(userObj.token);
//         // Extract role from the decoded token if present
//         const userRole = decodedToken.role || userObj.user.role;

//         // Check if the user role is admin
//         if (userRole && userRole === 'admin') {
//             document.getElementById('admin-section').style.display = 'block';
//         }
// }}