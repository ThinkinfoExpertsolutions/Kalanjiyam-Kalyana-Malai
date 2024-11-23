const data2 = sessionStorage.getItem("subscriptionData");
const subscriptionData = data2 ? JSON.parse(data2) : null;


const data = sessionStorage.getItem("userData");
const profilesData = sessionStorage.getItem("newProfiles");
const userData = data ? JSON.parse(data) : null;
const leatestProfiles = profilesData ? JSON.parse(profilesData) : null;
const defaultProfileImage = "https://static.vecteezy.com/system/resources/previews/001/840/612/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg";
document.addEventListener('DOMContentLoaded',()=>{

    if (userData && userData.media && userData.media.profileImage) {
        document.getElementById("profileImage").src = userData.media.profileImage;
    } else {
        document.getElementById("profileImage").src = defaultProfileImage;
    }
    updateNewProfiles(userData,leatestProfiles);
    UpdateProfileCompletion(userData);
    updateActivities(userData);
    updateBookmarkList(userData);
    updatePlan(subscriptionData)
    
})

function updateNewProfiles(userData,leatestProfiles){
         
    const dashboardNewProfiles = document.getElementById("dashboardNewProfiles");

    leatestProfiles.forEach(profile=>{
      
        if(profile.user_id === userData.user_id){
            return;
        }

    if(profile.media.profileImage || profile.basicInfo.name || profile.personalDetails.age ||profile.basicInfo.district ||profile.profileID){
        
    const li = document.createElement("li");

    li.innerHTML = `
         <div class="db-new-pro">
                 <img src="${profile.media.profileImage}" alt="" class="profile">
                 <div>
                     <h5>${profile.basicInfo.name}</h5>
                     <span class="city">${profile.basicInfo.district}</span>
                     <span class="age">${profile.personalDetails.age} Years old</span>
                 </div>
                 <div class="pro-ave" title="User currently available">
                 </div>
                 <a  href="profile-details.html?id=${profile.profileID}" class="fclick" target="_blank">&nbsp;</a>
             </div>
    `
    dashboardNewProfiles.appendChild(li);

    }
    })

}

function UpdateProfileCompletion(userData){
    
    const profileCompletion = sessionStorage.getItem("profileCompletion");
    document.getElementById("profileCompletion").innerHTML=`<b class="count" >${profileCompletion!==null?profileCompletion:"0"}</b>%`;
    document.getElementById("editProfilePath").href=`user-profile-edit.html?id=${userData.profileID}`;
    document.getElementById("viewProfilePath").href =`profile-details.html?id=${userData.profileID}`;
    document.getElementById("viewCount").innerHTML=`<i class="fa fa-eye view" aria-hidden="true"></i><b >${userData.viewCount}</b>Views`;
    document.getElementById("bookmarkCount").innerHTML=`<i class="fa fa-handshake-o inte" aria-hidden="true"></i><b>${userData.bookMarkedProfiles.length}</b >Bookmark`;

}

function updateActivities(userData){
    const activityContainer = document.getElementById("activities");
    let count=0;
    userData.activitys.forEach(acivity=>{
        const name = acivity.name.split(" ")[0];
     if(count<4){
        const li = document.createElement("li");
       
        li.innerHTML=`
                 <div class="db-int-pro-1" href="profile-details.html?id=${acivity.profileID}"> <img src="${acivity.image?acivity.image:defaultProfileImage}" alt=""> </div>
                                 <div class="db-int-pro-2">
                                     <h5>${name}</h5> <span>${acivity.event}</span>
                                  </div>
        `
       activityContainer.appendChild(li);
       count++;
     }
    }) 
}

function updateBookmarkList(userData) {
    const bookmarksList = document.getElementById('Bookmarks');
    bookmarksList.innerHTML = ''; // Clear the existing list before updating
  
    userData.bookMarkedProfiles.forEach((user) => {
      const isBookmarked = userData.bookMarkedProfiles.some(
        (profile) => profile.userId === user.userId
      );
  
      // Create the list item dynamically
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="db-int-pro-1">
          <img src="${user.image || defaultProfileImage}" alt="${user.name || 'Unknown User'}'s profile picture">
        </div>
        <div class="db-int-pro-2">
          <h5>${user.name || 'Unknown User'}</h5>
          <ol class="poi">
            <li>City: <strong>${user.location || 'N/A'}</strong></li>
            <li>Age: <strong>${user.age || 'N/A'}</strong></li>
            <li>Religion: <strong>${user.religion || 'N/A'}</strong></li>
            <li>Job: <strong>${user.jobType || 'N/A'}</strong></li>
          </ol>
          <ol class="poi poi-date">
            <li>Bookmarked on: ${new Date(user.time).toLocaleString() || 'N/A'}</li>
          </ol>
          <a href="profile-details.html?id=${user.userId}" class="cta-5">View full profile</a>
        </div>
        <span 
          class="enq-sav" 
          data-toggle="tooltip" 
          onclick="toggleBookmark('${user.userId}', this)"
        >
          <i class="${isBookmarked ? 'fa fa-bookmark' : 'fa fa-bookmark-o'}" aria-hidden="true"></i>
        </span>
      `;
  
      bookmarksList.appendChild(li);
    });
  }
  
  function toggleBookmark(userId, element) {

    if (!sessionStorage.getItem('token')) {
      window.location.href = 'login.html';
      return;
    }
  
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
  
    const isBookmarked = element.querySelector('i').classList.contains('fa-bookmark');
    toggleBookmarkUI(isBookmarked);
  
    const action = isBookmarked ? 'remove' : 'add';
    showLoader();
  
    fetch(`http://localhost:5000/api/handle-bookmark`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        token: sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        bookmarkProfileId: userId,
        action: action,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        hideLoader();
        if (!data.success) {
          toggleBookmarkUI(!isBookmarked);
          alert(data.message || 'Failed to update bookmark. Please try again.');
        }
        alert(data.message);
      })
      .catch((error) => {
        console.error('Error:', error);
        toggleBookmarkUI(!isBookmarked);
        alert('An error occurred. Please try again.');
      });
  }
  
  function updatePlan(subscriptionData) {
    // Get the HTML elements by their IDs
    console.log(subscriptionData)
    const planNameElement = document.getElementById("planeName");
    const planStatus = document.getElementById("planStatus");
    const durationElement = document.getElementById("duration");
    const validTillElement = document.getElementById("validTill");
    const updgradeBtn = document.getElementById("updgradeBtn");

    // Check if subscriptionData is valid and active
    if (subscriptionData && subscriptionData.isActive) {
        // Use a default plan name as "Standard Plan"
        const planName = "Platinum";
        
        // Get duration in days and convert to months
        const durationInDays = subscriptionData.durationInDays || 0;
        const durationInMonths = Math.floor(durationInDays / 30);

        // Format the endDate
        const endDate = subscriptionData.endDate
            ? new Date(subscriptionData.endDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
              })
            : "N/A";

        // Update the DOM elements
        planStatus.textContent=planName;
        planNameElement.textContent = "Active";
        durationElement.textContent = `${durationInMonths} ${durationInMonths === 1 ? "Month" : "Months"}`;
        validTillElement.textContent = endDate;
        updgradeBtn.innerText="Renew Plan";
    } else {
        // Handle inactive or missing subscription
        planNameElement.textContent = "No Active Plan";
        durationElement.textContent = "N/A";
        validTillElement.textContent = "N/A";
    }
}




