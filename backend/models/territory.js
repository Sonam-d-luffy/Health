import mongoose from "mongoose";

const territorySchema = new mongoose.Schema(
  {
    cellId: {
      type: String,
      required: true,
      unique: true
    },

    center: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },

    champion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true
    },

    championName: {
      type: String,
      default: ""
    },

    distance: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Territory",
  territorySchema
);