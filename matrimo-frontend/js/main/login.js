document.addEventListener("DOMContentLoaded", function() {
    // Adding the submit event listener to the form
    document.getElementById("loginForm").addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevents the default form submission

        // Get the form data
        const email = document.getElementById("email").value;
        const password = document.getElementById("pwd").value;
        const rememberMe = document.getElementById("rememberMe").checked;

        // Validate the input
        if (!email || !password) {
            alert("Please enter both email and password");
            return;
        }

        // Prepare the data to send to the backend
        const userData = {
            userName: email,  // Assuming user will log in with email
            password: password
        };

        try {
            const response = await fetch("http://localhost:5000/api/user/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (data.success) {
                // Store the encrypted token in session storage by default
                sessionStorage.setItem("token", data.encryptedToken);

                // Optionally, handle "Remember me" functionality
                if (rememberMe) {
                    // If "Remember me" is checked, store the token in cookies for persistence
                    document.cookie = `token=${data.encryptedToken}; path=/; max-age=31536000`; // 1 year expiration
                }

                alert(data.message);
                // Redirect to the dashboard or any other page
                window.location.href = "http://127.0.0.1:5500/matrimo-frontend/index.html";
            } else {
                alert(data.message); // Show error message
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Failed to sign in! Please try again.");
        }
    });
});
