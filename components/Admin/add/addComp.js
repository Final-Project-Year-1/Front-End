const addCompanyURL = "http://localhost:3000/api/addCompany";
const deleteCompanyURL = "http://localhost:3000/api/deleteCompany/"; 
const updateCompanyURL = "http://localhost:3000/api/updateCompany/"; 
const findCompanyURL = "http://localhost:3000/api/findCompany/"; 
const allCompaniesURL = "http://localhost:3000/api/all-companies";
const addCategoryURL = "http://localhost:3000/api/addCategory";
const deleteCategoryURL = "http://localhost:3000/api/deleteCategory/"; 
const updateCategoryURL = "http://localhost:3000/api/updateCategory/"; 
const findCategoryURL = "http://localhost:3000/api/find-category/"; 
const allCategoriesURL = "http://localhost:3000/api/allCategories";

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

        if (userObj.token) {
            const decodedToken = jwt_decode(userObj.token);
            const userRole = decodedToken.role || userObj.user.role;

            if (userRole && userRole === 'admin') {
                document.getElementById('admin-section').style.display = 'block';
            }
        }
    }

    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", () => {
        localStorage.setItem("token", "");
        window.location.href = "../Auth/Login/login.html";
    });

    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(button.dataset.tab).classList.add('active');
            if (button.dataset.tab === "all-companies") {
                fetchAllCompanies();
            }
            if (button.dataset.tab === "all-categories") {
                fetchAllCategories();
            }
        });
    });

    document.getElementById('company-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            company: formData.get('company')
        };

        try {
            const response = await fetch(addCompanyURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            const addResultDiv = document.getElementById('add-company-result');
            if (response.ok) {
                addResultDiv.textContent = `Company Added successfully: ${result.company}`;
                addResultDiv.className = 'success';
            } else {
                addResultDiv.textContent = result.message || 'Failed to add company';
                addResultDiv.className = 'error';
            }
        } catch (error) {
            console.error('Error:', error);
            const addResultDiv = document.getElementById('add-company-result');
            addResultDiv.textContent = 'Failed to add company';
            addResultDiv.className = 'error';
        }
    });

    document.getElementById('update-company-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const companyId = formData.get('company-id');
        const newName = formData.get('new-company-name');

        try {
            const response = await fetch(`${updateCompanyURL}${companyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ company: newName })
            });

            const result = await response.json();
            const updateResultDiv = document.getElementById('update-company-result');
            if (response.ok) {
                updateResultDiv.textContent = 'Company name updated successfully';
                updateResultDiv.className = 'success';
            } else {
                updateResultDiv.textContent = result.message || 'Failed to update company name';
                updateResultDiv.className = 'error';
            }
        } catch (error) {
            console.error('Error:', error);
            const updateResultDiv = document.getElementById('update-company-result');
            updateResultDiv.textContent = 'Failed to update company name';
            updateResultDiv.className = 'error';
        }
    });

    document.getElementById('delete-company-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const companyId = formData.get('company-id-delete');

        try {
            const response = await fetch(`${deleteCompanyURL}${companyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const result = await response.json();
            const deleteResultDiv = document.getElementById('delete-company-result');
            if (response.ok) {
                deleteResultDiv.textContent = `Company deleted successfully: ${result.company}`;
                deleteResultDiv.className = 'success';
            } else {
                deleteResultDiv.textContent = result.message || 'Failed to delete company';
                deleteResultDiv.className = 'error';
            }
        } catch (error) {
            console.error('Error:', error);
            const deleteResultDiv = document.getElementById('delete-company-result');
            deleteResultDiv.textContent = 'Failed to delete company';
            deleteResultDiv.className = 'error';
        }
    });

    document.getElementById('find-company-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const companyId = formData.get('company-id-find');

        try {
            const response = await fetch(`${findCompanyURL}${companyId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const result = await response.json();
            const findResultDiv = document.getElementById('find-company-result');
            if (response.ok) {
                findResultDiv.textContent = `Company found: ${result.company}`;
                findResultDiv.className = 'success';
            } else {
                findResultDiv.textContent = 'Company not found';
                findResultDiv.className = 'error';
            }
        } catch (error) {
            console.error('Error:', error);
            const findResultDiv = document.getElementById('find-company-result');
            findResultDiv.textContent = 'Failed to find company';
            findResultDiv.className = 'error';
        }
    });

    async function fetchAllCompanies() {
        try {
            const response = await fetch(allCompaniesURL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const result = await response.json();
            const allCompaniesDiv = document.getElementById('all-companies-result');
            const totalCompaniesDiv = document.getElementById('total-companies-result');
            if (response.ok) {
                totalCompaniesDiv.textContent = result.length;
                allCompaniesDiv.innerHTML = result.map((company, index) => `<p>${index + 1}. ${company._id}: ${company.company}</p>`).join('');
            } else {
                allCompaniesDiv.textContent = result.message || 'Failed to fetch companies';
            }
        } catch (error) {
            console.error('Error:', error);
            const allCompaniesDiv = document.getElementById('all-companies-result');
            allCompaniesDiv.textContent = 'Failed to fetch companies';
        }
    }

  
    document.getElementById('category-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const category = formData.get('category');

        try {
            const response = await fetch(addCategoryURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ category: category })
            });

            const result = await response.json();
            const addResultDiv = document.getElementById('add-category-result');
            if (response.ok) {
                addResultDiv.textContent = `Category Added successfully: ${result.category}`;
                addResultDiv.className = 'success';
            } else {
                addResultDiv.textContent = result.message || 'Failed to add category';
                addResultDiv.className = 'error';
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('add-category-result').textContent = 'Failed to add category';
            document.getElementById('add-category-result').className = 'error';
        }
    });

  
    document.getElementById('update-category-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const categoryId = formData.get('category-id');
        const newName = formData.get('new-category-name');

        try {
            const response = await fetch(`${updateCategoryURL}${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ category: newName })
            });

            const result = await response.json();
            const updateResultDiv = document.getElementById('update-category-result');
            if (response.ok) {
                updateResultDiv.textContent = 'Category name updated successfully';
                updateResultDiv.className = 'success';
            } else {
                updateResultDiv.textContent = result.message || 'Failed to update category name';
                updateResultDiv.className = 'error';
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('update-category-result').textContent = 'Failed to update category name';
            document.getElementById('update-category-result').className = 'error';
        }
    });

    document.getElementById('delete-category-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const categoryId = formData.get('category-id-delete');

        try {
            const response = await fetch(`${deleteCategoryURL}${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const result = await response.json();
            const deleteResultDiv = document.getElementById('delete-category-result');
            if (response.ok) {
                deleteResultDiv.textContent = 'Category deleted successfully';
                deleteResultDiv.className = 'success';
            } else {
                deleteResultDiv.textContent = result.message || 'Failed to delete category';
                deleteResultDiv.className = 'error';
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('delete-category-result').textContent = 'Failed to delete category';
            document.getElementById('delete-category-result').className = 'error';
        }
    });

 
    document.getElementById('find-category-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const categoryId = formData.get('category-id-find');

        try {
            const response = await fetch(`${findCategoryURL}${categoryId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const result = await response.json();
            const findResultDiv = document.getElementById('find-category-result');
            if (response.ok) {
                findResultDiv.textContent = `Category found: ${result.category}`;
                findResultDiv.className = 'success';
            } else {
                findResultDiv.textContent = 'Category not found';
                findResultDiv.className = 'error';
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('find-category-result').textContent = 'Failed to find category';
            document.getElementById('find-category-result').className = 'error';
        }
    });

    async function fetchAllCategories() {
        try {
            const response = await fetch(allCategoriesURL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const result = await response.json();
            const allCategoriesDiv = document.getElementById('all-categories-result');
            const totalCategoriesDiv = document.getElementById('total-categories-result');
            if (response.ok) {
                totalCategoriesDiv.textContent = result.length;
                allCategoriesDiv.innerHTML = result.map((category, index) => `<p>${index + 1}. ${category._id}: ${category.category}</p>`).join('');
            } else {
                allCategoriesDiv.textContent = result.message || 'Failed to fetch categories';
            }
        } catch (error) {
            console.error('Error:', error);
            const allCategoriesDiv = document.getElementById('all-categories-result');
            allCategoriesDiv.textContent = 'Failed to fetch categories';
        }
    }
});
