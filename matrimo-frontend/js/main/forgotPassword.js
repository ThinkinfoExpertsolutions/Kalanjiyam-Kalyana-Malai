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
            alert(data.message); // OTP sent successfully
            document.getElementById("otpContainer").style.display = "block"; // Show OTP input field
            document.getElementById("actionBtn").textContent = "Verify"; // Change button to "Verify"
            currentStep = 'verifyOtp'; // Move to the next step
        } else {
            alert(data.message); // Show error message
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
            alert(data.message); // OTP verified successfully
            document.getElementById("otpContainer").style.display = "none"; // Hide OTP input
            document.getElementById("passwordContainer").style.display = "block"; // Show New Password input
            document.getElementById("comfirmPasswordContainer").style.display = "block"; // Show Confirm Password input
            document.getElementById("actionBtn").textContent = "Submit"; // Change button to "Submit"
            currentStep = 'resetPassword'; // Move to the next step
        } else {
            alert(data.message); // Show error message
        }

    } else if (currentStep === 'resetPassword') {
        // Step 3: Reset Password
        if (newPassword!==comfirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const response = await fetch("http://localhost:5000/api/user/user/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, newPassword, comfirmPassword })
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message); // Password reset successful
            window.location.href = `http://127.0.0.1:5500/matrimo-frontend/login.html`; // Redirect to login page
        } else {
            alert(data.message); // Show error message
        }
    }
});