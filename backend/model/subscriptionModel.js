import mongoose from "mongoose";

const subscriptionPlanSchema =  mongoose.Schema({
    
  user_id:{
    type:String,
  },
  price: {
    type: Number,
    // required: true,
    // default: 0,
  },
  durationInDays: {
    type: Number,

    // default: 0,
  },
  isActive: {
    type: Boolean,
    default: false, 
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
},{timestamps: true});



const SubscriptionModel = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

export default SubscriptionModel;
