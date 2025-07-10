// import { NextApiRequest, NextApiResponse } from "next";
// import {connectToDatabase} from "@/lib/mongodb";
// import Admin from "@/models/Admin";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await connectToDatabase();

//   if (req.method !== "DELETE") return res.status(405).json({ message: "Method not allowed" });

//   const { _id } = req.query;
//   try {
//     await Admin.findByIdAndDelete(_id);
//     res.status(200).json({ message: "Admin deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to delete admin" });
//   }
// }


// import { NextApiRequest, NextApiResponse } from "next";
// import { connectToDatabase } from "@/lib/mongodb";
// import Admin from "@/models/Admin";
// import mongoose from "mongoose";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await connectToDatabase();

//   if (req.method !== "DELETE") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   const { _id } = req.query;

//   if (!_id || typeof _id !== "string" || !mongoose.Types.ObjectId.isValid(_id)) {
//     return res.status(400).json({ message: "Invalid admin ID" });
//   }

//   try {
//     const deleted = await Admin.findByIdAndDelete(_id);
//     if (!deleted) {
//       return res.status(404).json({ message: "Admin not found" });
//     }
//     return res.status(200).json({ message: "Admin deleted successfully" });
//   } catch (err) {
//     console.error("Delete error:", err);
//     return res.status(500).json({ message: "Failed to delete admin" });
//   }
// }


import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid admin ID" });
  }

  try {
    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ message: "Failed to delete admin" });
  }
}
