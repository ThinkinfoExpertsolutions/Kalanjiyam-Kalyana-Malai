// Logout functionality
function logout() {
    // Remove all session-related data
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userData");

    // Optionally, remove the token from cookies if it was stored there (if you're using cookies for "Remember Me" functionality)
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";


    window.location.reload(true); // Forces a fresh reload of the page, bypassing cache.

    // Redirect to home page after logging out
    // window.location.href = `${CONFIG.BASE_URL}`; // Adjust the path if needed based on your actual home URL
}

// Call the logout function when the page loads
window.onload = logout;
