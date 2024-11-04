import adminModel from "../model/adminModel.js";
import bcrypt from "bcrypt";
import { generateToken, setEncryptedToken } from "./userController.js";
import profilesModel from "../model/profileModel.js";
import { userModel } from "../model/userModel.js";



// CONTROLLER FOR ADMIN LOGIN



export const adminLogin = async(req,res)=>{


    const {userName,password} = req.body;
   
    try {
        
        const admin = await adminModel.findOne({userName:userName});

        if(!admin){
            return res.json({success:false,message:"User Name Not Found !"});
        }
       
        const isMatch = await bcrypt.compare(password,admin.password);

        if(!isMatch){
            return res.json({success:false,message:"Password Does't Match !"})
         }

         if(admin && isMatch){
            const token = generateToken(admin._id);
            const encryptedToken = setEncryptedToken(token);

           return res.json({success:true,message:"Login successful !",encryptedToken:encryptedToken});
         }

    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"Failed To SignIn !"});
    }

}



// CONTROLLER FOR CHANGE ADMIN CREDENTIAL



export const changeAdminCredential = async(req,res)=>{

    const user_id =  req.id;

    const {userName,password,email} = req.body;
try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    
    const newCredential = {
          userName:userName,
          password:hashedPassword,
          email:email
    };

    const admin = await adminModel.findByIdAndUpdate(user_id,newCredential, { new: true } );

    if(admin){
        res.json({success:true,message:"Credential Changed ",data:admin});

    }else {
        res.json({ success: false, message: "Admin not found" });
    }
    
} catch (error) {

    console.log(error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            res.json({success:false, message: 'Validation failed', errors });
          } else {
            res.status(500).json({ message: 'Server error', error: error.message });
          }
}

}



// CONTROLLER FOR UPDATE SOCIAL MEDIA LINKS


export const updateSocialMediaLinks = async(req,res)=>{

    const {instagram,facebook,youtube,whatsapp} = req.body;

    const user_id =  req.id;

    const update = {
        "socialMedia.facebook" : facebook,
        "socialMedia.youtube" : youtube,
        "socialMedia.whatsapp" : whatsapp,
       " socialMedia.instagram" : instagram,

    }
  
    try {
        const admin = await adminModel.findByIdAndUpdate(user_id,update,{new:true});

        if(admin){
            res.json({success:true,message:"Links Updated ",data:admin});
    
        }else {
            res.json({ success: false, message: "Admin not found" });
        }
        
    
    } catch (error) {
        
        console.log(error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            res.json({success:false, message: 'Validation failed', errors });
          } else {
            res.status(500).json({ message: 'Server error', error: error.message });
          }


    }

}




// ADD NEW PROFILES



export const addNewProfile = async(req,res)=>{

    const {
        name,
        familyName,
        dateOfBirth,
        gender,
        age,
        zodiac,
        HoroscopeImage,
        religion,
        cast,
        fatherName,
        motherName,
        weight,
        height,
        about,
        email,
        hobbies,
        phone,
        address,
        profileImage,
        galleryImages,
        companyName,
        position,
        salary,
        workLocation,
        jobType,
        school,
        college,
        degree,
        socialMedia,
      } = req.body;

      try {
        
          const newProfileData = profilesModel({
              basicInfo: {
                  name,
                  familyName,
                  dateOfBirth,
                  gender,
                  religion,
          cast,
          zodiac,
          fatherName,
          motherName,
        },
        personalDetails: {
          weight,
          height,
          age,
          about,
          hobbies,
        },
        contactInfo: {
            phone,
          email,
          address,
        },
        media: {
            profileImage,
            galleryImages,
            HoroscopeImage,
        },
        jobDetails: {
          companyName,
          position,
          salary,
          workingLocation: workLocation, 
          jobType,
        },
        education: {
            school,
            college,
            degree,
        },
        socialMedia:socialMedia,
    });

    

    const newProfile = await newProfileData.save();

    if(newProfile){
        return res.json({success:true,message:"Profile Added !"});
    }
    
    return res.json({success:false,message:"Profile could't add !"});



} catch (error) {
  
    console.log(error);
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        res.json({success:false, message: 'Validation failed', errors });
      } else {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
}
   
}


// CONTROLLER FOR GET WEBSITE DATA



export const getWebsiteData = async(req,res)=>{


    const id = req.id;

    try {
        
        const data = await adminModel.findById(id);

        if(data){
            return res.json({success:true,data:data});
        }else{
            return res.json({success:false,message:"data not found"});
        }

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "An error occurred", error: error.message });
    }


}


// CONTROLLER FOR HANDLE VERIFY REQUEST


export const handleVerifyRequest = async (req, res) => {
    const { userId, isAprove } = req.body;
    const id = req.id;
  
    try {
      
      const user = await profilesModel.findOne({ user_id: userId });
      const admin = await adminModel.findById(id);
  
      
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      if (!admin) {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }
  
      if (isAprove) {
        
        user.verification_status = "Verified";
        const index = admin.requestList.newRequest.indexOf(userId);
        if (index !== -1) {
          admin.requestList.newRequest.splice(index, 1);
        }
        admin.requestList.acceptedRequest.unshift(userId);
  
      
        await user.save();
        await admin.save();
  
        return res.json({
          success: true,
          message: "Profile verified",
          user,
          admin,
        });
      } else {

        // Deny the verification request
        
        user.verification_status = "UnVerified";
        const index = admin.requestList.newRequest.indexOf(userId);
        if (index !== -1) {
          admin.requestList.newRequest.splice(index, 1);
        }
        admin.requestList.deniedRequest.unshift(userId);
        
        await admin.save();
  
        return res.json({
          success: true,
          message: "Profile verification denied",
          user,
          admin,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
  };
  
