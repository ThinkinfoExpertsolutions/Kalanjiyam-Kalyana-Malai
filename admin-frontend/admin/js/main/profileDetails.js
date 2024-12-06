
  // Get the token
  let token = sessionStorage.getItem("token");

  const defaultImageUrl = "https://static.vecteezy.com/system/resources/previews/026/631/445/non_2x/add-photo-icon-symbol-design-illustration-vector.jpg";
  
  const data = sessionStorage.getItem("userData");
  const myData = data ? JSON.parse(data) : null;
  
  const data2 = sessionStorage.getItem("subscriptionData");
  const subscriptionData = data2 ? JSON.parse(data2) : null;
  
  async function getProfileData(profileID) {
      try {
          showLoader();
          const response = await fetch(`https://backend-green-seven-44.vercel.app/api/get-profile-data/${profileID}`, {
              method: "GET",
              headers: {
                  token: token, // Token header for authentication
              },
          });
          hideLoader();
  
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          if (data.success) {
             
              return { userData: data.data, isAdmin: data.isAdmin };
          } else {
              console.error("Error occurred:", data.error);
              throw new Error(data.error || "Failed to fetch profile data.");
          }
      } catch (error) {
          hideLoader();
          console.error("Error occurred:", error);
          throw error; // Propagate the error to the caller.
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
          "familyType",
          "martialStatus",
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
          }else{
              return;
          }
      });
  
      return elements; // Return the object with elements
  }
  
  
  
  function updateProfileData(elements, userData,myData,isAdmin) {
      
  
      // Basic info updates
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
      elements.familyType.innerHTML = `<b>Family Type:</b> ${userData.personalDetails?.familyType || "N/A"}`;
      elements.martialStatus.innerHTML = `<b>Martial Status:</b> ${userData.personalDetails?.martialStatus || "N/A"}`;
      if (userData.basicInfo?.cast?.includes("other")) {
          elements.cast.innerHTML = `<b>Cast:</b> ${userData.basicInfo.cast.split("-")[1] || "N/A"}`;
      } else {
          elements.cast.innerHTML = `<b>Cast:</b> ${userData.basicInfo?.cast || "N/A"}`;
      }
  
      if(userData.verification_status === "Verified"){
             const verifyImg = document.getElementById("verifyImg");
             if(verifyImg){
              verifyImg.src = "https://iconape.com/wp-content/png_logo_vector/google-verified.png";
             }
      }else{
          const verifyImg = document.getElementById("verifyImg");
             if(verifyImg){
              verifyImg.src = "https://iconape.com/wp-content/png_logo_vector/google-unverified.png";
             }
      }
  
      // About and hobbies
      elements.about.innerHTML = userData.personalDetails?.about || "";
      const hobbiesArray = userData.personalDetails?.hobbies
          ? userData.personalDetails.hobbies.split(",")
          : [];
      hobbiesArray.forEach((hobby) => {
          if (hobby.trim()) {
              const li = document.createElement("li");
              li.innerHTML = `<span>${hobby.trim()}</span>`;
              elements.hobbies.appendChild(li);
          }
      });
      
      
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
     
      let isPremium;
  
  if (isAdmin) {
      isPremium = true;
  } else if (userData && userData.profileID === myData?.profileID) {
      isPremium = true;
  } else {
      isPremium = subscriptionData?.isActive || false;
  }
  
      if(isPremium){
          elements.whatsapp.href = userData.socialMedia[0] || '#';
          elements.facebook.href = userData.socialMedia[1] || '#';
          elements.instagram.href = userData.socialMedia[2] || '#';
          elements.x.href = userData.socialMedia[3] || '#';
      }else{
         applyBlur( elements.whatsapp)
          applyBlur(elements.facebook)
          applyBlur(elements.instagram)
          applyBlur(elements.x)
      }
  
      // Contact details (with blur filter if not premium)
  
      if (isPremium) {
          elements.phone.innerHTML = `<i class="fa fa-mobile" aria-hidden="true"></i><b>Phone:</b> ${userData.contactInfo?.phone || "N/A"}`;
          elements.email.innerHTML = `<i class="fa fa-envelope-o" aria-hidden="true"></i><b>Email:</b> ${userData.contactInfo?.email || "N/A"}`;
          elements.address.innerHTML = `<i class="fa fa-map-marker" aria-hidden="true"></i><b>Address:</b> ${userData.contactInfo?.address || "N/A"}`;
      } else {
          applyBlur(elements.phone, "Get Premium to view contact details");
          applyBlur(elements.email, "Get Premium to view contact details");
          applyBlur(elements.address, "Get Premium to view contact details");
      }
  
      // Images (profile, horoscope, and gallery with blur filter if not premium)
      updateProfileImage(elements.profileImage, userData.media.profileImage);
  
      if (isPremium) {
          updateImage(elements.horoscopeImage, userData.media.horoscopeImage,isPremium);
          updateImage(elements.userImage1, userData.media.galleryImages[0],isPremium);
          updateImage(elements.userImage2, userData.media.galleryImages[1],isPremium);
          updateImage(elements.userImage3, userData.media.galleryImages[2],isPremium);
      } else {
          applyBlur(elements.horoscopeImage, "Get Premium to view this image");
          applyBlur(elements.userImage1, "Get Premium to view this image");
          applyBlur(elements.userImage2, "Get Premium to view this image");
          applyBlur(elements.userImage3, "Get Premium to view this image");
      }
  }
  
  // Function to update images with optional blur
  function updateImage(imageElement, imageUrl, isPremium ) {
      if (imageUrl) {
          imageElement.src = imageUrl;
          imageElement.style.width = "100%";
      } else {
          imageElement.src = defaultImageUrl;
      }
  
      if (!isPremium) {
          applyBlur(imageElement, "Get Premium to view this image");
      }
  }
  
  // Function to apply blur filter with overlay text
  function applyBlur(element, message) {
      element.style.filter = "blur(8px)";
      element.style.position = "relative";
  
      const overlay = document.createElement("div");
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      // overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      // overlay.style.color = "black";
      overlay.style.fontSize = "14px";
      overlay.style.fontWeight = "bold";
      overlay.style.textAlign = "center";
      // overlay.innerHTML = message;
  
      element.parentElement.style.position = "relative";
      element.parentElement.appendChild(overlay);
  }
  
  function updateProfileImage(imageElement, imageUrl) {
      if(imageUrl != undefined){
          imageElement.src = imageUrl;
          imageElement.style.width = "100%"; 
      }else{
          imageElement.src = defaultImageUrl;
      }
  }
  
  
  
  
  
  if (window.location.pathname.endsWith("profileDetails.html")) {
      const urlParams = new URLSearchParams(window.location.search);
      const profileID = urlParams.get("id");
  
      getProfileData(profileID)
          .then(({ userData, isAdmin }) => {
              if (userData.profileCompletion <= 75) {
                  if(userData && myData){
                      if (userData.profileID === myData.profileID) {
                          window.location.href = `user-profile-edit.html?id=${userData.profileID}`;
                          showInfoToast("Please Complete Your Profile");
                      }
                  }
                  else {
                      window.location.href = `index.html`;
                  }
              } else {
                  const elementsById = getAllElementsById();
                 
                  updateProfileData(elementsById, userData, myData, isAdmin);
              }
          })
          .catch((e) => {
              console.error("Error occurred while fetching profile data:", e);
          });
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
    function showInfoToast(msg) {
      Toastify({
        text: msg,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: " #FFD400",
        close: true,
      }).showToast();
    }
    
    