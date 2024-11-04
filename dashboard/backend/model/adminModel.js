import mongoose from 'mongoose';

const adminSchema =  mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'],
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });


const adminModel = mongoose.model('Admin', adminSchema);

export default adminModel;
