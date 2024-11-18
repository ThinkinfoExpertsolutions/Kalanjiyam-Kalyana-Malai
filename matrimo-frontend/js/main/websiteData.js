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
  

  function updateNewProfiles(profiles){

    

    const profilesContainer = document.getElementById('newProfiles');
    let count = 0;
// Loop through the profiles data
profiles.forEach(user => {
  // Create the list item for each profile
  const listItem = document.createElement('li');
  if(user.media.profileImage && user.basicInfo.name && user.education.degree && user.personalDetails.age && user.personalDetails.height)
  if(count<4){
  listItem.innerHTML = `
    <div class="all-pro-box" data-useravil="avilyes" data-aviltxt="Available online">
        <div class="pro-img">
            <a href="profile-details.html">
                <img src="${user.media.profileImage}" alt="">
            </a>
        </div>
        <div class="pro-detail">
            <h4><a href="profile-details.html">${user.basicInfo.name}</a></h4>
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
    onclick="toggleBookmark(this)"
>
    <i class="fa fa-bookmark-o" aria-hidden="true"></i>
</span>

<span 
    class="enq-sav" 
    data-toggle="tooltip" 
    title="Click to save this profile."
    onclick="toggleBookmark(this)"
>
    <i class="fa fa-bookmark-o" aria-hidden="true"></i>
</span>

    </div>
  `;
  profilesContainer.appendChild(listItem);
count++;
  }
}) }


function toggleBookmark(element) {
  const iconElement = element.querySelector('i');

  if(sessionStorage.getItem("token")){
    if (iconElement.classList.contains('fa-bookmark-o')) {
      // Change to "after bookmark" state
      iconElement.classList.remove('fa-bookmark-o');
      iconElement.classList.add('fa-bookmark');
      element.setAttribute('title', 'Profile saved. Click to remove bookmark.');
  } else {
      // Change back to "before bookmark" state
      iconElement.classList.remove('fa-bookmark');
      iconElement.classList.add('fa-bookmark-o');
      element.setAttribute('title', 'Click to save this profile.');
  }
  }else{
      window.location.href = "login.html";
  }

  
}


