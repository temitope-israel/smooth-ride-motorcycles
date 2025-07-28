import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
