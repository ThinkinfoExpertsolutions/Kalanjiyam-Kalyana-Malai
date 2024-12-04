import express from "express";
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

// CORS Configuration: Allow requests from the specific origin
const corsOptions = {
  origin: "https://www.kalanjiyamkalyanamalai.in",  // Allow only this domain
  methods: ["GET", "POST", "OPTIONS","DELETE","PATCH"],  // Allow specific methods
  allowedHeaders: ["Content-Type", "Authorization"]  // Allow specific headers
};

app.use(cors(corsOptions));  // Apply CORS middleware with options

// API ROUTES
app.use("/api/user", userRouter);
app.use("/api", profileRouter);
app.use("/api/admin", adminRouter);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// SERVER
app.listen(PORT, () => {
    console.log(`Server Started At http://localhost:${PORT}`);
});
