import express from "express";
import {  editProfile, editSettings, getLatestProfile, getProfileData, getRelatedProfile, getSearchResult, handleBookmark, handleViewCount, sendEnquiry, uploadImage, verifyAccount } from "../controller/profileController.js";
import authMiddleware from "../middleware/auth.js";
import upload from "../config/multer.js";



const profileRouter = express.Router();

// ROUTES FOR USER DASHBOARD DETAILS

profileRouter.patch("/edit-profile",authMiddleware,editProfile);
profileRouter.patch("/edit-settings/:id",editSettings);
profileRouter.get("/get-profile-data/:id",getProfileData);
profileRouter.patch('/profile/:id/view',authMiddleware,handleViewCount);
profileRouter.patch("/handle-bookmark",authMiddleware,handleBookmark);
profileRouter.get("/get-latest-profile",getLatestProfile);
profileRouter.get("/get-search-result",getSearchResult);
profileRouter.get("/get-related-profiles/:id",getRelatedProfile);
profileRouter.post("/verify-account/:id",authMiddleware,verifyAccount);
profileRouter.post("/send-quiry",authMiddleware,sendEnquiry);
profileRouter.post("/upload-images",upload,authMiddleware,uploadImage);

// profileRouter.patch("/accept-interest",acceptRequest);
// profileRouter.patch("/deny-interest",denyRequest);
// profileRouter.patch("/share-interest/:id",shareInterest);

export default profileRouter;