import mongoose from 'mongoose'
export const fitnessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  bicepCurls: {
    maxCount: {
      type: Number,
      default: 0
    },
    totalTime: {
      type: Number, // seconds
      default: 0
    }
  },

  squats: {
    maxCount: {
      type: Number,
      default: 0
    },
    totalTime: {
      type: Number, // seconds
      default: 0
    }
  },

  pullUps: {
    maxCount: {
      type: Number,
      default: 0
    },
    totalTime: {
      type: Number, // seconds
      default: 0
    }
  },

  jogging: {
    maxCount: {
      type: Number,
      default: 0
    },
    totalTime: {
      type: Number, // seconds
      default: 0
    }
  }
}, {
  timestamps: true
});

const Fitness = mongoose.model("Fitness", fitnessSchema);

export default Fitness;