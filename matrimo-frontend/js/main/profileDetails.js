
const token = sessionStorage.getItem("token");
const defaultImageUrl = "https://static.vecteezy.com/system/resources/previews/026/631/445/non_2x/add-photo-icon-symbol-design-illustration-vector.jpg";

async function getProfileData (profileID){
    try {
        
        const response = await fetch(`http://localhost:5000/api/get-profile-data/${profileID}`, {
            method: "GET",
            headers: {
                token: token, // Token header for authentication
            },
            
        });

        const data = await response.json();
        if(data.success){
            const userData = data.data;
            return userData;
        }else{
            console.error("Error occurred:",data.error );
           
        }

    } catch (error) {
        console.error("Error occurred:", error);
        
    }
}


// Function to get all elements by their ID
function getAllElementsById() {
    const ids = [
        'profileImage',
        'name',
        'name1',
        'district',
        'district1',
        'age',
        'age1',
        'religion',
        'religion1',
        'jobType',
        'jobType1',
        'about',
        'gallery',
        'image-gallery',
        'phone',
        'email',
        'address',
        'gender',
        'familyName',
        'fatherName',
        'motherName',
        'dateOfBirth',
        'height',
        'weight',
        'cast',
        'natchathiram',
        'zodiac',
        'userImage1',
        'userImage2',
        'userImage3',
        'jobType',
        'companyName',
        'position',
        'salary',
        'workingLocation',
        'workExperience',
        'degree',
        'college',
        'school',
        'hobbies',
        'socialMedia',
        'horoscopeImage',
        'whatsapp',
        'instagram',
        'facebook',
        'x'
    ];

    // Create an object to store the elements
    const elements = {};

    // Loop through the IDs and get the elements
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            elements[id] = element; // Store the element in the object
        }
    });

    return elements; // Return the object with elements
}



