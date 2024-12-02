
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
                showErrorToast("Please fill in all required fields.");
                return;
            }

            // Send OTP request to backend for email verification
            const response = await fetch("http://localhost:5000/api/user/user/verify", {
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
                showSuccessToast(data.message); // Show success message (OTP sent to email)
                document.getElementById("otpContainer").style.display = "block"; // Show OTP input field
                document.getElementById("actionBtn").textContent = "Verify"; // Change button text to "Verify"
                document.querySelectorAll(".form-control").forEach((element) => {
                    if (element.id !== "otp") {
                        element.setAttribute("disabled", "true");
                    }
                });
                isOtpSent = true; // Mark OTP as sent
            } else {
                showErrorToast(data.message || "Failed to send OTP."); // Show error message
            }
        } else {
            // Step 2: Verify OTP and Register
            if (!otp) {
                showErrorToast("Please enter the OTP.");
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
                
                showSuccessToast(data.message); 
                sessionStorage.setItem("token", data.encryptedToken); 
                setTimeout(()=>{
                    location.reload();
                    window.location.href = `user-profile-edit.html?id=${data.userData.profileID}`;
                },1000)
            } else {
                showErrorToast(data.message || "Registration failed."); // Show error message
            }
        }
    } catch (error) {
        console.error("Error occurred:", error);
        showErrorToast("An error occurred. Please try again later.");
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
  
