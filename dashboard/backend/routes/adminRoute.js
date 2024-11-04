import express from "express";
import { addNewProfile, adminLogin, changeAdminCredential, updateSocialMediaLinks } from "../controller/adminController.js";
import authMiddleware from "../middleware/auth.js";


const adminRouter = express.Router();



adminRouter.post("/admin-login",adminLogin);
adminRouter.post("/change-admin-credential",authMiddleware,changeAdminCredential);
adminRouter.post("/update-socialmedia",authMiddleware,updateSocialMediaLinks);
adminRouter.post("/add-new-profile",authMiddleware,addNewProfile);

export default adminRouter;