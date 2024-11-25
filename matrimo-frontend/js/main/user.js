let submiTAndShowMorePath = "http://127.0.0.1:5500/matrimo-frontend/login.html";

async function fetchUserData() {
    let token = sessionStorage.getItem("token");

    // if (!token) {
    //     const tokenMatch = document.cookie.match(/(^|;) ?token=([^;]*)(;|$)/);
    //     if (tokenMatch) token = tokenMatch[2];
    // }
if(token){


    try {
        showLoader()
        const response = await fetch("http://localhost:5000/api/user/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": token,
            }
        });
       hideLoader()
        const data = await response.json();
      
        if (data.success) {
            sessionStorage.setItem("userData", JSON.stringify(data.userData));
            sessionStorage.setItem("subscriptionData", JSON.stringify(data.subscriptionData));
            sessionStorage.setItem("viewCount",data.userData.viewCount);

            updateNavbar(true,data);
            updateEditProfilePath(data);
            submiTAndShowMorePath="http://127.0.0.1:5500/matrimo-frontend/all-profiles.html";
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
 if(!registerAndSigninLinks || !iconDiv || !exploreLink || !dashboardLink || !userImg ||!userName){
    return;
 }
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

function updateEditProfilePath(data) {
    try {
        // Find the button element
        const editProfileBtn = document.getElementById("editProfilePathBtn");
        if (!editProfileBtn) {
            return;
        }

        // Check if the required data is present
        if (!data || !data.userData || !data.userData.profileID) {
            console.error("Invalid data structure. 'profileID' is missing.");
            return;
        }

        // Set the href attribute
        editProfileBtn.href = `user-profile-edit.html?id=${data.userData.profileID}`;
    } catch (error) {
        console.error("An error occurred while updating the edit profile path:", error);
    }
}


function logout(e) {
    e.preventDefault();
    window.location.href = "index.html"; // Redirect to login page
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userData");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}

document.addEventListener("DOMContentLoaded", fetchUserData);

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
  
// Redirection for logged-in users to index page
if(window.location.pathname.endsWith("login.html") || window.location.pathname.endsWith("sign-up.html") || window.location.pathname.endsWith("forgot.html")){
    if(sessionStorage.getItem("token")){
        window.location.href = "index.html";
    }
}

// List of user-specific pages
const userPages = [
    "all-profiles.html",
    "profile-details.html",
    "user-chat.html",
    "user-dashboard.html",
    "user-profile-edit.html",
    "user-interests.html",
    "user-plan.html",
    "user-profile.html"
];

// Redirection for non-logged-in users to index page
if(userPages.some(page => window.location.pathname.endsWith(page))){
    if(!sessionStorage.getItem("token")){
        window.location.href = "index.html";
    }
}

// document.addEventListener('contextmenu', function(e) {
//     e.preventDefault(); // Disable right-click context menu
// });




// document.addEventListener("keydown", function (e) {
//     // Prevent Ctrl + Shift + I
//     if (e.ctrlKey && e.shiftKey && e.key === "I") {
//         e.preventDefault();
        
//     }

//     // Prevent Ctrl + Shift + J (Console)
//     if (e.ctrlKey && e.shiftKey && e.key === "J") {
//         e.preventDefault();
    
//     }

//     // Prevent Ctrl + U (View Source)
//     if (e.ctrlKey && e.key === "U") {
//         e.preventDefault();
      
//     }

//     // Prevent F12 (DevTools Shortcut)
//     if (e.key === "F12") {
//         e.preventDefault();
        
//     }
// });
