// import mongoose from "mongoose";

// const customerSchema = new mongoose.Schema(
//   {
//     engineNumber: { type: String, required: true, unique: true },
//     buyerName: { type: String, required: true },
//     title: { type: String, required: true },
//     phone: { type: String, required: true },
//     state: { type: String, required: true },
//     dealer: { type: String, required: true },
//     purchaseDate: { type: String, required: true },
//     endUser: { type: String },
//     model: { type: String, required: true },
//     color: { type: String, required: true },

//     // ✅ Newly Added
//     rimType: { type: String, required: false },
//     startType: { type: String, required: false },
//     variant: { type: String, required: false },

//   },
//   { timestamps: true }
// );

// export default mongoose.models.Customer ||
//   mongoose.model("Customer", customerSchema);

import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    engineNumber: { type: String, required: true, unique: true },
    buyerName: { type: String, required: true },
    title: { type: String, required: true },
    phone: { type: String, required: true },
    state: { type: String, required: true },
    dealer: { type: String, required: true },
    purchaseDate: { type: String, required: true },
    endUser: { type: String },
    endUserPhone: { type: String }, // ✅ add this in the schema
    model: { type: String, required: true },
    variant: { type: String }, // Optional
    color: { type: String, required: true },
    rimType: { type: String, required: false }, // Optional
    startType: { type: String, required: false }, // Optional
  },
  { timestamps: true }
);

export default mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);
