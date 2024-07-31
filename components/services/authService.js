const getUserFromToken = () => {
    let user = null;
    const token = localStorage.getItem("token");

    if (token) {
        const encodedObject = jwt_decode(token);
        user = encodedObject.user;
    }

    return {
        user: user,
        token: token,
    };
};

const authVerificationAdjustments = () => {
    if (localStorage.getItem("token") !== "") {
        const userObj = window.getUserFromToken();
        $(".top-button-logged-in").show();
        $(".top-button").hide();
        $("#hello-user").text(`Hello ${userObj.user.firstName} ${userObj.user.lastName}`);

        if (userObj.token) {
            const decodedToken = jwt_decode(userObj.token);
            const userRole = decodedToken.role || userObj.user.role;

            if (userRole && userRole === "admin") {
                $("#admin-section").show();
            }
        }
    }

    $("#logout").on("click", function() {
        localStorage.setItem("token", "");
        window.location.href = "../Auth/Login/login.html";
    });
};

window.getUserFromToken = getUserFromToken;
window.authVerificationAdjustments = authVerificationAdjustments;
