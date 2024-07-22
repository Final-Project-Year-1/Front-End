document.addEventListener('DOMContentLoaded', function () {
    const steps = document.querySelectorAll('.step');
    const backButton = document.getElementById('back-button');
    const nextButton = document.getElementById('next-button');
    const contentContainer = document.getElementById('content-container');
    let currentStep = 0;

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
        toggleNextButton(); // Update next button state
        updateNextButtonText(); // Update next button text
        toggleBackButton(); // Update back button state
    }

    function loadStepContent() {
        const stepContents = document.querySelectorAll('.step-content');
        stepContents.forEach((content, index) => {
            content.style.display = index === currentStep ? 'block' : 'none';
        });

        switch (currentStep) {
            case 0:
                document.getElementById('num-passengers').addEventListener('input', generatePassengerFields);
                generatePassengerFields(); // Initial call to generate fields based on default value
                break;
            case 1:
                const paymentForm = document.getElementById('payment-form');
                paymentForm.removeEventListener('submit', handlePaymentSubmit); // Remove previous event listener
                paymentForm.addEventListener('submit', handlePaymentSubmit); // Add new event listener
                addInputValidation(); // Add validation to the payment form inputs
                toggleSubmitButton(); // Update submit button state
                break;
            case 2:
                displayPassengerSummary();
                document.getElementById('booking-number').textContent = Math.floor(Math.random() * 10000);
                backButton.disabled = true; // Disable the back button
                backButton.style.backgroundColor = 'gray'; // Change the color to gray
                break;
        }
    }

    function handlePaymentSubmit(event) {
        event.preventDefault();
        if (validateStep(currentStep)) {
            alert('Payment processed.');
            currentStep++;
            updateSteps();
            window.scrollTo(0, 0); // Scroll to the top of the page
        } else {
            alert('Please fill out all required fields correctly.');
        }
    }

    function generatePassengerFields() {
        const numPassengers = parseInt(document.getElementById('num-passengers').value, 10);
        if (numPassengers < 1) {
            document.getElementById('num-passengers').value = 1;
            return;
        }

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
                toggleSubmitButton(); // Update submit button state
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
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validateStep(step) {
        let isValid = true;
        let inputs;

        // Validate only the inputs in the current step
        if (step === 0) {
            inputs = document.querySelectorAll('#order-summary input[required], #contact-info input[required]');
        } else if (step === 1) {
            inputs = document.querySelectorAll('#make-payment input[required]');
        } else {
            return true; // No validation needed for step 2
        }

        inputs.forEach(input => {
            if (input.value.trim() === '' || !input.checkValidity()) {
                isValid = false;
                input.classList.add('invalid');
                validateInput(input);
                console.log(`Invalid input: ${input.id}`);
            } else {
                input.classList.remove('invalid');
            }
        });

        console.log(`Step ${step} is ${isValid ? 'valid' : 'invalid'}`);
        return isValid;
    }

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
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
        toggleSubmitButton(); // Update submit button state
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
            nextButton.removeEventListener('click', handleNextClick); // Remove previous click handler
            nextButton.addEventListener('click', function () {
                window.location.href = 'file:///C:/Users/omer3/Desktop/Front-End/components/Home/home.html'; // Redirect to homepage
            });
        } else {
            nextButton.textContent = 'Continue';
            nextButton.removeEventListener('click', handleNextClick); // Remove previous click handler
            nextButton.addEventListener('click', handleNextClick); // Add new click handler
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
                window.scrollTo(0, 0); // Scroll to the top of the page
            }
        } else {
            alert('Please fill out all required fields correctly.');
        }
    }

    function toggleBackButton() {
        if (currentStep === 2) {
            backButton.disabled = true;
            backButton.style.backgroundColor = 'gray';
        } else {
            backButton.disabled = false;
            backButton.style.backgroundColor = '';
        }
    }

    backButton.addEventListener('click', function () {
        if (currentStep > 0) {
            currentStep--;
            updateSteps();
            window.scrollTo(0, 0); // Scroll to the top of the page
        }
    });

    nextButton.addEventListener('click', handleNextClick);

    function storePassengerData() {
        const numPassengers = parseInt(document.getElementById('num-passengers').value, 10);
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

    updateSteps();
});
