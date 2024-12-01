const defaultProfileImage = "https://static.vecteezy.com/system/resources/previews/001/840/612/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg";

let profiles = [];
let filteredProfiles = [];
let requestType;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await fetchData(); // Fetch data from the API
        if (data) {
            console.log(data);

            // Determine the request type based on the current page
            if (window.location.pathname.endsWith("admin-new-user-requests.html")) {
                requestType = "newRequest";
                document.getElementById("verification-header").classList.add("active");
            } else if (window.location.pathname.endsWith("admin-accepted-user-request.html")) {
                requestType = "acceptedRequest";
                document.getElementById("accepted-header").classList.add("active");
            } else {
                requestType = "deniedRequest";
                document.getElementById("denied-header").classList.add("active");
            }

            // Get the request profile IDs based on the request type
            const requestProfileIDs = data.adminData.requestList[requestType];

            // Filter profiles matching the IDs in a single iteration
            profiles = data.allProfilesData.filter(profile =>
                requestProfileIDs.includes(profile.user_id)
            );

            // Initialize filteredProfiles and update the UI
            filteredProfiles = [...profiles];
            updateProfiles(filteredProfiles);

            // Attach search handler
            const searchInput = document.getElementById("searchBar"); // Ensure the search input has this ID
            if (searchInput) {
                searchInput.addEventListener("input", handleSearch);
            }
        }
    } catch (error) {
        console.error("Error loading profiles:", error);
    }
});

/**
 * Handle search functionality for profiles.
 * @param {Event} event 
 */
function handleSearch(event) {
    const searchStr = event.target.value.toLowerCase();

    // Filter profiles dynamically based on the search string
    filteredProfiles = profiles.filter(profile =>
        profile.user_id.toLowerCase().includes(searchStr) ||
        profile.basicInfo.name.toLowerCase().includes(searchStr) ||
        profile.contactInfo.email.toLowerCase().includes(searchStr) ||
        profile.basicInfo.district.toLowerCase().includes(searchStr) ||
        profile.contactInfo.phone.toLowerCase().includes(searchStr)
    );

    // Update the UI with filtered profiles
    updateProfiles(filteredProfiles);
}





function updateProfiles(profiles) {
    console.log(profiles);
    const tableBody = document.querySelector("table tbody"); // Get the tbody of the table

    // Clear any existing rows in the table body
    tableBody.innerHTML = '';

    // Handle case when profiles array is empty
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

    // Loop through each profile in the profiles array
    profiles.forEach((profile, index) => {
        // Create a new row for each profile
        const row = document.createElement("tr");

        // Determine verification icon
        const verifyIcon = profile.verification_status === "Verified"
            ? "https://iconape.com/wp-content/png_logo_vector/google-verified.png"
            : "https://iconape.com/wp-content/png_logo_vector/google-unverified.png";

        // Determine plan type
        const planType = profile.subscription_status ? "Platinum" : "Standard";

        // Create each cell and append the data
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div class="prof-table-thum">
                    <div class="pro">
                        <img src="${profile.media.profileImage || defaultProfileImage}" alt="Profile Image">
                    </div>
                    <div class="pro-info">
                        <h5>${profile.basicInfo.name}</h5>
                        <p>${profile.contactInfo.email}</p>
                        ${requestType !== "newRequest" ? `
                        <img src="${verifyIcon}" alt="Verification Status" class="verified-logo">
                        ` : ""}
                    </div>
                </div>
            </td>
            <td>${profile.profileID}</td>
            <td>${profile.contactInfo.phone}</td>
            <td>${profile.basicInfo.district}</td>
            <td><span class="${profile.subscription_status ? "hig-grn" : "hig-red"}">${planType}</span></td>
            ${
                requestType === "newRequest" ? `
                <td><span class="cta cta-grn" onClick="handleRequest(${index}, true)">Approve</span></td>
                <td><span class="cta cta-red" onClick="handleRequest(${index}, false)">Deny</span></td>` :
                requestType === "deniedRequest" ? `
                <td><span class="cta cta-red">Denied</span></td>` : `
                <td><span class="cta cta-grn">Accepted</span></td>`
            }
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-outline-secondary" data-bs-toggle="dropdown">
                        <img src="./images/three-dot-icon.png" alt="icon" style="width: 25px; height: 20px;">
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="http://127.0.0.1:5500/matrimo-frontend/profile-details.html?id=${profile.profileID}">View profile</a></li>
                    </ul>
                </div>
            </td>
        `;

        // Append the newly created row to the table body
        tableBody.appendChild(row);
    });
}

const headers = {
    "Content-Type": "application/json",
    token: sessionStorage.getItem("token"),
  };



  async function handleRequest(index, isAprove) {
    const profile = profiles[index];
    const userId = profile.user_id;

    // Ensure the token exists
    const token = sessionStorage.getItem("token");
    if (!token) {
        alert("User is not authenticated.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/admin/handle-verify-request", {
            method: "POST", // Use POST for sending a body
            headers: {
                "Content-Type": "application/json",
                token: token,
            },
            body: JSON.stringify({
                userId, 
                isAprove,
            }),
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            location.reload(); // Reload the page to reflect the updated data
        } else {
            alert(data.message || "An error occurred while processing the request.");
        }
    } catch (error) {
        console.error("Network or server error:", error);
        alert("An error occurred, please try again later.");
    }
}







async function fetchData() {
    const token = sessionStorage.getItem("token");

    if (token) {
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
    
   
}