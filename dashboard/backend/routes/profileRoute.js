import express from "express";
import { editProfile, editSettings, shareInterest } from "../controller/profileController.js";



const profileRouter = express.Router();

// ROUTES FOR USER DASHBOARD DETAILS

profileRouter.patch("/edit-profile/:id",editProfile);
profileRouter.patch("/edit-settings/:id",editSettings);
profileRouter.patch("/share-interest",shareInterest);

export default profileRouter;