import express from "express";
import { SignIn, forgotPassword, getUserData, register, resetPassword, verify, verifyOTP } from "../controller/userController.js";
import authMidleware from "../middleware/auth.js";



const userRouter = express.Router();

// ROUTES FOR REGISTER, LOGIN AND FORGOT PASSWORD

userRouter.post("/register",register);
userRouter.post("/signin",SignIn);
userRouter.post("/verify",verify);
userRouter.get("/user",authMidleware,getUserData);
userRouter.post("/:type/forgot-password",forgotPassword)
userRouter.post("/verify-otp",verifyOTP);
userRouter.post("/:type/reset-password",resetPassword);


export default userRouter;