let percentage;

const Data = sessionStorage.getItem("userData");
const userData = JSON.parse(Data);

const token = sessionStorage.getItem("token");

const defaultImageUrl = "https://static.vecteezy.com/system/resources/previews/026/631/445/non_2x/add-photo-icon-symbol-design-illustration-vector.jpg";


if(window.location.pathname.endsWith("user-profile-edit.html")){
    
        // Retrieve values from the form
        document.getElementById('name').value = userData.basicInfo.name ? userData.basicInfo.name : '';
        document.getElementById('fatherName').value = userData.basicInfo.fatherName ? userData.basicInfo.fatherName : '';
        document.getElementById('motherName').value = userData.basicInfo.motherName ? userData.basicInfo.motherName : '';
        document.getElementById('familyName').value = userData.basicInfo.familyName ? userData.basicInfo.familyName : '';
        document.getElementById('dateOfBirth').value = userData.basicInfo.dateOfBirth ? userData.basicInfo.dateOfBirth.split("T")[0] : '';
        document.getElementById('gender').value = userData.basicInfo.gender ? userData.basicInfo.gender : '';
        document.getElementById('religion').value = userData.basicInfo.religion ? userData.basicInfo.religion : '';
        document.getElementById('zodiac').value = userData.basicInfo.zodiac ? userData.basicInfo.zodiac : '';
        document.getElementById('zodiac').value = userData.basicInfo.zodiac ? userData.basicInfo.zodiac : '';
        document.getElementById('natchathiram').value = userData.basicInfo.natchathiram ? userData.basicInfo.natchathiram : '';
        document.getElementById('district').value = userData.basicInfo.district ? userData.basicInfo.district : '';
        document.getElementById('phone').value = userData.contactInfo.phone ? userData.contactInfo.phone : '';
        document.getElementById('email').value = userData.contactInfo.email ? userData.contactInfo.email : '';
        document.getElementById('address').value = userData.contactInfo.address ? userData.contactInfo.address : '';
        
        document.getElementById('weight').value = userData.personalDetails?.weight ? userData.personalDetails.weight : '';
        document.getElementById('height').value = userData.personalDetails?.height ? userData.personalDetails.height : '';
        document.getElementById('age').value = userData.personalDetails?.age ? userData.personalDetails.age : '';
        document.getElementById('about').value = userData.personalDetails?.about ? userData.personalDetails.about : '';
        document.getElementById('hobbies').value = userData.personalDetails?.hobbies ? userData.personalDetails.hobbies : '';
        document.getElementById('familyType').value = userData.personalDetails?.familyType ? userData.personalDetails.familyType : '';
        document.getElementById('martialStatus').value = userData.personalDetails?.martialStatus ? userData.personalDetails.martialStatus : '';
        
        document.getElementById('jobType').value = userData.jobDetails?.jobType ? userData.jobDetails.jobType : '';
        document.getElementById('companyName').value = userData.jobDetails?.companyName ? userData.jobDetails.companyName : '';
        document.getElementById('salary').value = userData.jobDetails?.salary ? userData.jobDetails.salary : '';
        document.getElementById('position').value = userData.jobDetails?.position ? userData.jobDetails.position : '';
        document.getElementById('workExperience').value = userData.jobDetails?.workExperience ? userData.jobDetails.workExperience : '';
        document.getElementById('workingLocation').value = userData.jobDetails?.workingLocation ? userData.jobDetails.workingLocation : '';
        
        document.getElementById('degree').value = userData.education?.degree ? userData.education.degree : '';
        document.getElementById('school').value = userData.education?.school ? userData.education.school : '';
        document.getElementById('college').value = userData.education?.college ? userData.education.college : '';
        if(userData.socialMedia){

            document.getElementById('whatsapp').value = userData.socialMedia[0] ? userData.socialMedia[0] : '';
            document.getElementById('facebook').value = userData.socialMedia[1] ? userData.socialMedia[1] : '';
            document.getElementById('instagram').value = userData.socialMedia[2] ? userData.socialMedia[2] : '';
            document.getElementById('x').value = userData.socialMedia[3] ? userData.socialMedia[3] : '';
        }
        
        document.getElementById('cast').value = userData.basicInfo.cast ? (userData.basicInfo.cast.includes("other") ? "other" : userData.basicInfo.cast) : '';
        if (userData.basicInfo.cast && userData.basicInfo.cast.includes("other")) {
            const otherCastInput = document.getElementById('otherCast');
            otherCastInput.style.display = "block";
            otherCastInput.value = userData.basicInfo.cast.split("-")[1] ? userData.basicInfo.cast.split("-")[1] : '';
        }
        
// Update profile image
updateImage("profilePhoto", userData.media.profileImage);

// Update horoscope image
updateImage("horoscopePhoto", userData.media.horoscopeImage);

// Update gallery images
updateImage("image1", userData.media.galleryImages[0]);
updateImage("image2", userData.media.galleryImages[1]);
updateImage("image3", userData.media.galleryImages[2]);

const element = getAllElementsById();
calculatePercentage(element);

}

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
    // Retrieve values from the form
    userInfoData = {
       
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
       

        const dataResponse = await fetch("https://api.kalanjiyamkalyanmalai.in/api/edit-profile", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                token: token, // Token header for authentication
            },
            body: JSON.stringify(userInfoData), // Convert payload to JSON string
        });
        const data = await dataResponse.json();
        if(data.success){
            response1=true;
            formData.append("userId",data.userId)
        }
        
     // Check if any images were added to formData

     
if (formData.has("profileImage") || formData.has("horoscopeImage") || formData.has("galleryImages")) {
    const imageResponse = await fetch("https://api.kalanjiyamkalyanmalai.in/api/upload-images", {
        method: "POST",
        headers: {
            token: token, // Token header for authentication
        },
        body: formData, // Send the form data
    });

    const data2 = await imageResponse.json();
    if (data2.success) {
        response2 = true;
    }
}
        hideLoader()

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



function showLoader() {
    const loader = document.getElementById("loader");
    if(!loader){
     return;
    };
    loader.style.display = "flex";
 }
 
 function hideLoader() {
     const loader = document.getElementById("loader");
     if(!loader){
      return;
     };
     loader.style.display = "none";
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
  