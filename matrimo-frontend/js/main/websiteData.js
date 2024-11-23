
document.addEventListener("DOMContentLoaded",async()=>{
    showLoader()
    try {
        const response = await fetch("http://localhost:5000/api/get-latest-profile",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        hideLoader()
        const data = await response.json();

        if(data.success){
              updateSocialMediaLinks(data);
              
              updateNewProfiles(data.data);
              sessionStorage.setItem("newProfiles",JSON.stringify(data.data));
        }else{
            alert(data.message);
        }

    } catch (error) {
        
    }
});

function updateSocialMediaLinks(data) {
    // Get the socialMedia container element by its ID
    const socialMediaContainer = document.getElementById("socialMedia");
    // Social media icons mapped by platform
    const socialMediaIcons = {
      "facebook": "images/social/3.png",
      "whatsapp": "images/social/wh2.png",
      "youtube": "images/social/5.png",
      "instagram":"images/social/I.png"
    };
  
    // Clear any existing social media list items
    socialMediaContainer.innerHTML = '';
  
    // Loop through the socialMedia object from the response and create <li> dynamically
    for (const [platform, link] of Object.entries(data.socialMedia)) {
      if (link) {  // Check if the link exists
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = link;
        a.target = "_blank"; // Open the link in a new tab
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
        // console.error("Profiles container with ID 'newProfiles1' not found.");
        return;
    }

    console.log("Profiles data received:", profiles);

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
                console.warn("Skipping profile due to missing required fields:", user);
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
                            <a href="profile-details.html?id=${user.profileID}" onclick="handleViewCount('${user.user_id}', event)">
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
                            <a href="profile-details.html?id=${user.profileID}" onclick="handleViewCount('${user.user_id}', event)">More details</a>
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
                console.log(`Profile added: ${user.profileID}`);
            } else {
                console.log("Maximum profile count reached. Skipping:", user.profileID);
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
  fetch(`http://localhost:5000/api/handle-bookmark`, {
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
              alert(data.message || 'Failed to update bookmark. Please try again.');
          }
          alert(data.message);
      })
      .catch((error) => {
          console.error('Error:', error);
          // Revert UI if an error occurs
          toggleBookmarkUI(!isBookmarked);
          alert('An error occurred. Please try again.');
      });
}


async function handleViewCount(userId,event){
    event.preventDefault();
    console.log(userId)
    try {
        showLoader()
         const response = await fetch(`http://localhost:5000/api/profile/${userId}/view`,{
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
       }else{
        console.log(data.message);

       }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}







function showLoader() {
    document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

