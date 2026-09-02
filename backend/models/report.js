import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    // Reference to the athlete/player
    playerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Player', 
      required: true 
    },

    // Reference to the institute/academy
    academyId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Institute', 
      required: true 
    },
name:{type:String },
age: {type: Number},
    // Personal & Physical Info
    height: { type: Number, required: true }, // in cm
    weight: { type: Number },                 // in kg
    bmi: { type: Number },                     // optional, can calculate later
    bloodPressure: { type: String },          // e.g., '120/80'
    experience: { type: String },             // beginner, intermediate, professional

    // Sports info
    sports: { type: [String], required: true }, // sports disciplines

    // Achievements & Certificates
    achievements: { type: [String] },          // awards, medals

    // Supporting materials
    image: { type: String },                   // profile photo URL

    // System / Status fields
    status: { 
      type: String, 
      enum: ['Pending', 'Approved', 'Rejected'], 
      default: 'Pending' 
    },
    mailSent: {
  type: Boolean,
  default: false
},

    submissionDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Report = mongoose.model('Report' , reportSchema)

export default Report