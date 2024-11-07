import express from "express";
import { addNewProfile, adminChangeSubscriptionStatus, adminChangeVerificationStatus, adminLogin, changeAdminCredential, getWebsiteData, handleVerifyRequest, removeProfile, updateSocialMediaLinks } from "../controller/adminController.js";
import authMiddleware from "../middleware/auth.js";


const adminRouter = express.Router();



adminRouter.post("/admin-login",adminLogin);
adminRouter.post("/change-admin-credential",authMiddleware,changeAdminCredential);
adminRouter.post("/update-socialmedia",authMiddleware,updateSocialMediaLinks);
adminRouter.post("/add-new-profile",authMiddleware,addNewProfile);
adminRouter.get("/get-website-data",authMiddleware,getWebsiteData);
adminRouter.post("/handle-verify-request",authMiddleware,handleVerifyRequest);
adminRouter.post("/change-subscription-status",authMiddleware,adminChangeSubscriptionStatus);
adminRouter.post("/change-verification-status",authMiddleware,adminChangeVerificationStatus);
adminRouter.delete("/remove-profile",authMiddleware,removeProfile);


export default adminRouter;