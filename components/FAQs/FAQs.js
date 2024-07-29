

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

    if (localStorage.getItem('token') !== '') {
        const userObj = getUserFromToken();
        document.querySelector('.top-button-logged-in').style.display = 'block';
        document.querySelector('.top-button').style.display = 'none';
        document.getElementById('hello-user').textContent = `Hello ${userObj.user.firstName} ${userObj.user.lastName}`;

        if (userObj.token) {
            const decodedToken = jwt_decode(userObj.token);
            // Extract role from the decoded token if present
            const userRole = decodedToken.role || userObj.user.role;

            // Check if the user role is admin
            if (userRole && userRole === 'admin') {
                document.getElementById('admin-section').style.display = 'block';
            }
        }
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
    } 
    else {
        helloUserElement.textContent = "";
        topButtonLoggedIn.style.display = "none";
        topButton.style.display = "block";
        logoutButton.textContent = "Log in";
    }

    logoutButton.addEventListener("click", () => {
        localStorage.setItem("token", "");
        window.location.href = "../Auth/Login/login.html";
    });




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