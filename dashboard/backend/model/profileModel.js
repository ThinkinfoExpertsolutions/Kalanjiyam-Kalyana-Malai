import mongoose from "mongoose";




// USER PROFILE SCHEMA


const profilesSchema  =  mongoose.Schema({
  user_id:{
    type:String,
  },
  profileID:{
    type:String,
  },
  basicInfo: {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    familyName: {
      type: String,
      // required: [true, 'Family name is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      // required: [true, 'Date of Birth is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: 'Gender must be either Male, Female, or Other',
      },
      // required: [true, 'Gender is required'],
    },
    religion: {
      type: String,
      // required: [true, 'Religion is required'],
      trim: true,
    },
    cast: {
      type: String,
      trim: true,
    },
    zodiac:{
      type:String,
      trim:true,
    },
    fatherName: {
      type: String,
      trim: true,
    },
    motherName: {
      type: String,
      trim: true,
    },
  },

 
  personalDetails: {
    weight: {
      type: Number,
      min: [0, 'Weight must be a positive number'],
      validate: {
        validator: Number.isInteger,
        message: 'Weight must be an integer',
      },
    },
    height: {
      type: Number,
      min: [0, 'Height must be a positive number'],
      validate: {
        validator: Number.isInteger,
        message: 'Height must be an integer',
      },
    },
    age: {
      type: Number,
      min: [0, 'Age must be a positive number'],
      validate: {
        validator: Number.isInteger,
        message: 'Age must be an integer',
      },
    },
    about: {
      type: String,
      trim: true,
      maxlength: [500, 'About Yourself cannot be more than 500 characters'],
    },
    hobbies: {
      type: [String], 
      default: [],
    },
//     interestList: {
//       newRequest: {type: [String],default: []},
//       acceptRequest: {type: [String],default: []},
//       denyRequest: {type: [String],default: []}
//  },
  },
  
  
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'],
    },
    email: {
      type: String,
      required: [true, 'Gmail is required'],
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot be longer than 200 characters'],
    },
  },
  
  
  media: {
    profileImage: {
      type: String,
      
    },
    galleryImages: {
      type: [String], 
      default: [],
    },
    horoscopeImage:{
      type: String,
    }
  },
  
  
  jobDetails: {
    companyName: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    salary: {
      type: Number,
      min: [0, 'Salary must be a positive number'],
    },
    workingLocation: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
    },
  },
  
  
  education: {
    school: {
      type: String,
      trim: true,
    },
    college: {
      type: String,
      trim: true,
    },
    degree: {
      type: String,
      trim: true,
    },
  },
  socialMedia: {
      facebook: { type: String, trim: true },
      twitter: { type: String, trim: true },
      instagram: { type: String, trim: true },
      linkedin: { type: String, trim: true },
    },
    
    viewCount: {
      type: Number,
      default: 0
    },
    viewedBy: [
      {
        userId: String,
        time: Date 
      }
    ],
    activitys: [
      {
        userId: String,
        event:String,
        time: Date 
      }
    ],
    bookMarkedProfiles: [
      {
        userId: String,
        time: Date 
      }
      ],

    settings:{
      profileVisibleOption: {
        type: String,
      default: "Free",
    },
    bookmarkOption: {
      type: String,
      default: 'Free',
  
    },
    notificationPermission: {
      type: Boolean,
      default: false,
    },

  },
  verification_status: {
    type: String,
    enum: ['Verified', 'Pending','UnVerified'],
    default: 'UnVerified',
  },
  subscription_status: {
    type: Boolean,
    default: false,
  },
  
}, { timestamps: true }); 



const profilesModel = mongoose.model.profile || mongoose.model("profile",profilesSchema);

export default profilesModel;