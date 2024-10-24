import express from "express";
import { editProfile, editSettings, getProfileData, handleViewCount, shareInterest } from "../controller/profileController.js";



const profileRouter = express.Router();

// ROUTES FOR USER DASHBOARD DETAILS

profileRouter.patch("/edit-profile/:id",editProfile);
profileRouter.patch("/edit-settings/:id",editSettings);
profileRouter.patch("/share-interest/:id",shareInterest);
profileRouter.patch('/profile/:id/view',handleViewCount);
profileRouter.get("/get-profile-data/:id",getProfileData);

export default profileRouter;