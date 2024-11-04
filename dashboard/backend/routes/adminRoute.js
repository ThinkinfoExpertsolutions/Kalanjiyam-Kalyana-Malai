import express from "express";
import { adminLogin, changeAdminCredential, updateSocialMediaLinks } from "../controller/adminController.js";
import authMiddleware from "../middleware/auth.js";


const adminRouter = express.Router();



adminRouter.post("/admin-login",adminLogin);
adminRouter.post("/change-admin-credential",authMiddleware,changeAdminCredential);
adminRouter.post("/update-socialmedia",authMiddleware,updateSocialMediaLinks);

export default adminRouter;