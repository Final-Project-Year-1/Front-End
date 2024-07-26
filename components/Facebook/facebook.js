window.fbAsyncInit = function() {
    FB.init({
        appId: '1789994598450053',
        cookie: true,
        xfbml: true,
        version: 'v12.0'
    });

    FB.AppEvents.logPageView();
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function loginAndPost() {
    FB.login(function(response) {
        if (response.authResponse) {
            postToFacebook();
        } else {
            document.getElementById('status').innerHTML = 'User cancelled login or did not fully authorize.';
        }
    }, {scope: 'pages_manage_posts,pages_read_engagement,pages_show_list'});
}

function postToFacebook() {
    const page_id = '61563304472983'; // הכניסי את ה-Page ID שלך כאן
    const message = 'Check out our new vacation packages!';

    FB.api(
        `/${page_id}/feed`,
        'POST',
        {
            message: message,
            access_token: 'EAAZAbZCZAgww4UBO0kQtmiOe1SOcjegA2BALaFdEomBlF8SsF7lZALkIyDZBtkeUZCOR4rBUwGLmL65qCZBP7qaa4gOVYLe5ZCX3dq0icICuhngj5E0XOcvQOAorqiFaaQ6QIqmYPHKyZArqbvsBclMWPlZBFYqX3ZBYWn4BsWZBqsZC4vL2zLi5gCKRiVm46tj6buXSGlbtb245akjp95tCtZBy3yuUOfcspEOCXJGx0d' // הכניסי כאן את ה-Page Access Token שקיבלת
        },
        function(response) {
            if (response && !response.error) {
                document.getElementById('status').innerHTML = 'Post was successful!';
            } else {
                document.getElementById('status').innerHTML = 'Error while posting: ' + response.error.message;
            }
        }
    );
}

document.addEventListener('DOMContentLoaded', () => {
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

    if (!localStorage.getItem("token") || localStorage.getItem("token") === "") {
        document.querySelector(".top-button").style.display = "flex";
        document.querySelector(".top-button-logged-in").style.display = "none";
    } else {
        const userObj = getUserFromToken();
        document.querySelector(".top-button-logged-in").style.display = "flex";
        document.querySelector(".top-button").style.display = "none";
        document.getElementById("hello-user").textContent = `Hello ${userObj.user.firstName} ${userObj.user.lastName}`;

        const logoutButton = document.getElementById("logout");
        logoutButton.addEventListener("click", () => {
            localStorage.setItem("token", "");
            window.location.href = "../Auth/Login/login.html";
        });
    }
});
