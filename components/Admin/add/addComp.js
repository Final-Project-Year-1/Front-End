document.addEventListener("DOMContentLoaded", function() {
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

    if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
        const userObj = getUserFromToken();
        document.querySelector(".top-button-logged-in").style.display = "block";
        document.querySelector(".top-button").style.display = "none";
        document.getElementById("hello-user").textContent = `Hello ${userObj.user.firstName} ${userObj.user.lastName}`
    }

    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", () =>{
        localStorage.setItem("token", "");
        window.location.href = "../Auth/Login/login.html";
    });

    document.getElementById('company-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            company: formData.get('company')
        };

        try {
            const response = await fetch('/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                alert('Company added successfully');
                // ביצוע פעולה לאחר ההצלחה, כמו רענון הטופס
            } else {
                alert('Failed to add company: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add company');
        }
    });
});
