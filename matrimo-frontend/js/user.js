async function fetchUserData() {
    let token = sessionStorage.getItem("token");

    if (!token) {
        const tokenMatch = document.cookie.match(/(^|;) ?token=([^;]*)(;|$)/);
        if (tokenMatch) token = tokenMatch[2];
    }

    try {
        const response = await fetch("http://localhost:5000/api/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": token,
            }
        });

        const data = await response.json();
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
    const registerLink = document.querySelector("a[href='sign-up.html']");
    const signInLink = document.querySelector("a[href='login.html']");
    const logoutContainer = document.querySelector('.bl ul');
    
    let logoutLink = document.querySelector(".logout-link");

    if (!logoutLink) {
        logoutLink = document.createElement('a');
        logoutLink.href = '';
        logoutLink.innerText = "LOGOUT";
        logoutLink.classList.add("logout-link");

        logoutLink.addEventListener('click', logout);
        logoutContainer.appendChild(logoutLink);
    }

    if (isUserLoggedIn) {
        if (registerLink) registerLink.style.display = "none";
        if (signInLink) signInLink.style.display = "none";
        logoutLink.style.display = "inline-block";
    } else {
        if (registerLink) registerLink.style.display = "inline";
        if (signInLink) signInLink.style.display = "inline";
        logoutLink.style.display = "none";
    }
}

function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userData");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    window.location.href = "/login.html"; // Redirect to login page
}

document.addEventListener("DOMContentLoaded", fetchUserData);
