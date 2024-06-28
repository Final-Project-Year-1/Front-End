document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally

        // Get form values
    var email = document.getElementById('uname').value;
    var password = document.getElementById('psw').value;

        // Simple validation
    if (email === "" || password === "") {
        alert("Please fill out both fields.");
    } else {
            // You can add more complex validation here
        alert("Login successful!");

            // Optionally, you can submit the form programmatically if validation passes
            // this.submit();
    }
});

document.querySelector('.cancelbtn').addEventListener('click', function() {
    document.getElementById('loginForm').reset(); // Clear form fields
});
        