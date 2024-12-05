

document.addEventListener("DOMContentLoaded",async()=>{
    showLoader()
    try {
           const response = await fetch("https://backend-alpha-flax.vercel.app/api/get-latest-profile", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
});

        hideLoader()
        const data = await response.json();

        if(data.success){
              updateSocialMediaLinks(data);
              
              updateNewProfiles(data.data);
              sessionStorage.setItem("newProfiles",JSON.stringify(data.data));
        }else{
            showErrorToast(data.message)
        }

    } catch (error) {
        console.error('Error:', error);
        showErrorToast(error.message)
    }
});

function updateSocialMediaLinks(data) {
    // Get the socialMedia container element by its ID
    const socialMediaContainer = document.getElementById("socialMedia");
    if(!socialMediaContainer){
        return;
    }
    // Social media icons mapped by platform
    const socialMediaIcons = {
      "facebook": "images/social/3.png",
      "whatsapp": "images/social/wh2.png",
      "youtube": "images/social/5.png",
      "instagram":"images/social/I.png",
      "x":"images/social/twitter.jpg"
    };
  
    // Clear any existing social media list items
    socialMediaContainer.innerHTML = '';
  
    // Loop through the socialMedia object from the response and create <li> dynamically
    for (const [platform, link] of Object.entries(data.socialMedia)) {
      if (link) {  // Check if the link exists
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = link;
        const img = document.createElement("img");
        img.src = socialMediaIcons[platform] || ""; // Get the corresponding image for the platform
        img.alt = platform;
        img.loading = "lazy";
        a.appendChild(img);
        li.appendChild(a);
        socialMediaContainer.appendChild(li);
      }
    }
  }
  
  function updateNewProfiles(profiles) {
    const profilesContainer = document.getElementById('newProfiles1');

    // Check if the container exists
    if (!profilesContainer) {
        
        return;
    }
  
    console.log("Profiles data received:");

    let count = 0;
    const myProfile = sessionStorage.getItem("userData");
    const parsedData = myProfile ? JSON.parse(myProfile) : null;

    if (!parsedData) {
        console.warn("No user data found in session storage.");
    }

    profiles.forEach(user => {
        try {
            // Ensure required fields are available before processing
            const hasRequiredFields =
                user.media?.profileImage &&
                user.basicInfo?.name &&
                user.education?.degree &&
                user.personalDetails?.age &&
                user.personalDetails?.height &&
                user.user_id !== parsedData?.user_id;

            if (!hasRequiredFields) {
                console.warn("Skipping profile due to missing required fields");
                return;
            }

            // Check if the profile is bookmarked
            const isBookmarked = parsedData?.bookMarkedProfiles?.some(
                (profile) => profile.userId === user.profileID
            ) || false;

            // Create a list item for the profile
            const listItem = document.createElement('li');

            listItem.innerHTML = `
                <div class="all-pro-box" data-useravil="avilyes" data-aviltxt="Available online">
                    <div class="pro-img">
                        <a href="profile-details.html">
                            <img src="${user.media.profileImage}" alt="${user.basicInfo.name}">
                        </a>
                    </div>
                    <div class="pro-detail">
                        <h4>
                            <a href="" onclick="handleViewCount('${user.user_id}', event,'${user.profileID}')">
                                ${user.basicInfo.name.split(" ")[0]}
                            </a>
                        </h4>
                        <div class="pro-bio">
                            <span>${user.jobDetails?.position || "N/A"}</span>
                            <span>${user.basicInfo?.district || "N/A"}</span>
                            <span>${user.personalDetails?.age} Years old</span>
                            <span>${user.basicInfo.cast?.includes("other") 
                                ? user.basicInfo.cast.split("-")[0] 
                                : user.basicInfo.cast || "N/A"}
                            </span>
                        </div>
                        <div class="links">
                            <a href="" onclick="handleViewCount('${user.user_id}', event,'${user.profileID}')">More details</a>
                        </div>
                    </div>
                    <span 
                        class="enq-sav" 
                        data-toggle="tooltip" 
                        title="Click to save this profile."
                        onclick="toggleBookmark('${user.profileID}', this)"
                    >
                        <i class="${isBookmarked ? "fa fa-bookmark" : "fa fa-bookmark-o"}" aria-hidden="true"></i>
                    </span>
                </div>`;

            // Append to the container if the count is less than 4
            if (count < 4) {
                profilesContainer.appendChild(listItem);
                count++;
               
            } else {
                console.log("Maximum profile count reached. Skipping:");
            }
        } catch (error) {
            console.error("Error processing profile:", user, error);
        }
    });

    console.log("All profiles processed.");
}

// // Remove the loader once profiles are loaded
// if (profiles.length > 0) {
//     loader.remove();
// } else {
//     loader.innerHTML = 'No profiles found';
// }

  

function toggleBookmark(userId, element) {
  // Redirect to login if the user is not authenticated
  if (!sessionStorage.getItem("token")) {
      window.location.href = "login.html";
      return;
  }

  // Helper function to toggle bookmark UI
  const toggleBookmarkUI = (isBookmarked) => {
      const icon = element.querySelector('i');
      if (isBookmarked) {
          icon.classList.remove('fa-bookmark');
          icon.classList.add('fa-bookmark-o');
      } else {
          icon.classList.remove('fa-bookmark-o');
          icon.classList.add('fa-bookmark');
      }
  };

  // Check current bookmark state
  const isBookmarked = element.querySelector('i').classList.contains('fa-bookmark');

  // Update the UI optimistically
  toggleBookmarkUI(isBookmarked);

  // Prepare the action for the backend
  const action = isBookmarked ? 'remove' : 'add';
   showLoader()
  // Send request to backend
  fetch(`https://backend-alpha-flax.vercel.app/api/handle-bookmark`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'token': sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
          bookmarkProfileId: userId,
          action: action,
      }),
  })
      .then((response) => response.json())
      .then((data) => {
        hideLoader()
          if (!data.success) {
              // Revert UI if the request fails
              toggleBookmarkUI(!isBookmarked);
              showErrorToast(data.message || 'Failed to update bookmark. Please try again.');
          }
          showSuccessToast(data.message);
      })
      .catch((error) => {
          console.error('Error:', error);
          // Revert UI if an error occurs
          toggleBookmarkUI(!isBookmarked);
          showErrorToast('An error occurred. Please try again.');
      });
}


async function handleViewCount(userId,event,profileID){
    event.preventDefault();
    
    if(!sessionStorage.getItem("token")){
        window.location.href=`login.html`;
        return;
    }
    try {
        showLoader()
         const response = await fetch(`https://backend-alpha-flax.vercel.app/api/profile/${userId}/view`,{
            method: 'PATCH',
            headers: {
          'Content-Type': 'application/json',
          "token":sessionStorage.getItem("token")
           },
        });
        hideLoader();
        const data = await response.json();
      if(data.success){
            console.log(data.message);
            window.location.href=`profile-details.html?id=${profileID}`
       }else{
        console.log(data.message);

       }
    } catch (error) {
        console.error('Error:', error);
        showErrorToast('An error occurred. Please try again.');
    }
}







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

 // notifications.js

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
  
  
