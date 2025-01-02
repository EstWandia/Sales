document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the values from the form
    const email = document.querySelector('input[name="email"]').value;
    const name = document.querySelector('input[name="name"]').value;
    const password = document.querySelector('input[name="password"]').value;

    // Validate if password is provided
    if (!password || password.trim() === '') {
        alert('Password is required');
        return;
    }

    // Make a POST request to the backend to register the user
    fetch('/auth/userdetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, name, password })
    })
    .then(response=>response.json())
    .then(data => {
        if (data.success) {
            // If registration is successful, redirect to the login page
            window.location.href = '/pages/samples/login.html';
        } else {
            // If registration fails, show an error message
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error occured:', error);
    });
});
