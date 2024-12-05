const data2 = sessionStorage.getItem("subscriptionData");
const subscriptionData = data2 ? JSON.parse(data2) : null;


const data = sessionStorage.getItem("userData");
const userData = data ? JSON.parse(data) : null;

const profilesData = sessionStorage.getItem("newProfiles");
const leatestProfiles = profilesData ? JSON.parse(profilesData) : null;



const defaultProfileImage = "images/default-profileImage.jpg"
document.addEventListener('DOMContentLoaded',()=>{

  const profileImageElement = document.getElementById("profileImage");

  if (profileImageElement) {
      profileImageElement.src = 
          !!userData.media.profileImage? userData.media.profileImage:defaultProfileImage;
  }
  const largeProfileImageElement = document.getElementById("profileImageLarge");

  if (largeProfileImageElement) {
    largeProfileImageElement.src = 
    !!userData.media.profileImage? userData.media.profileImage:defaultProfileImage;

    largeProfileImageElement.style.objectFit='cover';
  }

    updateNewProfiles(userData,leatestProfiles);
    UpdateProfileCompletion(userData);
    updateActivities(userData);
    updateBookmarkList(userData);
    updatePlan(subscriptionData);
    updateVerify(userData.verification_status);
    updatePlanTable(userData.planHistory);
})

function updateNewProfiles(userData, leatestProfiles) {
  const dashboardNewProfiles = document.getElementById("dashboardNewProfiles");

  if (!dashboardNewProfiles) {
      return;
  }

  // Check if 'leatestProfiles' is defined and is an array
  if (!Array.isArray(leatestProfiles)) {
      console.log("Latest profiles data is not an array or is undefined.");
      return;
  }

  let count = 0;

  leatestProfiles.forEach(profile => {
      if (profile.user_id === userData.user_id) {
          return;
      }

      if (
        profile?.media?.profileImage ||
        profile?.basicInfo?.name ||
        profile?.personalDetails?.age !== undefined || 
        profile?.basicInfo?.district ||
        profile?.profileID
      )
      {
        if (count < 6) {
          const li = document.createElement("li");
      
          li.innerHTML = `
              <div class="db-new-pro">
                  <img src="${profile.media.profileImage || defaultProfileImage}" alt="" class="profile">
                  <div>
                      <h5>${profile.basicInfo.name || "N/A"}</h5>
                      <span class="city">${profile.basicInfo.district || "N/A"}</span>
                      <span class="age">${profile.personalDetails?.age ? profile.personalDetails.age + " Years old" : "N/A"}</span>
                  </div>
                  <a href="profile-details.html?id=${profile.profileID || "#"}" class="fclick">&nbsp;</a>
              </div>
          `;
      
          dashboardNewProfiles.appendChild(li);
          count++;
        }
      }
  });
}


function UpdateProfileCompletion(userData){
    
   // Early return if the element is not found
const profileCompletion = userData.profileCompletion

const ProfileID = document.getElementById("ProfileID");
if(ProfileID){ProfileID.innerText=userData.profileID}
const profileCompletionElement = document.getElementById("profileCompletion");
if (!profileCompletionElement) return;  // Exit if element not found
profileCompletionElement.innerHTML = `<b class="count">${profileCompletion !== null ? profileCompletion : "0"}</b>%`;

const editProfilePathElement = document.getElementById("editProfilePath");
if (!editProfilePathElement) return;  // Exit if element not found
editProfilePathElement.href = `user-profile-edit.html?id=${userData.profileID}`;

const viewProfilePathElement = document.getElementById("viewProfilePath");
if (!viewProfilePathElement) return;  // Exit if element not found
viewProfilePathElement.href = `profile-details.html?id=${userData.profileID}`;

const viewCountElement = document.getElementById("viewCount");
if (!viewCountElement) return;  // Exit if element not found
viewCountElement.innerHTML = `<i class="fa fa-eye view" aria-hidden="true"></i><b>${userData.viewCount}</b>Views`;

const bookmarkCountElement = document.getElementById("bookmarkCount");
if (!bookmarkCountElement) return;  // Exit if element not found
bookmarkCountElement.innerHTML = `<i class="fa fa-handshake-o inte" aria-hidden="true"></i><b>${userData.bookMarkedProfiles.length}</b>Bookmark`;

}

function updateActivities(userData){
    const activityContainer1 = document.getElementById("activities1");
    const activityContainer2 = document.getElementById("activities2");

    const sortedActivities = userData.activitys.sort((a,b)=>new Date(b.time) - new Date(a.time)) // Fetch all enquiries data

    if(activityContainer1){
      let count=0;

      if( sortedActivities<= 0){
        activityContainer1.innerHTML = `
        <p style="
            text-align: center;
            font-size: 1.2em;
            font-weight: bold;
            color: #555;
            margin-top: 20px;
            padding: 20px;
            border: 1px dashed #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
        ">
            No activities found.
        </p>
    `;
    
    return;
      }

      sortedActivities.forEach(acivity=>{
          const name = acivity.name.split(" ")[0];
       if(count<4){
          const li = document.createElement("li");
         
          li.innerHTML=`
                   <div class="db-int-pro-1" href="profile-details.html?id=${acivity.profileID}"> <img src="${acivity.image?acivity.image:defaultProfileImage}" alt=""> </div>
                                   <div class="db-int-pro-2">
                                       <h5>${name}</h5> <span>${acivity.event}</span>
                                    </div>
          `
         activityContainer1.appendChild(li);
         count++;
       }
      })
    }else if(activityContainer2){
      let count=0;
      const sortedActivities = userData.activitys.sort((a,b)=>new Date(b.time) - new Date(a.time)) // Fetch all enquiries data

      
      if( sortedActivities <= 0){
        activityContainer2.innerHTML = `
        <p style="
            text-align: center;
            font-size: 1.2em;
            font-weight: bold;
            color: #555;
            margin-top: 20px;
            padding: 20px;
            border: 1px dashed #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
        ">
            No activities found.
        </p>
    `;
    
    return;
      }

      sortedActivities.forEach(acivity=>{
          const name = acivity.name.split(" ")[0];
       if(count<4){
          const li = document.createElement("li");
         
          li.innerHTML = `
          <li class="db-chat-trig">
          <a href="profile-details.html?id=${acivity.profileID}" class="db-chat-link">
            <div class="db-chat-pro">
              <img src="${acivity.image ? acivity.image : defaultProfileImage}" alt="">
            </div>
            <div class="db-chat-bio">
              <h5>${name}</h5>
              <span>${acivity.event}</span>
            </div>
            <div class="db-chat-info">
              <div class="time new">
                <span class="timer">${new Date(acivity.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                <span class="timer">${new Date(acivity.time).toLocaleDateString()}</span>
              </div>
            </div>
          </a>
        </li>
        
`;
         activityContainer2.appendChild(li);
         count++;
       }
      })
    }else{
      return;
    }
    
    
}

