import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  sports: [
    {
      type: String, // e.g., "Cricket", "Football"
      required: true,
    },
  ],
  address: {
    state: String,
    district: String,
    local: String,
    pincode: String,
      location: {
            latitude:Number,
            longitude:Number
        }
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Player = mongoose.model("Player", playerSchema);

export default Player;
