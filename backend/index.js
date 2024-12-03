import express from "express";
import bcrypt from "bcrypt";

import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import profileRouter from "./routes/profileRoute.js";
import adminRouter from "./routes/adminRoute.js";
import adminModel from "./model/adminModel.js";


const app = express();
const PORT = 5000;

// DATABASE CONNECTION

connectDB()

// MIDDLEWARE

app.use(express.json());

// Allow requests from kalanjiyamkalyanmalai.in
const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Your domain
    methods: 'GET,POST,PUT,DELETE,PATCH', // Allowed methods
    credentials: true // If cookies or authentication headers are used
  };
  
  app.use(cors(corsOptions));


// API

app.use("/api/user",userRouter);
app.use("/api",profileRouter);
app.use("/api/admin",adminRouter);
app.get('/', (req, res) => {
    res.send('Hello World!');
  })

// SERVER  

app.listen(PORT,()=>{
    console.log(`Server Started At http://localhost:${PORT}`);
});


