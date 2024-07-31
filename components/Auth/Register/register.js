const userRegisterUrl = "http://localhost:3000/api/auth/register/";

const firstName = $("#first-name");
const lastName = $("#last-name");
const emailInput = $("#email");
const gender = $("input[name='gender']");
const password = $("#password");
const registerButton = $("#sign-up");

const confirmPassword = $("#confirm-password");
const passwordError = $("#password-error");
const firstNameError = $("#first-name-error");
const lastNameError = $("#last-name-error");
const passwordMatchError = $("#password-match-error");
const passwordLengthError = $("#password-length-error");
const emailError = $("#email-error");

const register = async (user) => {
    try {
        const response = await axios.post(userRegisterUrl, user);
        const token = response.data;
        if (typeof token === 'string') {
            localStorage.setItem("token", token);
            window.interceptorsService.setToken(token);
            window.location.href = "../../Home/home.html";
        } else {
            console.log('Invalid Data');
        }
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
}

const validatePassword = () => {
    const passValue = password.val();
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

const validatePasswordsMatch = () => {
    const passwordsMatch = password.val() === confirmPassword.val();
    if (!passwordsMatch && confirmPassword.val().length > 0) {
        passwordMatchError.text("Passwords do not match");
    } else {
        passwordMatchError.text("");
    }
    return passwordsMatch;
};

const togglePasswordButton = $("#toggle-password");
const eyeIcon = togglePasswordButton.find(".bi-eye");

togglePasswordButton.on("click", () => {
    const type = password.attr("type") === "password" ? "text" : "password";
    password.attr("type", type);
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

const validateNameInput = (inputElement, errorElement, nameType) => {
    const value = inputElement.val();
    let errorMessage = "";

    if (value.length > 0) {
        if (!/^[a-zA-Z]+$/.test(value)) {
            errorMessage = `Invalid input.`;
        } else if (value.length < 2) {
            errorMessage = `${nameType} too short`;
        } else if (value.length > 20) {
            errorMessage = `${nameType} too long`;
        }
    }

    errorElement.text(errorMessage);
    return value.length >= 2 && errorMessage === "";
};

const validateForm = () => {
    const isFirstNameValid = validateNameInput(firstName, firstNameError, "First name");
    const isLastNameValid = validateNameInput(lastName, lastNameError, "Last name");
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const passwordsMatch = validatePasswordsMatch();
    const genderChecked = gender.filter(":checked").length > 0;
    const fieldsFilled =
        isFirstNameValid &&
        isLastNameValid &&
        isEmailValid &&
        genderChecked &&
        isPasswordValid &&
        passwordsMatch;

    registerButton.toggleClass("active", fieldsFilled);
    registerButton.prop("disabled", !fieldsFilled);
};

firstName.on("input", () => {
    validateNameInput(firstName, firstNameError, "First name");
    validateForm();
});

lastName.on("input", () => {
    validateNameInput(lastName, lastNameError, "Last name");
    validateForm();
});

emailInput.on("input", () => {
    validateEmail();
    validateForm();
});

password.on("input", () => {
    validatePassword();
    validatePasswordsMatch();
    validateForm();
});

confirmPassword.on("input", () => {
    validatePasswordsMatch();
    validateForm();
});

gender.on("change", validateForm);

registerButton.on("click", async function () {
    console.log("clicked");
    if (!$(this).prop("disabled")) {
        const selectedGender = gender.filter(":checked").val() || "";
        const user = {
            firstName: firstName.val(),
            lastName: lastName.val(),
            email: emailInput.val(),
            gender: selectedGender,
            password: password.val(),
            role: "user",
        };

        register(user);
    }
});
