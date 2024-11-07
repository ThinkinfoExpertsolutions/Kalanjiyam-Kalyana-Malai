import mongoose from "mongoose";

const subscriptionPlanSchema =  mongoose.Schema({
    
  name: {
    type: String,
    required: true,
    default: 'Standard Plan',
  },
  user_id:{
    type:String,
  },
  price: {
    type: Number,
    required: true,
  },
  durationInDays: {
    type: Number,
    required: true,
    default: 30,
  },
  isActive: {
    type: Boolean,
    default: true, 
  },
  startDate: {
    type: Date,
    default: Date.now, 
  },
  endDate: {
    type: Date,
    default: function () {
      return new Date(Date.now() + this.durationInDays * 24 * 60 * 60 * 1000); // end date based on duration
    },
  },
},{timestamps: true});



const SubscriptionModel = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

export default SubscriptionModel;
