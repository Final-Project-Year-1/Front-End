document.addEventListener('DOMContentLoaded', function() {
    var faqItems = document.querySelectorAll('.faq-item h2');
    faqItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });
});
