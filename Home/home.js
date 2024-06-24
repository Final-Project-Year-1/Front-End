document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');

    let currentIndex = 0;
    const slidesToShow = 4;
    const totalSlides = slides.length;
    const slideWidth = slides[0].getBoundingClientRect().width;

    function updateSlider() {
        const offset = -currentIndex * slideWidth;
        slider.style.transform = `translateX(${offset}px)`;
        prevButton.style.display = currentIndex > 0 ? 'block' : 'none';
        nextButton.style.display = currentIndex < totalSlides - slidesToShow ? 'block' : 'none';
    }

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < totalSlides - slidesToShow) {
            currentIndex++;
            updateSlider();
        }
    });

    updateSlider();
});
