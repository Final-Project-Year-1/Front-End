const tips = [
    "Pack light to make your travel experience easier.",
    "Always carry a reusable water bottle.",
    "Learn a few phrases in the local language.",
    "Keep digital and physical copies of important documents.",
    "Try local food for a more authentic experience.",
    "Take travel insurance for peace of mind.",
    "Always have a backup plan for your itinerary.",
    "Respect the local culture and customs.",
    "Stay aware of your surroundings to ensure safety.",
    "Make copies of your passport and keep them separate from the original."
];

const tipElement = document.getElementById('tip');
const randomTip = tips[Math.floor(Math.random() * tips.length)];
tipElement.textContent = randomTip;

var dropdown = document.querySelector('.dropdown');
var dropdownContent = document.querySelector('.dropdown-content');

dropdown.addEventListener('click', function() {
    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
    } else {
        dropdownContent.style.display = "block";
    }
});
