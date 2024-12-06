
const defaultProfileImage = "images/default-profileImage.jpg"

document.addEventListener("DOMContentLoaded",async()=>{

    
    const data = await fetchData();

    if(data){

    


    
    // NEW REQUEST COUNT

    const requestCount = document.getElementById("requestCount");
    if(!requestCount){return}

    requestCount.innerText = data.adminData.requestList.newRequest.length;


    // ALL PROFILES

    const profileCount = document.getElementById("profileCount");
   const profileIcons = document.getElementById("profileIcons");


if (!profileCount || profileIcons.length === 0) {
    return;
}


profileCount.innerText = data.allProfilesData.length;

let count = 0;
data.allProfilesData.forEach((profile, index) => {
    
    if (profile.media.profileImage && count<7) { 
       const span = document.createElement("span");
       span.innerHTML =`<img src="${profile.media.profileImage}" data-bs-toggle="tooltip" title="Hooray!">`;
       profileIcons.appendChild(span);
       count++;
    }else{
        const span = document.createElement("span");
       span.innerHTML =`<img src="${defaultProfileImage}" data-bs-toggle="tooltip" title="Hooray!">`;
       profileIcons.appendChild(span);
       count++;
    }
});



// UPDATE MEMBERS COUNT


const membersCount = document.getElementById("membersCount");

    membersCount.innerText = data.allProfilesData.length;
    let platinumUserCount = 0;
    let standardUserCount = 0;
    data.allProfilesData.forEach(profile=>{
        if(profile.subscription_status){
            platinumUserCount++;
        }else{
             standardUserCount++;
        }
    })
    


       var usersCanvas = document.getElementById("Chart_users");
       var usersData = {
         labels: [ "Platinum", "Free",""],
         datasets: [{
           data: [platinumUserCount, standardUserCount],
           backgroundColor: ["#198754", "#ffc107", ]
         }]
       };
       var pieChart = new Chart(usersCanvas, {
         type: 'pie',
         data: usersData
       });
       
        // UPDATE TOTAL EARNINGS    

        const totalEarnings = document.getElementById("totalEarnings");
        
        let totalEarningAmount = 0;
        let freeAccountEarningsAmount = 10;
        data.subscriptionData.forEach(data=>{
            if(data.isActive){
                totalEarningAmount += data.price;
            }
        })
        
        totalEarnings.innerHTML = `<sub>₹ </sub>${totalEarningAmount}`;
        
        var earningCanvas = document.getElementById("Chart_earni");
        Chart.defaults.global.defaultFontSize = 14;
        var earningsData = {
            labels: ["Platinum", "Standard"],
            datasets: [{
                data: [totalEarningAmount, freeAccountEarningsAmount],
                backgroundColor: ["#8463FF", "#6384FF"]
            }]
        };
        var pieChart = new Chart(earningCanvas, {
            type: 'pie',
            data: earningsData
        });
        
        
        
        //  MONTHLY EARNINGS
        
        const MonthlyEarnings = document.getElementById("MonthlyEarnings");
        
        
       

        MonthlyEarnings.innerHTML = `<sub>₹ </sub>${totalEarningAmount}`;
        
        const ctx = document.getElementById("Chart_earni_rece").getContext('2d');




// Initialize an array for monthly earnings (12 months, Jan-Dec)
const monthlyEarnings = new Array(12).fill(0);

// Process subscription data
data.subscriptionData.forEach(subscription => {
    const createdDate = new Date(subscription.createdAt);
    const monthIndex = createdDate.getMonth(); // 0 = Jan, 11 = Dec
    if(subscription.price){
        monthlyEarnings[monthIndex] += subscription.price;
    }
});


// Create the bar chart
const barChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
            label: 'Monthly Earnings',
            data: monthlyEarnings, // Use the computed monthly earnings
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(75, 192, 192, 0.4)",
            hoverBorderColor: "rgba(75, 192, 192, 1)",
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Earnings (₹)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Months'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        }
    }
});

    

updateNewProfiles(data.allProfilesData);
      updateRenewProfiles(data.allProfilesData,data.subscriptionData)  
    }
})



