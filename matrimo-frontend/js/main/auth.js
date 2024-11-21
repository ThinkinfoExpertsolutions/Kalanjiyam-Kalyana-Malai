
// REGISTER 

let isOtpSent = false; // Flag to track whether OTP has been sent

// Handle "Send OTP" or "Verify" button click
document.getElementById("actionBtn").addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("pwd").value;
    const otp = document.getElementById("otp").value;

    try {
        if (!isOtpSent) {
            // Step 1: Send OTP
            if (!name || !email || !phone || !password) {
                alert("Please fill in all required fields.");
                return;
            }

            // Send OTP request to backend for email verification
            const response = await fetch("http://localhost:5000/api/user/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message); // Show success message (OTP sent to email)
                document.getElementById("otpContainer").style.display = "block"; // Show OTP input field
                document.getElementById("actionBtn").textContent = "Verify"; // Change button text to "Verify"
                document.querySelectorAll(".form-control").forEach((element) => {
                    if (element.id !== "otp") {
                        element.setAttribute("disabled", "true");
                    }
                });
                isOtpSent = true; // Mark OTP as sent
            } else {
                alert(data.message || "Failed to send OTP."); // Show error message
            }
        } else {
            // Step 2: Verify OTP and Register
            if (!otp) {
                alert("Please enter the OTP.");
                return;
            }

            // Send OTP verification request to backend for email
            showLoader()
            const response = await fetch("http://localhost:5000/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    password,
                    otp,
                }),
            });
        hideLoader()
            const data = await response.json();

            if (data.success) {
                
                alert(data.message); // Show success message (user registered)
                sessionStorage.setItem("token", data.encryptedToken); // Store token in localStorage
                // Redirect to dashboard or login page
                window.location.href = `user-profile-edit.html?id=${data.userData.profileID}`;
            } else {
                alert(data.message || "Registration failed."); // Show error message
            }
        }
    } catch (error) {
        console.error("Error occurred:", error);
        alert("An error occurred. Please try again later.");
    }
});

function showLoader() {
    document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}




