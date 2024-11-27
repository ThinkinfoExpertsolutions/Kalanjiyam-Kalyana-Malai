// const popupCard = document.getElementById('popupCard');
// const closePopup = document.getElementById('closePopup');
// const payButton = document.getElementById('payButton');
// const saveButton = document.getElementById('saveButton');
// const statusSpan = document.getElementById('status');
// const durationInput = document.getElementById('duration');
// const priceInput = document.getElementById('price');

// // Open popup (for demo purposes, it opens automatically)
// popupCard.style.display = 'flex';

// // Close popup
// closePopup.addEventListener('click', () => {
//     popupCard.style.display = 'none';
// });

// // Handle payment and enable subscription
// payButton.addEventListener('click', () => {
//     if (priceInput.value > 0 && durationInput.value >= 1 && durationInput.value <= 31) {
//         statusSpan.textContent = 'Enabled';
//         statusSpan.classList.remove('disabled');
//         statusSpan.classList.add('enabled');
//         alert('Payment successful! Subscription enabled.');
//     } else {
//         alert('Enter a valid price and duration.');
//     }
// });

// // Save button logic
// saveButton.addEventListener('click', () => {
//     alert('Subscription details saved successfully.');
// });

// const statusInputs = document.querySelectorAll('.toggle-input');
// const statusDisplay = document.getElementById('status'); // Assuming there's a separate status display element

// // Update the displayed status when a radio button is clicked
// statusInputs.forEach((input) => {
//     input.addEventListener('change', () => {
//         if (input.checked) {
//             statusDisplay.textContent = input.value.charAt(0).toUpperCase() + input.value.slice(1); // Capitalize first letter
//             statusDisplay.className = `status ${input.value}`; // Update the class dynamically
//         }
//     });
// });

// // Get the popup and the Close button
// const popupCard = document.getElementById('popupCard');
// // Add an event listener to the Close button
// closePopupButton.addEventListener('click', () => {
//     popupCard.style.display = 'none'; // Hide the popup
// });



