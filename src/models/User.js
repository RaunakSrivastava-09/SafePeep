import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
{
name: {
type: String,
required: true,
},


email: {
  type: String,
  required: true,
  unique: true,
},

password: {
  type: String,
  required: true,
},

notificationEnabled: {
  type: Boolean,
  default: true,
},

aqiAlerts: {
  type: Boolean,
  default: true,
},

heatAlerts: {
  type: Boolean,
  default: true,
},

fireAlerts: {
  type: Boolean,
  default: true,
},
darkMode: {
  type: Boolean,
  default: false,
},
temperatureUnit: {
  type: String,
  enum: ["C", "F"],
  default: "C",
},

defaultZoom: {
  type: Number,
  default: 13,
},
mutedAlerts: [
  {
    type: String,
    expiresAt: Date,
  }
],
savedLocations: [
  {
    name: String,
    latitude: Number,
    longitude: Number,
  },
],
},
{
timestamps: true,
}
);


export default mongoose.models.User ||
mongoose.model("User", UserSchema);
