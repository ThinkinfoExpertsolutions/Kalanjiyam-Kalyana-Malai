const defaultProfileImage = "https://static.vecteezy.com/system/resources/previews/001/840/612/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg";

let allProfiles;
let filteredProfiles=[];
let isFreeUsersPage = window.location.pathname.endsWith("admin-free-users.html");
let isPlatinumUsersPage = window.location.pathname.endsWith("admin-platinum-users.html");
document.addEventListener("DOMContentLoaded", async () => {


    try {
        const data = await fetchData();  // Fetch data from the API
        if (data) {
            console.log(data);
            allProfiles = data.allProfilesData;  // Store all profiles
            updateSettings(data.adminData);  // Update admin settings
            
            // Determine the page and filter profiles accordingly
             filteredProfiles = data.allProfilesData;

            if (isFreeUsersPage) {
                filteredProfiles = filteredProfiles.filter(profile => !profile.subscription_status);
            } else if (isPlatinumUsersPage) {
                filteredProfiles = filteredProfiles.filter(profile => profile.subscription_status);
            }

            // Update profiles based on the filtered data
            updateProfiles(filteredProfiles);
        }
    } catch (error) {
        console.error("Failed to fetch or update data:", error);
    }
});




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
    console.log(profiles)
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
                        <img src="${!!profile.media.profileImage? profile.media.profileImage : defaultProfileImage}">
                    </div>
                    <div class="pro-info">
                        <h5>${profile.basicInfo.name}</h5>
                        <p>${profile.contactInfo.email}</p>
                        <img src="${verifyIcon}" alt="" class="verified-logo">
                    </div>
                </div>
            </td>
            <td>${profile.profileID}</td>
            <td>${profile.contactInfo.phone}</td>
            <td>${profile.basicInfo.district}</td>
            <td><span class="${profile.subscription_status?"hig-grn":"hig-red"}">${planType}</span></td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-outline-secondary" data-bs-toggle="dropdown">
                        <img src="./images/three-dot-icon.png" alt="icon" style="width: 25px; height: 20px;">
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Edit</a></li>
                        <li><a class="dropdown-item" href="#">Delete</a></li>
                        <li><a class="dropdown-item" href="#" onclick="openPopup(${index})">Subscription Details</a></li>
                        <li><a class="dropdown-item" href="#" onclick="openPopupProfile(${index})">Profile Verification</a></li>
                        <li><a class="dropdown-item" href="#">View profile</a></li>
                    </ul>
                </div>
            </td>
        `;

        // Append the newly created row to the table body
        tableBody.appendChild(row);
    });
}

function openPopup(index){
    console.log(index);
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

    console.log(index);
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

console.log(profile.verification_status)
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
        alert("Please enter valid duration and price.");
        return;
      }
     }

      enabledRadio.checked? isActive=true : isActive =false;
      
     
    console.log({ userId, durationInDays, price, isActive})
      try {
        const response = await fetch("http://localhost:5000/api/admin/change-subscription-status",{
            method:"POST",
           headers,
           body:JSON.stringify({
            userId, durationInDays, price, isActive
           })
        });
        const data = await response.json();
        if(data.success){
            alert(data.message);
            location.reload();
        }
      } catch (error) {
        console.log(error);
        alert("please try again later")
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

 console.log(verification_status)
    try {
        const response = await fetch("http://localhost:5000/api/admin/change-verification-status",{
            method:"POST",
           headers,
           body:JSON.stringify({
            userId,verification_status
           })
        });
        const data = await response.json();
        if(data.success){
            alert(data.message);
            location.reload();
        }
      } catch (error) {
        console.log(error);
        alert("please try again later")
      }
    

}



















async function fetchData() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        alert("Authentication token is missing. Please log in.");
        return;
    }
    
    try {
        const response = await fetch("http://localhost:5000/api/admin/get-website-data", {
            method: "GET",
            headers: { token },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            return data;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Network or server error:", error);
        alert("An error occurred, please try again later.");
    }
}