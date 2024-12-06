document.addEventListener("DOMContentLoaded", function() {

    const url = "https://backend-green-seven-44.vercel.app/api/user/signin";
    // Adding the submit event listener to the form
    document.getElementById("loginForm").addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevents the default form submission

        // Get the form data
        const email = document.getElementById("email").value;
        const password = document.getElementById("pwd").value;

        // Validate the input
        if (!email || !password) {
            showErrorToast("Please enter both email and password");
            return;
        }

        // Prepare the data to send to the backend
        const userData = {
            userName: email,  // Assuming user will log in with email
            password: password
        };

        try {
            showLoader()
            console.log(url);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            hideLoader()
            const data = await response.json();

            if (data.success) {
                // Store the encrypted token in session storage by default
                showSuccessToast(data.message);
                setTimeout(()=>{
                    sessionStorage.setItem("token", data.encryptedToken);


                    // Redirect to the dashboard or any other page
                    window.location.href = "index.html";
                },1000)
            } else {
                showErrorToast(data.message); // Show error message
            }
        } catch (error) {
            console.error("Error during login:", error);
            showErrorToast("Failed to sign in! Please try again.");
        }
    });
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
  
  