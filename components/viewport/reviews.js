document.addEventListener('DOMContentLoaded', function() {
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
    };

    if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
        const userObj = getUserFromToken();
        document.querySelector(".top-button-logged-in").style.display = "flex";
        document.querySelector(".top-button").style.display = "none";
        document.getElementById("hello-user").textContent = `Hello ${userObj.user.firstName} ${userObj.user.lastName}`
    }

    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", () =>{
        localStorage.setItem("token", "");
        window.location.href = "../Auth/Login/login.html";
    });

    // Blog post rotation
    var blogPosts = document.querySelectorAll('.blog-post');
    var blogIndex = 0;

    function showNextPost() {
        blogPosts[blogIndex].style.display = 'none';
        blogIndex = (blogIndex + 1) % blogPosts.length;
        blogPosts[blogIndex].style.display = 'flex';
    }

    setInterval(showNextPost, 5000); // Change post every 5 seconds

    // Initial display setup for blog posts
    blogPosts.forEach(function(post, index) {
        if (index !== 0) post.style.display = 'none';
    });

    // Video slide rotation
    var slides = document.querySelectorAll('.video-slide');
    var slideIndex = 0;
    var muteButton = document.querySelector('.mute');
    var isMuted = true;

    function showSlides(n) {
        slides[slideIndex].style.display = 'none';
        slides[slideIndex].querySelector('video').muted = true; // Mute the previous video
        slideIndex = (slideIndex + n + slides.length) % slides.length;
        slides[slideIndex].style.display = 'block';
        slides[slideIndex].querySelector('video').muted = isMuted; // Apply the current mute state
        slides[slideIndex].querySelector('video').play();
    }

    showSlides(0); // Initialize the first slide

    document.querySelector('.prev').addEventListener('click', function() {
        showSlides(-1);
    });

    document.querySelector('.next').addEventListener('click', function() {
        showSlides(1);
    });

    muteButton.addEventListener('click', function() {
        isMuted = !isMuted;
        slides[slideIndex].querySelector('video').muted = isMuted;
        muteButton.textContent = isMuted ? '\uD83D\uDD07' : '\uD83D\uDD08';
    });

    // Play videos when DOM is fully loaded
    slides.forEach(function(slide) {
        slide.querySelector('video').play();
    });
});
