const userLoginUrl = "http://localhost:3000/api/auth/login/";

const emailInput = $("#email");
const passwordInput = $("#password");
const loginButton = $("#login-button");

const passwordError = $("#password-error");
const passwordLengthError = $("#password-length-error");
const emailError = $("#email-error");

const login = async (credentials) => {
    try {
        const response = await axios.post(userLoginUrl, credentials);
        const token = response.data;
        if (typeof token === 'string') {
            localStorage.setItem("token", token);
            window.interceptorsService.setToken(token);
            window.location.href = "../../Home/home.html";
        } else {
            alert('incorrect email or password');
        }
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

const validatePassword = () => {
    const passValue = passwordInput.val();
    let passMessage = "";

    if (passValue.length > 0) {
        if (!/^[a-zA-Z0-9!@#$^₪]+$/.test(passValue)) {
            passMessage = `Invalid input .`;
        } else if (passValue.length < 8) {
            passMessage = "Password too short";
        } else if (passValue.length > 30) {
            passMessage = "Password too long";
        } else if (!/[a-zA-Z]/.test(passValue)) {
            passMessage = "Password must contain letters";
        } else if (!/[0-9]/.test(passValue)) {
            passMessage = "Password must contain numbers";
        }
    }

    passwordLengthError.text(passMessage);
    return passValue.length >= 8 && passMessage === "";
};

const togglePasswordButton = $("#toggle-password");
const eyeIcon = togglePasswordButton.find(".bi-eye");

togglePasswordButton.on("click", () => {
    const type = passwordInput.attr("type") === "password" ? "text" : "password";
    passwordInput.attr("type", type);
    eyeIcon.attr("fill", type === "password" ? "currentColor" : "#000000");
});

const validateEmail = () => {
    const email = emailInput.val();
    const validEmailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const isValidEmail = validEmailPattern.test(email);

    if (!isValidEmail) {
        emailError.text("Invalid email address");
    } else {
        emailError.text("");
    }
    return isValidEmail;
};

const validateForm = () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const fieldsFilled = isEmailValid && isPasswordValid;

    loginButton.toggleClass("active", fieldsFilled);
    loginButton.prop("disabled", !fieldsFilled);
};

emailInput.on("input", () => {
    validateEmail();
    validateForm();
});

passwordInput.on("input", () => {
    validatePassword();
    validateForm();
});

loginButton.on("click", async function () {
    console.log("clicked");
    if (!$(this).prop("disabled")) {
        const credentials = {
            email: emailInput.val(),
            password: passwordInput.val(),
        };
        login(credentials);
    }
});
