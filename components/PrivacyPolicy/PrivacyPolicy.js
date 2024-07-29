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
    logoutButton.addEventListener("click", () =>{
        localStorage.setItem("token","");
        window.location.href = "../Auth/Login/login.html";
    });
});
