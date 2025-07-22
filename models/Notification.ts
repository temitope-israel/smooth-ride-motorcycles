// import mongoose, { Schema, Document } from "mongoose";

// export interface INotification extends Document {
//   message: string;
//   dealerId?: string;
//   createdAt: Date;
//   read: boolean;
// }

// const NotificationSchema: Schema = new Schema(
//   {
//     message: { type: String, required: true },
//     dealerId: { type: mongoose.Schema.Types.ObjectId, ref: "Dealer" },
//     read: { type: Boolean, default: false },
//   },
//   { timestamps: { createdAt: true, updatedAt: false } }
// );

// // Avoid re-defining the model if it already exists (in Next.js hot-reload)
// export default mongoose.models.Notification ||
//   mongoose.model<INotification>("Notification", NotificationSchema);
// /models/Notification.ts

import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
