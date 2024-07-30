const userLoginUrl = "http://localhost:3000/api/auth/login/";

const emailInput = document.getElementById("email");
const password = document.getElementById("password");
const loginButton = document.getElementById("login-button");

const passwordError = document.getElementById("password-error");
const passwordLengthError = document.getElementById("password-length-error");
const emailError = document.getElementById("email-error");


const login = async (credentials) => {
  try {
    const response = await axios.post(userLoginUrl, credentials);
    const token = response.data;
    if (typeof token === 'string') {
      localStorage.setItem("token", token);
      window.location.href = "../../Home/home.html";
    } else {
      console.log('incorrect email or password');
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}


  const getUserFromToken = () => {
      let user = null;
      const token = localStorage.getItem('token');

      if (token) {
          const encodedObject = jwt_decode(token);
          user = encodedObject.user;
      }

      return {
          user: user,
          token: token
      };
  };

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

const validateForm = () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const fieldsFilled = isEmailValid && isPasswordValid;
  
    loginButton.classList.toggle("active", fieldsFilled);
    loginButton.disabled = !fieldsFilled;
};

emailInput.addEventListener("input", () => {
    validateEmail();
    validateForm();
  });
  
  password.addEventListener("input", () => {
    validatePassword();
    validateForm();
});

loginButton.addEventListener("click", async function () {
    console.log("clicked");
    if (!this.disabled) {
      const credentials = {
        email: emailInput.value,
        password: password.value,
      };
      login(credentials);
    }
});
        

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