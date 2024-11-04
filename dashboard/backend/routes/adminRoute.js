import express from "express";
import { addNewProfile, adminLogin, changeAdminCredential, getWebsiteData, handleVerifyRequest, updateSocialMediaLinks } from "../controller/adminController.js";
import authMiddleware from "../middleware/auth.js";


const adminRouter = express.Router();



adminRouter.post("/admin-login",adminLogin);
adminRouter.post("/change-admin-credential",authMiddleware,changeAdminCredential);
adminRouter.post("/update-socialmedia",authMiddleware,updateSocialMediaLinks);
adminRouter.post("/add-new-profile",authMiddleware,addNewProfile);
adminRouter.get("/get-website-data",authMiddleware,getWebsiteData);
adminRouter.post("/handle-verify-request",authMiddleware,handleVerifyRequest);

export default adminRouter;