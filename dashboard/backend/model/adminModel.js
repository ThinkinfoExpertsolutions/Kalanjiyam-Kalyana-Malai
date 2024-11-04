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
  socialMedia: {
    whatsapp: { type: String, trim: true },
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    youtube: { type: String, trim: true },
  },
  requestList: {
          newRequest: {type: [String],default: []},
          acceptedRequest: {type: [String],default: []},
          deniedRequest: {type: [String],default: []}
     },
}, { timestamps: true });


const adminModel = mongoose.model('Admin', adminSchema);

export default adminModel;
