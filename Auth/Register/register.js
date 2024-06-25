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
    const emailInput = document.getElementById("email");
    const gender = document.querySelectorAll("input[name='gender']");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const firstNameError = document.getElementById("first-name-error");
    const lastNameError = document.getElementById("last-name-error");
    const passwordLengthError = document.getElementById("password-length-error");
    const passwordMatchError = document.getElementById("password-match-error");
    const emailError = document.getElementById("email-error");
    const signUpButton = document.getElementById("sign-up");

    function validateEmail() {
        const email = emailInput.value;
        const validEmailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        const isValidEmail = validEmailPattern.test(email);
        emailError.textContent = email.length > 0 && !isValidEmail ? 'Invalid email address' : '';
        validateForm();
    }

    function validateNameInput(inputElement, errorElement, nameType) {
        const value = inputElement.value;
        if (!/^[a-zA-Z]+$/.test(value) && value.length > 0) {
            errorElement.textContent = `Invalid input`;
            return false;
        } else {
            let errorMessage = '';
            if (value.length < 2 && value.length > 0) {
                errorMessage = `${nameType} too short`;
            } else if (value.length > 20) {
                errorMessage = `${nameType} too long`;
            }
            errorElement.textContent = errorMessage;
            return errorMessage === '';
        }
    }

    function validatePassword() {
        const passValue = password.value;
        if (!/^[a-zA-Z0-9!^₪#]+$/.test(passValue) && passValue.length > 0) {
            passwordLengthError.textContent = `Invalid input`;
            return false;
        } else {
            let passMessage = '';
            if (passValue.length < 8 && passValue.length > 0) {
                passMessage = 'Password too short';
            } else if (passValue.length > 30) {
                passMessage = 'Password too long';
            }
            passwordLengthError.textContent = passMessage;
            return passMessage === '';
        }
    }

    function validatePasswordsMatch() {
        const passwordsMatch = password.value === confirmPassword.value;
        if (!passwordsMatch && confirmPassword.value.length > 0) {
            passwordMatchError.textContent = "Passwords do not match";
        } else {
            passwordMatchError.textContent = ""; // Clear the message when passwords match
        }
        validateForm();
    }

    function validateForm() {
        const isFirstNameValid = validateNameInput(firstName, firstNameError, 'First name');
        const isLastNameValid = validateNameInput(lastName, lastNameError, 'Last name');
        const isPasswordValid = validatePassword();
        const genderChecked = Array.from(gender).some(g => g.checked);
        const passwordsMatch = password.value === confirmPassword.value && confirmPassword.value.length > 0;
        const fieldsFilled = isFirstNameValid && isLastNameValid && emailInput.value && genderChecked && isPasswordValid && passwordsMatch;

        signUpButton.classList.toggle("active", fieldsFilled);
        signUpButton.disabled = !fieldsFilled;
    }

    firstName.addEventListener("input", validateForm);
    lastName.addEventListener("input", validateForm);
    emailInput.addEventListener("input", validateEmail);
    password.addEventListener("input", validatePassword);
    confirmPassword.addEventListener("input", validatePasswordsMatch);
    gender.forEach(g => g.addEventListener("change", validateForm));
});

document.addEventListener("DOMContentLoaded", function() {
    const togglePasswordButton = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const eyeIcon = togglePasswordButton.querySelector('.bi-eye');

    togglePasswordButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Change the SVG icon
        eyeIcon.setAttribute('fill', type === 'password' ? 'currentColor' : '#000000');  // Here you can adjust to toggle between different icons or colors
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const signUpButton = document.getElementById('sign-up');

    signUpButton.addEventListener('click', function() {
        if (!this.disabled) {
            window.location.href = '../../UserArea/allVacations.html';
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');

    function validateEmail() {
        const email = emailInput.value;
        const validEmailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/; 
        const isValidEmail = validEmailPattern.test(email);
        
        if (!isValidEmail) {
            emailError.textContent = 'Invalid email address';
        } else {
            emailError.textContent = '';
        }
    }

    emailInput.addEventListener('input', validateEmail);
});
