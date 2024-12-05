document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submitBtn").addEventListener("click", async (e) => {
      e.preventDefault(); // Prevent form default submission if inside a form
      
  
      // Required fields
      const userName = document.getElementById("name")?.value.trim();
      const password = document.getElementById("password")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
  
      // Optional social media fields (check for existence only)
      const whatsapp = document.getElementById("whatsApp")?.value.trim() || null;
      const instagram = document.getElementById("instagram")?.value.trim() || null;
      const facebook = document.getElementById("faceBook")?.value.trim() || null;
      const x = document.getElementById("x")?.value.trim() || null;
      const youtube = document.getElementById("youTube")?.value.trim() || null;
  
      // Validate required fields
      if (!userName || !password || !email) {
        showErrorToast("Please fill out all required fields: Name, Email, and Password.");
        return;
      }
  
     
  
      try {
        // Define headers
        const headers = {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        };
      showLoader()
        // API request for admin credentials
        const credentialResponse = await fetch(
          "https://backend-green-seven-44.vercel.app/api/admin/change-admin-credential",
          {
            method: "POST",
            headers,
            body: JSON.stringify({ userName, email, password }),
          }
        );
  
        // API request for social media updates
        const socialMediaResponse = await fetch(
          "https://backend-green-seven-44.vercel.app/api/admin/update-socialmedia",
          {
            method: "POST",
            headers,
            body: JSON.stringify({ whatsapp, instagram, facebook, x, youtube }),
          }
        );
  hideLoader()
        // Parse API responses
        const credentialData = await credentialResponse.json();
        const socialMediaData = await socialMediaResponse.json();
  
        // Handle success or errors
        if (credentialData.success && socialMediaData.success) {
          showSuccessToast("Admin credentials and social media updated successfully!");
        } else {
          showErrorToast(
            `Error: ${credentialData.message || "Updating credentials failed"} - ${
              socialMediaData.message || "Updating social media failed"
            }`
          );
        }
      } catch (error) {
        console.error("Error:", error);
        showErrorToast("An error occurred. Please try again later.");
      }
    });
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