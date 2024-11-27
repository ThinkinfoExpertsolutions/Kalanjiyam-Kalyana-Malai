document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submitBtn").addEventListener("click", async (e) => {
      e.preventDefault(); // Prevent form default submission if inside a form
      console.log("Submit button clicked");
  
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
        alert("Please fill out all required fields: Name, Email, and Password.");
        return;
      }
  
      // Debugging log for input values
      console.log({
        userName,
        password,
        email,
        socialMedia: { whatsapp, instagram, facebook, x, youtube },
      });
  
      try {
        // Define headers
        const headers = {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        };
  
        // API request for admin credentials
        const credentialResponse = await fetch(
          "http://localhost:5000/api/admin/change-admin-credential",
          {
            method: "POST",
            headers,
            body: JSON.stringify({ userName, email, password }),
          }
        );
  
        // API request for social media updates
        const socialMediaResponse = await fetch(
          "http://localhost:5000/api/admin/update-socialmedia",
          {
            method: "POST",
            headers,
            body: JSON.stringify({ whatsapp, instagram, facebook, x, youtube }),
          }
        );
  
        // Parse API responses
        const credentialData = await credentialResponse.json();
        const socialMediaData = await socialMediaResponse.json();
  
        // Handle success or errors
        if (credentialData.success && socialMediaData.success) {
          alert("Admin credentials and social media updated successfully!");
        } else {
          alert(
            `Error: ${credentialData.message || "Updating credentials failed"} - ${
              socialMediaData.message || "Updating social media failed"
            }`
          );
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      }
    });
  });
  