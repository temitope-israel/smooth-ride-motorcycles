// models/dealer.ts
import mongoose, { Schema, model, models } from "mongoose";

const DealerSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["1s", "2s", "3s", "4s"],
      required: true,
    },
    exOrMulti: {
      type: String,
      enum: ["Exclusive", "Multi"],
      required: true,
    },
    hondaExclusiveOutlet: {
      type: String,
      enum: ["Exclusive", "Multi"],
      required: true,
    },
    pic: { type: String, required: true }, // Person in Charge
    dlrName: { type: String, required: true },
    region: { type: String, required: true },
    state: { type: String, required: true },
    town: { type: String, required: true },
    address: { type: String, required: true },
    phone1: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^\d{11}$/.test(v),
        message: "Phone number must be exactly 11 digits",
      },
    },
    phone2: {
      type: String,
      required: false,
      validate: {
        validator: (v: string) => !v || /^\d{11}$/.test(v),
        message: "Phone number must be exactly 11 digits",
      },
    },
    ownerOrContactPerson: { type: String, required: true }, // 👈 backend schema // ✅ quoted key
  },
  { timestamps: true }
);

export default models.Dealer || model("Dealer", DealerSchema);
