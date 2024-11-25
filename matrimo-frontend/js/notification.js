// notifications.js
window.showSuccessToast = function() {
    Toastify({
      text: "Operation successful!",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      close: true,
    }).showToast();
  };
  
  window.showErrorToast = function() {
    Toastify({
      text: "Something went wrong.",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      close: true,
    }).showToast();
  };
  