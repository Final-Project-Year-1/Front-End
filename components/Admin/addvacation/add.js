const addNewVacationURL = "http://localhost:3000/api/vacations";
const allCompaniesURL = "http://localhost:3000/api/all-companies";
const allCategoriesURL = "http://localhost:3000/api/allCategories";
const deleteVacationURL = "http://localhost:3000/api/vacations/"; 
const updateVacationURL = "http://localhost:3000/api/vacations/"; 
const allVacationsURL = "http://localhost:3000/api/Allvacations";
const findCategoryURL = "http://localhost:3000/api/find-category/";
const findCompanyURL = "http://localhost:3000/api/findCompany/"; 
const getVacationImg = "http://localhost:3000/api/vacations/images/";
const findVacationURL = "http://localhost:3000/api/vacations/"; 
const totalVacationsURL = "http://localhost:3000/api/vacation/total-vacations";
const allImagesURL = "http://localhost:3000/api/vacation-images/";
const searchVacationsAdminQueryURL = "http://localhost:3000/api/search-vacations-admin-query";
const uploadImageURL = "http://localhost:3000/api/upload"; 

const userObj = window.getUserFromToken();
window.authVerificationAdjustments();

document.getElementById('add-button').addEventListener('click', () => {
        showForm('vacation-form');
        populateSelectOptions();
});
document.getElementById('view-all-button').addEventListener('click', () => {
        showForm('view-all-vacations');
        loadAllVacations();
        updateTotalVacationsCount();
    });
    document.getElementById('find-button').addEventListener('click', () => {
        showForm('find-vacation-form');
        populateSelectOptions(false, true);
    });

    async function showForm(formId) {
        clearAllForms();
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

        const uploadResult = await uploadImage(images[0]);
        if (!uploadResult.success) {
            document.getElementById('images-error').textContent = 'Failed to upload image.';
            return;
        }

        const data = {
            destination: formData.get('destination').trim(),
            description: formData.get('description').trim(),
            startDate: formData.get('startDate').trim(),
            endDate: formData.get('endDate').trim(),
            price: formData.get('price').trim(),
            groupOf: formData.get('groupOf').trim(),
            vacationType: formData.get('vacationType').trim(),
            companyName: formData.get('companyName').trim(),
            tripCategory: formData.get('tripCategory').trim(),
            imageName: uploadResult.imagePath 
        };

        submitFormData(addNewVacationURL, 'POST', data, 'vacation-form-result');
    });

    async function uploadImage(image) {
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await fetch(uploadImageURL, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                return { success: true, imagePath: result.imagePath };
            } else {
                return { success: false };
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            return { success: false };
        }
    }

    document.getElementById('update-vacation-id-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const vacationId = document.getElementById('vacation-id-update').value.trim();

        try {
            const response = await fetch(`${findVacationURL}${vacationId}`);
            const result = await response.json();
            const updateIdResultDiv = document.getElementById('update-vacation-id-result');
            if (response.ok) {
                updateIdResultDiv.textContent = '';
                showForm('update-vacation-form-container');
                populateSelectOptions(true);
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

    document.getElementById('update-vacation-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        clearErrorMessages();

        const vacationId = document.getElementById('vacation-id-update-hidden').value;
        const formData = new FormData(event.target);
        const images = formData.getAll('images');
        const spotsTaken = document.getElementById('vacation-id-update-hidden').dataset.spotsTaken;

        if (images.length < 1) {
            document.getElementById('images-update-error').textContent = 'You must upload an image.';
            return;
        }

        if (!await validateFormData(formData, true, spotsTaken)) {
            return;
        }

        const uploadResult = await uploadImage(images[0]);
        if (!uploadResult.success) {
            document.getElementById('images-update-error').textContent = 'Failed to upload image.';
            return;
        }

        const data = {
            destination: formData.get('destination').trim(),
            description: formData.get('description').trim(),
            startDate: formData.get('startDate').trim(),
            endDate: formData.get('endDate').trim(),
            price: formData.get('price').trim(),
            groupOf: formData.get('groupOf').trim(),
            vacationType: formData.get('vacationType').trim(),
            companyName: formData.get('companyName').trim(),
            tripCategory: formData.get('tripCategory').trim(),
            imageName: uploadResult.imagePath 
        };

        submitFormData(`${updateVacationURL}${vacationId}`, 'PUT', data, 'update-vacation-result');
    });

    document.getElementById('find-vacation-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const destination = document.getElementById('destination-find').value.trim();
        const companyName = document.getElementById('company-name-find').value.trim();
        const departureMonth = document.getElementById('departure-month-find').value.trim();

        const queryData = {
            destination: destination,
            companyName: companyName,
            departureMonth: departureMonth ? parseInt(departureMonth) : undefined
        };

        // Remove undefined fields from queryData
        Object.keys(queryData).forEach(key => {
            if (queryData[key] === undefined || queryData[key] === "") {
                delete queryData[key];
            }
        });

        try {
            const response = await fetch(searchVacationsAdminQueryURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(queryData)
            });
            const resultDiv = document.getElementById('find-vacation-result');
            if (response.ok) {
                const vacations = await response.json();
                showForm('view-all-vacations');
                const vacationList = document.getElementById('vacation-list');
                vacationList.innerHTML = ''; // Clear previous results

                const totalVacationsResult = document.getElementById('total-vacations-result');
                totalVacationsResult.textContent = `Total Results: ${vacations.length}`;
                totalVacationsResult.style.display = 'block';

                vacations.forEach(appendVacationCard);
            } else {
                resultDiv.textContent = 'No vacations found';
                resultDiv.className = 'error';
            }
        } catch (error) {
            console.error('Error:', error);
            const resultDiv = document.getElementById('find-vacation-result');
            resultDiv.textContent = 'Failed to find vacation';
            resultDiv.className = 'error';
        }
    });

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

    async function deleteVacation(vacationId) {
        try {
            const token = userObj.token;
    
            const headers = {
                "Content-Type": "application/json",
            };
            if (token) {
                window.interceptorsService.setToken(token);
                headers['Authorization'] = `Bearer ${token}`;
            }
    
            console.log("Headers:", headers);
    
            const response = await fetch(`${deleteVacationURL}${vacationId}`, {
                method: 'DELETE',
                headers: headers
            });
    
            if (response.ok) {
                document.getElementById(vacationId).remove();
                updateTotalVacationsCount();
            } else {
                console.error('Failed to delete vacation');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    

    function appendVacationCard(vacation) {
        const vacationList = document.getElementById('vacation-list');
        const listItem = document.createElement('div');
        listItem.classList.add('vacation-card');
        listItem.id = vacation._id;

        const companyName = vacation.companyName ? vacation.companyName.company : 'Unknown';
        const tripCategory = vacation.tripCategory ? vacation.tripCategory.category : 'Unknown';

        listItem.innerHTML = `
            <img src="${getVacationImg}${vacation.imageName || 'logo-vacationHub.png'}" alt="Vacation Image">
            <div class="vacation-card-actions">
                <span class="edit-icon" data-id="${vacation._id}" style="cursor: pointer;">✏️</span>
                <span class="delete-icon" data-id="${vacation._id}" style="cursor: pointer;">🗑️</span>
            </div>
            <h3>${vacation.destination}</h3>
            <p class="details">Description: ${vacation.description}</p>
            <p>Start Date: ${new Date(vacation.startDate).toLocaleDateString()}</p>
            <p>End Date: ${new Date(vacation.endDate).toLocaleDateString()}</p>
            <p>Price: $${vacation.price}</p>
            <p>Group Size: ${vacation.groupOf}</p>
            <p>Spots Taken: ${vacation.spotsTaken}</p>
            <p>Spots Left: ${vacation.spotsLeft}</p>
            <p>Vacation Type: ${vacation.vacationType}</p>
            <p>Company Name: ${companyName}</p>
            <p>Trip Category: ${tripCategory}</p>
            <p>Rating: ${vacation.rating}</p>
            <p>Image Name: ${vacation.imageName}</p>
        `;
        vacationList.appendChild(listItem);
    }

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('edit-icon')) {
            const vacationId = event.target.getAttribute('data-id');
            openUpdateForm(vacationId);
        }

        if (event.target.classList.contains('delete-icon')) {
            const vacationId = event.target.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this vacation?')) {
                deleteVacation(vacationId);
            }
        }
    });

    async function openUpdateForm(vacationId) {
        try {
            const response = await fetch(`${findVacationURL}${vacationId}`);
            const result = await response.json();
            if (response.ok) {
                showForm('update-vacation-form-container');
                await populateSelectOptions(true); // Ensure the select options are populated before filling in the form
                populateUpdateForm(result);
                displayVacationCard(result);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                console.error('Vacation not found');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function populateSelectOptions(isUpdate = false, isFind = false) {
        const companySelect = isUpdate ? document.getElementById('company-name-update') : (isFind ? document.getElementById('company-name-find') : document.getElementById('company-name'));
        const categorySelect = isUpdate ? document.getElementById('trip-category-update') : document.getElementById('trip-category');

        try {
            const companyResponse = await fetch(allCompaniesURL);
            const companies = await companyResponse.json();
            companySelect.innerHTML = companies.map(company => `<option value="${company._id}">${company.company}</option>`).join('');

            if (!isFind) {
                const categoryResponse = await fetch(allCategoriesURL);
                const categories = await categoryResponse.json();
                categorySelect.innerHTML = categories.map(category => `<option value="${category._id}">${category.category}</option>`).join('');
            }
        } catch (error) {
            console.error('Error fetching companies or categories:', error);
        }
    }

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
        document.getElementById('company-name-update').value = vacation.companyName._id; // Ensure this matches the select option value
        document.getElementById('trip-category-update').value = vacation.tripCategory._id; // Ensure this matches the select option value
        document.getElementById('vacation-image-update').value = vacation.imageName;
        loadExistingImage(vacation.imageName);
        const companySelect = document.getElementById('company-name-update');
        const categorySelect = document.getElementById('trip-category-update');

        companySelect.value = vacation.companyName._id;
        categorySelect.value = vacation.tripCategory._id;
    }

    function loadExistingImage(imageName) {
        const imageUrl = `${getVacationImg}${imageName}`;

        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], imageName, { type: blob.type });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                const fileInput = document.getElementById('images-update');
                fileInput.files = dataTransfer.files;

                // Create an event to trigger the input change
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            })
            .catch(error => {
                console.error('Error loading existing image:', error);
            });
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
            <p>Company Name: ${vacation.companyName.company}</p>
            <p>Trip Category: ${vacation.tripCategory.category}</p>
            <p>Rating: ${vacation.rating}</p>
            <p>Image Name: ${vacation.imageName}</p>
        `;
        vacationCardContainer.appendChild(listItem);
    }

async function submitFormData(url, method, data, resultElementId) {
  console.log("Submitting form data:", data);

  const isValid = await validateCompanyAndCategory(data, resultElementId);
  if (!isValid) return;

  const token = userObj.token;

  if (token) {
    window.interceptorsService.setToken(token);
  }

  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(data),
    });
    const result = await response.json();
    const resultElement = document.getElementById(resultElementId);

    if (response.ok) {
      if (method === "POST") {
        resultElement.textContent = "Vacation submitted successfully";
        resultElement.className = "success";
        appendVacationCard(result);
        updateTotalVacationsCount();
      } else if (method === "PUT") {
        resultElement.textContent = "Vacation updated successfully";
        resultElement.className = "success";
        document.getElementById(result._id).remove();
        appendVacationCard(result);
      }
    } else {
      resultElement.textContent = result.message || "Failed to submit vacation";
      resultElement.className = "error";
    }
  } catch (error) {
    console.error("Error:", error);
    const resultElement = document.getElementById(resultElementId);
    resultElement.textContent = "Failed to submit vacation";
    resultElement.className = "error";
  }
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

    function validateDescription(description, errorElementId) {
        const words = description.split(/\s+/).filter(word => word); 
        const firstWord = words[0] || ""; 
        const wordCount = words.length;
        if (firstWord.length < 2 || wordCount > 100 || /\d/.test(description)) {
            document.getElementById(errorElementId).textContent = 'Maximum 100 words and atleast 2 letters.';
            return false;
        }
        return true;
    }

    function validateDestination(destination, errorElementId) {
        const words = destination.split(/\s+/).filter(word => word); 
        const firstWord = words[0] || ""; 
        const wordCount = words.length;
        if (firstWord.length < 2 || wordCount > 20 || /\d/.test(destination)) {
            document.getElementById(errorElementId).textContent = 'Maximum 20 words and atleast 2 letters';
            return false;
        }
        return true;
    }

    async function validateFormData(formData, isUpdate = false, spotsTaken = 0) {
        let isValid = true;

        
        const destination = formData.get('destination').trim();
        if (!validateDestination(destination, isUpdate ? 'destination-update-error' : 'destination-error')) {
            isValid = false;
        }

        const description = formData.get('description').trim();
        if (!validateDescription(description, isUpdate ? 'description-update-error' : 'description-error')) {
            isValid = false;
        }

        const price = parseFloat(formData.get('price').trim());
        if (isNaN(price) || price < 0 || price > 50000) {
            document.getElementById(isUpdate ? 'price-update-error' : 'price-error').textContent = 'Price must be between 0 and 50000.';
            isValid = false;
        }

        // Validate group size (1 to 100) and spotsTaken constraint
        const groupOf = parseInt(formData.get('groupOf').trim());
        const parsedSpotsTaken = parseInt(spotsTaken);

        if (isNaN(groupOf) || groupOf < 1 || groupOf > 100) {
            document.getElementById(isUpdate ? 'group-of-update-error' : 'group-of-error').textContent = 'Group size must be between 1 and 100.';
            isValid = false;
        } else if (isUpdate && !isNaN(parsedSpotsTaken) && groupOf < parsedSpotsTaken) {
            document.getElementById(isUpdate ? 'group-of-update-error' : 'group-of-error').textContent = `Group size must be at least ${parsedSpotsTaken}.`;
            isValid = false;
        }

        // Validate dates
        const startDate = formData.get('startDate').trim();
        const endDate = formData.get('endDate').trim();
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
        const companyName = formData.get('companyName').trim();
        if (!await validateId(findCompanyURL, companyName, isUpdate ? 'company-name-update-validity' : 'company-name-validity')) {
            isValid = false;
        }

        // Validate trip category (ID)
        const tripCategory = formData.get('tripCategory').trim();
        if (!await validateId(findCategoryURL, tripCategory, isUpdate ? 'trip-category-update-validity' : 'trip-category-validity')) {
            isValid = false;
        }

        return isValid;
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
