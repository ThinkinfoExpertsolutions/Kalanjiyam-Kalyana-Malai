document.getElementById("sendEnquiry").addEventListener("click", async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");

    if (!token) {
        showErrorToast("Please Login");
        setTimeout(()=>{
            window.location.href = "login.html"; 
        },1000)
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
        showLoader()
        // Make the fetch request
        const response = await fetch("https://backend-green-seven-44.vercel.app/api/send-quiry", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token, // Token header for authentication
            },
            body: JSON.stringify(payload), // Convert payload to JSON string
        });
     hideLoader()
        const data = await response.json();

        if (data.success) {
            showSuccessToast(data.message);

            // Clear input fields
            document.getElementById("profileId").value = "";
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("subject").value = "";
            document.getElementById("details").value = "";
        } else {
            showErrorToast(data.message);
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
  