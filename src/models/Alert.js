import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

   type: {
  type: String,
  enum: [
    "HEATWAVE",
    "EXTREME_HEAT",
    "AQI",
    "AQI_SEVERE",
    "FIRE",
    "RAIN",
    "STORM",
    "EARTHQUAKE",
  ],
  required: true,
  index: true,
},

    message: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
      index: true,
    },

   
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    
    isMuted: {
      type: Boolean,
      default: false,
      index: true,
    },

   
    mutedUntil: {
      type: Date,
      default: null,
    },
    eventId: {
  type: String,
  required: true,
  index: true,
},

   
    lastTriggeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


AlertSchema.index({ userId: 1, type: 1, isActive: 1 });

export default mongoose.models.Alert ||
  mongoose.model("Alert", AlertSchema);