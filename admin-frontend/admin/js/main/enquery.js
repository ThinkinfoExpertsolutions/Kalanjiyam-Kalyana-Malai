const defaultProfileImage ="images/default-profileImage.jpg"



let enquiries = [];
let filteredEnquiries = [];
const isSolvedPage = window.location.pathname.endsWith("admin-solved-enquiry.html");
const isPendingPage = window.location.pathname.endsWith("admin-pending-enquiry.html");

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await fetchData(); // Fetch data from the API

        if (data) {
            
            const allEnquiries = data.adminData.enquirys.sort((a,b)=>new Date(b.time) - new Date(a.time)) // Fetch all enquiries data
           
            // Filter enquiries based on the current page
            if (isSolvedPage) {
                enquiries = allEnquiries.filter(enquiry => enquiry.isSolved === "Solved");
                document.getElementById("accepted-header").classList.add("active");
            } else if (isPendingPage) {
                enquiries = allEnquiries.filter(enquiry => enquiry.isSolved === "Pending");
                document.getElementById("denied-header").classList.add("active");
            } else {
                enquiries = [...allEnquiries];
                document.getElementById("verification-header").classList.add("active");
            }

            // Initialize filteredEnquiries and update the table
            filteredEnquiries = [...enquiries];
            updateEnquiryTable(filteredEnquiries);

            // Attach search handler
            const searchInput = document.getElementById("searchBar"); // Ensure your search input has this ID
            if (searchInput) {
                searchInput.addEventListener("input", handleSearch);
            }
        }
    } catch (error) {
        console.error("Error loading enquiries:", error);
    }
});

/**
 * Handle search functionality for enquiries.
 * @param {Event} event 
 */
function handleSearch(event) {
    const searchStr = event.target.value.toLowerCase();
    // Filter enquiries dynamically based on the search string
    filteredEnquiries = enquiries.filter(enquiry =>
        enquiry.name.toLowerCase().includes(searchStr) ||
        enquiry.phone.toLowerCase().includes(searchStr) ||
        enquiry.email.toLowerCase().includes(searchStr) ||
        enquiry.district.toLowerCase().includes(searchStr) ||
        enquiry.subject.toLowerCase().includes(searchStr) 
    );
   
    
    // Update the table with filtered enquiries
    updateEnquiryTable(filteredEnquiries);
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
                    ${isSolvedPage ?`
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
        
    const enqueryProfile = enquiries[index];

    const token = sessionStorage.getItem("token");

   const userId = enqueryProfile.userId;
   const enqueryID = enqueryProfile._id;

    if (!enqueryProfile) {
        console.error("Profile not found.");
        return;
    }

    try {
        showLoader()
        const response = await fetch("https://backend-green-seven-44.vercel.app/api/admin/change-enquery-status", {
            method: "POST",
            headers: { token ,
                 "Content-Type": "application/json"
            },
            body:JSON.stringify({
                isSolved,userId,enqueryID
            })
        });
        hideLoader()
        const data= await response.json();

        if(data.success){
            showSuccessToast(data.message);
            setTimeout(() => {
                location.reload(); // Reload page after 2 seconds
            }, 1000); // Adjust the delay as needed
        }else{
            showErrorToast(data.message);
        }

    } catch (error) {
        console.error("Network or server error:", error);
        showErrorToast("An error occurred, please try again later.");
    }

}












function openPopupProfile(index) {
    const popup = document.getElementById('popup');
    

    if (!popup || !(popup instanceof HTMLElement)) {
        console.error("Popup element is not valid.");
        return;
    }

    const enqueryProfile = enquiries[index];
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
    const profilePath = document.getElementById("profilePath");

    if (
        !profileName ||
        !profileId ||
        !profileEmail ||
        !profileContact ||
        !profileLocation ||
        !enquirySubject ||
        !enquiryDetails ||
        !profileImage ||
        !profilePath
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
    profilePath.href = `admin-profileDetails.html?id=${enqueryProfile.profileID}` 
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

