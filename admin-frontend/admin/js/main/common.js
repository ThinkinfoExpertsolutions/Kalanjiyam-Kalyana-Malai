const defaultProfileImage = "images/default-profileImage.jpg"

let allProfiles;
let filteredProfiles = [];
const isFreeUsersPage = window.location.pathname.endsWith("admin-free-users.html");
const isPlatinumUsersPage = window.location.pathname.endsWith("admin-platinum-users.html");

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await fetchData(); // Fetch data from the API
        if (data) {
            
            
            allProfiles = data.allProfilesData; // Store all profiles
            updateSettings(data.adminData); // Update admin settings

            // Filter profiles based on the current page
            filteredProfiles = isFreeUsersPage
                ? allProfiles.filter(profile => !profile.subscription_status)
                : isPlatinumUsersPage
                ? allProfiles.filter(profile => profile.subscription_status)
                : allProfiles;

            // Attach search handler
            const searchInput = document.getElementById("searchBar"); // Ensure the search input has this ID
            if (searchInput) {
                searchInput.addEventListener("input", handleSearch);
            }

            // Update profiles initially
            updateProfiles(filteredProfiles);
        }
    } catch (error) {
        console.error("Failed to fetch or update data:", error);
    }
});

/**
 * Handle search functionality for profiles.
 * @param {Event} event 
 */
function handleSearch(event) {
    const searchStr = event.target.value.toLowerCase();
    filteredProfiles = (isFreeUsersPage
        ? allProfiles.filter(profile => !profile.subscription_status)
        : isPlatinumUsersPage
        ? allProfiles.filter(profile => profile.subscription_status)
        : allProfiles
    ).filter(profile =>
        profile.profileID.toLowerCase().includes(searchStr) ||
        profile.basicInfo.name.toLowerCase().includes(searchStr) ||
        profile.contactInfo.email.toLowerCase().includes(searchStr) ||
        profile.basicInfo.district.toLowerCase().includes(searchStr) ||
        profile.contactInfo.phone.toLowerCase().includes(searchStr)
    );

    // Update profiles based on the search
    updateProfiles(filteredProfiles);
}





function updateSettings(adminData) {
    const name = document.getElementById("name");
    const password = document.getElementById("password");
    const email = document.getElementById("email");
    const whatsApp = document.getElementById("whatsApp");
    const instagram = document.getElementById("instagram");
    const faceBook = document.getElementById("faceBook");
    const x = document.getElementById("x");
    const youTube = document.getElementById("youTube");

    if (!name || !password || !email || !whatsApp || !instagram || !faceBook || !x || !youTube) {
       
        return;
    }

    name.value = adminData.userName || '';
    email.value = adminData.email || '';
    password.value = adminData.password.slice(0,7); 
    whatsApp.value = adminData.socialMedia?.whatsapp || '';
    instagram.value = adminData.socialMedia?.instagram || '';
    faceBook.value = adminData.socialMedia?.facebook || '';
    x.value = adminData.socialMedia?.x || '';
    youTube.value = adminData.socialMedia?.youtube || '';
}




