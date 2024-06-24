document.addEventListener("DOMContentLoaded", function() {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const passwordError = document.getElementById("password-error");

    function validatePassword() {
        if (password.value !== confirmPassword.value) {
            passwordError.textContent = "Passwords do not match";
        } else {
            passwordError.textContent = "";
        }
    }

    password.addEventListener("change", validatePassword);
    confirmPassword.addEventListener("keyup", validatePassword);
});

document.addEventListener("DOMContentLoaded", function() {
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const email = document.getElementById("email");
    const gender = document.querySelectorAll("input[name='gender']");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const passwordError = document.getElementById("password-error");
    const signUpButton = document.getElementById("sign-up");

    function validateForm() {
        const genderChecked = Array.from(gender).some(g => g.checked);
        const fieldsFilled = firstName.value && lastName.value && email.value && genderChecked && password.value && confirmPassword.value;
        const passwordsMatch = password.value === confirmPassword.value;

        if (fieldsFilled && passwordsMatch) {
            signUpButton.classList.add("active");
            signUpButton.disabled = false;
        } else {
            signUpButton.classList.remove("active");
            signUpButton.disabled = true;
        }

        if (!passwordsMatch) {
            passwordError.textContent = "Passwords do not match";
        } else {
            passwordError.textContent = "";
        }
    }

    firstName.addEventListener("input", validateForm);
    lastName.addEventListener("input", validateForm);
    email.addEventListener("input", validateForm);
    gender.forEach(g => g.addEventListener("change", validateForm));
    password.addEventListener("input", validateForm);
    confirmPassword.addEventListener("input", validateForm);
});