function updateBookmarkList(userData) {
    const bookmarksList = document.getElementById('Bookmarks');
    if(!bookmarksList){
      return;
    }
    bookmarksList.innerHTML = ''; // Clear the existing list before updating
    
    if(userData.bookMarkedProfiles.length <= 0){
      bookmarksList.innerHTML = `
      <p style="
          text-align: center;
          font-size: 1.2em;
          font-weight: bold;
          color: #555;
          margin-top: 20px;
          padding: 20px;
          border: 1px dashed #ccc;
          border-radius: 5px;
          background-color: #f9f9f9;
      ">
          No Profiles Bookmarked.
      </p>
  `;
  return;
    }


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
          <h5>${user.name || ' User'}</h5>
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
  
    fetch(`https://backend-green-seven-44.vercel.app/api/handle-bookmark`, {
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
          showErrorToast(data.message || 'Failed to update bookmark. Please try again.');
        }

        showErrorToast(data.message);
        setTimeout(()=>{
          location.reload();
        },800)
      })
      .catch((error) => {
        console.error('Error:', error);
        toggleBookmarkUI(!isBookmarked);
        showErrorToast('An error occurred. Please try again.');
      });
  }
  
  function updatePlan(subscriptionData) {
    // Get the HTML elements by their IDs
    
    const planNameElement = document.getElementById("planeName");
    const planStatus = document.getElementById("planStatus");
    const durationElement = document.getElementById("duration");
    const validTillElement = document.getElementById("validTill");
    const updgradeBtn = document.getElementById("updgradeBtn");
  if(!planNameElement || !planStatus || !durationElement || !validTillElement || !updgradeBtn){return;};
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
        updgradeBtn.style.backgroundColor = "orange"
        updgradeBtn.style.border = "none"
    } else {
        // Handle inactive or missing subscription
        planNameElement.textContent = "No Active Plan";
        durationElement.textContent = "N/A";
        validTillElement.textContent = "N/A";
    }
}


const sendVerifyBtn = document.getElementById("verify-request");
if (sendVerifyBtn) { // Check if the element exists

  if(userData.verification_status === "Pending"){
    sendVerifyBtn.style.backgroundColor = "#FEBE10";
    sendVerifyBtn.innerText = "Pending...!";
  }

  sendVerifyBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      showLoader()
      const response = await fetch("https://backend-green-seven-44.vercel.app/api/verify-account", {
        method: "POST",
        headers: {
          token: sessionStorage.getItem('token'),
        },
      });
     hideLoader()
      const data = await response.json();

      if (data.success) {
        showSuccessToast(data.message);
        sendVerifyBtn.style.backgroundColor = "#FEBE10";
        sendVerifyBtn.innerText = "Pending...!";
      } else {
        showErrorToast(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      showErrorToast('An error occurred. Please try again later.');
    }
  });
}


function updateVerify(verificationStatus){
  
  const verifySection =  document.getElementById('verified-section');
  const unVerifySection =  document.getElementById('unverified-section');

  if(!verifySection || !unVerifySection){
    return;
  }
  
  if (verificationStatus==="Verified") {
   verifySection.style.display = 'flex';
   unVerifySection.style.display = 'none';
} else if(verificationStatus === "unVerified") {
    verifySection.style.display = 'none';
    unVerifySection.style.display = 'flex';
}

}

function updatePlanTable(planHistory) {
  const tbody = document.querySelector("#invoiceTable tbody");
  if(!tbody){
    return;
  }
  tbody.innerHTML = ""; // Clear existing rows
 if(planHistory.length <=0){
  const row = `
  <tr>
    <td>N/A</td>
    <td>N/A</td>

    <td>N/A</td>

    <td>N/A</td>

    <td>N/A</td>

  </tr>
`;
// Insert the row into the table body
tbody.insertAdjacentHTML("beforeend", row);

return;
  }
 
  // Iterate over the planHistory data to create table rows
  planHistory.forEach((plan) => {
    const { startDate, endDate, price, durationInDays, _id } = plan;

    // Determine the plan type based on duration
    const planType = "Platinum";

    // Format dates
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    // Create a new row
    const row = `
      <tr>
        <td>${planType}</td>
        <td>${durationInDays} Days</td>
        <td>${formattedStartDate}</td>
        <td>${formattedEndDate}</td>
        <td>₹ ${price}</td>
      </tr>
    `;
    // Insert the row into the table body
    tbody.insertAdjacentHTML("beforeend", row);
  });
}
function formatDate(date) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
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
