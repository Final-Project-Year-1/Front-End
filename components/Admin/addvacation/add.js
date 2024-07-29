const addNewVacationURL = "http://localhost:3000/api/vacations";
const allCompaniesURL = "http://localhost:3000/api/all-companies";
const allCategoriesURL = "http://localhost:3000/api/allCategories";
const deleteVacationURL = "http://localhost:3000/api/vacations/"; // here comes the id
const updateVacationURL = "http://localhost:3000/api/vacations/"; // here comes the id
const allVacationsURL = "http://localhost:3000/api/Allvacations";
const findCategoryURL = "http://localhost:3000/api/find-category/"; // here comes the id
const findCompanyURL = "http://localhost:3000/api/findCompany/"; // here comes the id
const getVacationImg = "http://localhost:3000/api/vacations/images/";
const findVacationURL = "http://localhost:3000/api/vacations/"; // here comes the id
const totalVacationsURL = "http://localhost:3000/api/vacation/total-vacations";
const allImagesURL = "http://localhost:3000/api/vacation-images/";

document.addEventListener("DOMContentLoaded", function() {
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

    if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
        const userObj = getUserFromToken();
        document.querySelector(".top-button-logged-in").style.display = "block";
        document.querySelector(".top-button").style.display = "none";
        document.getElementById("hello-user").textContent = `Hello ${userObj.user.firstName} ${userObj.user.lastName}`;
    }

    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", () => {
        localStorage.setItem("token", "");
        window.location.href = "../Auth/Login/login.html";
    });

    document.getElementById('add-button').addEventListener('click', () => {
        showForm('vacation-form');
    });
    document.getElementById('delete-button').addEventListener('click', () => {
        showForm('delete-vacation-form');
    });
    document.getElementById('update-button').addEventListener('click', () => {
        showForm('update-vacation-id-form');
    });
    document.getElementById('view-all-button').addEventListener('click', () => {
        showForm('view-all-vacations');
        loadAllVacations();
        updateTotalVacationsCount();
    });
    document.getElementById('find-button').addEventListener('click', () => {
        showForm('find-vacation-form');
    });
    document.getElementById('total-images-button').addEventListener('click', () => {
        showForm('view-all-images');
        loadAllImages();
    });

    async function showForm(formId) {
        clearAllForms(); // clear all forms before showing the new one
        document.querySelectorAll('.form-section').forEach(form => form.style.display = 'none');
        document.getElementById(formId).style.display = 'block';
        if (formId !== 'view-all-vacations') {
            document.getElementById('total-vacations-result').style.display = 'none';
        }
    }

    function clearAllForms() {
        document.querySelectorAll('form').forEach(form => form.reset());
        clearErrorMessages();
        clearMessages();
    }

    function clearMessages() {
        document.querySelectorAll('.success, .error').forEach(el => el.textContent = '');
    }

    document.getElementById('vacation-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        clearErrorMessages();

        const formData = new FormData(event.target);
        const images = formData.getAll('images');

        if (images.length < 1) {
            document.getElementById('images-error').textContent = 'You must upload at least 1 image.';
            return;
        }

        if (!await validateFormData(formData)) {
            return;
        }

        const data = {
            destination: formData.get('destination'),
            description: formData.get('description'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            price: formData.get('price'),
            groupOf: formData.get('groupOf'),
            vacationType: formData.get('vacationType'),
            companyName: formData.get('companyName'),
            tripCategory: formData.get('tripCategory'),
            imageName: formData.get('vacationImage'),
            images: []
        };

        images.forEach((image, index) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                data.images.push(event.target.result);
                if (index === images.length - 1) {
                    submitFormData(addNewVacationURL, 'POST', data, 'vacation-form-result');
                }
            };
            reader.readAsDataURL(image);
        });
    });

    document.getElementById('delete-vacation-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const vacationId = document.getElementById('vacation-id-delete').value;

        try {
            const vacation = await fetchVacation(vacationId);
            if (vacation) {
                const response = await fetch(`${deleteVacationURL}${vacationId}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                const deleteResultDiv = document.getElementById('delete-vacation-result');
                if (response.ok) {
                    deleteResultDiv.textContent = 'Vacation deleted successfully';
                    deleteResultDiv.className = 'success';
                    document.getElementById(vacationId).remove();
                    updateTotalVacationsCount();
                } else {
                    deleteResultDiv.textContent = 'Failed to delete vacation';
                    deleteResultDiv.className = 'error';
                }
            } else {
                const deleteResultDiv = document.getElementById('delete-vacation-result');
                deleteResultDiv.textContent = 'Vacation not found';
                deleteResultDiv.className = 'error';
            }
        } catch (error) {
            console.error('Error:', error);
            const deleteResultDiv = document.getElementById('delete-vacation-result');
            deleteResultDiv.textContent = 'Failed to delete vacation';
            deleteResultDiv.className = 'error';
        }
    });

    async function fetchVacation(vacationId) {
        try {
            const response = await fetch(`${findVacationURL}${vacationId}`);
            if (response.ok) {
                return await response.json();
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching vacation:', error);
            return null;
        }
    }

    document.getElementById('update-vacation-id-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const vacationId = document.getElementById('vacation-id-update').value;

        try {
            const response = await fetch(`${findVacationURL}${vacationId}`);
            const result = await response.json();
            const updateIdResultDiv = document.getElementById('update-vacation-id-result');
            if (response.ok) {
                updateIdResultDiv.textContent = '';
                showForm('update-vacation-form-container');
                populateUpdateForm(result);
                displayVacationCard(result);
            } else {
                updateIdResultDiv.textContent = 'Vacation not found';
                updateIdResultDiv.className = 'error';
            }
        } catch (error) {
            console.error('Error:', error);
            const updateIdResultDiv = document.getElementById('update-vacation-id-result');
            updateIdResultDiv.textContent = 'Failed to find vacation';
            updateIdResultDiv.className = 'error';
        }
    });

    function populateUpdateForm(vacation) {
        document.getElementById('vacation-id-update-hidden').value = vacation._id;
        document.getElementById('vacation-id-update-hidden').dataset.spotsTaken = vacation.spotsTaken; // Save spotsTaken to data attribute
        document.getElementById('destination-update').value = vacation.destination;
        document.getElementById('description-update').value = vacation.description;
        document.getElementById('start-date-update').value = vacation.startDate.split('T')[0];
        document.getElementById('end-date-update').value = vacation.endDate.split('T')[0];
        document.getElementById('price-update').value = vacation.price;
        document.getElementById('group-of-update').value = vacation.groupOf;
        document.getElementById('vacation-type-update').value = vacation.vacationType;
        document.getElementById('company-name-update').value = vacation.companyName._id;
        document.getElementById('trip-category-update').value = vacation.tripCategory._id;
        document.getElementById('vacation-image-update').value = vacation.imageName;
    }

    function displayVacationCard(vacation) {
        const vacationCardContainer = document.getElementById('vacation-card-container');
        vacationCardContainer.innerHTML = '';

        const listItem = document.createElement('div');
        listItem.classList.add('vacation-card');
        listItem.id = vacation._id;
        listItem.innerHTML = `
            <img src="${getVacationImg}${vacation.imageName}" alt="Vacation Image">
            <h3>${vacation.destination}</h3>
            <p class="details">Description: ${vacation.description}</p>
            <p>Start Date: ${new Date(vacation.startDate).toLocaleDateString()}</p>
            <p>End Date: ${new Date(vacation.endDate).toLocaleDateString()}</p>
            <p>Price: $${vacation.price}</p>
            <p>Group Size: ${vacation.groupOf}</p>
            <p>Spots Taken: ${vacation.spotsTaken}</p>
            <p>Spots Left: ${vacation.spotsLeft}</p>
            <p>Vacation Type: ${vacation.vacationType}</p>
            <p>Company Name: ${vacation.companyName.company} (ID: ${vacation.companyName._id})</p>
            <p>Trip Category: ${vacation.tripCategory.category} (ID: ${vacation.tripCategory._id})</p>
            <p>Rating: ${vacation.rating}</p>
            <p>Image Name: ${vacation.imageName}</p>
            <p>ID: ${vacation._id}</p>
        `;
        vacationCardContainer.appendChild(listItem);
    }

    document.getElementById('update-vacation-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        clearErrorMessages();

        const vacationId = document.getElementById('vacation-id-update-hidden').value;
        const formData = new FormData(event.target);
        const images = formData.getAll('images');
        const spotsTaken = document.getElementById('vacation-id-update-hidden').dataset.spotsTaken;

        if (images.length < 1) {
            document.getElementById('images-update-error').textContent = 'You must upload at least 1 image.';
            return;
        }

        if (!await validateFormData(formData, true, spotsTaken)) {
            return;
        }

        const data = {
            destination: formData.get('destination'),
            description: formData.get('description'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            price: formData.get('price'),
            groupOf: formData.get('groupOf'),
            vacationType: formData.get('vacationType'),
            companyName: formData.get('companyName'),
            tripCategory: formData.get('tripCategory'),
            imageName: formData.get('vacationImage'),
            images: []
        };

        images.forEach((image, index) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                data.images.push(event.target.result);
                if (index === images.length - 1) {
                    submitFormData(`${updateVacationURL}${vacationId}`, 'PUT', data, 'update-vacation-result');
                }
            };
            reader.readAsDataURL(image);
        });
    });

    document.getElementById('find-vacation-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const vacationId = document.getElementById('vacation-id-find').value;

        try {
            const response = await fetch(`${findVacationURL}${vacationId}`);
            if (response.ok) {
                const vacation = await response.json();
                showForm('view-all-vacations');
                document.getElementById('vacation-list').innerHTML = ''; // Clear previous results
                appendVacationCard(vacation);
                document.getElementById('total-vacations-result').style.display = 'none';
            } else {
                const findResultDiv = document.getElementById('find-vacation-result');
                findResultDiv.textContent = 'Vacation not found';
                findResultDiv.className = 'error';
            }
        } catch (error) {
            console.error('Error:', error);
            const findResultDiv = document.getElementById('find-vacation-result');
            findResultDiv.textContent = 'Failed to find vacation';
            findResultDiv.className = 'error';
        }
    });

    async function submitFormData(url, method, data, resultElementId) {
        console.log('Submitting form data:', data); // log for debugging

        const isValid = await validateCompanyAndCategory(data, resultElementId);
        if (!isValid) return;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            const resultElement = document.getElementById(resultElementId);
            if (response.ok) {
                resultElement.textContent = 'Vacation submitted successfully';
                resultElement.className = 'success';
                if (method === 'POST') {
                    appendVacationCard(result);
                    updateTotalVacationsCount();
                } else if (method === 'PUT') {
                    resultElement.textContent = 'Vacation updated successfully';
                    resultElement.className = 'success';
                    document.getElementById(result._id).remove();
                    appendVacationCard(result);
                }
            } else {
                resultElement.textContent = 'Failed to submit vacation';
                resultElement.className = 'error';
            }
        } catch (error) {
            console.error('Error:', error);
            const resultElement = document.getElementById(resultElementId);
            resultElement.textContent = 'Failed to submit vacation';
            resultElement.className = 'error';
        }
    }

    async function loadAllVacations() {
        try {
            const response = await fetch(allVacationsURL);
            const vacations = await response.json();
            const vacationList = document.getElementById('vacation-list');
            vacationList.innerHTML = '';
            vacations.forEach((vacation) => {
                appendVacationCard(vacation);
            });
        } catch (error) {
            console.error('Error fetching vacations:', error);
        }
    }

    function appendVacationCard(vacation) {
        const vacationList = document.getElementById('vacation-list');
        const listItem = document.createElement('div');
        listItem.classList.add('vacation-card');
        listItem.id = vacation._id;
        listItem.innerHTML = `
            <img src="${getVacationImg}${vacation.imageName || 'logo-vacationHub.jpeg'}" alt="Vacation Image">
            <h3>${vacation.destination}</h3>
            <p class="details">Description: ${vacation.description}</p>
            <p>Start Date: ${new Date(vacation.startDate).toLocaleDateString()}</p>
            <p>End Date: ${new Date(vacation.endDate).toLocaleDateString()}</p>
            <p>Price: $${vacation.price}</p>
            <p>Group Size: ${vacation.groupOf}</p>
            <p>Spots Taken: ${vacation.spotsTaken}</p>
            <p>Spots Left: ${vacation.spotsLeft}</p>
            <p>Vacation Type: ${vacation.vacationType}</p>
            <p>Company Name: ${vacation.companyName.company} (ID: ${vacation.companyName._id})</p>
            <p>Trip Category: ${vacation.tripCategory.category} (ID: ${vacation.tripCategory._id})</p>
            <p>Rating: ${vacation.rating}</p>
            <p>Image Name: ${vacation.imageName}</p>
            <p>ID: ${vacation._id}</p>
        `;
        vacationList.appendChild(listItem);
    }

    async function updateTotalVacationsCount() {
        try {
            const response = await fetch(totalVacationsURL);
            const total = await response.json();
            const totalElement = document.getElementById('total-vacations-result');
            totalElement.textContent = `Total Vacations: ${total.totalVacations}`;
            totalElement.style.display = 'block';
        } catch (error) {
            console.error('Error fetching total vacations count:', error);
        }
    }

    async function loadAllImages() {
        try {
            const response = await fetch(allImagesURL);
            const data = await response.json();
            const imageList = document.getElementById('image-list');
            const totalImagesResult = document.getElementById('total-images-result');
            imageList.innerHTML = '';
            totalImagesResult.textContent = `Total Images: ${data.totalImages}`;
            data.imageNames.forEach((imageName, index) => {
                const imageItem = document.createElement('div');
                imageItem.classList.add('image-card');
                imageItem.innerHTML = `
                    <img src="${getVacationImg}${imageName}" alt="Image ${index + 1}">
                    <p>${index + 1}. ${imageName}</p>
                `;
                imageList.appendChild(imageItem);
            });
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }

    async function validateFormData(formData, isUpdate = false, spotsTaken = 0) {
        let isValid = true;

        // Validate destination (only letters and at least 2 characters)
        const destination = formData.get('destination');
        if (!/^[a-zA-Z\s]{2,}$/.test(destination)) {
            document.getElementById(isUpdate ? 'destination-update-error' : 'destination-error').textContent = 'Destination must be at least 2 letters.';
            isValid = false;
        }

        // Validate description (only letters and at least 2 characters)
        const description = formData.get('description');
        if (!/^[a-zA-Z\s]{2,}$/.test(description)) {
            document.getElementById(isUpdate ? 'description-update-error' : 'description-error').textContent = 'Description must be at least 2 letters.';
            isValid = false;
        }

        // Validate price (0 to 50000)
        const price = formData.get('price');
        if (price < 0 || price > 50000) {
            document.getElementById(isUpdate ? 'price-update-error' : 'price-error').textContent = 'Price must be between 0 and 50000.';
            isValid = false;
        }

        // Validate group size (1 to 100) and spotsTaken constraint
        const groupOf = formData.get('groupOf');
        if (groupOf < 1 || groupOf > 100) {
            document.getElementById(isUpdate ? 'group-of-update-error' : 'group-of-error').textContent = 'Group size must be between 1 and 100.';
            isValid = false;
        } else if (groupOf < spotsTaken) {
            document.getElementById(isUpdate ? 'group-of-update-error' : 'group-of-error').textContent = `Group size must be at least ${spotsTaken}.`;
            isValid = false;
        }

        // Validate dates
        const startDate = formData.get('startDate');
        const endDate = formData.get('endDate');
        if (!startDate) {
            document.getElementById(isUpdate ? 'start-date-update-error' : 'start-date-error').textContent = 'Start date is required.';
            isValid = false;
        }
        if (!endDate) {
            document.getElementById(isUpdate ? 'end-date-update-error' : 'end-date-error').textContent = 'End date is required.';
            isValid = false;
        }
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            document.getElementById(isUpdate ? 'end-date-update-error' : 'end-date-error').textContent = 'End date must be after start date.';
            isValid = false;
        }

        // Validate company name (ID)
        const companyName = formData.get('companyName');
        if (!await validateId(findCompanyURL, companyName, isUpdate ? 'company-name-update-validity' : 'company-name-validity')) {
            isValid = false;
        }

        // Validate trip category (ID)
        const tripCategory = formData.get('tripCategory');
        if (!await validateId(findCategoryURL, tripCategory, isUpdate ? 'trip-category-update-validity' : 'trip-category-validity')) {
            isValid = false;
        }

        // Validate vacation image
        const vacationImage = formData.get('vacationImage');
        if (!await validateVacationImage(vacationImage, isUpdate ? 'vacation-image-update-error' : 'vacation-image-error')) {
            isValid = false;
        }

        return isValid;
    }

    async function validateVacationImage(imageName, elementId) {
        try {
            const response = await fetch(allImagesURL);
            const data = await response.json();
            if (!data.imageNames.includes(imageName)) {
                document.getElementById(elementId).textContent = 'Image does not exist';
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error validating image name:', error);
            document.getElementById(elementId).textContent = 'Error validating image';
            return false;
        }
    }

    function clearErrorMessages() {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }

    async function validateId(url, id, elementId) {
        try {
            const response = await fetch(`${url}${id}`);
            const result = await response.json();
            if (!response.ok) {
                document.getElementById(elementId).textContent = `Invalid ID`;
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error validating ID:', error);
            document.getElementById(elementId).textContent = 'Invalid ID';
            return false;
        }
    }

    async function validateCompanyAndCategory(data, resultElementId) {
        const companyValid = await validateId(findCompanyURL, data.companyName, 'company-name-validity');
        const categoryValid = await validateId(findCategoryURL, data.tripCategory, 'trip-category-validity');

        if (!companyValid || !categoryValid) {
            return false;
        }

        return true;
    }
});