function updateNewProfiles(allProfilesData){


    // Get the container for injecting cards
  const membersContainer = document.getElementById("membersContainer");

  // Dynamically create cards for the first 10 members
  allProfilesData.slice(0, 10).forEach(member => {

    const createdAt = member.createdAt ? new Date(member.createdAt) : null;
    const date = createdAt.toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric'}) || 'N/A';
    const time = createdAt.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true}) || 'N/A'

    const card = `
    <section>
      <div style="position: relative;margin-bottom:15px; display:flex; flex-direction:column; align-items:center; max-width:600px; width:100%; padding:16px; border-radius:12px; background:#fff; box-shadow:0 4px 12px rgba(0, 0, 0, 0.1);">
        <!-- Arrow Icon in Top Left Corner -->
        <a href="admin-profileDetails.html?id=${member.profileID ? member.profileID : 'N/A'}" 
           style="position: absolute; top: 6px; right: 6px; font-size: 20px; text-decoration: none; color: #8a02f9; background:#19b5d5; border-radius: 50%; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
          ➡️
        </a>
  
        <!-- Card Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; width: 100%; margin-top: 2px; padding-bottom: 10px; border-bottom: 1px solid #c1bdbd;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="height: 80px; width: 80px; display: flex; justify-content: center; align-items: center;">
              <img src="${member.media?.profileImage ? member.media.profileImage : defaultProfileImage}" alt="Profile Picture" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 2px solid #333;">
            </div>
            <div style="display: flex; flex-direction: column; justify-content: center; text-align: center;">
              <h3 style="font-size: 22px; font-weight: bold; color: #222; margin: 0;">${member.basicInfo?.name ? member.basicInfo.name : 'N/A'}</h3>
              <p style="font-size: 14px; color: #222; margin: 4px 0 0;">ID: ${member.profileID ? member.profileID : 'N/A'}</p>
              <p style="margin-right: 15px; font-size: 14px;">Age: <span style="font-size: 14px; color: #222;">${member.basicInfo?.age ? member.basicInfo.age : 'N/A'}</span></p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #222;">
            <span style="font-size: 16px;margin-top:10px;">📅</span> 
            <span style="font-weight: 600;margin-top:10px; color: rgb(0, 2, 3); background-color: #ffffff; padding: 5px 0px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
              ${date && time ? `${date}-${time}` : 'N/A'}
            </span>
          </div>
        </div>
  
        <!-- Card Footer -->
        <div style="display: flex; flex-direction: column; width: 100%; margin-top: 16px; padding-top: 12px; margin-top :2px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 24px; color: #2b2b2b; margin-bottom: 8px;">
            <p style="margin: 0; font-weight: 600; display: flex; align-items: center;">
              <span style="margin-right: 8px;">📞</span> Phone: 
              <span style="font-weight: 550; color: #222; margin-left: 4px;">${member.contactInfo?.phone ? member.contactInfo.phone : 'N/A'}</span>
            </p>
            <p style="margin: 0; font-weight: 600; display: flex; align-items: center;">
              <span style="margin-right: 8px;">✉️</span> Email: 
              <span style="font-weight: 550; color: #222; margin-left: 4px;">${member.contactInfo?.email ? member.contactInfo.email : 'N/A'}</span>
            </p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 24px; color: #2b2b2b; margin-bottom: 8px;">
            <p style="margin: 0; font-weight: 600; display: flex; align-items: center;">
              <span style="margin-right: 8px;">📍</span> Location: 
              <span style="font-weight: 550; color: #222; margin-left: 4px;">${member.basicInfo?.district ? member.basicInfo.district : 'N/A'}</span>
            </p>
            <p style="margin: 0; font-weight: 600; display: flex; align-items: center; margin-right: 35px;">
              <span style="margin-right: 10px;">💼</span> Job: 
              <span style="font-weight: 550; color: #222; margin-left: 4px;">${member.jobDetails?.jobType ? member.jobDetails.jobType : 'N/A'}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  `;
  

    membersContainer.innerHTML += card;
  });


}






