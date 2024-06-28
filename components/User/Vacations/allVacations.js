
flatpickr("#start", {
    // Configuration options
});
flatpickr("#end", {
    // Configuration options
});

document.addEventListener('DOMContentLoaded', function() {
    const sliderImages = document.querySelectorAll('.slide-image');
    let currentImage = 0;

    function showImage(index) {
        sliderImages.forEach(img => {
            img.style.display = 'none';
        });
        sliderImages[index].style.display = 'block'; // הצג את התמונה הנוכחית
    }

    document.querySelector('.prev-btn').addEventListener('click', () => {
        currentImage = currentImage > 0 ? currentImage - 1 : sliderImages.length - 1;
        showImage(currentImage);
    });

    document.querySelector('.next-btn').addEventListener('click', () => {
        currentImage = currentImage < sliderImages.length - 1 ? currentImage + 1 : 0;
        showImage(currentImage);
    });

    showImage(currentImage); // מציג את התמונה הראשונה בעת טעינת הדף
});