function updateProfiles(profiles) {
    
    const tableBody = document.querySelector("table tbody"); // Get the tbody of the table

    if (profiles.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px;">
                    <strong>No profiles available to display.</strong>
                </td>
            </tr>
        `;
        return;
    }

    // Clear any existing rows in the table body
    tableBody.innerHTML = '';

    // Loop through each profile in the profiles array
    profiles.forEach((profile, index) => {
        // Create a new row for each profile



        const row = document.createElement("tr");

         const isEditable = profile.user_id === profile._id;
        
        
        let verifyIcon="";
        if(profile.verification_status === "Verified"){
            verifyIcon = "https://iconape.com/wp-content/png_logo_vector/google-verified.png"
        }else{
            verifyIcon = "https://iconape.com/wp-content/png_logo_vector/google-unverified.png"
        }
       let planType;

        if(profile.subscription_status){
            planType = "Platinum"
        }else{
            planType = "Stantard"
        }

        // Create each cell and append the data
        row.innerHTML = `
    <td>${index + 1}</td>
    <td>
        <div class="prof-table-thum">
            <div class="pro">
                <img src="${!!profile.media.profileImage ? profile.media.profileImage : defaultProfileImage}">
            </div>
            <div class="pro-info">
                <h5>
                    ${profile.basicInfo.name}
                    ${isEditable ? `<img src="images/admin-icon.jpg" alt="Admin" style="width: 18px; height: 18px; margin-left: 5px;">` : ''}
                </h5>
                <p>${profile.contactInfo.email}</p>
                <img src="${verifyIcon}" alt="" class="verified-logo">
            </div>
        </div>
    </td>
    <td>${profile.profileID}</td>
    <td>${profile.contactInfo.phone}</td>
    <td>${profile.basicInfo.district}</td>
    <td><span class="${profile.subscription_status ? "hig-grn" : "hig-red"}">${planType}</span></td>
    <td>
        <div class="dropdown">
            <button type="button" class="btn btn-outline-secondary" data-bs-toggle="dropdown">
                <img src="./images/three-dot-icon.png" alt="icon" style="width: 25px; height: 20px;">
            </button>
            <ul class="dropdown-menu">
                ${isEditable ? `<li><a class="dropdown-item" href="admin-add-new-user.html?id=${profile.profileID}">Edit</a></li>` : ""}
                <li><a class="dropdown-item" onclick="deleteProfile(${index})">Delete</a></li>
                ${!isEditable?`<li><a class="dropdown-item" href="#" onclick="openPopup(${index})">Subscription Details</a></li>`:""}
                <li><a class="dropdown-item" href="#" onclick="openPopupProfile(${index})">Profile Verification</a></li>
                <li><a class="dropdown-item" href="admin-profileDetails.html?id=${profile.profileID}">View profile</a></li>
            </ul>
        </div>
    </td>
`;

        // Append the newly created row to the table body
        tableBody.appendChild(row);
    });
}

function openPopup(index){
    
    const profile = filteredProfiles[index];
    const profileName = document.getElementById("profileName");
    const profileId = document.getElementById("profileId");
    const profileContact = document.getElementById("profileContact");
    const profileLocation = document.getElementById("profileLocation");
    const profilePicture = document.getElementById("profilePicture");
    const disabled = document.getElementById("disabled-label");
    const enabled = document.getElementById("enabled-label");
    
   

    if(!profileContact||!profileId||!profileName||!profileLocation){
        return;
    }
    
        var popup = document.getElementById('popup');
        if(popup) popup.style.display = 'flex'; 
        
        profileName.innerHTML = `<strong style="display: inline-block; width: 100px;">Name:</strong> ${profile.basicInfo.name}`;
        profileId.innerHTML = `<strong style="display: inline-block; width: 100px;">ProfileID:</strong> ${profile.profileID}`;
        profileContact.innerHTML = `<strong style="display: inline-block; width: 100px;">Phone:</strong> ${profile.contactInfo.phone}`;
        profileLocation.innerHTML = `<strong style="display: inline-block; width: 100px;">District:</strong> ${profile.basicInfo.district}`;
        
        
  profilePicture.src = profile.media.profileImage;

  const saveBtn = document.getElementById("subscription-saveBtn");
//   saveBtn.replaceWith(saveBtn.cloneNode(true)); // Remove previous listeners
  saveBtn.addEventListener("click", () => changeSubscription(index));
  
  if(profile.subscription_status){
    enabled.style.backgroundColor="green";
    enabled.style.color="white";
    disabled.style.backgroundColor ="white";
    disabled.style.color="black";
  }else{
    disabled.style.backgroundColor ="red";
    disabled.style.color="white";
    enabled.style.backgroundColor="white";
    enabled.style.color="black";
    document.getElementById("details").style.display = "none";
  }
}

function openPopupProfile(index){

    
    const profile = filteredProfiles[index];
    const profileName = document.getElementById("profileName2");
    const profileId = document.getElementById("profileId2");
    const profileContact = document.getElementById("profileContact2");
    const profileLocation = document.getElementById("profileLocation2");
    const profilePicture = document.getElementById("profilePicture2");
    const disabled = document.getElementById("unverified-label");
    const enabled = document.getElementById("verified-label");
    

    if(!profileContact||!profileId||!profileName||!profileLocation){
        return;
    }
    
        var popup = document.getElementById('popup01');
        if(popup) popup.style.display = 'flex'; 
        
        profileName.innerHTML = `<strong style="display: inline-block; width: 100px;">Name:</strong> ${profile.basicInfo.name}`;
        profileId.innerHTML = `<strong style="display: inline-block; width: 100px;">ProfileID:</strong> ${profile.profileID}`;
        profileContact.innerHTML = `<strong style="display: inline-block; width: 100px;">Phone:</strong> ${profile.contactInfo.phone}`;
        profileLocation.innerHTML = `<strong style="display: inline-block; width: 100px;">District:</strong> ${profile.basicInfo.district}`;
        profilePicture.src = profile.media.profileImage;
  
  const saveBtn = document.getElementById("verification-saveBtn");

  saveBtn.addEventListener("click", () => changeVerification(index));


  if(profile.verification_status === "Verified"){
    enabled.style.backgroundColor="#00CCFF";
    enabled.style.color="white";
    disabled.style.backgroundColor ="white";
    disabled.style.color="black";
  }else{
    disabled.style.backgroundColor ="#B2BEB5";
    disabled.style.color="white";
    enabled.style.backgroundColor="white";
    enabled.style.color="black";
  }
}







const unverifiedRadio = document.getElementById('unverified');
const verifiedRadio = document.getElementById('verified');
const unverifiedLabel = document.getElementById('unverified-label');
const verifiedLabel = document.getElementById('verified-label');

unverifiedRadio.addEventListener('change', () => {
    if (unverifiedRadio.checked) {
        unverifiedLabel.style.backgroundColor = '#B2BEB5'; 
        unverifiedLabel.style.color = '#fff';
        verifiedLabel.style.backgroundColor = 'white'; 
        verifiedLabel.style.color = 'rgb(4, 3, 3)';
    }
});

verifiedRadio.addEventListener('change', () => {
    if (verifiedRadio.checked) {
        verifiedLabel.style.backgroundColor = '#00CCFF'; 
        verifiedLabel.style.color = '#fff';
        unverifiedLabel.style.backgroundColor = 'white'; // Inactive color (gray)
        unverifiedLabel.style.color = 'rgb(7, 1, 1)';
    }
});




let verification_status;

const disabledRadio = document.getElementById('disabled');
const enabledRadio = document.getElementById('enabled');
const disabledLabel = document.getElementById('disabled-label');
const enabledLabel = document.getElementById('enabled-label');

disabledRadio.addEventListener('change', () => {
    if (disabledRadio.checked) {
        disabledLabel.style.backgroundColor = '#f74a4a'; // Active color
        disabledLabel.style.color = '#fff';
        enabledLabel.style.backgroundColor = 'white'; // Inactive color
        enabledLabel.style.color = 'rgb(2, 1, 1)';
        document.getElementById("details").style.display = "none";
        verification_status=false;
    }
});

enabledRadio.addEventListener('change', () => {
    if (enabledRadio.checked) {
        enabledLabel.style.backgroundColor = '#6ac36a'; // Active color
        enabledLabel.style.color = '#fff';
        disabledLabel.style.backgroundColor = 'white'; // Inactive color
        disabledLabel.style.color = 'rgb(2, 1, 1)';
        document.getElementById("details").style.display = "block";
        verification_status=true;
    }
});


const headers = {
    "Content-Type": "application/json",
    token: sessionStorage.getItem("token"),
  };

async function changeSubscription(index){
   
    const profile = filteredProfiles[index];
    const userId = profile.user_id;
     const durationInDays = document.getElementById("duration").value;
    const price = document.getElementById("price").value;
    let isActive=false;

    
      
     const enabledRadio = document.getElementById('enabled');

     if(enabledRadio.checked){
             if (!durationInDays || !price) {
        showErrorToast("Please enter valid duration and price.");
        return;
      }
     }

      enabledRadio.checked? isActive=true : isActive =false;
      
     
   
      try {
        showLoader()
        const response = await fetch("https://backend-green-seven-44.vercel.app/api/admin/change-subscription-status",{
            method:"POST",
           headers,
           body:JSON.stringify({
            userId, durationInDays, price, isActive
           })
        });
        hideLoader()
        const data = await response.json();
        if(data.success){
            showSuccessToast(data.message);
            setTimeout(() => {
                location.reload(); // Reload page after 2 seconds
            }, 500); // Adjust the delay as needed
        }else{
            showErrorToast(data.message);
        }
      } catch (error) {
        console.log(error);
        showErrorToast("please try again later")
      }

}

async function changeVerification(index){

    

   const verifiedRadio = document.getElementById('verified');

  let verification_status;

    const profile = filteredProfiles[index];
    const userId = profile.user_id;

    if( verifiedRadio && verifiedRadio.checked){
        verification_status = "Verified"
    }else{
        verification_status = "UnVerified";
    }

 
    try {
        showLoader()
        const response = await fetch("https://backend-green-seven-44.vercel.app/api/admin/change-verification-status",{
            method:"POST",
           headers,
           body:JSON.stringify({
            userId,verification_status
           })
        });
        hideLoader()
        const data = await response.json();
        if(data.success){
            showSuccessToast(data.message);
            setTimeout(() => {
                location.reload(); // Reload page after 2 seconds
            }, 500); // Adjust the delay as needed
        }else{
            showErrorToast(data.message);
        }
      } catch (error) {
        console.log(error);
        showErrorToast("please try again later")
      }
    

}




async function deleteProfile(index){

    const profile = filteredProfiles[index];
    const userId = profile.user_id;

    try {
        showLoader()
        const response = await fetch("https://backend-green-seven-44.vercel.app/api/admin/remove-profile",{
            method:"DELETE",
            headers,
            body:JSON.stringify({userId})
        });
hideLoader()
        const data = await response.json();

        if(data){
            showSuccessToast(data.message);
            setTimeout(() => {
                location.reload(); // Reload page after 2 seconds
            }, 500); // Adjust the delay as needed
        }else{
            showErrorToast(data.message);
        }

    } catch (error) {
        console.log(error);
        showErrorToast("please try again later")
    }

}














async function fetchData() {
    const token = sessionStorage.getItem("token");

    if (token) {
        try {
            showLoader()
            const response = await fetch("https://backend-green-seven-44.vercel.app/api/admin/get-website-data", {
                method: "GET",
                headers: { token },
            });
            hideLoader()
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                return data;
            } else {
                showErrorToast(data.message);
            }
        } catch (error) {
            console.error("Network or server error:", error);
            showErrorToast("An error occurred, please try again later.");
        }
    }
    
   
}
// Show and hide loader
function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "flex";
}

function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
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
