let submiTAndShowMorePath = "http://127.0.0.1:5500/matrimo-frontend/login.html";

async function fetchUserData() {
    let token = sessionStorage.getItem("token");

    // if (!token) {
    //     const tokenMatch = document.cookie.match(/(^|;) ?token=([^;]*)(;|$)/);
    //     if (tokenMatch) token = tokenMatch[2];
    // }
if(token){


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
            updateNavbar(true,data);
            submiTAndShowMorePath="http://127.0.0.1:5500/matrimo-frontend/all-profiles.html"
            
        } else {
            updateNavbar(false);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        updateNavbar(false);
    }
}
}

function updateNavbar(isUserLoggedIn, data) {
    const registerAndSigninLinks = document.getElementsByClassName("auth");
    const iconDiv = document.getElementsByClassName("al");
    const exploreLink = document.querySelector('.explore');
    const dashboardLink = document.querySelector('.dashboard');
    let logoutLink = document.querySelector(".logout-link");
    const userImg = document.getElementById("userImg");
    const userName = document.getElementById("userName");

    // Create the logout link if it doesn't already exist
    if (!logoutLink) {
        const logoutContainer = document.querySelector('.bl ul');
        if (!logoutContainer) {
            console.error("Logout container not found.");
            return;
        }

        logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.innerText = "LOGOUT";
        logoutLink.classList.add("logout-link");
        logoutLink.style.display = "none";
        logoutLink.addEventListener('click', logout);
        logoutContainer.appendChild(logoutLink);
    }

    // Update visibility and attributes based on login state
    if (isUserLoggedIn) {
        for (let link of registerAndSigninLinks) {
            link.classList.toggle('hidden', true);
            link.classList.toggle('visible', false);
        }
        if (exploreLink && dashboardLink) {
            exploreLink.href = "all-profiles.html";
            dashboardLink.href = "user-dashboard.html";
        }
        logoutLink.style.display = "inline-block";

        if (data?.userData?.media?.profileImage) {
            userImg.src = data.userData.media.profileImage;
        } else {
            userImg.src = "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png";
        }

        if (userName) {
            userName.innerHTML = data.userData.basicInfo.name || "User";
        }

        if (iconDiv.length > 0) {
            iconDiv[0].href = `profile-details.html?id=${data.userData.profileID}`;
        } else {
            console.error("Icon div not found.");
        }
        if(document.getElementById("register")){
            document.getElementById("register").style.display="none";
            }
    } else {
        for (let link of registerAndSigninLinks) {
            link.classList.toggle('hidden', false);
            link.classList.toggle('visible', true);
        }
        if (exploreLink && dashboardLink) {
            exploreLink.href = "login.html";
            dashboardLink.href = "login.html";
        }
        logoutLink.style.display = "none";
    }
}

if(document.getElementById("submit")){

document.getElementById("submit").addEventListener("click",(e)=>{
     e.preventDefault();
     window.location.href=submiTAndShowMorePath;
})
}
if(document.getElementById("showMore")){
document.getElementById("showMore").addEventListener("click",(e)=>{
     e.preventDefault();
     window.location.href=submiTAndShowMorePath;
})
}


function logout() {
    window.location.href = "http://127.0.0.1:5500/matrimo-frontend/index.html"; // Redirect to login page
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userData");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}

document.addEventListener("DOMContentLoaded", fetchUserData);
