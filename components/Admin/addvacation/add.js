document.addEventListener("DOMContentLoaded", function() {
    const customSelects = document.querySelectorAll(".custom-select");
    customSelects.forEach(customSelect => {
        const selectElement = customSelect.querySelector("select");
        const selectedElement = document.createElement("div");
        selectedElement.classList.add("select-selected");
        selectedElement.innerText = selectElement.options[selectElement.selectedIndex].innerText;
        customSelect.appendChild(selectedElement);

        const optionsContainer = document.createElement("div");
        optionsContainer.classList.add("select-items", "select-hide");
        for (let i = 0; i < selectElement.options.length; i++) {
            const optionElement = document.createElement("div");
            optionElement.innerText = selectElement.options[i].innerText;
            optionElement.addEventListener("click", function() {
                for (let j = 0; j < selectElement.options.length; j++) {
                    if (selectElement.options[j].innerText === this.innerText) {
                        selectElement.selectedIndex = j;
                        selectedElement.innerText = this.innerText;
                        const sameAsSelected = customSelect.querySelectorAll(".same-as-selected");
                        sameAsSelected.forEach(same => same.classList.remove("same-as-selected"));
                        this.classList.add("same-as-selected");
                        break;
                    }
                }
                selectedElement.click();
            });
            optionsContainer.appendChild(optionElement);
        }
        customSelect.appendChild(optionsContainer);

        selectedElement.addEventListener("click", function(e) {
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    });

    function closeAllSelect(el) {
        const items = document.querySelectorAll(".select-items");
        const selected = document.querySelectorAll(".select-selected");
        for (let i = 0; i < selected.length; i++) {
            if (el === selected[i]) continue;
            selected[i].classList.remove("select-arrow-active");
        }
        for (let i = 0; i < items.length; i++) {
            if (el === items[i].previousSibling) continue;
            items[i].classList.add("select-hide");
        }
    }

    document.addEventListener("click", closeAllSelect);

    // Update the date input fields with styled text
    
});

document.getElementById('vacation-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const images = formData.getAll('images');

    if (images.length !== 4) {
        alert('You must upload exactly 4 images.');
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
        images: []
    };

    images.forEach((image, index) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            data.images.push(event.target.result);
            if (index === images.length - 1) {
                submitFormData(data);
            }
        };
        reader.readAsDataURL(image);
    });

    async function submitFormData(data) {
        try {
            const response = await fetch('/vacations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) {
                alert('Vacation added successfully');
                // ביצוע פעולה לאחר ההצלחה, כמו רענון הטופס
            } else {
                alert('Failed to add vacation: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add vacation');
        }
    }
});
