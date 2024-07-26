document.addEventListener("DOMContentLoaded", function () {
    // FAQ toggle functionality
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

    // Auth functionality
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
    }

    const logoutButton = document.getElementById("logout");
    const loginLink = document.getElementById("login");
    const registerLink = document.getElementById("register");
    const helloUserElement = document.getElementById("hello-user");
    const topButtonLoggedIn = document.querySelector(".top-button-logged-in");
    const topButton = document.querySelector(".top-button");

    if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
        const userObj = getUserFromToken();
        helloUserElement.textContent = `Hello ${userObj.user.firstName} ${userObj.user.lastName}`;
        topButtonLoggedIn.style.display = "block";
        topButton.style.display = "none";
    } else {
        helloUserElement.textContent = "";
        topButtonLoggedIn.style.display = "none";
        topButton.style.display = "block";
        logoutButton.textContent = "Log in";
    }

    logoutButton.addEventListener("click", () => {
        localStorage.setItem("token", "");
        window.location.href = "../Auth/Login/login.html";
    });
});
