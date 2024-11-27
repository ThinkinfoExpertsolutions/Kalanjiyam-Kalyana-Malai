document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await fetchData();
        if (data) {
            console.log(data);
            updateSettings(data.adminData);
        }
    } catch (error) {
        console.error("Failed to fetch or update data:", error);
    }
});



function updateSettings(adminData) {
    const name = document.getElementById("name");
    const password = document.getElementById("password");
    const email = document.getElementById("email");
    const whatsApp = document.getElementById("whatsApp");
    const instagram = document.getElementById("instagram");
    const faceBook = document.getElementById("faceBook");
    const x = document.getElementById("x");
    const youTube = document.getElementById("youTube");

    if (!name || !password || !email || !whatsApp || !instagram || !faceBook || !x || !youTube) {
        console.error("One or more elements are missing in the DOM");
        return;
    }

    name.value = adminData.userName || '';
    email.value = adminData.email || '';
    password.value = adminData.password.slice(0,7); 
    whatsApp.value = adminData.socialMedia?.whatsapp || '';
    instagram.value = adminData.socialMedia?.instagram || '';
    faceBook.value = adminData.socialMedia?.facebook || '';
    x.value = adminData.socialMedia?.x || '';
    youTube.value = adminData.socialMedia?.youtube || '';
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