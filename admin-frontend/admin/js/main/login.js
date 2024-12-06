let logInCurrentStep = "verify";
let email = "";
document.getElementById("loginBtn").addEventListener("click", async (e) => {
    e.preventDefault();

    const userName = document.getElementById("email").value;
    const password = document.getElementById("pwd").value;

    if (!userName || !password) {
        showErrorToast("Please enter email and password");
        return;
    }

    try {
        if (logInCurrentStep === "verify") {
            // Step 1: Verify user credentials and send OTP
            showLoader()
            const response = await fetch("https://backend-green-seven-44.vercel.app/api/user/admin/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userName, password }),
            });
       hideLoader()
            const data = await response.json();

            if (data.success) {
                showSuccessToast(data.message);
                document.getElementById("otpContainer-l").style.display = "block";
                document.getElementById("loginBtn").innerText = "Submit";
                logInCurrentStep = "logIn";
                email = data.email;
            } else {
                showErrorToast(data.message);
            }
        } else if (logInCurrentStep === "logIn") {
            // Step 2: Verify OTP and log in
            const otp = document.getElementById("otpInput").value; // Assume OTP input field has id `otpInput`

            if (!otp) {
                showErrorToast("Please enter the OTP");
                return;
            }

            showLoader();
          console.log(email)
            // Verify OTP
            const otpResponse = await fetch("https://backend-green-seven-44.vercel.app/api/user/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, otp }),
            });

            const otpData = await otpResponse.json();
            hideLoader();

            if (otpData.success) {
                // Log in user after OTP verification
                showLoader();

                const loginResponse = await fetch("https://backend-green-seven-44.vercel.app/api/admin/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userName, password }),
                });

                const loginData = await loginResponse.json();
                hideLoader();

                if (loginData.success) {
                    showSuccessToast(loginData.message);
                    sessionStorage.setItem("token", loginData.encryptedToken);

                    window.location.href = "dashboard.html";
                } else {
                    showErrorToast(loginData.message);
                }
            } else {
                showErrorToast(otpData.message);
            }
        }
    } catch (error) {
        console.error("Error:", error);
        hideLoader();
        showErrorToast("An error occurred. Please try again.");
    }
});


let currentStep = "sendOTP";

document.getElementById("verifyBtn").addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("verifyEmail").value;
    const otp = document.getElementById("otp").value;
    const newPassword = document.getElementById("newPwd").value;
    const comfirmPassword = document.getElementById("comfirmPwd").value;
    const verifyBtn = document.getElementById("verifyBtn");



    if (currentStep === "sendOTP") {
        try {
            showLoader()
            const response = await fetch("https://backend-green-seven-44.vercel.app/api/user/admin/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
          hideLoader()
            if (data.success) {
                showSuccessToast(data.message);
                
                document.getElementById("otpContainer").style.display = "block";
                verifyBtn.innerHTML = "Verify OTP";
                currentStep = "verifyOTP";
                
            } else {
                showErrorToast(data.message);
            }
        } catch (error) {
            console.error(error);
            showErrorToast("An error occurred while sending the OTP. Please try again later.");
        }
    } else if (currentStep === "verifyOTP") {
        if (!otp) {
            showErrorToast("Please enter the OTP.");
            return;
        }

        try {
            showLoader()
            const response = await fetch("https://backend-green-seven-44.vercel.app/api/user/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();
   hideLoader()
            if (data.success) {
                showSuccessToast(data.message);
                document.getElementById("otpContainer").style.display = "none";
                document.getElementById("changePassword").style.display = "block";
                verifyBtn.innerHTML = "Change Password";
                currentStep = "changePassword";
                
            } else {
                showErrorToast(data.message);
            }
        } catch (error) {
            console.error(error);
            showErrorToast("An error occurred while verifying the OTP. Please try again later.");
        }
    } else if (currentStep === "changePassword") {
        if (!newPassword || !comfirmPassword) {
            showErrorToast("Please fill in all password fields.");
            return;
        }

        if (newPassword !== comfirmPassword) {
            showErrorToast("Passwords do not match. Please try again.");
            return;
        }

        try {
            showLoader()
            const response = await fetch("https://backend-green-seven-44.vercel.app/api/user/admin/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword,comfirmPassword }),
            });

            const data = await response.json();
            

            hideLoader()

            if (data.success) {
                showSuccessToast(data.message);
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000); // Adjust the delay as needed
            } else {
                showErrorToast(data.message);
            }
        } catch (error) {
            console.error(error);
            showErrorToast("An error occurred while resetting the password. Please try again later.");
        }
    }
});




// Show and hide loader
function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "flex";
}

function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
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