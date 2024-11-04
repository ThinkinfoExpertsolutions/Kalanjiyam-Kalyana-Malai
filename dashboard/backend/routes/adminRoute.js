import express from "express";
import { adminLogin, changeAdminCredential } from "../controller/adminController.js";
import authMiddleware from "../middleware/auth.js";


const adminRouter = express.Router();



adminRouter.post("/admin-login",adminLogin);
adminRouter.post("/change-admin-credential",authMiddleware,changeAdminCredential);

export default adminRouter;