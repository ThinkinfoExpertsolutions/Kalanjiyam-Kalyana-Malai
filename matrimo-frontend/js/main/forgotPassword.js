let currentStep = 'sendOtp'; // Track the current step in the workflow
                                
document.getElementById("actionBtn").addEventListener("click", async function(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("email").value;
    const otp = document.getElementById("otp").value;
    const newPassword = document.getElementById("newPassword").value;
    const comfirmPassword = document.getElementById("comfirmPassword").value;

    if (currentStep === 'sendOtp') {
        // Step 1: Send OTP to email
        const response = await fetch("http://localhost:5000/api/user/user/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        if (data.success) {
            showSuccessToast(data.message); // OTP sent successfully
            document.getElementById("otpContainer").style.display = "block"; // Show OTP input field
            document.getElementById("actionBtn").textContent = "Verify"; // Change button to "Verify"
            currentStep = 'verifyOtp'; // Move to the next step
        } else {
            showErrorToast(data.message); // Show error message
        }

    } else if (currentStep === 'verifyOtp') {
        // Step 2: Verify OTP
        const response = await fetch("http://localhost:5000/api/user/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp })
        });

        const data = await response.json();

        if (data.success) {
            showSuccessToast(data.message); // OTP verified successfully
            document.getElementById("otpContainer").style.display = "none"; // Hide OTP input
            document.getElementById("passwordContainer").style.display = "block"; // Show New Password input
            document.getElementById("comfirmPasswordContainer").style.display = "block"; // Show Confirm Password input
            document.getElementById("actionBtn").textContent = "Submit"; // Change button to "Submit"
            currentStep = 'resetPassword'; // Move to the next step
        } else {
            showErrorToast(data.message); // Show error message
        }

    } else if (currentStep === 'resetPassword') {
        // Step 3: Reset Password
        if (newPassword!==comfirmPassword) {
            showErrorToast("Passwords do not match!");
            return;
        }
       showLoader()
        const response = await fetch("http://localhost:5000/api/user/user/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, newPassword, comfirmPassword })
        });
       hideLoader()
        const data = await response.json();

        if (data.success) {
            showSuccessToast(data.message); // Password reset successful
            window.location.href = `http://127.0.0.1:5500/matrimo-frontend/login.html`; // Redirect to login page
        } else {
            showErrorToast(data.message); // Show error message
        }
    }
});

function showLoader() {
    const loader = document.getElementById("loader");
    if(!loader){
     return;
    };
    loader.style.display = "flex";
 }
 
 function hideLoader() {
     const loader = document.getElementById("loader");
     if(!loader){
      return;
     };
     loader.style.display = "none";
 }

 function showSuccessToast(msg) {
    Toastify({
      text: msg,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      close: true,
    }).showToast();
  }
  
  function showErrorToast(msg) {
    Toastify({
      text: msg,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      close: true,
    }).showToast();
  }
  

  