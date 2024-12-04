const data = sessionStorage.getItem("userData");
const myData = data ? JSON.parse(data) : null;

// if(!myData){
//     window.location.href="index.html";
// }

document.addEventListener("DOMContentLoaded", async () => {
    
    fetchData().then(profiles=>{
        populateProfileList(profiles)
    }).catch(e=>{
       console.log(e);
    })

    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener("change", handleChange);
    });
    

});

let condition = {}; 

let debounceTimer;
function handleChange(event) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const name = event.target.name;
        const value = event.target.value;

        condition[name] = value;
        

        fetchData()
            .then((profiles) => {
                const result = filterData(profiles, condition);
                
                populateProfileList(result);
            })
            .catch((e) => {
                console.log(e);
            });
    }, 300); // Adjust debounce delay as needed
}









async function fetchData() {
    try {
        showLoader();
        const response = await fetch("https://api.kalanjiyamkalyanamalai.in/api/get-all-profile", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch profiles: ${response.statusText}`);
        }

        const data = await response.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error("Error:", error);
        return [];
    } finally {
        hideLoader();
    }
}






// Filter profiles based on the condition object
function filterData(users, condition) {
   
    

console.log(condition)
    const result = users.filter((user) => {
        for (let key in condition) {
            if (condition[key]) {
                // Special handling for "age" range filter
                if (key === "personalDetails.age") {
                    const range = condition[key].split("-").map(Number); // Convert "18-25" to [18, 25]
                    const userAge = user.personalDetails?.age; // Extract the user's age
                   
                    // Skip users who don't have an age or whose age is out of range
                    if (!userAge || userAge < range[0] || userAge > range[1]) {
                        return false;
                    }
                }else if(key ==="jobDetails.salary"){
                    const range = condition[key].split("-").map(Number);
                    const userSalary = user.jobDetails?.salary;

                    if(!userSalary || userSalary<range[0] || userSalary>range[1]){
                        return false;
                    }

                }else if(key === "basicInfo.cast"){
                    const cast  = condition[key];
                    const userCast = user.basicInfo.cast;

                    if(!userCast.includes(cast)){return false;}
                }
                 else if (key.includes(".")) {
                    // Handle nested keys (e.g., "basicInfo.religion")
                    const keys = key.split(".");
                    let value = user;

                    // Traverse nested structure
                    for (let k of keys) {
                        value = value[k];
                        if (value === undefined) break;
                    }

                    // Exclude user if condition does not match
                    if (value !== condition[key]) {
                        return false;
                    }
                } else {
                    // Top-level property comparison
                    if (user[key] !== condition[key]) {
                        return false;
                    }
                }
            }
        }
        return true;
    });
    return result;
}



// Render profiles into the DOM
function populateProfileList(profiles) {
    const searchResult = document.getElementById("searchResult");

    if (!searchResult) {
        console.error('Container with ID "searchResult" not found.');
        return;
    }

    // Update profile count
    const profilesCountElement = document.getElementById("profilesCount");
    if (profilesCountElement) {
        profilesCountElement.innerHTML = `Showing <b>${profiles.length}</b> profiles`;
    }

    // Clear existing content
    searchResult.innerHTML = "";

    if (profiles.length === 0) {
        // No profiles found
        searchResult.innerHTML = `
            <div style="
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
                No results found.
            </div>
        `;
        return;
    }

    // Loop through profiles and populate the list
    profiles.forEach((profile) => {
       let mine=false;
        if(profile.profileID === myData.profileID){
          mine =true;
        }

        const {
            basicInfo,
            jobDetails,
            education,
            personalDetails,
            profileID,
        } = profile;
   
        // Fallbacks for missing data
        const name = basicInfo?.name || "N/A";
        const age = personalDetails?.age || "N/A";
        const educationDegree = education?.degree || "N/A";
        const profession = jobDetails?.position || "N/A";
        const religion = basicInfo?.religion || "N/A";
        const profileLink = `profile-details.html?id=${profileID}`;
        const image =
            profile?.media?.profileImage ||
            "https://static.vecteezy.com/system/resources/previews/001/840/612/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg";

        // Construct profile HTML
        const isBookmarked = myData.bookMarkedProfiles.some(
            (user) => profile.profileID === user.userId
          );

        const profileHTML = `
            <li>
                <div class="all-pro-box user-avil-onli">
                    <div class="pro-img">
                        <a href="${profileLink}" onclick="handleViewCount('${profile.user_id}', event,'${profile.profileID}')">
                            <img src="${image}" style="object-fit:cover;" alt="Profile Image">
                        </a>
                    </div>
                    <div class="pro-detail">
                        <h4><a href="${profileLink}">${name}</a></h4>
                        <div class="pro-bio">
                            <span>${educationDegree}</span>
                            <span>${profession}</span>
                            <span>${age} Years old</span>
                            <span>${religion}</span>
                        </div>
                        <div class="links">
                        <a href="${profileLink}" onclick="handleViewCount('${profile.user_id}', event,'${profile.profileID}')">More details</a>

                        </div>
                    </div>
                    ${!mine ?
                        `<span 
                    class="enq-sav" 
                    data-toggle="tooltip" 
                    onclick="toggleBookmark('${profile.profileID}', this)"
                      >
                     <i class="${isBookmarked ? 'fa fa-bookmark' : 'fa fa-bookmark-o'}" aria-hidden="true"></i>
                    </span>` :""
                    }
                    
                </div>
            </li>
        `;

        // Append the HTML to the container
        searchResult.insertAdjacentHTML("beforeend", profileHTML);
    });
}


async function handleViewCount(userId,event,profileID){
    event.preventDefault();
    
    if(!sessionStorage.getItem("token")){
        window.location.href=`login.html`;
        return;
    }
    try {
        showLoader()
         const response = await fetch(`https://api.kalanjiyamkalyanamalai.in/api/profile/${userId}/view`,{
            method: 'PATCH',
            headers: {
          'Content-Type': 'application/json',
          "token":sessionStorage.getItem("token")
           },
        });
        hideLoader();
        const data = await response.json();
      if(data.success){
            console.log(data.message);
            window.location.href=`profile-details.html?id=${profileID}`
       }else{
        console.log(data.message);

       }
    } catch (error) {
        console.error('Error:', error);
        showErrorToast('An error occurred. Please try again.');
    }
}



function toggleBookmark(userId, element) {
    // Redirect to login if the user is not authenticated
    if (!sessionStorage.getItem("token")) {
        window.location.href = "login.html";
        return;
    }
  
    // Helper function to toggle bookmark UI
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
  
    // Check current bookmark state
    const isBookmarked = element.querySelector('i').classList.contains('fa-bookmark');
  
    // Update the UI optimistically
    toggleBookmarkUI(isBookmarked);
  
    // Prepare the action for the backend
    const action = isBookmarked ? 'remove' : 'add';
     showLoader()
    // Send request to backend
    fetch(`https://api.kalanjiyamkalyanamalai.in/api/handle-bookmark`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'token': sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
            bookmarkProfileId: userId,
            action: action,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
          hideLoader()
            if (!data.success) {
                // Revert UI if the request fails
                toggleBookmarkUI(!isBookmarked);
                showErrorToast(data.message || 'Failed to update bookmark. Please try again.');
            }
            showSuccessToast(data.message);
        })
        .catch((error) => {
            console.error('Error:', error);
            // Revert UI if an error occurs
            toggleBookmarkUI(!isBookmarked);
            showErrorToast('An error occurred. Please try again.');
        });
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
  