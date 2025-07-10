// pages/api/update-customer.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb"; // Your MongoDB connection utility
import Customer from "@/models/Customer"; // Your Mongoose model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.query;
  const updatedData = req.body;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Missing or invalid ID in query" });
  }

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate against schema
      }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Server error during update" });
  }
}

// import type { NextApiRequest, NextApiResponse } from "next";
// import clientPromise from "../"; // Adjust path if needed
// import { ObjectId } from "mongodb";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "PUT") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   const { id, engineNumber, buyerName, title, phone, state, dealer, model, color, endUser } = req.body;

//   if (!id || !engineNumber || !buyerName || !title || !phone || !state || !dealer || !model || !color) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     const client = await clientPromise;
//     const db = client.db();
//     const collection = db.collection("customers");

//     const result = await collection.updateOne(
//       { _id: new ObjectId(id) },
//       {
//         $set: {
//           engineNumber,
//           buyerName,
//           title,
//           phone,
//           state,
//           dealer,
//           model,
//           color,
//           endUser: endUser || "", // Optional field
//         },
//       }
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).json({ message: "Customer not found or no changes made" });
//     }

//     return res.status(200).json({ message: "Customer updated successfully" });
//   } catch (err) {
//     console.error("Update error:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }
