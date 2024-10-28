import express from "express";
import { addBookmark, editProfile, editSettings, getNewProfile, getProfileData, handleViewCount, removeBookmark } from "../controller/profileController.js";



const profileRouter = express.Router();

// ROUTES FOR USER DASHBOARD DETAILS

profileRouter.patch("/edit-profile/:id",editProfile);
profileRouter.patch("/edit-settings/:id",editSettings);
profileRouter.get("/get-profile-data/:id",getProfileData);
profileRouter.patch('/profile/:id/view',handleViewCount);
profileRouter.patch("/add-bookmark",addBookmark);
profileRouter.patch("/remove-bookmark",removeBookmark);
profileRouter.get("/get-new-profile",getNewProfile);
// profileRouter.patch("/accept-interest",acceptRequest);
// profileRouter.patch("/deny-interest",denyRequest);
// profileRouter.patch("/share-interest/:id",shareInterest);

export default profileRouter;