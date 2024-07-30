let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slides");
    let thumbnails = document.getElementsByClassName("thumbnail");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    for (i = 0; i < thumbnails.length; i++) {
        thumbnails[i].classList.remove("active");
    }
    slides[slideIndex-1].classList.add("active");
    thumbnails[slideIndex-1].classList.add("active");
}

// Static Calendar for August 2024
const vacationStartDate = new Date(2024, 7, 12); 
const vacationEndDate = new Date(2024, 7, 16); 

function renderStaticCalendar() {
    const currentDate = new Date(2024, 7, 1); 
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    
    document.getElementById('month-year').innerText = `${currentDate.toLocaleString('default', { month: 'long' })}, ${year}`;
    
    let days = '';
    
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const dateString = `${year}-${month + 1}-${i}`;
        const date = new Date(year, month, i);
        let dayClass = 'day current-month';
        
        if (date >= vacationStartDate && date <= vacationEndDate) {
            dayClass += ' vacation-day';
        }
        
        days += `<div class="${dayClass}" data-date="${dateString}">${i}</div>`;
    }
    
    const daysContainer = document.getElementById('calendar-days');
    daysContainer.innerHTML = days;
}

// Initial render of the static calendar
renderStaticCalendar();

function toggleReadMore() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("read-more");

    if (dots.style.display === "none") {
        dots.style.display = "inline";
        btnText.innerHTML = "Read more";
        moreText.style.display = "none";
    } else {
        dots.style.display = "none";
        btnText.innerHTML = "Read less";
        moreText.style.display = "inline";
    }
}

// Reviews Section 
document.getElementById('add-review-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('review-name').value;
    const rating = document.getElementById('review-rating').value;
    const reviewText = document.getElementById('review-text').value;

    const newReview = {
        name: name,
        rating: parseInt(rating),
        text: reviewText
    };

    try {
        const response = await axios.post('http://localhost:3000/api/vacation/reviews/:66a11cb11eb3f43395f7ae79', newReview, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 200) {
            throw new Error('Failed to submit review');
        }

        const reviewWrapper = document.querySelector('.reviews-wrapper');
        const reviewElement = document.createElement("div");
        reviewElement.classList.add("review");

        const reviewName = document.createElement("h3");
        reviewName.textContent = newReview.name;

        const reviewRating = document.createElement("p");
        const filledStars = '★'.repeat(newReview.rating);
        const emptyStars = '☆'.repeat(10 - newReview.rating);
        reviewRating.textContent = filledStars + emptyStars;

        const reviewTextElement = document.createElement("p");
        reviewTextElement.textContent = newReview.text;

        reviewElement.appendChild(reviewName);
        reviewElement.appendChild(reviewRating);
        reviewElement.appendChild(reviewTextElement);

        reviewWrapper.prepend(reviewElement); // Add the new review to the top

        document.getElementById('add-review-form').reset();
    } catch (error) {
        console.error("Error submitting review:", error);
    }
});

const reviewsWrapper = document.getElementById("reviews-wrapper");

const mockReviews = [
    {
        name: "Alice Smith",
        rating: 9,
        text: "This was a fantastic vacation! The hotel was superb, and the service was top-notch. Highly recommend it!"
    },
    {
        name: "Bob Johnson",
        rating: 8,
        text: "Great vacation spot with beautiful scenery and friendly staff. Would definitely visit again."
    },
    {
        name: "Catherine Brown",
        rating: 10,
        text: "Absolutely loved it! The amenities were excellent, and the location was perfect. A wonderful getaway."
    },
    {
        name: "David Wilson",
        rating: 7,
        text: "Good value for money, but the rooms could have been cleaner. Overall, a decent experience."
    },
];

mockReviews.forEach((review) => {
    const reviewElement = document.createElement("div");
    reviewElement.classList.add("review");

    const reviewName = document.createElement("h3");
    reviewName.textContent = review.name;

    const reviewRating = document.createElement("p");
    const filledStars = '★'.repeat(review.rating);
    const emptyStars = '☆'.repeat(10 - review.rating);
    reviewRating.textContent = filledStars + emptyStars;

    const reviewTextElement = document.createElement("p");
    reviewTextElement.textContent = review.text;

    reviewElement.appendChild(reviewName);
    reviewElement.appendChild(reviewRating);
    reviewElement.appendChild(reviewTextElement);

    reviewsWrapper.appendChild(reviewElement);
});

document.getElementById('person-selection-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const numberOfPersons = document.getElementById('number-of-persons').value;
    const vacationId = '66a11e251eb3f43395f7aeaf'; // Replace with the actual vacation ID
    
    try {
        const response = await axios.get('http://localhost:3000/api/vacation/spots-left', {
            vacationId: vacationId,
            passengers: parseInt(numberOfPersons)
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const messageElement = document.getElementById('availability-message');
        
        if (response.status === 200) {
            messageElement.textContent = 'Spots are available!';
            messageElement.style.color = 'green';
        } else {
            messageElement.textContent = 'Not enough spots available!';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error("Error checking spots:", error);
        const messageElement = document.getElementById('availability-message');
        messageElement.textContent = 'Error checking availability. Please try again.';
        messageElement.style.color = 'red';
    }
});


// Footer
if (localStorage.getItem('token') !== '') {
    const userObj = getUserFromToken();
    document.querySelector('.top-button-logged-in').style.display = 'block';
    document.querySelector('.top-button').style.display = 'none';
    document.getElementById('hello-user').textContent = 'Hello ${userObj.user.firstName} ${userObj.user.lastName}';

    if (userObj.token) {
        const decodedToken = jwt_decode(userObj.token);
        // Extract role from the decoded token if present
        const userRole = decodedToken.role || userObj.user.role;

        // Check if the user role is admin
        if (userRole && userRole === 'admin') {
            document.getElementById('admin-section').style.display = 'block';
        }
}}