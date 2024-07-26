let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slides");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
}

document.querySelector('.prev-month').addEventListener('click', function() {
    // Handle previous month click
});

document.querySelector('.next-month').addEventListener('click', function() {
    // Handle next month click
});

const daysContainer = document.querySelector('.days');
let startDate = null;
let endDate = null;
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

// Generate calendar days
function generateCalendarDays(month, year) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    daysContainer.innerHTML = '';
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = day;
        dayElement.setAttribute('data-date', `${year}-${month + 1}-${day}`);
        daysContainer.appendChild(dayElement);
    }
}

// Initialize calendar
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();
generateCalendarDays(currentMonth, currentYear);

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

