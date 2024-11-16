async function fetchUserData() {
    let token = sessionStorage.getItem("token");

    if (!token) {
        const tokenMatch = document.cookie.match(/(^|;) ?token=([^;]*)(;|$)/);
        if (tokenMatch) token = tokenMatch[2];
    }

    try {
        const response = await fetch("http://localhost:5000/api/user/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": token,
            }
        });

        const data = await response.json();
        console.log(data);
        if (data.success) {
            sessionStorage.setItem("userData", JSON.stringify(data.userData));
            updateNavbar(true);
        } else {
            updateNavbar(false);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        updateNavbar(false);
    }
}

function updateNavbar(isUserLoggedIn) {
    const registerAndSigninLinks = document.getElementsByClassName("auth"); // Get all elements with the class "auth"
    const exploreLink = document.querySelector('.explore'); // Explore link
    const dashboardLink = document.querySelector('.dashboard'); // Dashboard link
    let logoutLink = document.querySelector(".logout-link"); // Logout link

    // Debugging
    console.log('registerAndSigninLinks:', registerAndSigninLinks);
    console.log('exploreLink:', exploreLink);
    console.log('dashboardLink:', dashboardLink);

    // Create the logout link if it doesn't already exist
    if (!logoutLink) {
        const logoutContainer = document.querySelector('.bl ul'); // Ensure container exists
        if (!logoutContainer) {
            console.error("Logout container not found.");
            return;
        }

        logoutLink = document.createElement('a');
        logoutLink.href = '#'; // Replace with logout endpoint if needed
        logoutLink.innerText = "LOGOUT";
        logoutLink.classList.add("logout-link");
        logoutLink.style.display = "none"; // Initially hidden
        logoutLink.addEventListener('click', logout);
        logoutContainer.appendChild(logoutLink);
    }

    // Update visibility and attributes based on login state
    if (isUserLoggedIn) {
        for (let link of registerAndSigninLinks) {
            link.classList.remove('visible');
            link.classList.add('hidden');
        }
        exploreLink.href = "all-profiles.html";
        dashboardLink.href = "user-dashboard.html";
        logoutLink.style.display = "inline-block";
    } else {
        for (let link of registerAndSigninLinks) {
            link.classList.remove('hidden');
            link.classList.add('visible');
        }
        exploreLink.href = "login.html";
        dashboardLink.href = "login.html";
        logoutLink.style.display = "none";
    }
    
    
}





function logout() {
    window.location.href = "http://127.0.0.1:5500/matrimo-frontend/index.html"; // Redirect to login page
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userData");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}

document.addEventListener("DOMContentLoaded", fetchUserData);
