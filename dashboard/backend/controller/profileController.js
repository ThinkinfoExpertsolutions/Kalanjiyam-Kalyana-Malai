import profilesModel from "../model/profileModel.js";
import { userModel } from "../model/userModel.js";



// CONTROLLER FOR EDIT USEER PROFILE


export const editProfile = async (req, res) => {
  const {
    name,
    familyName,
    dateOfBirth,
    gender,
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

  const user_id = req.params.id;

  try {
    
    const userExist = await checkUserFound(user_id, "userModel");

    if (!userExist) {
        return res.status(404).json({ success: false, message: " User Not Found" });
    }

    const updatedProfileData = {
      basicInfo: {
        name,
        familyName,
        dateOfBirth,
        gender,
        religion,
        cast,
        fatherName,
        motherName,
      },
      personalDetails: {
        weight,
        height,
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
    };

    
    const updatedProfile = await profilesModel.findOneAndUpdate(
      { user_id: user_id },
      updatedProfileData,
      {
        new: true, 
        runValidators: true, 
      }
    );

    if (!updatedProfile) {
      return res.status(404).json({ success: false, message: "Profile Not Found" });
    }

    res.json({ success: true, message: "Successfully Profile Updated", data: updatedProfile });
  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ success: false, message: 'Validation failed', errors });
    } else {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
};


// CONTROLLER FOR EDIT USER SETTINGS


export const editSettings = async (req, res) => {
  const userId = req.params.id;

  try {
 
    const userExist = await checkUserFound(userId, "userModel");

    if (!userExist) {
        return res.status(404).json({ success: false, message: " User Not Found" });
    }

    
    const { profileVisibleOption, interestRequestOption, notificationPermission } = req.body;

    
    const updateData = {settings:{}};
    if (profileVisibleOption !== undefined) updateData.settings.profileVisibleOption = profileVisibleOption;
    if (interestRequestOption !== undefined) updateData.settings.interestRequestOption = interestRequestOption;
    if (notificationPermission !== undefined) updateData.settings.notificationPermission = notificationPermission;

    let up;

    if (Object.keys(updateData).length > 0) {
      up =  await profilesModel.findOneAndUpdate(
        { user_id: userId },
        updateData,
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({ success: true, message: "Settings updated successfully",data:up });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "error", error: error.message });
  }
};


// CONTROLLER FOR SHARE INTEREST


export const shareInterest = async (req, res) => {

  const { senderId } = req.body;
  const receiverId = req.params.id;

  try {
      
      const [senderUserExists, receiverUserExists, senderProfileExists, receiverProfileExists] = await Promise.all([
          checkUserFound(senderId, "userModel"),
          checkUserFound(receiverId, "userModel"),
          checkUserFound(senderId, "profilesModel"),
          checkUserFound(receiverId, "profilesModel"),
      ]);

      
      if (!senderUserExists) {
          return res.status(404).json({ success: false, message: "Sender User Not Found" });
      }
      if (!receiverUserExists) {
          return res.status(404).json({ success: false, message: "Receiver User Not Found" });
      }
      if (!senderProfileExists) {
          return res.status(404).json({ success: false, message: "Sender Profile Not Found" });
      }
      if (!receiverProfileExists) {
          return res.status(404).json({ success: false, message: "Receiver Profile Not Found" });
      }

      
      
      const [senderProfile, receiverProfile] = await Promise.all([
          profilesModel.findOne({ user_id: senderId }),
          profilesModel.findOne({ user_id: receiverId })
      ]);

      if (
          senderProfile.planType === receiverProfile.settings.interestRequestOption ||
          receiverProfile.settings.interestRequestOption === "All User"
      ) {
          let requests = [senderId];
          const newRequest = {
            personalDetails:{
              interestList: {
                  newRequest: requests
              }

            }
          };

          // UPDATE 
          
          const updatedProfile = await profilesModel.findOneAndUpdate(
              { user_id: receiverId },
              newRequest,
              { new: true, runValidators: true }
          );

          if (updatedProfile) {
              return res.status(200).json({ success: true, message: "Your request has been sent successfully !", data: updatedProfile });
          } else {
              return res.status(404).json({ success: false, message: "Failed to update profile" });
          }
      } else {
          return res.status(400).json({ success: false, message: "Interest Request not allowed" });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
  }
};







// CONTROLLER FOR GET PROFILE DATA


export const getProfileData = async(req,res)=>{
  
  const userId = req.params.id;
try {
  const [user ,profile] = await Promise.all([
    checkUserFound(userId, "userModel"),
    checkUserFound(userId, "profilesModel"),
]);

if(!user){
  return res.status(404).json({ success: false, message: " User Not Found" });
}
if(!profile){
  return res.status(404).json({ success: false, message: " User Profile Not Found" });
}
  
const data = await profilesModel.findOne({user_id:userId});

res.json({success:true,data:data});

} catch (error) {
  console.log(error);
  return res.json({ success: false, message: "An error occurred", error: error.message });
}

}


// CONTROLLER FOR VIEWS COUNT


export const handleViewCount = async(req,res)=>{
  
  const userId = req.params.id;

  const {viewerId} = req.body;

  try {
    
    const user = await profilesModel.findOne({user_id:userId});
    if(!user){
      return res.json({ message: 'User not found' });
    }

    const existingUser = user.viewedBy.find(view => view.userId === viewerId)
    
    if(!existingUser){
            user.viewCount += 1;
            user.viewedBy.push({ userId: viewerId, time: new Date() });
            await user.save();
            return res.json({ message: 'View count updated', viewCount: user.viewCount });
          }
          return res.json({success:false, message: 'already viewed', viewCount: user.viewCount });
   
  } catch (error) {
      console.log(error);
      return res.json({ success: false, message: "An error occurred", error: error.message });

  }

}



// FUNCTION TO CHECK  USER OR PROFILE IS FOUND


const checkUserFound = async (id, model) => {
  try {
      let user;
      if (model === "profilesModel") {
          user = await profilesModel.findOne({ user_id: id });
      } else {
          user = await userModel.findById(id);
      }
      return !!user; 
      
      
  } catch (error) {
      console.error(error);
      throw new Error("Database error occurred"); 
      
  }
};
