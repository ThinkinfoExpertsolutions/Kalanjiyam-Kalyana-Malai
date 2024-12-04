import { userModel } from "../model/userModel.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import validator from "validator";
import profilesModel from "../model/profileModel.js";
import adminModel from "../model/adminModel.js";
import SubscriptionModel from "../model/subscriptionModel.js";
import dotenv from "dotenv";
dotenv.config();



 const otpStore = {};


export const verify = async (req, res) => {
    const type = req.params.type;
     console.log(type)
    try {
        if (type === "user") {
            const { name, phone, email, password } = req.body;

            // Validate input
            if (!/^[0-9]{10}$/.test(phone)) {
                return res.status(400).json({ success: false, message: "Please enter a valid phone number!" });
            }
            if (!validator.isEmail(email)) {
                return res.status(400).json({ success: false, message: "Please enter a valid email!" });
            }
            if (password.length < 8) {
                return res.status(400).json({ success: false, message: "Password must be at least 8 characters long!" });
            }

            // Check for existing user
            const [existEmail, existPhone] = await Promise.all([
                userModel.findOne({ email }),
                userModel.findOne({ phone }),
            ]);
            if (existEmail) {
                return res.status(409).json({ success: false, message: "Email already registered!" });
            }
            if (existPhone) {
                return res.status(409).json({ success: false, message: "Phone number already registered!" });
            }

            // Send OTP
            const otpSent = await sentOTP(email, name);
            if (otpSent) {
                return res.status(200).json({ success: true, message: "OTP sent successfully to your registered email!" });
            } else {
                return res.status(500).json({ success: false, message: "Failed to send OTP. Please try again later." });
            }
        } else if (type === "admin") {
            const { userName, password } = req.body;

            // Check for admin
            const admin = await adminModel.findOne({ userName });
            if (!admin) {
                return res.status(404).json({ success: false, message: "Username not found!" });
            }

            // Validate password
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Incorrect password!" });
            }

            // Fetch admin email for OTP
            const { email } = admin; // Assuming `email` is a field in the admin schema

            // Send OTP
            const otpSent = await sentOTP(email, userName);
            
            if (otpSent) {
                return res.status(200).json({ success: true, message: "OTP sent successfully to your registered email!",email:email });
            } else {
                return res.status(500).json({ success: false, message: "Failed to send OTP. Please try again later." });
            }
        } else {
            return res.status(400).json({ success: false, message: "Invalid request type!" });
        }
    } catch (error) {
        console.error("Error in verify function:", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
};



// REGISTER CONTROLLER

export const register = async(req,res)=>{
    
    const {name,phone,email,password,otp} = req.body;
    
    const storedOtp = otpStore[email];
    const{OTP,expireTime} = storedOtp;
    
    if(Date.now() > expireTime && OTP==otp){
        return res.json({success:false,message:"Your OTP has expired !"});
    }

   if(OTP != otp){
      return res.json({success:false,message:"Oops! The OTP you entered is incorrect."})
    }else{
       delete otpStore[email];
    }
    

   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword =  await bcrypt.hash(password,salt);



    const newUser = userModel({
        name:name,
        phone:phone,
        email:email,
        password:hashedPassword
    })
    let profileID;
    const newProfileSave = async(id)=>{
        
        const newProfile = profilesModel({
            user_id:id,
            profileID:createUniqueUserId(id),
            basicInfo:{
                name:name
            },
            contactInfo:{
                phone:phone,
                email:email
            }
        })

        const newProfileData =  await newProfile.save();
        profileID=newProfileData.profileID;
    }

    const newSubscriptionDataSave = async(id,userName)=>{
        const newDocument = SubscriptionModel({
            user_id:id,
            name:userName
        });

        await newDocument.save();
    }

    try {

       const user = await newUser.save();
       newProfileSave(user._id);
       newSubscriptionDataSave(user._id,user.name);
       const token =  generateToken(user._id,process.env.SECRET_KEY);
       const encryptedToken = setEncryptedToken(token);
       res.json({success:true,message:"Successfully Registered ",encryptedToken:encryptedToken,profileID:profileID});

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


// GET USER DATA

export const getUserData = async(req,res)=>{

    const user_id =  req.id;
    
try {
    const userData = await profilesModel.findOne({user_id:user_id});
    const subscriptionData = await SubscriptionModel.findOne({user_id:user_id});
    
    if(!userData || !subscriptionData){
        return res.json({success:false,message:"User Data Not Found !"});
    }
    return res.json({success:true,userData:userData,subscriptionData:subscriptionData});
    
} catch (error) {
     console.log(error);
     return res.json({success:false,message:"Failed To GeT User Data !"});
    }
}


// LOGIN CONTROLLER


export const SignIn = async(req,res)=>{
 
    const {userName,password} = req.body;
    let user;
    try {
        if(validator.isEmail(userName)){
            const email = userName;
             user = await userModel.findOne({email});
        }else{
            const phone = userName;
             user = await userModel.findOne({phone});
        }
       
        
        if(!user){
            return res.json({success:false,message:"User Does't Exist !"})
        }
        
        const isMatch = await bcrypt.compare(password,user.password);
        
        if(!isMatch){
           return res.json({success:false,message:"Password Does't Match !"})
        }
        
        if(user && isMatch){
            const token = generateToken(user._id,process.env.SECRET_KEY);
            const encryptedToken = setEncryptedToken(token);
             
            return res.json({success:true,message:"Login successful !",encryptedToken:encryptedToken});
        }

    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"Failed To SignIn !"})
    }
}


// CONTROLLER FOR FORGOT-PASSWORD

export const forgotPassword = async(req,res)=>{

    const {email} = req.body;
    const isAdmin = req.params.type;
    let user;
    try {
        if(isAdmin === "admin"){
             user = await adminModel.findOne({email});
        }else{
            user = await userModel.findOne({email});
        }

        if(!user){
            return res.json({success:false,message:"This Email Is Not Registered. Please Try Again"})
        }else{
           
           if(sentOTP(email,user.name)){
                    res.json({success:true,message:"OTP has been successfully sent to your registered email address"});  
           }else{
                    res.json({success:false,message:"Failed To Send OTP"});     
           }
        }

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Something Wrong In Sent OTP !"})
    }

}


// VERIFY OTP

export const verifyOTP = async(req,res,next)=>{

    const{otp,email} = req.body;

    const storedOtp = otpStore[email];
    const{OTP,expireTime} = storedOtp;
    
    if(Date.now() > expireTime && OTP==otp){
        return res.json({success:false,message:"Your OTP has expired !"});
    }

   if(OTP != otp){
      return res.json({success:false,message:"Oops! The OTP you entered is incorrect"})
    }else{
        delete otpStore[email];
    }
    
    return res.json({success:true,message:"OTP verified successfully!"})
 }


// CONTROLLER FOR RESET-PASSWORD 


export const resetPassword = async(req,res)=>{

    const{newPassword,comfirmPassword,email} = req.body;
  
    const isAdmin = req.params.type;
    let user;

   

    if(newPassword !== comfirmPassword){
        return res.json({success:false,message:"Pasword Does't Match !"})
    }else{
        try {
            if(isAdmin === "admin"){
                user = await adminModel.findOne({email});
            }else{
               user = await userModel.findOne({email});
            }

            const salt = await bcrypt.genSalt(10);
            const newHashedPassword =  await bcrypt.hash(newPassword,salt);


            
            user.password = newHashedPassword;
            
            await user.save();
            
            res.json({success:true,message:"Your password has been updated successfully !",data:user})
            
            
        } catch (error) {
            console.log(error);
            return res.json({success:false,message:"Failed To Update Password !"});

        }
    }
    
}










// FUNCTION FOR GIVE UNIQUE ID FOR USERS

let count=0;
export const createUniqueUserId = (mongoObjectId) => {
    const base64Id = Buffer.from(mongoObjectId.toString()).toString('base64');
    const last4Chars = base64Id.slice(-4); // Extract the last 6 characters
    count++;
    return `USER-${last4Chars}${count}`;
  };
  



// FUNCTION FOR SEND OTP TO MAIL 
const sentOTP = async (email, name) => {
    // OTP GENERATION
    const OTP = generateOTP(5);
    const expireTime = Date.now() + 300 * 1000;
    otpStore[email] = { OTP, expireTime };
    

    // NODEMAILER CONFIG
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
        },
    });

    const mailOption = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: "Kalanjiyam Kalyana Malai OTP",
        text: `
        Dear ${name},
        
        Thank you for Using Kalanjiyam Kalyana Malai!
        
        Please use the following One-Time Password (OTP):
        
        OTP: ${OTP}
        
        This OTP is valid for the next 5 minutes. Please do not share this OTP with anyone for your security.
        
        If you did not initiate this OTP, please contact our support team immediately.
        
        Thank you for choosing Kalangiyum Kalyana Maalai, where we help you find your perfect match!
        
        Best regards,
        The Kalanjiyam Kalyana Malai Team
        `,
    };

    try {
        await transporter.sendMail(mailOption);
        return true; // OTP sent successfully
    } catch (error) {
        console.error("Error sending OTP:", error.message);
        return false; // Failed to send OTP
    }
};




// FUNCTION FOR OTP GENERATION

const generateOTP = (length)=>{
    let otp = "";
    for(let i =0;i<length;i++){
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

// FUNCTION FOR GENERATE JWT TOKEN

export const generateToken = (id,SECRET_KEY)=>{

    return jwt.sign({id},SECRET_KEY,{
       expiresIn:"24h"
    });
}

// EXTRA ENCRYPTING THE TOKEN

export function setEncryptedToken(token) {
    const encryptedToken = CryptoJS.AES.encrypt(token, process.env.SECRET_KEY_2).toString();
    return encryptedToken;
  }