const userObj = window.getUserFromToken();
window.authVerificationAdjustments();

$(document).ready(function () {
  let $blogPosts = $(".blog-post");
  let blogIndex = 0;

  function showNextPost() {
    $blogPosts.eq(blogIndex).hide();
    blogIndex = (blogIndex + 1) % $blogPosts.length;
    $blogPosts.eq(blogIndex).show();
  }

  setInterval(showNextPost, 5000);

  $blogPosts.each(function (index) {
    if (index !== 0) $(this).hide();
  });

  let $slides = $(".video-slide");
  let slideIndex = 0;
  let $muteButton = $(".mute");
  let isMuted = true;

  function showSlides(n) {
    $slides.eq(slideIndex).hide();
    $slides.eq(slideIndex).find("video").prop("muted", true);
    slideIndex = (slideIndex + n + $slides.length) % $slides.length;
    $slides.eq(slideIndex).show();
    $slides.eq(slideIndex).find("video").prop("muted", isMuted);
    $slides.eq(slideIndex).find("video").get(0).play();
  }

  showSlides(0);

  $(".prev").on("click", function () {
    showSlides(-1);
  });

  $(".next").on("click", function () {
    showSlides(1);
  });

  $muteButton.on("click", function () {
    isMuted = !isMuted;
    $slides.eq(slideIndex).find("video").prop("muted", isMuted);
    $muteButton.text(isMuted ? "\uD83D\uDD07" : "\uD83D\uDD08");
  });

  $slides.each(function () {
    $(this).find("video").get(0).play();
  });
});
