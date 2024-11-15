import mongoose from "mongoose";

// USER SCHEMA

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Full name is required'],
        minlength: [3, 'Full name must be at least 3 characters long']
    },
    phone: {
        type: String,
        required: [true, 'Mobile number is required'],
        match: [/^\d{10}$/, 'Mobile number must be 10 digits'] 
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] 
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
});


export const userModel = mongoose.model("user",userSchema) || mongoose.model.user ;