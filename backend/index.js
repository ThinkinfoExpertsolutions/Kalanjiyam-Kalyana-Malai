import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import profileRouter from "./routes/profileRoute.js";
import adminRouter from "./routes/adminRoute.js";

const app = express();
const PORT = 5000;

// DATABASE CONNECTION
connectDB();

// MIDDLEWARE
app.use(express.json());

// CORS Configuration: Allow requests from the specific origin
const corsOptions = {
  origin: 'https://www.kalanjiyamkalyanamalai.in', // Specify allowed origin(s)
  methods: 'GET,POST,PUT,DELETE,PATCH', // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'token'], // Include 'token' here
  credentials: true, // Allow credentials if required
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// API ROUTES
app.use("/api/user", userRouter);
app.use("/api", profileRouter);
app.use("/api/admin", adminRouter);

// Root Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Error Handling Middleware (Optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// SERVER
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
