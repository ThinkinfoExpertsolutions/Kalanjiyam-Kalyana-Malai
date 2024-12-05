let percentage;



const token = sessionStorage.getItem("token");

const defaultImageUrl = "https://static.vecteezy.com/system/resources/previews/026/631/445/non_2x/add-photo-icon-symbol-design-illustration-vector.jpg";


document.addEventListener("DOMContentLoaded",async()=>{



if (window.location.pathname.endsWith("admin-add-new-user.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const profileID = urlParams.get("id");
    if (!profileID) return;

    const userData = await getProfileData(profileID);
    if (!userData || !userData.basicInfo) {
        showErrorToast("Invalid user data. Unable to populate the form.");
        return;
    }

    // Populate basic information
    const basicInfo = userData.basicInfo || {};
    document.getElementById('name').value = basicInfo.name || '';
    document.getElementById('fatherName').value = basicInfo.fatherName || '';
    document.getElementById('motherName').value = basicInfo.motherName || '';
    document.getElementById('familyName').value = basicInfo.familyName || '';
    document.getElementById('dateOfBirth').value = basicInfo.dateOfBirth?.split("T")[0] || '';
    document.getElementById('gender').value = basicInfo.gender || '';
    document.getElementById('religion').value = basicInfo.religion || '';
    document.getElementById('zodiac').value = basicInfo.zodiac || '';
    document.getElementById('natchathiram').value = basicInfo.natchathiram || '';
    document.getElementById('district').value = basicInfo.district || '';

    // Populate contact information
    const contactInfo = userData.contactInfo || {};
    document.getElementById('phone').value = contactInfo.phone || '';
    document.getElementById('email').value = contactInfo.email || '';
    document.getElementById('address').value = contactInfo.address || '';

    // Populate personal details
    const personalDetails = userData.personalDetails || {};
    document.getElementById('weight').value = personalDetails.weight || '';
    document.getElementById('height').value = personalDetails.height || '';
    document.getElementById('age').value = personalDetails.age || '';
    document.getElementById('about').value = personalDetails.about || '';
    document.getElementById('hobbies').value = personalDetails.hobbies || '';
    document.getElementById('familyType').value = personalDetails.familyType || '';
    document.getElementById('martialStatus').value = personalDetails.martialStatus || '';

    // Populate job details
    const jobDetails = userData.jobDetails || {};
    document.getElementById('jobType').value = jobDetails.jobType || '';
    document.getElementById('companyName').value = jobDetails.companyName || '';
    document.getElementById('salary').value = jobDetails.salary || '';
    document.getElementById('position').value = jobDetails.position || '';
    document.getElementById('workExperience').value = jobDetails.workExperience || '';
    document.getElementById('workingLocation').value = jobDetails.workingLocation || '';

    // Populate education details
    const education = userData.education || {};
    document.getElementById('degree').value = education.degree || '';
    document.getElementById('school').value = education.school || '';
    document.getElementById('college').value = education.college || '';

    // Populate social media
    const socialMedia = userData.socialMedia || [];
    document.getElementById('whatsapp').value = socialMedia[0] || '';
    document.getElementById('facebook').value = socialMedia[1] || '';
    document.getElementById('instagram').value = socialMedia[2] || '';
    document.getElementById('x').value = socialMedia[3] || '';

    // Handle cast and other cast field
    const cast = basicInfo.cast || '';
    const otherCastInput = document.getElementById('otherCast');
    document.getElementById('cast').value = cast.includes("other") ? "other" : cast;
    if (cast.includes("other")) {
        otherCastInput.style.display = "block";
        otherCastInput.value = cast.split("-")[1] || '';
    } else {
        otherCastInput.style.display = "none";
        otherCastInput.value = '';
    }

    // Update images
    const media = userData.media || {};
    updateImage("profilePhoto", media.profileImage || '');
    updateImage("horoscopePhoto", media.horoscopeImage || '');
    const galleryImages = media.galleryImages || [];
    updateImage("image1", galleryImages[0] || '');
    updateImage("image2", galleryImages[1] || '');
    updateImage("image3", galleryImages[2] || '');

    // Update completion percentage
    const element = getAllElementsById();
    calculatePercentage(element);
}
});

function updateImage(elementId, imageUrl) {
    const imageElement = document.getElementById(elementId);
    if(imageUrl === undefined || imageUrl===''){
        imageElement.src = defaultImageUrl;
    }else{
        imageElement.src = imageUrl;
        imageElement.style.width = "100%"; 

    }
}


function handleImageChange(event, imageId) {
    const fileInput = event.target;  // Get the file input element
    const imageFile = fileInput.files[0];  // Get the selected file

    if (imageFile) {
        const reader = new FileReader();  // Create a new FileReader to read the file

        reader.onload = function(e) {
            const imageElement = document.getElementById(imageId);  // Get the image element by ID
            imageElement.src = e.target.result;  // Update the image source with the file result
            imageElement.style.width = "100%"; 
        };

        reader.readAsDataURL(imageFile);  // Read the selected file as a data URL
    }
}


let userInfoData;
document.getElementById('profileForm').addEventListener('submit',async function(event) {
    event.preventDefault(); // Prevent the form from submitting
    const element = getAllElementsById();
    calculatePercentage(element);

    const urlParams = new URLSearchParams(window.location.search);
    let profileID = urlParams.get("id");
 if(!profileID){
    profileID = null;
 }
    // Retrieve values from the form
    userInfoData = {
       
        profileID:profileID,
        name: document.getElementById('name').value,
        fatherName: document.getElementById('fatherName').value,
        motherName: document.getElementById('motherName').value,
        familyName: document.getElementById('familyName').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value,
        religion: document.getElementById('religion').value,
        cast: document.getElementById('cast').value,
        zodiac: document.getElementById('zodiac').value,
        natchathiram: document.getElementById('natchathiram').value,
        martialStatus:document.getElementById("martialStatus").value,
        familyType:document.getElementById("familyType").value,
        district: document.getElementById('district').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        weight: document.getElementById('weight').value,
        height: document.getElementById('height').value,
        age: document.getElementById('age').value,
        about: document.getElementById('about').value,
        hobbies: document.getElementById('hobbies').value,
        jobType: document.getElementById('jobType').value,
        companyName: document.getElementById('companyName').value,
        salary: document.getElementById('salary').value,
        position: document.getElementById('position').value,
        workExperience: document.getElementById('workExperience').value,
        workingLocation: document.getElementById('workingLocation').value,
        degree: document.getElementById('degree').value,
        school: document.getElementById('school').value,
        college: document.getElementById('college').value,
        profileCompletion:percentage,
        socialMedia:[document.getElementById('whatsapp').value,document.getElementById('facebook').value, document.getElementById('instagram').value, document.getElementById('x').value],
    };

    handleCastChange();
    
    const formData = new FormData();

    const profileImage = document.getElementById('profileImage').files[0];
    if (profileImage) formData.append("profileImage", profileImage);
    
    const horoscopeImage = document.getElementById('horoscopeImage').files[0];
    if (horoscopeImage) formData.append("horoscopeImage", horoscopeImage);
    
    const userImage1 = document.getElementById('userImage1').files[0];
    if (userImage1) formData.append("galleryImages", userImage1);
    
    const userImage2 = document.getElementById('userImage2').files[0];
    if (userImage2) formData.append("galleryImages", userImage2);
    
    const userImage3 = document.getElementById('userImage3').files[0];
    if (userImage3) formData.append("galleryImages", userImage3);
    


    let response1=false;
    let response2=false;

    
    try {
        
       showLoader()

        const dataResponse = await fetch("https://backend-green-seven-44.vercel.app/api/admin/add-new-profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token, // Token header for authentication
            },
            body: JSON.stringify(userInfoData), // Convert payload to JSON string
        });
        hideLoader();
        const data = await dataResponse.json();
        if(data.success){
            response1=true;
            formData.append("userId",data.userId);
        }else{
            return;
        }
        
     // Check if any images were added to formData

     
if (formData.has("profileImage") || formData.has("horoscopeImage") || formData.has("galleryImages")) {
    showLoader()
    const imageResponse = await fetch("https://backend-green-seven-44.vercel.app/api/upload-images", {
        method: "POST",
        headers: {
            token: token, // Token header for authentication
        },
        body: formData, // Send the form data
    });
 hideLoader()
    const data2 = await imageResponse.json();
    if (data2.success) {
        response2 = true;
    }
}
       

        if( response1 && response2){
            showSuccessToast("Profile Information And Image Updated Successfully!");
        }else if(response1){
            showSuccessToast("Profile Information Updated Successfully!");
        }else if(response2){
            showSuccessToast("Profile Image Updated Successfully!");
        }else{
            showErrorToast("error");
        }


    } catch (error) {
         console.error("Error occurred:", error);
        showErrorToast("An error occurred. Please try again later.");
    }
});



  
  function handleCastChange() {
    const castDropdown = document.getElementById('cast');
    const otherInput = document.getElementById('otherCast');

    // Show the input field if "Other" is selected
    if (castDropdown.value === 'other') {
        otherInput.style.display = 'block';
        otherInput.required = true; // Make it mandatory if shown
        userInfoData.cast = `other-${otherInput.value.trim()}`;
    } else {
        otherInput.style.display = 'none';
        otherInput.value = ''; // Clear the input if it's hidden
        otherInput.required = false; // Remove the mandatory field property
    }
}

function getAllElementsById() {
    const ids = [
        'profilePhoto',
        'name',
        'district',
        'age',
        'religion',
        'jobType',
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
        'image1',
        'image2',
        'image3',
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
        'horoscopePhoto',
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

function calculatePercentage(elements) {
    let filledCount = 0;

    // Loop through all elements and check if they have a value
    for (let key in elements) {
        const element = elements[key];
        if (element.type === "file" || element.type === "checkbox" || element.type === "radio") {
            // Handle special input types
            if (element.checked || element.files?.length > 0) {
                filledCount++;
            }
        } else if (element.value !== "") {
            // Count non-empty values for other elements
            filledCount++;
        }
    }

    const total = Object.keys(elements).length;
    const Totalpercentage = Math.round((filledCount / total) * 100);

     percentage = Totalpercentage;

}


async function getProfileData (profileID){
    try {
        showLoader()
        const response = await fetch(`https://backend-green-seven-44.vercel.app/api/get-profile-data/${profileID}`, {
            method: "GET",
            headers: {
                token: token, // Token header for authentication
            },
            
        });
       hideLoader()
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