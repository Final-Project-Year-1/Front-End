const userRegisterUrl = "http://localhost:3000/api/auth/register/";

const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const emailInput = document.getElementById("email");
const gender = document.querySelectorAll("input[name='gender']");
const password = document.getElementById("password");
const registerButton = document.getElementById("sign-up");

const confirmPassword = document.getElementById("confirm-password");
const passwordError = document.getElementById("password-error");
const firstNameError = document.getElementById("first-name-error");
const lastNameError = document.getElementById("last-name-error");
const passwordMatchError = document.getElementById("password-match-error");
const passwordLengthError = document.getElementById("password-length-error");
const emailError = document.getElementById("email-error");


const register = async (user) => {
  try {
    const response = await axios.post(userRegisterUrl, user);
    const token = response.data;
    localStorage.setItem("token", token);     
    window.location.href = "../../Home/home.html";
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

const validatePassword = () => {
  const passValue = password.value;
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

  passwordLengthError.textContent = passMessage;
  return passValue.length >= 8 && passMessage === "";
};

const validatePasswordsMatch = () => {
  const passwordsMatch = password.value === confirmPassword.value;
  if (!passwordsMatch && confirmPassword.value.length > 0) {
    passwordMatchError.textContent = "Passwords do not match";
  } else {
    passwordMatchError.textContent = "";
  }
  return passwordsMatch;
};

const togglePasswordButton = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");
const eyeIcon = togglePasswordButton.querySelector(".bi-eye");

togglePasswordButton.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  eyeIcon.setAttribute("fill", type === "password" ? "currentColor" : "#000000");
});

const validateEmail = () => {
  const email = emailInput.value;
  const validEmailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const isValidEmail = validEmailPattern.test(email);

  if (!isValidEmail) {
    emailError.textContent = "Invalid email address";
  } else {
    emailError.textContent = "";
  }
  return isValidEmail;
};

const validateNameInput = (inputElement, errorElement, nameType) => {
  const value = inputElement.value;
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

  errorElement.textContent = errorMessage;
  return value.length >= 2 && errorMessage === "";
};

const validateForm = () => {
  const isFirstNameValid = validateNameInput(firstName, firstNameError, "First name");
  const isLastNameValid = validateNameInput(lastName, lastNameError, "Last name");
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const passwordsMatch = validatePasswordsMatch();
  const genderChecked = Array.from(gender).some((g) => g.checked);
  const fieldsFilled =
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    genderChecked &&
    isPasswordValid &&
    passwordsMatch;

  registerButton.classList.toggle("active", fieldsFilled);
  registerButton.disabled = !fieldsFilled;
};

firstName.addEventListener("input", () => {
  validateNameInput(firstName, firstNameError, "First name");
  validateForm();
});

lastName.addEventListener("input", () => {
  validateNameInput(lastName, lastNameError, "Last name");
  validateForm();
});

emailInput.addEventListener("input", () => {
  validateEmail();
  validateForm();
});

password.addEventListener("input", () => {
  validatePassword();
  validatePasswordsMatch();
  validateForm();
});

confirmPassword.addEventListener("input", () => {
  validatePasswordsMatch();
  validateForm();
});

gender.forEach((g) => g.addEventListener("change", validateForm));

registerButton.addEventListener("click", async function () {
  console.log("clicked");
  if (!this.disabled) {
    const selectedGender = Array.from(gender).find((g) => g.checked)?.value || "";
    const user = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: emailInput.value,
      gender: selectedGender,
      password: password.value,
      role: "user",
    };

    register(user);
  }
});