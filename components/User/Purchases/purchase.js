document.addEventListener('DOMContentLoaded', async function () {
    const getVacationImg = "http://localhost:3000/api/vacations/images/";

    const fetchVacationImg = async (imageName) => {
        try {
            const response = await axios.get(getVacationImg + imageName, { responseType: 'blob' });
            const imageUrl = URL.createObjectURL(response.data);
            return imageUrl;
        } catch (error) {
            console.error("Error fetching image:", error);
            return null;
        }
    };

    const steps = document.querySelectorAll('.step');
    const backButton = document.getElementById('back-button');
    const nextButton = document.getElementById('next-button');
    const contentContainer = document.getElementById('content-container');
    let currentStep = 0;

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
        window.location.href = "../../Auth/login/login.html";
    } else {
        const userObj = getUserFromToken();
        document.querySelector(".logout-container").style.display = "flex";
        document.getElementById("hello-user").textContent = `Hello ${userObj.user.firstName} ${userObj.user.lastName}`;

        const logoutButton = document.getElementById("logout");
        logoutButton.addEventListener("click", () => {
            localStorage.setItem("token", "");
            window.location.href = "../../Auth/login/login.html";
        });
    }

    const updateVacationCard = (vacation) => {
        document.getElementById('destination').textContent = vacation.destination;
        document.getElementById('description').textContent = vacation.description;
        document.getElementById('start-date').textContent = formatDate(vacation.startDate);
        document.getElementById('end-date').textContent = formatDate(vacation.endDate);
        document.getElementById('price').textContent = vacation.price;
        document.getElementById('vacation-type').textContent = vacation.vacationType;
        document.getElementById('company-name').textContent = vacation.companyName?.company || '';
        document.getElementById('trip-category').textContent = vacation.tripCategory?.category || '';
        document.getElementById('rating').textContent = vacation.rating;

        fetchVacationImg(vacation.imageName).then((imageUrl) => {
            document.getElementById('vacation-img').src = imageUrl || 'https://via.placeholder.com/150';
        });
    };

    const fetchBookingsForUser = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/bookings/bookings-by-user/${userId}?populate=true`);
            return response.data;
        } catch (error) {
            console.error("Error fetching bookings:", error);
            return [];
        }
    };

    const initializePage = async () => {
        const userObj = getUserFromToken();
        const bookings = await fetchBookingsForUser(userObj.user._id);

        if (bookings.length > 0) {
            const booking = bookings[0];
            const vacation = booking.vacationId;

            updateVacationCard(vacation);
            document.getElementById('num-passengers').textContent = booking.Passengers;

            generatePassengerFields(booking.Passengers);

            sessionStorage.setItem('booking', JSON.stringify(booking));
        }
    };

    function generatePassengerFields(numPassengers) {
        const passengerFields = document.getElementById('passenger-fields');
        passengerFields.innerHTML = '';
        for (let i = 1; i <= numPassengers; i++) {
            passengerFields.innerHTML += `
                <div class="passenger-card">
                    <h3>Passenger ${i}</h3>
                    <label for="first-name-${i}">First Name:</label>
                    <input type="text" id="first-name-${i}" required pattern="[A-Za-z ]{2,}" maxlength="30"><br>
                    <span class="error-message" id="error-first-name-${i}"></span>
                    <br>
                    <label for="last-name-${i}">Last Name:</label>
                    <input type="text" id="last-name-${i}" required pattern="[A-Za-z ]{2,}" maxlength="30"><br>
                    <span class="error-message" id="error-last-name-${i}"></span>
                    <br>
                    <label for="email-${i}">Email:</label>
                    <input type="email" id="email-${i}" required placeholder="example@example.com"><br>
                    <span class="error-message" id="error-email-${i}"></span>
                    <br>
                    <label for="dob-${i}">Date of Birth:</label>
                    <input type="date" id="dob-${i}" required><br>
                    <span class="error-message" id="error-dob-${i}"></span>
                    <br>
                    <label for="passport-number-${i}">Passport Number:</label>
                    <input type="text" id="passport-number-${i}" required pattern="\\d{9}" maxlength="9"><br>
                    <span class="error-message" id="error-passport-number-${i}"></span>
                    <br>
                    <label for="passport-expiry-${i}">Passport Expiry Date:</label>
                    <input type="date" id="passport-expiry-${i}" required>
                    <span class="error-message" id="error-passport-expiry-${i}"></span>
                    <br>
                </div>
                <br>
            `;
        }

        addInputValidation();
    }

    function addInputValidation() {
        const inputs = contentContainer.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('input', function () {
                validateInput(input);
                toggleSubmitButton();
            });
        });
    }

    function validateInput(input) {
        const errorMessage = document.getElementById(`error-${input.id}`);
        if (input.validity.patternMismatch) {
            input.classList.add('invalid');
            if (input.id === 'card-number') {
                errorMessage.textContent = 'Only Numbers. Card number must be 16 digits.';
            } else if (input.id === 'cvv') {
                errorMessage.textContent = 'Only Numbers. CVV must be 3 digits.';
            } else if (input.id.startsWith('passport-number')) {
                errorMessage.textContent = 'Only Numbers. Passport number must be 9 digits.';
            } else if (input.id === 'contact-first-name' || input.id === 'contact-last-name' ||
                input.id === 'payment-name' || input.id === 'payment-surname' ||
                input.id.startsWith('first-name') || input.id.startsWith('last-name')) {
                if (/[^a-zA-Z ]/.test(input.value)) {
                    errorMessage.textContent = 'Only letters are allowed.';
                } else if (input.value.replace(/\s/g, '').length < 2) {
                    errorMessage.textContent = 'Must contain at least 2 letters!';
                } else {
                    errorMessage.textContent = 'Invalid input.';
                }
            } else {
                errorMessage.textContent = 'Invalid input.';
            }
        } else if (input.validity.valueMissing) {
            input.classList.add('invalid');
            errorMessage.textContent = 'This field is required.';
        } else if (input.id === 'card-number' && input.value.length < 16) {
            input.classList.add('invalid');
            errorMessage.textContent = 'Card number must be 16 digits.';
        } else if (input.id === 'cvv' && input.value.length < 3) {
            input.classList.add('invalid');
            errorMessage.textContent = 'CVV must be 3 digits.';
        } else if (input.id.startsWith('passport-number') && input.value.length < 9) {
            input.classList.add('invalid');
            errorMessage.textContent = 'Passport number must be 9 digits.';
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            input.classList.add('invalid');
            errorMessage.textContent = 'Invalid email address.';
        } else {
            input.classList.remove('invalid');
            errorMessage.textContent = '';
        }
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validateStep(step) {
        let isValid = true;
        let inputs;

        if (step === 0) {
            inputs = document.querySelectorAll('#order-summary input[required], #contact-card input[required]');
        } else if (step === 1) {
            inputs = document.querySelectorAll('#make-payment input[required]');
        } else {
            return true;
        }

        inputs.forEach(input => {
            if (input.value.trim() === '' || !input.checkValidity()) {
                isValid = false;
                input.classList.add('invalid');
                validateInput(input);
            } else {
                input.classList.remove('invalid');
            }
        });

        return isValid;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    function displayPassengerSummary() {
        const passengers = JSON.parse(sessionStorage.getItem('passengers'));
        const passengerSummary = document.getElementById('passenger-summary');
        passengerSummary.innerHTML = '<h3 class="passenger-details-title">Passengers Details</h3>';
        if (passengers) {
            passengers.forEach((passenger, index) => {
                passengerSummary.innerHTML += `
                    <div class="passenger-card">
                        <h4>Passenger ${index + 1}</h4>
                        <p><strong>First Name:</strong> ${passenger.firstName}</p>
                        <p><strong>Last Name:</strong> ${passenger.lastName}</p>
                        <p><strong>Email:</strong> ${passenger.email}</p>
                        <p><strong>Date of Birth:</strong> ${formatDate(passenger.dob)}</p>
                        <p><strong>Passport Number:</strong> ${passenger.passportNumber}</p>
                        <p><strong>Passport Expiry Date:</strong> ${formatDate(passenger.passportExpiry)}</p>
                    </div>
                `;
            });
        }
    }

    function clearPaymentFields() {
        const paymentFields = ['card-number', 'expiry-date', 'cvv', 'payment-name', 'payment-surname', 'payment-email'];
        paymentFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = '';
                field.classList.remove('invalid');
                const errorMessage = document.getElementById(`error-${fieldId}`);
                if (errorMessage) {
                    errorMessage.textContent = '';
                }
            }
        });
        toggleSubmitButton();
    }

    function toggleNextButton() {
        if (currentStep === 1) {
            nextButton.disabled = true;
            nextButton.style.backgroundColor = 'gray';
        } else {
            nextButton.disabled = false;
            nextButton.style.backgroundColor = '';
        }
    }

    function toggleSubmitButton() {
        const submitButton = document.getElementById('submit-payment');
        const inputs = document.querySelectorAll('#make-payment input[required]');
        let allValid = true;

        inputs.forEach(input => {
            if (input.value.trim() === '' || input.classList.contains('invalid')) {
                allValid = false;
            }
        });

        if (allValid) {
            submitButton.disabled = false;
            submitButton.style.backgroundColor = 'green';
        } else {
            submitButton.disabled = true;
            submitButton.style.backgroundColor = 'gray';
        }
    }

    function updateNextButtonText() {
        if (currentStep === 2) {
            nextButton.textContent = 'Back To Homepage';
            nextButton.removeEventListener('click', handleNextClick);
            nextButton.addEventListener('click', function () {
                window.location.href = '../../Home/home.html';
            });
        } else {
            nextButton.textContent = 'Continue';
            nextButton.removeEventListener('click', handleNextClick);
            nextButton.addEventListener('click', handleNextClick);
        }
    }

    function handleNextClick() {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                if (currentStep === 0) {
                    storePassengerData();
                }
                currentStep++;
                updateSteps();
                window.scrollTo(0, 0);
            }
        } else {
            alert('Please fill out all required fields correctly.');
        }
    }

    function toggleBackButton() {
        if (currentStep === 0) {
            backButton.disabled = true;
            backButton.style.backgroundColor = 'gray';
        } else {
            backButton.disabled = false;
            backButton.style.backgroundColor = '';
        }

        if (currentStep === 2) {
            backButton.disabled = true;
            backButton.style.backgroundColor = 'gray';
        }
    }

    backButton.addEventListener('click', function () {
        if (currentStep > 0) {
            currentStep--;
            updateSteps();
            window.scrollTo(0, 0);
        }
    });

    nextButton.addEventListener('click', handleNextClick);

    function storePassengerData() {
        const numPassengers = parseInt(document.getElementById('num-passengers').textContent, 10);
        const passengers = [];

        for (let i = 1; i <= numPassengers; i++) {
            const passenger = {
                firstName: document.getElementById(`first-name-${i}`).value,
                lastName: document.getElementById(`last-name-${i}`).value,
                email: document.getElementById(`email-${i}`).value,
                dob: document.getElementById(`dob-${i}`).value,
                passportNumber: document.getElementById(`passport-number-${i}`).value,
                passportExpiry: document.getElementById(`passport-expiry-${i}`).value,
            };
            passengers.push(passenger);
        }

        const contactDetails = {
            email: document.getElementById('contact-email').value,
            firstName: document.getElementById('contact-first-name').value,
            lastName: document.getElementById('contact-last-name').value,
        };

        sessionStorage.setItem('passengers', JSON.stringify(passengers));
        sessionStorage.setItem('contactDetails', JSON.stringify(contactDetails));
    }

    function updateFinishSection(vacation) {
        document.getElementById('finish-destination').textContent = vacation.destination;
        document.getElementById('finish-description').textContent = vacation.description;
        document.getElementById('finish-start-date').textContent = formatDate(vacation.startDate);
        document.getElementById('finish-end-date').textContent = formatDate(vacation.endDate);
        document.getElementById('finish-price').textContent = vacation.price;
        document.getElementById('finish-num-passengers').textContent = document.getElementById('num-passengers').textContent;
        document.getElementById('finish-vacation-type').textContent = vacation.vacationType;
        document.getElementById('finish-company-name').textContent = vacation.companyName?.company || '';
        document.getElementById('finish-trip-category').textContent = vacation.tripCategory?.category || '';
        document.getElementById('finish-rating').textContent = vacation.rating;

        fetchVacationImg(vacation.imageName).then((imageUrl) => {
            document.getElementById('finish-vacation-img').src = imageUrl || 'https://via.placeholder.com/150';
        });
    }

    function updateSteps() {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
            const underline = step.querySelector('.underline');
            underline.style.width = index === currentStep ? '100%' : '0';
        });
        loadStepContent();
        if (currentStep !== 1) {
            clearPaymentFields();
        }
        toggleNextButton();
        updateNextButtonText();
        toggleBackButton();
    }

    function loadStepContent() {
        const stepContents = document.querySelectorAll('.step-content');
        stepContents.forEach((content, index) => {
            content.style.display = index === currentStep ? 'block' : 'none';
        });

        switch (currentStep) {
            case 0:
                const booking = JSON.parse(sessionStorage.getItem('booking'));
                if (booking) {
                    generatePassengerFields(booking.Passengers);
                }
                break;
            case 1:
                const paymentForm = document.getElementById('payment-form');
                paymentForm.removeEventListener('submit', handlePaymentSubmit);
                paymentForm.addEventListener('submit', handlePaymentSubmit);
                addInputValidation();
                toggleSubmitButton();
                break;
            case 2:
                const storedBooking = JSON.parse(sessionStorage.getItem('booking'));
                const vacation = storedBooking.vacationId;
                updateFinishSection(vacation);
                displayPassengerSummary();
                document.getElementById('booking-number').textContent = storedBooking.OrderNumber;
                backButton.disabled = true;
                backButton.style.backgroundColor = 'gray';
                break;
        }
    }

    function handlePaymentSubmit(event) {
        event.preventDefault();
        if (validateStep(currentStep)) {
            alert('Payment processed.');
            currentStep++;
            updateSteps();
            window.scrollTo(0, 0);
        } else {
            alert('Please fill out all required fields correctly.');
        }
    }

    await initializePage();
    updateSteps();
});
