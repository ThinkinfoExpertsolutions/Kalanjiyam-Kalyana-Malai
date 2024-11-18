
document.addEventListener("DOMContentLoaded",async()=>{
    try {
        const response = await fetch("http://localhost:5000/api/get-latest-profile",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await response.json();

        if(data.success){
              updateSocialMediaLinks(data);
              updateNewProfiles(data.data);
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
    const profilesContainer = document.getElementById('newProfiles');
    
    // Show a loader before data is received
    const loader = document.createElement('div');
    loader.classList.add('loader'); // You can customize this class for the loader style
    loader.innerHTML = 'Loading profiles...'; // You can change this to a spinner or other loader
    profilesContainer.appendChild(loader);
    
    let count = 0;
    const myProfile = sessionStorage.getItem("userData");

    let isBookmarked = false;

    // Loop through the profiles data
    profiles.forEach(user => {
        // Check if the profile is bookmarked
        if (myProfile) {
            const parsedData = JSON.parse(myProfile);
            isBookmarked = parsedData.bookMarkedProfiles.some(
                (profile) => profile.userId === user.user_id
            );
        }

        const listItem = document.createElement('li');
        
        // Check if required fields are available
        if (user.media.profileImage && user.basicInfo.name && user.education.degree && user.personalDetails.age && user.personalDetails.height) {
            if (count < 4) {
                listItem.innerHTML = `
                    <div class="all-pro-box" data-useravil="avilyes" data-aviltxt="Available online">
                        <div class="pro-img">
                            <a href="profile-details.html">
                                <img src="${user.media.profileImage}" alt="">
                            </a>
                        </div>
                        <div class="pro-detail">
                            <h4><a href="profile-details.html?id=${user._id}">${user.basicInfo.name}</a></h4>
                            <div class="pro-bio">
                                <span>${user.education.degree}</span>
                                <span>${user.jobDetails.position}</span>
                                <span>${user.personalDetails.age} Years old</span>
                                <span>Height: ${user.personalDetails.height} Cms</span>
                            </div>
                            <div class="links">
                                <a href="profile-details.html">More details</a>
                            </div>
                        </div>
                        <span 
                            class="enq-sav" 
                            data-toggle="tooltip" 
                            title="Click to save this profile."
                            onclick="toggleBookmark('${user._id}', this)"
                        >
                            <i class="${isBookmarked ? "fa fa-bookmark" : "fa fa-bookmark-o"}" aria-hidden="true"></i>
                        </span>
                    </div>`;

                profilesContainer.appendChild(listItem);
                count++;
            }
        }
    });

    // Remove the loader once profiles are loaded
    if (profiles.length > 0) {
        loader.remove();
    } else {
        loader.innerHTML = 'No profiles found';
    }
}

  

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




