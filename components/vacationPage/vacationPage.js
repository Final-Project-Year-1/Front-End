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
const vacationStartDate = new Date(2024, 7, 12); // August 12, 2024
const vacationEndDate = new Date(2024, 7, 16); // August 16, 2024

function renderStaticCalendar() {
    const currentDate = new Date(2024, 7, 1); // August 2024
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
        const response = await fetch('http://localhost:3000/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newReview)
        });

        if (!response.ok) {
            throw new Error('Failed to submit review');
        }

        const reviewWrapper = document.querySelector('.reviews-wrapper');
        const reviewElement = document.createElement("div");
        reviewElement.classList.add("review");
        reviewElement.innerHTML = `
            <h3>${newReview.name}</h3>
            <p>${'★'.repeat(newReview.rating)}${'☆'.repeat(5 - newReview.rating)}</p>
            <p>${newReview.text}</p>
        `;
        reviewWrapper.prepend(reviewElement); // Add the new review to the top

        document.getElementById('add-review-form').reset();
    } catch (error) {
        console.error("Error submitting review:", error);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const mockReviews = [
        {
            name: "Alice Smith",
            rating: 5,
            text: "This was a fantastic vacation! The hotel was superb, and the service was top-notch. Highly recommend it!"
        },
        {
            name: "Bob Johnson",
            rating: 4,
            text: "Great vacation spot with beautiful scenery and friendly staff. Would definitely visit again."
        },
        {
            name: "Catherine Brown",
            rating: 5,
            text: "Absolutely loved it! The amenities were excellent, and the location was perfect. A wonderful getaway."
        },
        {
            name: "David Wilson",
            rating: 3,
            text: "Good value for money, but the rooms could have been cleaner. Overall, a decent experience."
        },
    ];

    const reviewsWrapper = document.getElementById("reviews-wrapper");

    mockReviews.forEach((review) => {
        const reviewElement = document.createElement("div");
        reviewElement.classList.add("review");
        reviewElement.innerHTML = `
            <h3>${review.name}</h3>
            <p>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
            <p>${review.text}</p>
        `;
        reviewsWrapper.appendChild(reviewElement);
    });
});
