
const Data = sessionStorage.getItem("userData");
const userData = JSON.parse(Data);

const token = sessionStorage.getItem("token");

const defaultImageUrl = "https://static.vecteezy.com/system/resources/previews/026/631/445/non_2x/add-photo-icon-symbol-design-illustration-vector.jpg";


if(window.location.pathname.endsWith("user-profile-edit.html")){
    
        // Retrieve values from the form
document.getElementById('name').value = userData.basicInfo.name || '';
document.getElementById('fatherName').value = userData.basicInfo.fatherName || '';
document.getElementById('motherName').value = userData.basicInfo.motherName || '';
document.getElementById('familyName').value = userData.basicInfo.familyName || '';
document.getElementById('dateOfBirth').value = userData.basicInfo.dateOfBirth || '';
document.getElementById('gender').value = userData.basicInfo.gender || '';
document.getElementById('religion').value = userData.basicInfo.religion || '';
// document.getElementById('castOther').value = userData.basicInfo.castOther || '';
document.getElementById('zodiac').value = userData.basicInfo.zodiac || '';
document.getElementById('natchathiram').value = userData.basicInfo.natchathiram || '';
document.getElementById('district').value = userData.basicInfo.district || '';
document.getElementById('phone').value = userData.contactInfo.phone || '';
document.getElementById('email').value = userData.contactInfo.email || '';
document.getElementById('address').value = userData.contactInfo.address || '';
document.getElementById('weight').value = userData.personalDetails.weight || '';
document.getElementById('height').value = userData.personalDetails.height || '';
document.getElementById('age').value = userData.personalDetails.age || '';
document.getElementById('about').value = userData.personalDetails.about || '';
document.getElementById('hobbies').value = userData.personalDetails.hobbies || '';
document.getElementById('jobType').value = userData.jobDetails?.jobType || '';
document.getElementById('companyName').value = userData.jobDetails?.companyName || '';
document.getElementById('salary').value = userData.jobDetails?.salary || '';
document.getElementById('position').value = userData.jobDetails?.position || '';
document.getElementById('workExperience').value = userData.jobDetails?.workExperience || '';
document.getElementById('workingLocation').value = userData.jobDetails?.workingLocation || '';
document.getElementById('degree').value = userData.education?.degree || '';
document.getElementById('school').value = userData.education?.school || '';
document.getElementById('college').value = userData.education?.college || '';
document.getElementById('whatsapp').value = userData.socialMedia[0] || '';
document.getElementById('facebook').value = userData.socialMedia[1] || '';
document.getElementById('instagram').value = userData.socialMedia[2] || '';
document.getElementById('x').value = userData.socialMedia[3] || '';

if(userData.basicInfo.cast.includes("other")){
    document.getElementById('cast').value = "other" || '';
    const otheCastInput = document.getElementById('otherCast');
    otheCastInput.style.display="block";
    otheCastInput.value = userData.basicInfo.cast.split("-")[1] || ''
}

// Update profile image
updateImage("profilePhoto", userData.media.profileImage);

// Update horoscope image
updateImage("horoscopePhoto", userData.media.horoscopeImage);

// Update gallery images
updateImage("image1", userData.media.galleryImages[0]);
updateImage("image2", userData.media.galleryImages[1]);
updateImage("image3", userData.media.galleryImages[2]);
}

function updateImage(elementId, imageUrl) {
    const imageElement = document.getElementById(elementId);
    if(imageUrl != undefined){
        imageElement.src = imageUrl;
        imageElement.style.width = "100%"; 
    }else{
        imageElement.src = defaultImageUrl;
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
        socialMedia:[document.getElementById('whatsapp').value,document.getElementById('facebook').value, document.getElementById('instagram').value, document.getElementById('x').value],
    };

    handleCastChange();
    

    const formData = new FormData();

    formData.append("profileImage", document.getElementById('profileImage').files[0]);
    formData.append("horoscopeImage", document.getElementById('horoscopeImage').files[0]);
    formData.append('galleryImages', document.getElementById('userImage1').files[0]);
    formData.append('galleryImages', document.getElementById('userImage2').files[0]);
    formData.append('galleryImages', document.getElementById('userImage3').files[0]);


    console.log(userInfoData); // Output the data to the console

    
    try {
        showLoader()
        console.log(userInfoData)
        const dataResponse = await fetch("http://localhost:5000/api/edit-profile", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                token: token, // Token header for authentication
            },
            body: JSON.stringify(userInfoData), // Convert payload to JSON string
        });
        const data = await dataResponse.json();

        // const imageResponse = await fetch("http://localhost:5000/api/upload-images", {
        //     method: "POST",
        //     headers: {
        //         token: token, // Token header for authentication
        //     },
        //     body: formData, // Convert payload to JSON string
        // });
        
        hideLoader()

        const data2 = await imageResponse.json();

        if( data.success){
            alert(data2.message);
        }else{
            alert(data2.message);
        }

    } catch (error) {
         console.error("Error occurred:", error);
        alert("An error occurred. Please try again later.");
    }
});


// Show loader
function showLoader() {
    document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}
  // Example usage
  setTimeout(showLoader, 1000); // Simulate showing the loader after 1 second
  setTimeout(hideLoader, 2000); // Hide loader after 5 seconds
  
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