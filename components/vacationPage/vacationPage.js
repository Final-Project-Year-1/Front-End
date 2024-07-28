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

// Calendar Functionality
let currentDate = new Date();
let startDate = null;
let endDate = null;

document.querySelector('.prev-month').addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.querySelector('.next-month').addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

const daysContainer = document.querySelector('.days');
daysContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('day')) {
        const selectedDate = new Date(event.target.getAttribute('data-date'));
        if (!startDate || (startDate && endDate)) {
            startDate = selectedDate;
            endDate = null;
            clearSelection();
            event.target.classList.add('selected');
        } else if (selectedDate < startDate) {
            endDate = startDate;
            startDate = selectedDate;
            updateSelection();
        } else {
            endDate = selectedDate;
            updateSelection();
        }
    }
});

function clearSelection() {
    const days = daysContainer.querySelectorAll('.day');
    days.forEach(day => day.classList.remove('selected'));
}

function updateSelection() {
    const days = daysContainer.querySelectorAll('.day');
    const startDateTime = startDate.getTime();
    const endDateTime = endDate ? endDate.getTime() : startDateTime;
    days.forEach(day => {
        const dayDate = new Date(day.getAttribute('data-date')).getTime();
        if (dayDate >= startDateTime && dayDate <= endDateTime) {
            day.classList.add('selected');
        } else {
            day.classList.remove('selected');
        }
    });
}

function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfLastMonth = month === 0 ? new Date(year - 1, 11, 0).getDate() : new Date(year, month, 0).getDate();
    
    document.getElementById('month-year').innerText = `${currentDate.toLocaleString('default', { month: 'long' })}, ${year}`;
    
    let days = '';
    
    for (let i = firstDayOfMonth; i > 0; i--) {
        days += `<div class="day prev-month">${lastDayOfLastMonth - i + 1}</div>`;
    }
    
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const dateString = `${year}-${month + 1}-${i}`;
        days += `<div class="day current-month" data-date="${dateString}" data-price="$${(Math.random() * 1000 + 3000).toFixed(0)}">${i}</div>`;
    }
    
    daysContainer.innerHTML = days;
    addDayClickEvent();
}

function addDayClickEvent() {
    const days = document.querySelectorAll('.day.current-month');
    days.forEach(day => {
        day.addEventListener('click', function() {
            document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

// Initial render of the calendar
renderCalendar();

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
document.getElementById('add-review-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('review-name').value;
    const rating = document.getElementById('review-rating').value;
    const reviewText = document.getElementById('review-text').value;

    const reviewWrapper = document.querySelector('.reviews-wrapper');
    const newReview = document.createElement('div');
    newReview.classList.add('review');
    newReview.innerHTML = `
        <h3>${name}</h3>
        <p>${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</p>
        <p>${reviewText}</p>
    `;

    reviewWrapper.prepend(newReview); // מוסיף את הביקורת החדשה למעלה

    document.getElementById('add-review-form').reset();
});
