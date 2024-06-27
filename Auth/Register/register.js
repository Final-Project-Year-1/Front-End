document.addEventListener("DOMContentLoaded", function() {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const passwordError = document.getElementById("password-error");

    function validatePassword() {
        const passValue = password.value;
        let passMessage = '';

        if (passValue.length > 0) {
            if (!/^[a-zA-Z0-9!@#$^₪]+$/.test(passValue)) {
                passMessage = `Invalid input .`;
            } else if (passValue.length < 8) {
                passMessage = 'Password too short';
            } else if (passValue.length > 30) {
                passMessage = 'Password too long';
            } else if (!/[a-zA-Z]/.test(passValue)) {
                passMessage = 'Password must contain letters';
            } else if (!/[0-9]/.test(passValue)) {
                passMessage = 'Password must contain numbers';
            }
        }

        passwordLengthError.textContent = passMessage;
        return passValue.length >= 8 && passMessage === '';
    }

    function validatePasswordsMatch() {
        const passwordsMatch = password.value === confirmPassword.value;
        if (!passwordsMatch && confirmPassword.value.length > 0) {
            passwordMatchError.textContent = "Passwords do not match";
        } else {
            passwordMatchError.textContent = ""; // Clear the message when passwords match
        }
        return passwordsMatch;
    }

    password.addEventListener("change", validatePassword);
    confirmPassword.addEventListener("keyup", validatePassword);
});

document.addEventListener("DOMContentLoaded", function() {
    const togglePasswordButton = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const eyeIcon = togglePasswordButton.querySelector('.bi-eye');

    togglePasswordButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Change the SVG icon
        eyeIcon.setAttribute('fill', type === 'password' ? 'currentColor' : '#000000'); 
    });
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
        return isValidEmail;
    }

    function validateNameInput(inputElement, errorElement, nameType) {
        const value = inputElement.value;
        let errorMessage = '';

        if (value.length > 0) {
            if (!/^[a-zA-Z]+$/.test(value)) {
                errorMessage = `Invalid input.`;
            } else if (value.length < 2) {
                errorMessage = `${nameType} too short`;
            } else if (value.length > 20) {
                errorMessage = `${nameType} too long`;
            }
        }

        errorElement.textContent = errorMessage;
        return value.length >= 2 && errorMessage === '';
    }

    function validatePassword() {
        const passValue = password.value;
        let passMessage = '';

        if (passValue.length > 0) {
            if (!/^[a-zA-Z0-9!@#$^₪]+$/.test(passValue)) {
                passMessage = `Invalid input.`;
            } else if (passValue.length < 8) {
                passMessage = 'Password too short';
            } else if (passValue.length > 30) {
                passMessage = 'Password too long';
            } else if (!/[a-zA-Z]/.test(passValue)) {
                passMessage = 'Password must contain letters';
            } else if (!/[0-9]/.test(passValue)) {
                passMessage = 'Password must contain numbers';
            }
        }

        passwordLengthError.textContent = passMessage;
        return passValue.length >= 8 && passMessage === '';
    }

    function validatePasswordsMatch() {
        const passwordsMatch = password.value === confirmPassword.value;
        if (!passwordsMatch && confirmPassword.value.length > 0) {
            passwordMatchError.textContent = "Passwords do not match";
        } else {
            passwordMatchError.textContent = ""; // Clear the message when passwords match
        }
        return passwordsMatch;
    }

    function validateForm() {
        const isFirstNameValid = validateNameInput(firstName, firstNameError, 'First name');
        const isLastNameValid = validateNameInput(lastName, lastNameError, 'Last name');
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const passwordsMatch = validatePasswordsMatch();
        const genderChecked = Array.from(gender).some(g => g.checked);
        const fieldsFilled = isFirstNameValid && isLastNameValid && isEmailValid && genderChecked && isPasswordValid && passwordsMatch;

        signUpButton.classList.toggle("active", fieldsFilled);
        signUpButton.disabled = !fieldsFilled;
    }

    firstName.addEventListener("input", function() {
        validateNameInput(firstName, firstNameError, 'First name');
        validateForm();
    });
    lastName.addEventListener("input", function() {
        validateNameInput(lastName, lastNameError, 'Last name');
        validateForm();
    });
    emailInput.addEventListener("input", function() {
        validateEmail();
        validateForm();
    });
    password.addEventListener("input", function() {
        validatePassword();
        validatePasswordsMatch();
        validateForm();
    });
    confirmPassword.addEventListener("input", function() {
        validatePasswordsMatch();
        validateForm();
    });
    gender.forEach(g => g.addEventListener("change", validateForm));

    signUpButton.addEventListener("click", function() {
        if (!signUpButton.disabled) {
            window.location.href = '../../UserArea/allVacations.html';
        }
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
