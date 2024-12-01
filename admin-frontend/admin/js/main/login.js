
document.getElementById("loginBtn").addEventListener("click",async(e)=>{
 e.preventDefault();
    const userName = document.getElementById("email").value;
    const password = document.getElementById("pwd").value;
    
    console.log({userName,password});
    
    if(!userName || !password){
        alert("please Enter Emial And Password");
    }else{
        
        try {
            const response = await fetch("http://localhost:5000/api/admin/login",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({
                    userName:userName,
                    password:password
                })
            });
            const data = await response.json();
    
            if(data.success){
                alert(data.message);
                sessionStorage.setItem("token",data.encryptedToken);
                window.location.href="dashboard.html";
            }else{
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
            alert("error,Please Try later");
        }
    
    }
})

let currentStep = "sendOTP";

document.getElementById("verifyBtn").addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("verifyEmail").value;
    const otp = document.getElementById("otp").value;
    const newPassword = document.getElementById("newPwd").value;
    const comfirmPassword = document.getElementById("comfirmPwd").value;
    const verifyBtn = document.getElementById("verifyBtn");



    if (currentStep === "sendOTP") {
        try {
            const response = await fetch("http://localhost:5000/api/user/admin/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                document.getElementById("otpContainer").style.display = "block";
                verifyBtn.innerHTML = "Verify OTP";
                currentStep = "verifyOTP";
                console.log(currentStep);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while sending the OTP. Please try again later.");
        }
    } else if (currentStep === "verifyOTP") {
        if (!otp) {
            alert("Please enter the OTP.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/user/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                document.getElementById("otpContainer").style.display = "none";
                document.getElementById("changePassword").style.display = "block";
                verifyBtn.innerHTML = "Change Password";
                currentStep = "changePassword";
                console.log(currentStep);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while verifying the OTP. Please try again later.");
        }
    } else if (currentStep === "changePassword") {
        if (!newPassword || !comfirmPassword) {
            alert("Please fill in all password fields.");
            return;
        }

        if (newPassword !== comfirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/user/admin/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword,comfirmPassword }),
            });

            const data = await response.json();
            console.log(data);

            if (data.success) {
                alert(data.message);
                window.location.href = "index.html";
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while resetting the password. Please try again later.");
        }
    }
});

document.getElementById("logOut").addEventListener("click",()=>{


    sessionStorage.removeItem("token");
    location.reload();


})