function updateRenewProfiles(allProfilesData, subscriptionData) {
    const membersContainer = document.getElementById("renewMembersContainer");
    if (!membersContainer) {
        console.error("Container not found");
        return;
    }

    membersContainer.innerHTML = ""; // Clear existing content

    const currentDate = new Date();

    // Sort subscriptions by nearest endDate
    const sortedData = subscriptionData.sort((a, b) => {
        const diffA = Math.abs(new Date(a.endDate) - currentDate);
        const diffB = Math.abs(new Date(b.endDate) - currentDate);
        return diffA - diffB;
    });

    const filteredProfiles = sortedData.map(data => {
        return allProfilesData.find(profile => profile.user_id === data.user_id);
    }).filter(profile => profile); // Exclude undefined profiles

    let count = 0;
    filteredProfiles.forEach(member => {
        if(!member.subscription_status){
            return;
        }
        if (count >= 10) return; // Stop after 10 profiles

        const subscription = sortedData.find(data => member.user_id === data.user_id);
        if (!subscription) return;
     
        const createdAt = subscription.endDate ? new Date(subscription.endDate) : null;
        const date = createdAt ? createdAt.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
        const time = createdAt ? createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A';

        // Construct card
        const card = `
            <section style="margin-top:15px">
                <div style="position: relative; display: flex; flex-direction: column; align-items: center; max-width: 600px; width: 100%; padding: 16px; border-radius: 12px; background: #fff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Arrow Icon in Top Left Corner -->
                    <a href="admin-profileDetails.html?id=${member.profileID}" 
                       style="position: absolute; top: 6px; right: 6px; font-size: 20px; text-decoration: none; color: #8a02f9; background: #19b5d5; border-radius: 50%; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); ">
                        ➡️
                    </a>

                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; width: 100%; margin-top: 2px; padding-bottom: 10px; border-bottom: 1px solid #c1bdbd;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="height: 80px; width: 80px; display: flex; justify-content: center; align-items: center;">
                                <img src="${member.media?.profileImage || 'default.jpg'}" alt="Profile Picture" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 2px solid #333;">
                            </div>
                            <div style="display: flex; flex-direction: column; justify-content: center; text-align: center;">
                                <h3 style="font-size: 22px; font-weight: bold; color: #222; margin: 0;">${member.basicInfo.name || 'N/A'}</h3>
                                <p style="font-size: 14px; color: #222; margin: 4px 0 0;">ID:${member.profileID || 'N/A'}</p>
                                <p style="margin-right: 15px; font-size: 14px;">Age: <span style="font-size: 14px; color: #222;">${member.basicInfo.age || 'N/A'}</span></p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #222;">
                            <span style="font-size: 16px;margin-top:10px;">📅</span> 
                            <span style="font-weight: 600;margin-top:10px; color: red; background-color: #fff3f3; padding: 5px 0px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                                ${date} - ${time}
                            </span>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; width: 100%; margin-top: 16px; padding-top: 12px;margin-top :2px">
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 24px; color: #2b2b2b; margin-bottom: 8px;">
                            <p style="margin: 0; font-weight: 600; display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📞</span> Phone: 
                                <span style="font-weight: 550; color: #222; margin-left: 4px;">${member.contactInfo.phone || 'N/A'}</span>
                            </p>
                            <p style="margin: 0; font-weight: 600; display: flex; align-items: center;">
                                <span style="margin-right: 8px;">✉️</span> Email: 
                                <span style="font-weight: 550; color: #222; margin-left: 4px;">${member.contactInfo.email || 'N/A'}</span>
                            </p>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 24px; color: #2b2b2b; margin-bottom: 8px;">
                            <p style="margin: 0; font-weight: 600; display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📍</span> Location: 
                                <span style="font-weight: 550; color: #222; margin-left: 4px;">${member.basicInfo.district || 'N/A'}</span>
                            </p>
                            <p style="margin: 0; font-weight: 600; display: flex; align-items: center; margin-right: 35px;">
                                <span style="margin-right: 10px;">💼</span> Job: 
                                <span style="font-weight: 550; color: #222; margin-left: 4px;">${member.jobDetails.jobType || 'N/A'}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        `;


        membersContainer.innerHTML += card;
        count++;
    });
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