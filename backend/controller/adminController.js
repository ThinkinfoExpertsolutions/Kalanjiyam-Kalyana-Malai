import adminModel from "../model/adminModel.js";
import bcrypt from "bcrypt";
import { createUniqueUserId, generateToken, setEncryptedToken } from "./userController.js";
import profilesModel from "../model/profileModel.js";
import { userModel } from "../model/userModel.js";
import SubscriptionModel from "../model/subscriptionModel.js";



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
            const token = generateToken(admin._id,process.env.ADMIN_SECRET_KEY);
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
        res.json({success:true,message:"Credential Changed "});

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


export const updateSocialMediaLinks = async (req, res) => {
  const { instagram, facebook, youtube, whatsapp } = req.body;
  const user_id = req.id;

  // Dynamically construct the update object
  const update = {};
  if (facebook) update["socialMedia.facebook"] = facebook;
  if (youtube) update["socialMedia.youtube"] = youtube;
  if (whatsapp) update["socialMedia.whatsapp"] = whatsapp;
  if (instagram) update["socialMedia.instagram"] = instagram;

  try {
      // Only update if there are fields to update
      if (Object.keys(update).length === 0) {
          return res.status(400).json({ success: false, message: "No social media links provided" });
      }

      const admin = await adminModel.findByIdAndUpdate(user_id, update, { new: true });

      if (admin) {
          res.json({ success: true, message: "Links Updated", data: admin });
      } else {
          res.status(404).json({ success: false, message: "Admin not found" });
      }
  } catch (error) {
      console.error(error);
      if (error.name === 'ValidationError') {
          const errors = Object.values(error.errors).map(err => err.message);
          res.status(400).json({ success: false, message: 'Validation failed', errors });
      } else {
          res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
  }
};





// ADD NEW PROFILES



export const addNewProfile = async(req,res)=>{

    const {
        name,
        familyName,
        dateOfBirth,
        gender,
        age,
        zodiac,
        natchathiram,
        district,
        workExperience,
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
          natchathiram,
          district,
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
          workExperience,
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
    newProfile.user_id = newProfile._id;
    newProfile.profileID = createUniqueUserId(newProfile._id);
    newProfile.save();

    if(newProfile){
        return res.json({success:true,message:"Profile Added !",id:newProfile.profileID});
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
        console.log(id);
        const adminData = await adminModel.findById(id);
        const allProfiles = await profilesModel.find({});
        const subscriptionData = await SubscriptionModel.find({});

        if(adminData && allProfiles){
            return res.json({success:true,adminData:adminData,allProfilesData:allProfiles,subscriptionData:subscriptionData});
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
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
  };
  
// CONTROLLER FOR CHANGE ADMIN CHANGE PROFILE VERIFICATION STATUS


export const adminChangeVerificationStatus = async(req,res)=>{
  
  const {userId,verification_status} = req.body;


  try {
    const profile = await profilesModel.findOneAndUpdate(
      {user_id:userId},
      {verification_status:verification_status},
      { new: true, runValidators: true });

    if(!profile){
      return res.json({success:false,message:"profile not found"});
    }
    
    return res.json({success:true,message:"Profile Verification Status Changed"})

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
  }

}


// CONTROLLER FOR ADMIN CHANGE SUBSCRIPTION STATUS


export const adminChangeSubscriptionStatus = async (req, res) => {
  const { userId, durationInDays, price, isActive } = req.body;

  try {
    
    const profile = await SubscriptionModel.findOne({ user_id: userId });

    
    if (!isActive) {
      if (!profile) {
        return res.status(404).json({ success: false, message: "User Profile Not Found" });
      }

      
      const updatedProfile = await SubscriptionModel.findOneAndUpdate(
        { user_id: userId },
        { price: 0, durationInDays: 0, startDate: 0, endDate: 0, isActive: false },
        { new: true, runValidators: true }
      );
      const updatedUser = await profilesModel.findOneAndUpdate(
        { user_id: userId },
        { subscription_status: false },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Subscription deactivated successfully",
      });
    }

    
    if (!profile) {
      return res.status(404).json({ success: false, message: "User Profile Not Found" });
    }

    
    if (profile.isActive) {
      return res.status(400).json({ success: false, message: "User Already Subscribed!" });
    }

    // Activate new subscription
    const startDate = new Date();
    const endDate = new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000);

    const newSubscription = {
      price,
      durationInDays,
      startDate,
      endDate,
      isActive: true
    };

    const updatedProfile = await SubscriptionModel.findOneAndUpdate(
      { user_id: userId },
      newSubscription,
      { new: true, upsert: true, runValidators: true }
    );

    const updatedUser = await profilesModel.findOneAndUpdate(
      { user_id: userId },
      { subscription_status: true },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Subscription Status Changed",
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};




// CONTROLLER FOR ADMIN REMOVE PROFILE


export const removeProfile = async(req,res)=>{

  const { userId } = req.body;
  let name;
  try {
    
      
      const user = await profilesModel.findOne({ user_id:userId });
  
      
      if (!user) {
        return res.json({ success: false, message: "User does not exist" });
      }
     
      name = user.basicInfo.name;
     
      await profilesModel.deleteOne({ user_id:userId });
  
      
      return res.json({ success: true, message: `${name}'s details deleted successfully` });

  } catch (error) {
    
    console.log(error.message);
    return res.json({ success: false, message: "An error occurred", error: error.message });

  }


}