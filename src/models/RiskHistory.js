import mongoose from "mongoose";

const RiskHistorySchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      riskScore: {
        type: Number,
        required: true,
      },

      temperature: {
        type: Number,
        required: true,
      },

      aqi: {
        type: Number,
        required: true,
      },

      date: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models.RiskHistory ||
  mongoose.model(
    "RiskHistory",
    RiskHistorySchema
  );