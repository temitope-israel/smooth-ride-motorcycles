// models/Admin.ts
import mongoose, { CallbackError, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    return next(error as CallbackError);
  }
});

export default mongoose.models.Admin || model("Admin", AdminSchema);

// import mongoose, { CallbackError, Schema, model, models } from "mongoose";
// import bcrypt from "bcryptjs";

// const AdminSchema = new mongoose.Schema(
//   {
//     fullName: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true },
//     password: { type: String, required: true },
//     role: {
//       type: String,
//       enum: ["superadmin", "admin"],
//       default: "admin",
//     },
//   },
//   { timestamps: true }
// );

// AdminSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     console.error("Error hashing password:", error);
//     return next(error as CallbackError);
//   }
// });

// export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
