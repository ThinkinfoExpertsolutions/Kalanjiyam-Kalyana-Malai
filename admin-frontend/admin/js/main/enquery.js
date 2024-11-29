document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetchData();

    if (data) {
        console.log(data);
        enquirys = data.adminData.enquirys;
        updateEnquiryTable(data.adminData.enquirys);
    }
});

function openPopupProfile(index) {
    const enqueryProfile = enquirys[index];

    if (!enqueryProfile) {
        console.error("Profile not found");
        return;
    }

    const popup = document.getElementById('popup');
    
    if (!popup) {
        console.error("Popup element not found in the DOM.");
        return;
    }

    popup.style.display = 'flex'; // Show the popup

    // Select DOM elements for profile data
    const profileName = document.getElementById("profileName");
    const profileId = document.getElementById("profileId");
    const profileEmail = document.getElementById("profileEmail");
    const profileContact = document.getElementById("profileContact");
    const profileLocation = document.getElementById("profileLocation");
    const enquirySubject = document.getElementById("profileSubject");
    const enquiryDetails = document.getElementById("profileDetails");
    const profileImage = document.getElementById("profilePicture");

    if (
        !profileName ||
        !profileId ||
        !profileEmail ||
        !profileContact ||
        !profileLocation ||
        !enquirySubject ||
        !enquiryDetails ||
        !profileImage
    ) {
        console.error("One or more profile elements are missing in the DOM.");
        return;
    }
   console.log({
    profileName ,
        profileId ,
        profileEmail ,
        profileContact ,
        profileLocation ,
        enquirySubject ,
        enquiryDetails ,
        profileImage
   })
    // Update profile data in the popup
    profileName.textContent = enqueryProfile.name || "N/A";
    profileId.textContent = `ID: ${enqueryProfile.profileID || "N/A"}`;
    profileEmail.textContent = `Email: ${enqueryProfile.email || "N/A"}`;
    profileContact.textContent = `Contact: ${enqueryProfile.phone || "N/A"}`;
    profileLocation.textContent = `Location: ${enqueryProfile.location || "N/A"}`;
    enquirySubject.textContent = `Subject: ${enqueryProfile.subject || "N/A"}`;
    enquiryDetails.textContent = enqueryProfile.details || "No details provided";
    profileImage.src = enqueryProfile.image || defaultProfileImage;
}

function closePopupProfile() {
    const popup = document.getElementById('popup');
    
    if (!popup) {
        console.error("Popup element not found in the DOM.");
        return;
    }

    popup.style.display = 'none'; // Hide the popup
}





























function updateEnquiryTable(profileDetails) {
    const tableBody = document.querySelector(".table tbody"); // Select the table body
    
    if (profileDetails.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px;">
                    <strong>No profiles available to display.</strong>
                </td>
            </tr>
        `;
        return;
    }

    // Clear the existing rows in the table
    tableBody.innerHTML = '';

    // Check if there are any profiles
    if (profileDetails.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center;">No enquiries available</td></tr>`;
        return;
    }

    // Loop through each profile and create table rows
    profileDetails.forEach((profile, index) => {
        const row = document.createElement("tr");

        const nameInitial = profile.name ? profile.name.charAt(0).toUpperCase() : '-';

        const time = profile.time ? new Date(profile.time) : null;

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div class="prof-table-thum">
                    <div class="pro">
                        <span class="name-init">${nameInitial}</span>
                    </div>
                </div>
            </td>
            <td>${profile.name || 'N/A'}</td>
            <td><span class="hig-blu">${profile.email || 'N/A'}</span></td>
            <td><span class="hig-red">${profile.phone || 'N/A'}</span></td>
            <td>${time.toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric'}) || 'N/A'}</td>
            <td>${time.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true}) || 'N/A'}</td>
            <td>${profile.subject || 'No subject provided'}</td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-outline-secondary" data-bs-toggle="dropdown"">
                        <img src="./images/three-dot-icon.png" alt="icon" style="width: 25px; height: 20px;">
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#" onclick="deleteEnquiry(${index})">Delete</a>
                        <a class="dropdown-item" href="#" onclick="openPopupProfile(${index})">View</a>
                    </div>
                </div>
            </td>
        `;

        // Append the row to the table body
        tableBody.appendChild(row);
    });
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