function updateProfileData(elements, userData) {

    console.log(userData)
  
    elements.age.innerHTML = userData.personalDetails.age || '';
    elements.religion.innerHTML = userData.basicInfo.religion.split("(")[0] || '';
    elements.name.innerHTML = userData.basicInfo?.name || '';
    elements.jobType.innerHTML = userData.jobDetails?.jobType || '';
    elements.district.innerHTML = ` ${userData.basicInfo?.district || "N/A"}`;

    
    elements.name1.innerHTML = `<b>Name:</b> ${userData.basicInfo?.name || "N/A"}`;
    elements.gender.innerHTML = `<b>Gender:</b> ${userData.basicInfo?.gender || "N/A"}`;
    elements.familyName.innerHTML = `<b>Family name:</b> ${userData.basicInfo?.familyName || "N/A"}`;
    elements.fatherName.innerHTML = `<b>Father name:</b> ${userData.basicInfo?.fatherName || "N/A"}`;
    elements.motherName.innerHTML = `<b>Mother name:</b> ${userData.basicInfo?.motherName || "N/A"}`;
    elements.dateOfBirth.innerHTML = `<b>Date of birth:</b> ${userData.basicInfo?.dateOfBirth || "N/A"}`;
    elements.age1.innerHTML = `<b>Age:</b> ${userData.personalDetails?.age || "N/A"} Years Old`;
    elements.height.innerHTML = `<b>Height:</b> ${userData.personalDetails?.height || "N/A"} cm`;
    elements.weight.innerHTML = `<b>Weight:</b> ${userData.personalDetails?.weight || "N/A"} kg`;
    elements.religion1.innerHTML = `<b>Religion:</b> ${userData.basicInfo?.religion || "N/A"}`;
    
    elements.natchathiram.innerHTML = `<b>Natchathiram:</b> ${userData.basicInfo?.natchathiram || "N/A"}`;
    elements.zodiac.innerHTML = `<b>Zodiac:</b> ${userData.basicInfo?.zodiac || "N/A"}`;
    elements.district1.innerHTML = `<b>District:</b> ${userData.basicInfo?.district || "N/A"}`;
    if (userData.basicInfo?.cast?.includes("other")) {
        elements.cast.innerHTML = `<b>Cast:</b> ${userData.basicInfo.cast.split("-")[1] || "N/A"}`;
    } else {
        elements.cast.innerHTML = `<b>Cast:</b> ${userData.basicInfo?.cast || "N/A"}`;
    }
    
    // Ensure "about" section is defined
    elements.about.innerHTML = userData.personalDetails?.about || "";
    
    // Safely handle hobbies
    const hobbiesArray = userData.personalDetails?.hobbies
        ? userData.personalDetails.hobbies.split(",")
        : [];
    
    hobbiesArray.forEach((hobby) => {
        if (hobby.trim()) { // Avoid adding empty items
            const li = document.createElement("li");
            li.innerHTML = hobby.trim(); // Remove unnecessary spaces
            elements.hobbies.appendChild(li);
        }
    });
    
    // elements.hobbies.innerHTML = userData.personalDetails.hobbies || '';
    
    // contact details
    elements.phone.innerHTML = `<i class="fa fa-mobile" aria-hidden="true"></i><b>Phone:</b> ${userData.contactInfo?.phone || "N/A"}`;
    elements.email.innerHTML = `<i class="fa fa-envelope-o" aria-hidden="true"></i><b>Email:</b> ${userData.contactInfo?.email || "N/A"}`;
    elements.address.innerHTML = `<i class="fa fa-map-marker" aria-hidden="true"></i><b>Address:</b> ${userData.contactInfo?.address || "N/A"}`;

    // Job details
    elements.jobType1.innerHTML = `<b>Job Type:</b> ${userData.jobDetails?.jobType || "N/A"}`;
    elements.companyName.innerHTML = `<b>Company Name:</b> ${userData.jobDetails?.companyName || "N/A"}`;
    elements.position.innerHTML = `<b>Position:</b> ${userData.jobDetails?.position || "N/A"}`;
    elements.salary.innerHTML = `<b>Salary:</b> ${userData.jobDetails?.salary || "N/A"} INR`;
    elements.workingLocation.innerHTML = `<b>Working Location:</b> ${userData.jobDetails?.workingLocation || "N/A"}`;
    elements.workExperience.innerHTML = `<b>Work Experience:</b> ${userData.jobDetails?.workExperience || "N/A"}`;
    elements.degree.innerHTML = `<b>Degree:</b> ${userData.education?.degree || "N/A"}`;
    elements.college.innerHTML = `<b>College:</b> ${userData.education?.college || "N/A"}`;
    // elements.school.innerHTML = `<b>School:</b> ${userData.education?.school || "N/A"}`;

    // Social Media Links
    elements.whatsapp.href = userData.socialMedia[0] || '#';
    elements.facebook.href = userData.socialMedia[1] || '#';
    elements.instagram.href = userData.socialMedia[2] || '#';
    elements.x.href = userData.socialMedia[3] || '#';

    // Images (example if you have image elements)
    updateImage(elements.profileImage, userData.media.profileImage);

    // Update horoscope image
    updateImage(elements.horoscopeImage, userData.media.horoscopeImage);

    // Update gallery images
    updateImage(elements.userImage1, userData.media.galleryImages[0]);
    updateImage(elements.userImage2, userData.media.galleryImages[1]);
    updateImage(elements.userImage3, userData.media.galleryImages[2]);
    
}


function updateImage(imageElement, imageUrl) {
    if(imageUrl != undefined){
        imageElement.src = imageUrl;
        imageElement.style.width = "100%"; 
    }else{
        imageElement.src = defaultImageUrl;
    }
}






if(window.location.pathname.endsWith("profile-details.html")){
    const urlParams = new URLSearchParams(window.location.search);
    const profileID = urlParams.get("id");
     getProfileData(profileID).then(userData=>{
        
         const elementsById = getAllElementsById();
         updateProfileData(elementsById,userData)
     }).catch(e=>{
        console.log(e);
     })
    console.log(profileID);
  
}