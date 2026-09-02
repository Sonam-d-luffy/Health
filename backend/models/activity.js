import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Number
    }
  },
  {
    _id: false
  }
);

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
      unique: true
    },

    todayDistance: {
      type: Number,
      default: 0
    },

    todayDuration: {
      type: Number,
      default: 0
    },

    maxDailyDistance: {
      type: Number,
      default: 0
    },

    maxDailyDistanceSpeed: {
      type: Number,
      default: 0
    },

    maxDailyDistanceLocation: locationSchema,

    maxDailyDistanceDate: {
      type: String
    },

    totalDistance: {
      type: Number,
      default: 0
    },

    totalDuration: {
      type: Number,
      default: 0
    },

    totalAvgSpeed: {
      type: Number,
      default: 0
    },

    fastestDistance: {
      type: Number,
      default: 0
    },

    fastestDistanceSpeed: {
      type: Number,
      default: 0
    },

    fastestDistanceLocation: locationSchema,

    fastestDistanceDate: {
      type: String
    },

    totalActivities: {
      type: Number,
      default: 0
    },

    lastActivityDate: {
      type: String
    },

    route: {
      type: [locationSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Activity",
  activitySchema
);
