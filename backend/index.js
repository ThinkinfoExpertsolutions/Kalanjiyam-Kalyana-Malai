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

// Dynamic CORS Configuration
const allowedOrigins = [
  'https://www.kalanjiyamkalyanamalai.in',
  'https://kalanjiyam-kalyana-malai-zhkl-pa92dbiaq.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE,PATCH',
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight

// ROUTES
app.use("/api/user", userRouter);
app.use("/api", profileRouter);
app.use("/api/admin", adminRouter);

// Root Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// SERVER
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
