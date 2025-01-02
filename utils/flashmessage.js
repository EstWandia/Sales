function showFlashMessage(message, type) {
    const flashContainer = document.getElementById('flashMessageContainer');
    
    // Create a new div element for the flash message
    const flashMessage = document.createElement('div');
    flashMessage.classList.add('flash-message', type);
    flashMessage.innerText = message;
  
    // Append the flash message to the container
    flashContainer.appendChild(flashMessage);
  
    // Set a timeout to remove the message after 3 seconds
    setTimeout(() => {
      flashMessage.classList.add('fade-out'); // Add fade-out effect
      setTimeout(() => flashMessage.remove(), 500); // Remove the message after fade-out
    }, 3000); // Message disappears after 3 seconds
  }

  export default showFlashMessage;