let submiTAndShowMorePath = "login.html";

async function fetchUserData() {
    let token = sessionStorage.getItem("token");

    // if (!token) {
    //     const tokenMatch = document.cookie.match(/(^|;) ?token=([^;]*)(;|$)/);
    //     if (tokenMatch) token = tokenMatch[2];
    // }
if(token){


    try {
        showLoader()
        const response = await fetch("https://backend-green-seven-44.vercel.app/api/user/user", {
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
            updateMobileNavbar(true,data)
            submiTAndShowMorePath="all-profiles.html";
        } else {
            updateNavbar(false);
            updateMobileNavbar(false);

        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        updateNavbar(false);
    }
}
}
function updateMobileNavbar(isUserLoggedIn, data) {
    const registerAndSigninLinks = document.querySelectorAll(".auth-m");
    const exploreLink = document.querySelectorAll(".explore-m");
    const myProfile = document.getElementById("myProfile-m");
    const dashboardLink = document.getElementById("dasshBoard-m");
    let logoutLink = document.getElementById("logout-link");
   
    const userImg = document.getElementById("userImg-m");
    const userName = document.getElementById("userName-n");
    const profileID = document.getElementById("profileID-m");

    // Check if required elements exist
    if (!registerAndSigninLinks  || !exploreLink || !dashboardLink || !userImg || !userName || !profileID) {
        console.error("One or more required elements are missing.");
        return;
    }

    
    if (isUserLoggedIn) {
        
        Array.from(registerAndSigninLinks).forEach(link => {
            link.classList.add('hidden2');
            link.classList.remove('visible2');
            link.style.display = "none"; 
        });
        const userData = data?.userData;
        // Update links
        if (exploreLink) {
            for(let link of exploreLink){
                link.href="all-profiles.html";
            }
        }
        
        if (dashboardLink) dashboardLink.href = "user-dashboard.html";
        if(myProfile) myProfile.href = `profile-details.html?id=${userData.profileID}`
        // Show logout link
        logoutLink.innerHTML=`<a onClick="logout(event)">Log Out<a/>`

        // Update user details
        if (userData) {
            userImg.src = userData.media?.profileImage || "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png";
            userName.innerText = userData.basicInfo?.name || "User";
            profileID.innerText = userData.profileID || "ID Not Available";
        } else {
            console.warn("User data is not available.");
        }
    } else {
        // Show login/signup links
        Array.from(registerAndSigninLinks).forEach(link => {
            link.classList.remove('hidden2');
            link.classList.add('visible2');
            link.style.display = "inline"; // Make it visible
        });

        // Update links for unauthenticated state
        if (exploreLink) exploreLink.href = "login.html";
        if (dashboardLink) dashboardLink.href = "login.html";

        // Hide logout link
        logoutLink.style.display = "none";
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
    const profileID = document.getElementById("profileID");
 if(!registerAndSigninLinks || !iconDiv || !exploreLink || !dashboardLink || !userImg ||!userName ||!profileID){
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
        profileID.innerText = data.userData.profileID;

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
    sessionStorage.removeItem("subscriptionData");
    sessionStorage.removeItem("viewCount");
    sessionStorage.removeItem("latestProfiles");
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

function showLoader() {
    document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

function openPopup() {
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    const closeButton = document.querySelector(".close-btn");
    closeButton.classList.add("rotate"); // Add rotation class

    // Wait for the animation to finish before hiding the popup
    setTimeout(() => {
        closeButton.classList.remove("rotate"); // Remove rotation class after animation
        document.getElementById("popup").style.display = "none";
    }, 600); // Match the animation duration (0.6s)
}
