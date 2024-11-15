import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB =()=>{
     mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("DB Connected");
}).catch(e=>{
    console.log(e.message);
})
}

export default connectDB;