document.getElementById("sendEnquiry").addEventListener("click", async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html"; // Corrected redirection
        return;
    }

    // Collect input field values
    const profileId = document.getElementById("profileId").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const subject = document.getElementById("subject").value;
    const details = document.getElementById("details").value;

    try {
        // Construct the payload as a JSON object
        const payload = {
            profileId,
            name,
            email,
            phone,
            subject,
            details,
        };

        // Make the fetch request
        const response = await fetch("http://localhost:5000/api/send-quiry", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token, // Token header for authentication
            },
            body: JSON.stringify(payload), // Convert payload to JSON string
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);

            // Clear input fields
            document.getElementById("profileId").value = "";
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("subject").value = "";
            document.getElementById("details").value = "";
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error occurred:", error);
        alert("An error occurred. Please try again later.");
    }
});
