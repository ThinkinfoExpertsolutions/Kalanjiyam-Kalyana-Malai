const defaultProfileImage = "https://static.vecteezy.com/system/resources/previews/001/840/612/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg";


let = enquirys=[];
const issolvedPage = window.location.pathname.endsWith("admin-solved-enquiry.html");
const isPendingPage = window.location.pathname.endsWith("admin-pending-enquiry.html");
document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetchData();

    if (data) {
        console.log(data);
        let Allenquirys = data.adminData.enquirys;

        if (issolvedPage) {
            enquirys = Allenquirys.filter(enquiry=>{
                return enquiry.isSolved==="Solved";
            });
            document.getElementById("accepted-header").classList.add("active");

        } else if (isPendingPage) {
            enquirys = Allenquirys.filter(enquiry=>{
                return enquiry.isSolved==="Pending";
            });
            document.getElementById("denied-header").classList.add("active");

        } else {
            enquirys = Allenquirys
            document.getElementById("verification-header").classList.add("active");


        }


        updateEnquiryTable(enquirys);
    }
});

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
                    <button type="button" class="btn btn-outline-secondary" data-bs-toggle="dropdown">
                        <img src="./images/three-dot-icon.png" alt="icon" style="width: 25px; height: 20px;">
                    </button>
                    <div class="dropdown-menu">
                    ${issolvedPage ?`
                        <a class="dropdown-item" href="#" onclick="handleEnquiryStatus(${index},false)">Mark as Pending</a>
                        `:isPendingPage?`
                        <a class="dropdown-item" href="#" onclick="handleEnquiryStatus(${index},true)">Mark as Solved</a>
                        `:
                       ` <a class="dropdown-item" href="#" onclick="handleEnquiryStatus(${index},false)">Mark as Pending</a>
                        <a class="dropdown-item" href="#" onclick="handleEnquiryStatus(${index},true)">Mark as Solved</a>`
                    }
                    <a class="dropdown-item" href="#" onclick="openPopupProfile(${index})">View</a>
                       
                    </div>
                </div>
            </td>
        `;

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}


async function handleEnquiryStatus(index,isSolved){
        
    const enqueryProfile = enquirys[index];

    const token = sessionStorage.getItem("token");

   const userId = enqueryProfile.userId;
   const enqueryID = enqueryProfile._id;

    if (!enqueryProfile) {
        console.error("Profile not found.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/admin/change-enquery-status", {
            method: "POST",
            headers: { token ,
                 "Content-Type": "application/json"
            },
            body:JSON.stringify({
                isSolved,userId,enqueryID
            })
        });

        const data= await response.json();

        if(data.success){
            alert(data.message);
            location.reload();
        }else{
            alert(data.message);
        }

    } catch (error) {
        console.error("Network or server error:", error);
        alert("An error occurred, please try again later.");
    }

}












function openPopupProfile(index) {
    const popup = document.getElementById('popup');
    console.log(popup);

    if (!popup || !(popup instanceof HTMLElement)) {
        console.error("Popup element is not valid.");
        return;
    }

    const enqueryProfile = enquirys[index];
    if (!enqueryProfile) {
        console.error("Profile not found.");
        return;
    }

    popup.style.display = "flex"; // Show the popup

    // Select and update the DOM elements
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
        console.error({
            profileName ,
        profileId,
        profileEmail ,
        profileContact ,
        profileLocation ,
        enquirySubject ,
        enquiryDetails ,
        profileImage
        });
        return;
    }

    // Update profile data
    profileName.textContent = enqueryProfile.name || "N/A";
    profileId.textContent = `ID: ${enqueryProfile.profileID || "N/A"}`;
    profileEmail.textContent = `Email: ${enqueryProfile.email || "N/A"}`;
    profileContact.textContent = `Contact: ${enqueryProfile.phone || "N/A"}`;
    profileLocation.textContent = `Location: ${enqueryProfile.location || "N/A"}`;
    enquirySubject.textContent = `Subject: ${enqueryProfile.subject || "N/A"}`;
    enquiryDetails.textContent = enqueryProfile.details || "No details provided";
    profileImage.src = enqueryProfile.image || defaultProfileImage;
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



