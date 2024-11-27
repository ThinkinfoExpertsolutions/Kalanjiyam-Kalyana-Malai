const defaultProfileImage = "https://static.vecteezy.com/system/resources/previews/001/840/612/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg";

let allProfiles;
document.addEventListener("DOMContentLoaded", async () => {


    try {
        const data = await fetchData();
        if (data) {
            console.log(data);
            allProfiles = data.allProfilesData;
            updateSettings(data.adminData);
            updateProfiles(data.allProfilesData)
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

    // Clear any existing rows in the table body
    tableBody.innerHTML = '';

    // Loop through each profile in the profiles array
    profiles.forEach((profile, index) => {
        // Create a new row for each profile
        const row = document.createElement("tr");
        
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
                    </div>
                </div>
            </td>
            <td>${profile.profileID}</td>
            <td>${profile.contactInfo.phone}</td>
            <td>${profile.basicInfo.district}</td>
            <td><span class="hig-grn">${profile.subscription_status?"Platinum":"Stantard"}</span></td>
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
    const profile = allProfiles[index];
    const profileName = document.getElementById("profileName");
    const profileId = document.getElementById("profileId");
    const profileContact = document.getElementById("profileContact");
    const profileLocation = document.getElementById("profileLocation");
    const profilePicture = document.getElementById("profilePicture");
    const disabled = document.getElementById("disabled");
    const enabled = document.getElementById("enabled");
    console.log(enabled)
    // const duration = document.getElementById("duration");
    // const price = document.getElementById("price");
    // const saveButton = document.getElementById("saveButton");

    if(!profileContact||!profileId||!profileName||!profileLocation){
        return;
    }
    console.log(profile.subscription_status)
        var popup = document.getElementById('popup');
        if(popup) popup.style.display = 'flex'; 
        
   profileName.textContent = profile.basicInfo.name;
   profileId.textContent = profile.profileID;
   profileContact.textContent = profile.contactInfo.phone;
   profileLocation.textContent = profile.basicInfo.district;
  profilePicture.src = profile.media.profileImage;

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
  }
}

function openPopupProfile(index){

    console.log(index);
    const profile = allProfiles[index];
    const profileName = document.getElementById("profileName2");
    const profileId = document.getElementById("profileId2");
    const profileContact = document.getElementById("profileContact2");
    const profileLocation = document.getElementById("profileLocation2");
    const profilePicture = document.getElementById("profilePicture2");
    const disabled = document.getElementById("disabled2");
    const enabled = document.getElementById("enabled2");
    // const duration = document.getElementById("duration");
    // const price = document.getElementById("price");
    // const saveButton = document.getElementById("saveButton");

    if(!profileContact||!profileId||!profileName||!profileLocation){
        return;
    }
    
        var popup = document.getElementById('popup01');
        if(popup) popup.style.display = 'flex'; 
        
   profileName.textContent = profile.basicInfo.name;
   profileId.textContent = profile.profileID;
   profileContact.textContent = profile.contactInfo.phone;
   profileLocation.textContent = profile.basicInfo.district;
  profilePicture.src = profile.media.profileImage;

  if(profile.subscription_status){
    enabled.style.backgroundColor="blue";
    enabled.style.color="white";
    disabled.style.backgroundColor ="white";
    disabled.style.color="black";
  }else{
    disabled.style.backgroundColor ="grey";
    disabled.style.color="white";
    enabled.style.backgroundColor="white";
    enabled.style.color="black";
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